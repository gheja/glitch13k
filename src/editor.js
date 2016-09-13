"use strict";

var _spritesheet;
var _canvas;
var _ctx;
var _final_canvas;
var _final_ctx;
var _gfx_tile_cache;
var _pixel_ratio = 1;
var _zoom = 2;
var _glitch1;
var _paused = true;
var _input_handler = null;
var _view_pad = { x: 0, y: 0 };
var _objs = [];
var _projections = [];
var _player_obj = null;
var _particle_handler = null;
var _a = { x: 0, y: 0, speedX: 0, speedY: 0, direction: 0 };
var _center_state;
var _shake;
var _fade = 0;
var _synth;
var _restart_timer = 0;
var _gfx_force_refresh = false;
var _muted = false;

var _view_update_needed = false;
var _last_was_grab = false;
var _last_was_use = false;
var _frames_processed = 0;
var _frames_processed_last = 0;
var _low_gfx = false;

// DEBUG BEGIN
var _profiler;
// DEBUG END

var _map = [];
var _palettes = [];
var _animated_palettes = [];

function getGroundTileId(x, y)
{
	return 27;
}

function gameDraw()
{
	var x, y, a, b, c, d, e, f, g, g1, g2, s, i, j, p, vx, vy;
	
//	if (_view_update_needed)
	{
		
		// TODO: remove this?
		_ctx.fillStyle = "#222";
		_ctx.fillRect(0, 0, _editor_width, _editor_height);
		
		// draw floor (tiles)
		for (x=0; x<_map[0].length; x++)
		{
			for (y=0; y<_map.length; y++)
			{
				c = 0;
				g = 0;
				a = _map[y][x];
				
				if (a == TILE_VOID)
				{
					drawTile16(x * 16, y * 16, 3, 0, PAL1);
				}
				else if (a == TILE_VOID2)
				{
					drawTile16(x * 16, y * 16, 3, 0, PAL2);
				}
				else if (a == TILE_GROUND)
				{
					drawTile16(x * 16, y * 16, 3, 0, PAL3);
				}
				else if (a == TILE_WALL)
				{
					drawTile16(x * 16, y * 16, 3, 0, PAL4);
				}
			}
		}
	}
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	_objs[0].tile = 8;
	
	for (i=0; i<_objs.length; i++)
	{
		_objs[i].tickHandler();
		
		if (typeof _objs[i].sprites == "number")
		{
			_objs[i].tile = _objs[i].sprites;
		}
		else if (typeof _objs[i].sprites[a] == "number")
		{
			_objs[i].tile = _objs[i].sprites[a];
			_objs[i].mirrored = false;
		}
		else
		{
			_objs[i].tile = _objs[i].sprites[a][0];
			_objs[i].mirrored = _objs[i].sprites[a][1];
		}
	}
	
	// draw projections
	for (i=0; i<4; i++)
	{
		for (j=0; j<_objs.length; j++)
		{
			if (_objs[j].layer == i)
			{
				if (_objs[j].floating)
				{
					drawTile16(_objs[j].realX + _objs[j].floatX, _objs[j].realY, 26, 0, -1);
				}
				drawTile16(_objs[j].realX + _objs[j].floatX, _objs[j].realY + _objs[j].floatY, _objs[j].tile, _objs[j].mirrored, _objs[j].spritePalette);
			}
		}
	}
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	// draw ceiling
/*
	for (x=0; x<VIEW_WIDTH; x++)
	{
		for (y=0; y<VIEW_HEIGHT - 1; y++)
		{
			a = _map[y][x];
			b = _map[y + 1][x];
			
			if (b.status == STATUS_VALID)
			{
				if (b.tile == TILE_WALL)
				{
					if (x > 7 && x < 13 && y > 7 && y < 13 && (a == TILE_GROUND))
					{
						drawTile16(x * 16, y * 16, 2, 0, 0, -1);
					}
					else
					{
						drawTile16(x * 16, y * 16, 0, 0, 0, -1);
					}
				}
			}
		}
	}
*/
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	vx = 0;
	vy = 0;
	
	_ctx.fillStyle = "rgba(255,255,255,0.5)";
	_ctx.fillRect(Math.floor(_cursor.x / 16) * 16, Math.floor(_cursor.y / 16) * 16, 16, 16);
	
// DEBUG BEGIN
	_ctx.fillStyle = "#fff";
	_ctx.fillText(Math.floor(_cursor.x) + ", " + Math.floor(_cursor.y), 10 - vx, 10 - vy);
	_ctx.fillText(Math.floor(_cursor.x / 16) + ", " + Math.floor(_cursor.y / 16), 10 - vx, 20 - vy);
	
	if (typeof MAP_OBJECT_NAMES !== 'undefined')
	{
		for (i=0; i<_objs.length; i++)
		{
			if (toTile(_objs[i].realX) == toTile(_cursor.x) && toTile(_objs[i].realY) == toTile(_cursor.y) && (MAP_OBJECT_NAMES[i] !== undefined))
			{
				_ctx.fillStyle = "rgba(0,0,0,0.5)";
				_ctx.fillRect(_cursor.x - 16, _cursor.y - 12, 64, 12);
				_ctx.fillStyle = "#fff";
				_ctx.fillText(MAP_OBJECT_NAMES[i], _cursor.x - 14, _cursor.y - 2);
			}
		}
	}
// DEBUG END
	
// DEBUG BEGIN
	_profiler.mark();
// DEBUG END
	
	_final_ctx.drawImage(_canvas, 0, 0, _editor_width, _editor_height, 0, 0, _editor_width * _zoom, _editor_height * _zoom);
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
	_profiler.mark();
// DEBUG END
	
	gameDraw();
	
// DEBUG BEGIN
	_profiler.draw();
// DEBUG END
}

