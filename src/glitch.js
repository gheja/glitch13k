var _glitch_distance;
var _glitch_distance_wanted;
var _glitch_pos = { viewX: 0, viewY: 500 };
var _glitch_bzzt = false;
var _glitch_percent = 0;
var _glitch_size = 40;
var _glitch_time_left = 3000;

var _glitch_update_lock = false;
var _glitch_values = [ 0, 0, 0, 0, 0, 0, 0, 0 ];

function acquireGlitchUpdateLock()
{
	while (_glitch_update_lock) {}
	
	_glitch_update_lock = true;
}

function releaseGlitchUpdateLock()
{
	_glitch_update_lock = false;
}

function glitchParamUpdate()
{
	var tmp, i, master;
	
	master = Math.pow(_glitch_percent / 100, 0.7);
	
	acquireGlitchUpdateLock();
	
	if (chance(eee(master, 0.4, 1, 2) / 6))
	{
		_glitch_values[0] += 5000;
	}
	
	_glitch_values[1] = eee(master, 0.4, 1, 4);
	_glitch_values[7] = eee(master, 0.8, 1, 4);
	
	// white noise
	if (_glitch_bzzt && master > 0.4)
	{
		_glitch_values[2] = randomInt(1000, 6000);
	}
	
	// detuned note count - adjust detune amount, when the current has finished
	if (_glitch_values[3] == 0)
	{
		_glitch_values[4] = Math.floor(randomPosNeg(master * 36));
	}
	
	// detuned note detune amount
	if (chance(eee(master, 0.75, 1, 1) / 4))
	{
		_glitch_values[3] = randomInt(1, 20);
	}
	
	// brown noise
	_glitch_values[5] = eee(master, 0.8, 1, 3);
	
	// cut-off stuff
	_glitch_values[6] = eee(master, 0.7, 0.9, 3);
	
	releaseGlitchUpdateLock();
}

function glitchMonsterUpdate()
{
	var dx, dy, a, ax, ay;
	
	_glitch_time_left--;
	
	_glitch_distance_wanted = Math.max(0, _glitch_time_left / 10);
	
	dx = _glitch_pos.viewX - _a.viewX;
	dy = _glitch_pos.viewY - _a.viewY;
	a = distanceView(_a, _glitch_pos);
	
	_glitch_bzzt = false;
	
	// 0.5% to move around a bit
/*
	if (chance(0.005))
	{
		_glitch_pos.viewX = _a.viewX + dx + randomPosNeg(30);
		_glitch_pos.viewY = _a.viewY + dy + randomPosNeg(30);
		_glitch_bzzt = true;
	}
*/
	
	// if it is too far...
	if (a > _glitch_distance_wanted)
	{
		_glitch_pos.viewX = _a.viewX + dx * 0.9;
		_glitch_pos.viewY = _a.viewY + dy * 0.9;
		_glitch_pos.viewX += randomPosNeg(Math.min(30, _glitch_distance_wanted * 0.05));
		_glitch_pos.viewY += randomPosNeg(Math.min(30, _glitch_distance_wanted * 0.05));
		_glitch_bzzt = true;
	}
	// if it is too near...
	else
	{
		ax = clip(toTile(_glitch_pos.viewX), 0, VIEW_WIDTH - 1);
		ay = clip(toTile(_glitch_pos.viewY), 0, VIEW_HEIGHT - 1);
		
		if (a < Math.min(64, _glitch_distance_wanted) && chance(0.05))
		{
			_glitch_pos.viewX = _a.viewX + dx * (1.1 + randomPosNeg(0.3));
			_glitch_pos.viewY = _a.viewY + dy * (1.1 + randomPosNeg(0.3));
			_glitch_bzzt = true;
		}
		
		if (_layers[0][ay][ax] > 1 || _layers[1][ay][ax] > 1)
		{
			_glitch_pos.viewX = _a.viewX + dx * (2 + randomPosNeg(0.5));
			_glitch_pos.viewY = _a.viewY + dy * (2 + randomPosNeg(0.5));
			_glitch_bzzt = true;
		}
	}
	
	_glitch_distance = distanceView(_a, _glitch_pos);
	
	_glitch_percent = Math.max(0, (100 - _glitch_distance));
}

function glitchUpdate()
{
	glitchMonsterUpdate();
	glitchParamUpdate();
}

function glitchInit()
{
	_glitch_pos.viewX = 0;
	_glitch_pos.viewY = 200;
	_glitch_time_left = 100000;
	_glitch_distance_wanted = 5000;
	// _glitch_distance = 5000;
}
