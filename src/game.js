"use strict";

var _spritesheet;
var _tile_canvas;
var _tile_ctx;
var _object_canvas;
var _object_ctx;
var _canvas;
var _ctx;
var _final_canvas;
var _final_ctx;
var _pixel_ratio;
var _zoom;
var _player_obj;
var _saved_object_id;
var _center_state;
var _shake;
var _synth;
var _objs = [];
var _permanent_objs = [];
var _projections = [];
var _a = { viewX: 0, viewY: 0, viewPadX: 0, viewPadY: 0, speedX: 0, speedY: 0, direction: 0 };
var _fade = 0;
var _restart_timer = 0;
var _gfx_force_refresh = false;
var _sound_status_messages = [ "Music and sound", "Sound only", "Muted" ];
var _sound_status = 0; // 0: sound + music, 1: sound, 2: mute
// DEBUG BEGIN
// _sound_status = 1;
// DEBUG END

var _view_update_needed = false;
var _last_was_grab = false;
var _last_was_use = false;
var _last_was_mute = false;
var _frames_processed = 0;
var _frames_processed_last = 0;
var _low_gfx = false;

// DEBUG BEGIN
var _profiler;
// DEBUG END

var _map = [];
var _view_map = [];
var _palettes = [];
var _animated_palettes = [];
var _colors = [];
var _default_state = { viewX: 0, viewY: 0, realX: 0, realY: 0, direction: 0, status: STATUS_UNMAPPED, tile: 0 };

var _fhdk_string;
var _fhdk_done = false;