function gameInit()
{
	loadPalettes();
	mapInit();
	_player_obj = _objs[0];
}


////////////////////////

var _editor_width = 800;
var _editor_height = 400;
var PAL1;
var PAL2;
var PAL3;
var PAL4;
var _editor_tile = '0';
var _cursor = { x: 0, y: 0, down: false };
var _map_changed = false;

function updateMapData()
{
	var s, x, y, aw, ah;
	
	s = "";
	
	if (_map.length > 0)
	{
		aw = _map[0].length;
		ah = _map.length;
	}
	else
	{
		aw = 0;
		ah = 0;
	}
	
	mapResize();
	
	for (y=0; y<_map.length; y++)
	{
		for (x=0; x<_map[0].length; x++)
		{
			s += _map[y][x];
		}
	}
	
	getDomElement("map_width").value = _map[0].length;
	getDomElement("map_height").value = _map.length;
	getDomElement("map_data").value = s;
	
	if (aw != _map[0].length || ah != _map.length)
	{
		resize();
	}
	
	getDomElement("submit").className = "button_warning";
	_map_changed = true;
}

function onTextareaChange()
{
	getDomElement("submit").className = "button_warning";
	_map_changed = true;
	resizeTextareas();
}

function editorSelectTile(a)
{
	_editor_tile = a;
}

function onMouseDown(event)
{
	_cursor.down = true;
	onMouseMove(event);
}

function onMouseUp(event)
{
	_cursor.down = false;
}

function onMouseMove(event)
{
	_cursor.x = Math.floor((event.clientX + _body.scrollLeft) / _zoom);
	_cursor.y = Math.floor((event.clientY + _body.scrollTop - 30) / _zoom);
	
	if (_cursor.down && _cursor.x / 16 >= 0 && _cursor.x / 16 < _map[0].length && _cursor.y / 16 >= 0 && _cursor.y / 16 < _map.length)
	{
		_map[Math.floor(_cursor.y / 16)][Math.floor(_cursor.x / 16)] = _editor_tile;
		updateMapData();
	}
}

function resizeTextarea(id)
{
	var obj;
	
	obj = getDomElement(id);
	obj.style.height = obj.scrollHeight + "px";
}

function resizeTextareas()
{
	resizeTextarea('map_objs');
	resizeTextarea('map_init');
	resizeTextarea('map_update');
}

function toggleTextarea(id)
{
	var obj;
	
	obj = getDomElement(id);
	if (obj.style.display != 'block')
	{
		obj.style.display = 'block';
	}
	else
	{
		obj.style.display = 'none';
	}
	
	resizeTextarea(id);
}

function resize()
{
	if (getDomElement("zoom").checked)
	{
		_zoom = 3;
	}
	else
	{
		_zoom = 1;
	}
	
	if (_map.length > 0)
	{
		_editor_width = _map[0].length * 16;
		_editor_height = _map.length * 16;
	}
	
	_canvas.width = _editor_width;
	_canvas.height = _editor_height;
	
	_final_canvas.width = _editor_width * _zoom;
	_final_canvas.height = _editor_height * _zoom;
	
	fixCanvasContextSmoothing(_final_ctx);
}

var _body;
var _nextFrameTime = 0;

function mainUpdate()
{
	var a;
	
	_requestAnimationFrame(mainUpdate);
	
	a = Date.now();
	
	if (a + 5 < _nextFrameTime)
	{
		return;
	}
	
	_nextFrameTime = a + (1000 / FPS);
	
// DEBUG BEGIN
	if (typeof EDITOR_LOADED != 'undefined')
	{
		editorUpdate();
	}
	else
// DEBUG END
	{
		gameUpdate();
	}
}

function loadMapCallback()
{
	var obj;
	
	if (this.readyState == 4)
	{
		try
		{
			obj = JSON.parse(this.responseText);
			getDomElement("map_width").value = obj.map_width;
			getDomElement("map_height").value = obj.map_height;
			getDomElement("map_data").value = obj.map_data;
			getDomElement("map_objs").value = obj.map_objs;
			getDomElement("map_init").value = obj.map_init;
			getDomElement("map_update").value = obj.map_update;
			resizeTextareas();
		}
		catch (err)
		{
			alert(err);
			return;
		}
	}
}

function editorDeleteRowIfEmpty(x)
{
	var i;
	
	for (i=0; i<_map.length; i++)
	{
		if (_map[i][x] != 0)
		{
			return false;
		}
	}
	
	for (i=0; i<_map.length; i++)
	{
		_map[i].splice(x, 1);
	}
	
/*
	for (i=0; i<_doors.length; i++)
	{
		if (_doors[i].x > x)
		{
			_doors[i].x--;
		}
	}
*/
	
	return true;
}