var _keys_found = [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var _last_event_id = -1;
var _events = [
	// x, y, w, h, glitch setup, key, text, is from player?
	[ 14, 10, 1, 3, 100000, 0, "This place looks a bit strange.", 1 ],
	[ 16, 20, 3, 3, 100000, 0, "Hmm... that obelisk looks nice.", 1 ],
	[ 19, 20, 3, 3, 100000, 0, "Try to use the obelisk (button \"E\")", 0 ],
	[ 23, 14, 3, 7, 100000, 0, "You can pick up some of the items (button \"Q\")", 0 ],
	[ 27, 14, 3, 7, 100000, 0, "What the...", 1 ],
	[ 24, 9, 6, 3, 100000, 0, "I've seen that door before.", 1 ],
	[ 22, 9, 2, 3, 100000, 0, "There are more items to grab and to use, experiment", 0 ],
	[ 26, 5, 1, 1, 100000, 0, "That one looks nasty.", 1 ],
	[ 13, 3, 1, 5, 100000, 1 ],
	[ 12, 3, 1, 5, 1500, 2 ],
	[ 33, 11, 4, 1, 1500, 3 ],
	[ 39, 14, 4, 1, 1500, 4 ],
	[ 55, 2, 3, 1, 1500, 5 ],
	[ 1, 20, 7, 1, 1500, 6 ],
	[ 26, 29, 1, 5, 100000, 7 ],
	[ 37, 29, 7, 5, 100000, 0, "Congratulations! You've completed the game.", 0 ]
];

function onResize()
{
	var scale, w, h, dpr, bsr;
	
	dpr = window.devicePixelRatio || 1;
	
/*
	// NOTE: for old browsers, pre-2013
	bsr = _final_ctx.webkitBackingStorePixelRatio ||
		_final_ctx.mozBackingStorePixelRatio ||
		_final_ctx.msBackingStorePixelRatio ||
		_final_ctx.oBackingStorePixelRatio ||
		_final_ctx.backingStorePixelRatio || 1;
*/
	
	bsr = _final_ctx.backingStorePixelRatio || 1;
	
	_pixel_ratio = dpr / bsr;
	
	
	_zoom = Math.min(Math.floor(window.innerWidth / FINAL_WIDTH), Math.floor(window.innerHeight / FINAL_HEIGHT));
	
	if (_zoom * _pixel_ratio < 1)
	{
		// warn the user about viewport clipping?
		_zoom = 1;
	}
	
	// if (_zoom < 2 && window.innerWidth < window.innerHeight)
	// {
	// 	// suggest the use of landscape mode
	// }
	
	w = FINAL_WIDTH * _zoom;
	h = FINAL_HEIGHT * _zoom;
	
	_final_canvas.width = w * _pixel_ratio;
	_final_canvas.height = h * _pixel_ratio;
	
	_final_canvas.style.width = w;
	_final_canvas.style.height = h;
	
	_final_canvas.style.left = (window.innerWidth - w) / 2;
	_final_canvas.style.top = (window.innerHeight - h) / 2;
	
	// smoothing is reset on canvas resize
	fixCanvasContextSmoothing(_final_ctx);
	
	uiResize();
}

function viewUpdate()
{
	var x, y, i, queue, a, state;
	
	function addIfUnknown(state, dx, dy)
	{
		var ax, ay;
		
		ax = toTile(state.viewX) + dx;
		ay = toTile(state.viewY) + dy;
		
		if (
			(ax) < 0 ||
			(ax) >= VIEW_WIDTH ||
			(ay) < 0 ||
			(ay) >= VIEW_HEIGHT ||
			_view_map[ay][ax].status != STATUS_UNMAPPED
		)
		{
			return;
		}
		
		_view_map[ay][ax].status = STATUS_MAPPING;
		queue.push([ state, dx, dy ]);
	}
	
	initArray(_view_map, _default_state);
	
	// [ [ state, dx, dy ], ... ]
	queue = [];
	
	a = _copy(_center_state);
	queue.push([ a, 0, 0 ]);
	
	while (queue.length > 0)
	{
		a = queue.shift();
		
		try
		{
			state = mapProcessState(a[0], a[1], a[2]);
		}
		catch (err)
		{
			// that's what I call error handling!
// DEBUG BEGIN
			console.log('e!');
// DEBUG END
			gameExplodeAndRestart();
			return;
		}
		_view_map[toTile(state.viewY)][toTile(state.viewX)] = state;
		
		if (state.tile == TILE_WALL || state.tile == TILE_VOID)
		{
			continue;
		}
		
		addIfUnknown(state,  0, -1);
		addIfUnknown(state, +1, -1);
		addIfUnknown(state, +1,  0);
		addIfUnknown(state, +1, +1);
		addIfUnknown(state,  0, +1);
		addIfUnknown(state, -1, +1);
		addIfUnknown(state, -1,  0);
		addIfUnknown(state, -1, -1);
	}
}

function tryMoveReal(x, y, r)
{
/*
	var i, j;
	
	for (i=0; i<_locked_tiles.length; i++)
	{
		if (_locked_tiles[i][0] == toTile(x) && _locked_tiles[i][1] == toTile(y) && !_keys[i])
		{
			uiShowMessage("Door locked.");
			return;
		}
	}
*/
	
	if (
		(_view_map[toTile(y - r - 1)][toTile(x        )].tile == TILE_WALL) || // top
		(_view_map[toTile(y        )][toTile(x + r    )].tile == TILE_WALL) || // right
		(_view_map[toTile(y + r    )][toTile(x        )].tile == TILE_WALL) || // bottom
		(_view_map[toTile(y        )][toTile(x - r - 1)].tile == TILE_WALL) // left
	)
	{
		return;
	}
	
	_a.viewX = x;
	_a.viewY = y;
}

function tryMove()
{
	// TODO: optimize 
	var i, step, dx, dy, ax, ay;
	
	// do not move after the player was destroyed
	if (_player_obj.destroyed)
	{
		return;
	}
	
	step = 0.1;
	
	ax = 1;
	ay = 1;
	
	if (_a.speedX > 0)
	{
		_a.direction = 1;
	}
	if (_a.speedX < 0)
	{
		_a.direction = 3;
		ax = -1;
	}
	
	if (_a.speedY > 0)
	{
		_a.direction = 2;
	}
	if (_a.speedY < 0)
	{
		_a.direction = 0;
		ay = -1;
	}
	
	dx = Math.abs(_a.speedX);
	dy = Math.abs(_a.speedY);
	
	for (i=0; i<dx; i += step)
	{
		tryMoveReal(_a.viewX + ax * step, _a.viewY, 5);
	}
	
	for (i=0; i<dy; i += step)
	{
		tryMoveReal(_a.viewX, _a.viewY + ay * step, 5);
	}
}

function fireEvent()
{
	var x, y, i;
	
	x = toTile(_center_state.realX);
	y = toTile(_center_state.realY);
	
	for (i=0; i<_events.length; i++)
	{
		if (
			_events[i][0] <= x &&
			_events[i][0] + _events[i][2] > x &&
			_events[i][1] <= y &&
			_events[i][1] + _events[i][3] > y
		)
		{
			if (_events[i][6] && _last_event_id != i)
			{
				uiShowMessage(_events[i][6], _events[i][7]);
			}
			_glitch_time_left = _events[i][4];
			_keys_found[_events[i][5]] = 1;
			_last_event_id = i;
		}
	}
}

function viewRecenter()
{
	var a, b, c;
	
	a = toTile(_a.viewX);
	b = toTile(_a.viewY);
	
	if (toTile(_center_state.viewX) != a || toTile(_center_state.viewY) != b)
	{
		c = _copy(_view_map[b][a]);
		
		_a.viewX -= (c.viewX - _center_state.viewX);
		_a.viewY -= (c.viewY - _center_state.viewY);
		_a.viewPadX += (c.viewX - _center_state.viewX);
		_a.viewPadY += (c.viewY - _center_state.viewY);
		
		_glitch_pos.viewX -= (c.viewX - _center_state.viewX);
		_glitch_pos.viewY -= (c.viewY - _center_state.viewY);
		
		_player_obj.updateGrabbedObjectRotation(_center_state, c);
		
		_center_state = _copy(c);
		_center_state.viewX = VIEW_CENTER_X * 16;
		_center_state.viewY = VIEW_CENTER_Y * 16;
		
		_view_update_needed = true;
		
		layersMove(c.viewX - _center_state.viewX, c.viewY - _center_state.viewY);
		fireEvent();
	}
	
	if (_view_update_needed)
	{
		viewUpdate();
	}
}

function gameTick()
{
	_a.speedX = round1(_a.speedX * PLAYER_SPEED_REDUCTION, 0.1);
	_a.speedY = round1(_a.speedY * PLAYER_SPEED_REDUCTION, 0.1);
	_shake = round1(_shake * SHAKE_REDUCTION, 0.1);
	_fade = round1(_fade * FADE_REDUCTION, 0.01);
	
	if (!_low_gfx)
	{
		layerAddDroplet(0, randomInt(5, VIEW_WIDTH - 6), randomInt(5, VIEW_HEIGHT - 6), 1.5);
	}
	
	mapUpdate();
	tryMove();
	viewRecenter();
}

function getGroundTileId(x, y)
{
	return T_FIRST_GROUND + ((toTile(_view_map[y][x].realX) * 17 + toTile(_view_map[y][x].realY)) % 712 % 3) + (toTile(_view_map[y][x].realY) % 2) * 3;
}

function drawTiles()
{
	var x, y, c, g, a;
	
	_ctx.fillStyle = "#111";
	_ctx.fillRect(0, 0, WIDTH, HEIGHT);
	
	for (y=0; y<VIEW_HEIGHT; y++)
	{
		for (x=0; x<VIEW_WIDTH; x++)
		{
			a = _view_map[y][x];
			
			if (a.status == STATUS_VALID)
			{
				if (a.tile == TILE_GROUND)
				{
					drawTile16(x * 16, y * 16, getGroundTileId(x, y), 0, FIRST_CUSTOM_PALETTE + 4);
				}
				else if (a.tile == TILE_WALL)
				{
					drawTile16(x * 16, y * 16, T_WALL, 0, -1);
				}
			}
		}
	}
}

function drawProjections()
{
	var i, j, p;
	
	// go layer by layer, starting from the lowermost
	for (i=0; i<4; i++)
	{
		for (j=0; j<_projections.length; j++)
		{
			p = _projections[j];
			
			if (p.obj.layer == i)
			{
				// shadow
				if (p.obj.floating)
				{
					drawTile16(p.viewX + p.obj.floatX, p.viewY, 26, 0, -1);
				}
				drawTile16(p.viewX + p.obj.floatX, p.viewY + p.obj.floatY, p.tile, p.mirrored, p.obj.spritePalette);
				if (p.obj.overlaySprite)
				{
					drawTile16(p.viewX + p.obj.floatX, p.viewY + p.obj.floatY, p.obj.overlaySprite, p.mirrored, p.obj.overlaySpritePalette[Math.floor(p.obj.tickCount + p.obj.id * 140) % (6 * 6)]);
				}
			}
		}
	}
	
	// draw the greabbed object above all
	if (_player_obj.grabbedObject != null)
	{
		for (j=0; j<_projections.length; j++)
		{
			p = _projections[j];
			
			if (p.obj == _player_obj.grabbedObject)
			{
				// NOTE: grabbed item does not have a shadow and is not floating
				drawTile16(p.viewX, p.viewY, p.tile, p.mirrored, p.obj.spritePalette);
			}
		}
	}
}

function isDoorAt(x, y)
{
	var i;
	
	for (i=0; i<_objs.length; i++)
	{
		if (_objs[i].realX == x && _objs[i].realY == y && _objs[i] instanceof ObjDoor)
		{
			return true;
		}
	}
	
	return false;
}

function drawCeiling()
{
	var x, y, a, b;
	
	// draw ceiling
	for (y=0; y<VIEW_HEIGHT - 1; y++)
	{
		for (x=0; x<VIEW_WIDTH; x++)
		{
			a = _view_map[y][x];
			b = _view_map[y + 1][x];
			
			if (b.status == STATUS_VALID)
			{
				if (b.tile == TILE_WALL || isDoorAt(b.realX, b.realY))
				{
					_ctx.globalAlpha = 1;
					
					if (
						x > VIEW_CENTER_X - 3 &&
						x < VIEW_CENTER_X + 3 &&
						y > VIEW_CENTER_Y - 3 &&
						y < VIEW_CENTER_X + 3 &&
						(a.tile == TILE_GROUND || a.tile == TILE_VOID2)
					)
					{
						// half-transparent ceiling
						_ctx.globalAlpha = 0.5;
					}
					drawTile16(x * 16, y * 16, T_CEILING, 0, -1);
				}
			}
		}
	}
}

function drawGlitch()
{
	var i, j, x, y, a, b, c, d, e, f, g, g1, g2;
	
	// TODO: this is a mess...
	// normal: glitched 8x8 boxes around moster and randomly on the screen
	// low gfx: white 8x8 boxes around monster and white lines randomly on the screen
	
	c = _glitch_size;
	
	// glitch-bzzt: the glitch monster is "jumping"
	if (_glitch_bzzt)
	{
		c += 64;
	}
	
	// full screen glitch effect chance (0..1)
	e = _glitch_values[1];
	
	// shake level
	_shake += _glitch_values[7] * 10;
	
	_ctx.fillStyle = "#fff";
	
	if (!_low_gfx)
	{
		f = _ctx.getImageData(0, 0, WIDTH, HEIGHT);
	}
	for (y=0; y<VIEW_HEIGHT; y+=0.5)
	{
		if (_low_gfx)
		{
			if (chance(e))
			{
				_ctx.fillRect(0, y * 16, WIDTH, randomInt(4, 8));
			}
		}
		
		for (x=0; x<VIEW_WIDTH; x+=0.5)
		{
			d = false;
			g = false;
			
			// full screen glitch
			if (chance(e))
			{
				d = true;
			}
			else
			{
				// glitch around the monster
				a = distance(_glitch_pos.viewX, _glitch_pos.viewY, x * 16, y * 16);
				
				if (a < c)
				{
					b = Math.pow(1 - (a / c), 2);
					
					if (chance(b))
					{
						d = true;
						g = true;
					}
				}
			}
			
			if (_low_gfx)
			{
				if (g)
				{
					_ctx.fillRect(x * 16, y * 16, 8, 8);
				}
			}
			else
			{
				if (d)
				{
					// TODO: lower treshold? non-random treshold?
					b = randomInt(0, 255);
					
					for (i=0; i<8; i++)
					{
						// white on black
						g1 = 255;
						g2 = 0;
						
						// inverted
						if (chance(0.2))
						{
							g1 = 0;
							g2 = 255;
						}
						
						for (j=0; j<8; j++)
						{
							a = ((y * 16 + i) * WIDTH + (x * 16) + j) * 4;
							
							f.data[a] = f.data[a] < b ? g1 : g2;
							f.data[a+1] = f.data[a+1] < b ? g1 : g2;
							f.data[a+2] = f.data[a+2] < b ? g1 : g2;
							f.data[a+3] = 255;
						}
					}
				}
			}
		}
	}
	
	if (!_low_gfx)
	{
		_ctx.putImageData(f, 0, 0);
	}
}

function drawDrops()
{
	var y, x, a;
	
	for (y=0; y<VIEW_HEIGHT; y++)
	{
		for (x=0; x<VIEW_WIDTH; x++)
		{
			a = _player_obj.tickCount + (x * y);
			
			// powerup
			if (_layers[0][y][x] > 0.01 && _view_map[y][x].tile == TILE_GROUND)
			{
				_ctx.globalAlpha = Math.min(_layers[0][y][x], 1);
				drawTile16(x * 16, y * 16, getGroundTileId(x, y), 0, _animated_palettes[0][a % 36]);
			}
			
			// super
			if (_layers[1][y][x] > 0.01 && (_view_map[y][x].tile == TILE_GROUND || _view_map[y][x].tile == TILE_VOID2))
			{
				_ctx.globalAlpha = Math.min(_layers[1][y][x], 1);
				drawTile16(x * 16, y * 16, getGroundTileId(x, y), 0, _animated_palettes[1][a % 36]);
			}
		}
	}
	
	_ctx.globalAlpha = 1;
}

function drawFade()
{
	if (_fade != 0)
	{
		_ctx.fillStyle = "rgba(255,255,255," + _fade + ")";
		_ctx.fillRect(0, 0, WIDTH, HEIGHT);
	}
}

function drawFhdks()
{
	var x, y, a, b, c, i;
	
	// TODO: in final, merge with drawProjections()
	
	if (_player_obj.tickCount % (20 * 5) == 0)
	{
		_fhdk_string = "";
	}
	
	for (y=0; y<VIEW_HEIGHT; y++)
	{
		for (x=0; x<VIEW_WIDTH; x++)
		{
			a = _view_map[y][x];
			
			if (a.realX / 16 > 12 && a.realX / 16 < 18 && a.realY / 16 == 4 && _player_obj.tickCount % 20 == 0)
			{
				b = a.realX / 16 - 13;
				c = Math.floor(_player_obj.tickCount / 20) % 8;
				
				if (c == b)
				{
					layerAddDroplet(1, x, y, 13);
					for (i=0; i<_objs.length; i++)
					{
						if (_objs[i] instanceof ObjCrystal && distanceReal(a, _objs[i]) < 10)
						{
							_synth.playSound(_objs[i].grabSound);
							_fhdk_string += (_objs[i].grabSound - SOUND_FIRST_CRYSTAL_SAMPLE);
							if (_fhdk_string == "01234" && !_fhdk_done)
							{
								_fhdk_done = true;
							}
						}
					}
				}
			}
		}
	}
}

function gameDrawAll()
{
	var vx, vy, a, b, c, x, y;
	
	if (_view_update_needed)
	{
		_ctx = _tile_ctx;
		drawTiles();
	}
	
	_object_ctx.drawImage(_tile_canvas, 0, 0);
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	_ctx = _object_ctx;
/*
	_ctx.fillStyle = "rgba(0,0,0,0.1)";
	_ctx.fillRect(0, 0, 0, WIDTH, HEIGHT);
*/
	drawFhdks();
	drawDrops();
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	drawProjections();
	_ctx.globalAlpha = 1;
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	drawCeiling();
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	drawGlitch();
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	drawFade();
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	_a.viewPadX += (- _a.viewX - _a.viewPadX) * VIEW_SPEED;
	_a.viewPadY += (- _a.viewY - _a.viewPadY) * VIEW_SPEED;
	
	vx = Math.floor(_a.viewPadX + FINAL_WIDTH / 2 + randomPosNeg(_shake));
	vy = Math.floor(_a.viewPadY + FINAL_HEIGHT / 2 + randomPosNeg(_shake));
	
// DEBUG BEGIN
	_ctx.fillStyle = "#000";
	_ctx.fillRect(120 - vx, 2 - vy, 100, 4);
	
	_ctx.fillStyle = "#e00";
	_ctx.fillRect(120 - vx, 2 - vy, Math.floor(_glitch_percent), 4);
	
	_ctx.fillStyle = "#000";
	_ctx.fillRect(120 - vx, 8 - vy, 100, 4);
	
	_ctx.fillStyle = "#0ee";
	_ctx.fillRect(120 - vx, 8 - vy, Math.floor(_glitch_time_left / 30), 4);
	
	_ctx.fillStyle = "#fff";
	_ctx.fillText(Math.round(_player_obj.realX) + ", " + Math.round(_player_obj.realY), 10 - vx, 10 - vy);
	_ctx.fillText(Math.round(_player_obj.realX / 16) + ", " + Math.round(_player_obj.realY / 16), 10 - vx, 20 - vy);
// DEBUG END
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	_final_ctx.drawImage(_object_canvas, 0, 0, WIDTH, HEIGHT, vx * _zoom * _pixel_ratio, vy * _zoom * _pixel_ratio, WIDTH * _zoom * _pixel_ratio, HEIGHT * _zoom * _pixel_ratio);
	
	_view_update_needed = false;
}

function projectViewCoordinatesToReal(a, obj)
{
	// TODO?!
	var x, y, v, b;
	
	v = _view_map[toTile(a.viewY)][toTile(a.viewX)];
	
	b = [ 0, 0 ];
	
	x = v.realX + b[0];
	y = v.realY + b[1];
	
	return [ x, y ];
}

function playerUpdate()
{
	var a, b, v;
	
	v = _view_map[toTile(_a.viewY)][toTile(_a.viewX)];
	
	_player_obj.direction = (_a.direction - v.direction + 4) % 4;
	b = mapApplyDirection(_a.viewX % 16 - 8, _a.viewY % 16 - 8, (v.direction) % 4);
	
	_player_obj.realX = v.realX + b[0];
	_player_obj.realY = v.realY + b[1];
}

function objectUpdate()
{
	var i;
	
	// from last item to the first one so if a removal is needed it will not
	// affect the indexes of the items still need to be processed
	for (i=_objs.length-1; i>=0; i--)
	{
		_objs[i].tickHandler();
		
		if (_objs[i].destroyed)
		{
			_objs.splice(i, 1);
		}
	}
}

function projectionUpdate()
{
	var i, x, y;
	
	_projections = [];
	
	for (i=0; i<_objs.length; i++)
	{
		for (y=0; y<VIEW_HEIGHT-1; y++)
		{
			for (x=0; x<VIEW_WIDTH-1; x++)
			{
				if (
					_objs[i].realX >= (_view_map[y][x].realX) &&
					_objs[i].realX <  (_view_map[y][x].realX + 16) &&
					_objs[i].realY >= (_view_map[y][x].realY) &&
					_objs[i].realY <  (_view_map[y][x].realY + 16)
				)
				{
					_projections.push(new Projection(_objs[i], _view_map[y][x]));
				}
			}
		}
	}
}

function gameExplodeAndRestart()
{
	_player_obj.destroyed = true;
	_objs.push(new ObjExplosion(_player_obj.realX / 16, _player_obj.realY / 16, SOUND_EXPLOSION));
	_shake += 25;
	_restart_timer = 10;
}

function playerGrabSave()
{
	_saved_object_id = null;
	
	if (_player_obj && _player_obj.grabbedObject && _player_obj.grabbedObject.persistent)
	{
		_saved_object_id = _player_obj.grabbedObject.id;
	}
}

function playerGrabRestore()
{
	var i;
	
	for (i=0; i<_objs.length; i++)
	{
		if (_objs[i].id == _saved_object_id)
		{
			_player_obj.grabbedObject = _objs[i];
		}
	}
}

function processPermanentObjects()
{
	if (!_permanent_objs.length)
	{
		_permanent_objs.push(
			new ObjCrystal(56, 20, 1),
			new ObjCrystal(24, 19, 2),
			new ObjCrystal(13, 4, 3),
			new ObjCrystal(25, 30, 4),
			new ObjCrystal(35, 27, 5)
		);
	}
	_objs = _objs.concat(_permanent_objs);
}

function gameRestart()
{
	var a, i;
	
	playerGrabSave();
	
	resetObjectIdSequence();
	mapInit();
	glitchInit();
	layersInit();
	uiReset();
	
	processPermanentObjects();
	
	_view_update_needed = true;
	
	_player_obj = _objs[0];
	
	playerGrabRestore();
	
	_center_state = _copy(_default_state);
	_center_state.tile = 1;
	
	_center_state.direction = randomInt(0, 3);
// DEBUG BEGIN
	_center_state.direction = 0;
// DEBUG END
	_center_state.viewX = VIEW_CENTER_X * 16;
	_center_state.viewY = VIEW_CENTER_Y * 16;
	_center_state.realX = _player_obj.realX;
	_center_state.realY = _player_obj.realY;
	
	_a.viewX = (VIEW_CENTER_X) * 16 + 8;
	_a.viewY = (VIEW_CENTER_Y) * 16 + 8;
	_a.viewPadX = - _a.viewX;
	_a.viewPadY = - _a.viewY;
	
	_shake = 0;
	
	mapUpdate();
	viewUpdate();
}

function controlUpdate()
{
	if (inputIsKeyActive(IH_KEY_MUTE))
	{
		// _muted = true;
		
		// TODO: optimize this
		if (!_last_was_mute)
		{
			_sound_status = (_sound_status + 1) % 3;
			uiShowMessage(_sound_status_messages[_sound_status]);
		}
		_last_was_mute = true;
	}
	else
	{
		_last_was_mute = false;
	}
	
	if (inputIsKeyActive(IH_KEY_GRAB))
	{
		// _muted = true;
		
		// TODO: optimize this
		if (!_last_was_grab)
		{
			_player_obj.tryGrabOrRelease();
		}
		_view_update_needed = true;
		_last_was_grab = true;
	}
	else
	{
		_last_was_grab = false;
	}
	
	if (inputIsKeyActive(IH_KEY_USE))
	{
		if (!_last_was_use)
		{
			_player_obj.tryUse();
		}
		_view_update_needed = true;
		_last_was_use = true;
	}
	else
	{
		_last_was_use = false;
	}
	
	if (inputIsKeyActive(IH_KEY_UP))
	{
		_a.speedY -= PLAYER_SPEED;
	}
	if (inputIsKeyActive(IH_KEY_RIGHT))
	{
		_a.speedX += PLAYER_SPEED;
	}
	if (inputIsKeyActive(IH_KEY_DOWN))
	{
		_a.speedY += PLAYER_SPEED;
	}
	if (inputIsKeyActive(IH_KEY_LEFT))
	{
		_a.speedX -= PLAYER_SPEED;
	}
}

function gameFirstTouch()
{
	var i;
	
	_synth = new Synth();
	_synth.addSamples(SOUND_SAMPLES);
	for (i=0; i<8; i++)
	{
		_synth.addSamples([[0,0.09,0.01,,0.64,0.3 + i * 0.05,,,,,,,,,,,,,1,,,,,0.5]]);
	}
	_synth.setSongs(SONGS);
	_synth.playSong(0);
}

function newPalette(s)
{
	// push() returns the length, not the index
	return _palettes.push(hexToPalette(s)) - 1;
}

function loadPalettes()
{
	var i;
	
	for (i=0; i<PALETTES.length / 16; i++)
	{
		newPalette(PALETTES.substring(i * 16, (i + 1) * 16));
	}
}

function gameUpdate()
{
// DEBUG BEGIN
	_profiler.start();
// DEBUG END
	
	// uiUpdate() handles the touches as well
	uiUpdate();
	
	controlUpdate();
	gameTick();
	
	playerUpdate();
	glitchUpdate();
	objectUpdate();
	projectionUpdate();
/*
	particleUpdate();
*/
	layersUpdate();
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	gameDrawAll();
	
// DEBUG BEGIN
	_profiler.draw();
// DEBUG END
	
	// we need to redraw immediately after restart
	// so we should not clear after gameRestart()
	_view_update_needed = false;
	
	if (!_player_obj.destroyed && (_center_state.tile == TILE_VOID || (_center_state.tile == TILE_VOID2 && !_player_obj.superTime > 0)))
	{
		gameExplodeAndRestart();
	}
	
	if (_glitch_percent > 99 || _restart_timer == 1)
	{
		gameRestart();
		_fade = 1;
	}
	
	if (_restart_timer > 0)
	{
		_restart_timer--;
	}
	
// DEBUG BEGIN
	if (_player_obj.tickCount % 200 == 0)
	{
		console.log("cached tiles: " + _gfx_tile_cache_length);
	}
// DEBUG END
	
	_frames_processed++;
}

function fpsGuard()
{
	if (_frames_processed_last != 0 && (_frames_processed_last + _frames_processed) / 2 < 20)
	{
		_low_gfx = true;
	}
	
	_frames_processed_last = _frames_processed;
	_frames_processed = 0;
}

function generateAnimatedPalette(color)
{
	var i, result, palettes, a, b, c, d, e, j;
	
	result = [];
	
	// [
	//   [ frames_to_blend_into_next_color, [ c1, c2, c3, c4 ] ],
	//   ...
	// ]
	palettes =  [
		hexToPalette(stringReplaceAll("0000ffff0000...2", '...', color)),
		hexToPalette(stringReplaceAll("0000...fffff0000", '...', color)),
		hexToPalette(stringReplaceAll("0000...8...fffff", '...', color)),
		hexToPalette(stringReplaceAll("0000...4...8...f", '...', color)),
		hexToPalette(stringReplaceAll("0000...2...4...8", '...', color)),
		hexToPalette(stringReplaceAll("00000000...2...4", '...', color))
	];
	
	b = 0;
	c = -1;
	a = 0;
	
	for (i=0; i<36; i++)
	{
		if (i % 6 == 0)
		{
			c++;
		}
		
		b = [];
		
		d = (c + 1) % 6;
		
		e = (i % 6) / 6;
		
		for (j=0; j<4; j++)
		{
			b[j] = [
				lerp256(palettes[c][j][0], palettes[d][j][0], e),
				lerp256(palettes[c][j][1], palettes[d][j][1], e),
				lerp256(palettes[c][j][2], palettes[d][j][2], e),
				lerp256(palettes[c][j][3], palettes[d][j][3], e)
			];
		}
		
		result.push(b);
	}
	
	return result;
}

function gameInit()
{
	uiInit();
	inputInit();
	touchInit();
	loadPalettes();
	
	window.addEventListener("resize", onResize);
	onResize();
	
	if (!_touch_available)
	{
		gameFirstTouch();
	}
	
	_animated_palettes.push(
		generateAnimatedPalette("0f0"),
		generateAnimatedPalette("0af"),
		generateAnimatedPalette("fe0"),
		generateAnimatedPalette("f30"),
		generateAnimatedPalette("a5b"),
		generateAnimatedPalette("ec0")
	);
	
	window.setInterval(fpsGuard, 1000);
	
	gameRestart();
}