function editorDeleteColumnIfEmpty(y)
{
	var i;
	
	for (i=0; i<_map[y].length; i++)
	{
		if (_map[y][i] != 0)
		{
			return false;
		}
	}
	
	_map.splice(y, 1);
	
/*
	for (i=0; i<_doors.length; i++)
	{
		if (_doors[i].y > y)
		{
			_doors[i].y--;
		}
	}
*/
	
	return true;
}

function editorInsertRow(y)
{
	var i, x, a;
	
	a = [];
	for (x=0; x<_map[0].length; x++)
	{
		a.push(TILE_VOID);
	}
	
/*
	for (i=0; i<_doors.length; i++)
	{
		if (_doors[i].y >= y)
		{
			_doors[i].y++;
		}
	}
*/
	
	arrayInsert(_map, y, a);
}

function editorInsertColumn(x)
{
	var i;
	
	for (i=0; i<_map.length; i++)
	{
		arrayInsert(_map[i], x, TILE_VOID);
	}
	
/*
	for (i=0; i<_doors.length; i++)
	{
		if (_doors[i].x >= x)
		{
			_doors[i].x++;
		}
	}
*/
}

function mapResize()
{
	while (1)
	{
		if (_map.length == 1)
		{
			break;
		}
		
		if (!editorDeleteColumnIfEmpty(_map.length - 1))
		{
			break;
		}
	}
	
	while (1)
	{
		if (_map[0].length == 1)
		{
			break;
		}
		
		if (!editorDeleteRowIfEmpty(_map[0].length - 1))
		{
			break;
		}
	}
	
	editorInsertRow(_map.length);
	editorInsertColumn(_map[0].length);
}

function checkUnsavedChanges()
{
	if (_map_changed)
	{
		if (!confirm("Discard changes?"))
		{
			return false;
		}
	}
	
	return true;
}

function downloadMap()
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = loadMapCallback;
	xhr.open("GET", MAP_JSON, true);
	xhr.send();
}

function storageSet(key, value)
{
	window.localStorage.setItem("glitch13k_editor:" + key, value);
}

function storageGet(key, defaultValue)
{
	var value;
	
	value = window.localStorage.getItem("glitch13k_editor:" + key);
	
	if (value !== undefined)
	{
		return value;
	}
	
	return defaultValue;
}

function settingsLoad()
{
	getDomElement("map_objs").style.display = storageGet("map_objs.on", "yes") == "yes" ? "block" : "none";
	getDomElement("map_init").style.display = storageGet("map_init.on", "yes") == "yes" ? "block" : "none";
	getDomElement("map_update").style.display = storageGet("map_update.on", "yes") == "yes" ? "block" : "none";
	getDomElement("zoom").checked = storageGet("zoom") == "yes";
}

function settingsSave()
{
	storageSet("map_objs.on", getDomElement("map_objs").style.display == "block" ? "yes" : "no");
	storageSet("map_init.on", getDomElement("map_init").style.display == "block" ? "yes" : "no");
	storageSet("map_update.on", getDomElement("map_update").style.display == "block" ? "yes" : "no");
	storageSet("zoom", getDomElement("zoom").checked ? "yes" : "no");
}

function validateMapName(silent)
{
	var s;
	s = getDomElement("map_name").value;
	
	if (! /^[-_a-z0-9]+$/.test(s))
	{
		if (!silent)
		{
			alert('Invalid map name.');
		}
		
		getDomElement("map_name").className = 'invalid';
		
		return false;
	}
	
	getDomElement("map_name").className = '';
	
	return true;
}

function init()
{
	var x, y;
	
	_spritesheet = new Image();
	_spritesheet.src = SPRITESHEET_URL;
	
	_body = document.getElementsByTagName("body")[0];
	
// DEBUG BEGIN
	_profiler = new Profiler();
	_profiler.init("canvas2", 200, 60, 8);
// DEBUG END
	
	PAL1 = hexToPalette("111f111f111fffff");
	PAL2 = hexToPalette("022f022f022fffff");
	PAL3 = hexToPalette("063f063f063fffff");
	PAL4 = hexToPalette("b63fb63fb63fffff");
	
	_gfx_tile_cache = {};
	
	_canvas = newCanvas();
	_canvas.width = _editor_width;
	_canvas.height = _editor_height;
	_ctx = _canvas.getContext("2d");
	
	_final_canvas = getDomElement("canvas1");
	_final_ctx = _final_canvas.getContext("2d");
	_final_canvas.addEventListener("mousedown", onMouseDown);
	_final_canvas.addEventListener("mouseup", onMouseUp);
	_final_canvas.addEventListener("mouseleave", onMouseUp);
	_final_canvas.addEventListener("mousemove", onMouseMove);
	
	settingsLoad();
	
	gameInit();
	downloadMap();
	
	resize();
	mapResize();
	mainUpdate();
	
	window.setInterval(settingsSave, 1000);
}

window.onload = init;
