"use strict";

var _first_touch = true;
var _touch_available = false;

var _joystick_active = false;
var _joystick_center = [ 50, 50 ];
var _joystick_distance = 0;

// integer, right: 0, down-right: 1, down: 2, down-left: 3, left: 4, ...
var _joystick_angle = 0;

// the right box is always in the bottom-right corner, we will just note the
// top-left coordinates as bottom right will always be the bottom-right corner
// of the window
var _touch_right_box = [ 0, 0 ];

// also, the left box is always in the bottom-left corner of screen
var _touch_left_box = [ 0, 0 ];

var _right_touch = null; // only one touch is allowed
var _left_touches = [];

function touchUpdateJoystick()
{
	if (_right_touch == null)
	{
		_joystick_center = [ 50, 50 ];
		_joystick_distance = 0;
		_joystick_active = false;
		return;
	}
	
	// if joystick was not active before then put its center on _this_ touch and activate it
	if (!_joystick_active)
	{
		_joystick_center = [ _right_touch[0], _right_touch[1] ];
		_joystick_active = true;
	}
	
	_joystick_distance = distance(_joystick_center[0], _joystick_center[1], _right_touch[0], _right_touch[1]);
	_joystick_angle = Math.atan2(_joystick_center[1] - _right_touch[1], _joystick_center[0] - _right_touch[0]);
	_joystick_angle = Math.floor((_joystick_angle / (2 * Math.PI) + 0.5) * 12);
}

function touchHandler(event)
{
	var i;
	
	_right_touch = null;
	_left_touches.length = 0;
	
	for (i=0; i<event.touches.length; i++)
	{
		// touch on the left side
		if (event.touches[i].clientX < _touch_left_box[0])
		{
			_left_touches.push([ (event.touches[i].clientX) / _ui_z, (event.touches[i].clientY - _touch_left_box[1]) / _ui_z]);
		}
		else // touch on the right side
		{
			_right_touch = [ (event.touches[i].clientX - _touch_right_box[0]) / _ui_z, (event.touches[i].clientY - _touch_right_box[1]) / _ui_z ];
		}
	}
	
	touchUpdateJoystick();
	
	if (_first_touch)
	{
		gameFirstTouch();
		_first_touch = false;
	}
	event.preventDefault();
}

function touchDrawAndProcessBox(n, text, key)
{
	var i, bx, by, bw, bh, px, py, pw, ph, button_count, button_padding;
	
	button_count = 3;
	button_padding = 5;
	bh = (100 - 5 * button_count) / button_count;
	bw = 80 - 2 * button_padding;
	
	bx = button_padding;
	by = (bh + button_padding) * n;
	
	px = bx * _ui_z;
	py = by * _ui_z + _touch_left_box[1];
	pw = bw * _ui_z;
	ph = bh * _ui_z;
	
	_ui_ctx.strokeStyle = "rgba(255,255,255,0.3)";
	
	for (i=0; i<_left_touches.length; i++)
	{
		if (
			_left_touches[i][0] > bx &&
			_left_touches[i][0] < bx + bw &&
			_left_touches[i][1] > by &&
			_left_touches[i][1] < by + bh
		)
		{
			inputSetTouchStatusOn(key);
			_ui_ctx.strokeStyle =  "rgba(255,255,255,0.8)";
			break;
		}
	}
	
	_ui_ctx.strokeRect(px, py, pw, ph);
	
	_ui_ctx.fillStyle = _ui_ctx.strokeStyle;
	_ui_ctx.fillText(text + " ", px + pw - button_padding * _ui_z, py + ph / 2);
}

function touchDrawAndProcessCircle(radius)
{
	var px, py, pr;
	
	_ui_ctx.strokeStyle = "rgba(255,255,255,0.3)";
	
	if (_joystick_distance > 5)
	{
		_ui_ctx.strokeStyle = "rgba(255,255,255,0.8)";
		
		// up
		if (_joystick_angle > 6 && _joystick_angle < 11)
		{
			inputSetTouchStatusOn(IH_KEY_UP);
		}
		
		// right (wrapping around!)
		if (_joystick_angle < 2 || _joystick_angle > 9)
		{
			inputSetTouchStatusOn(IH_KEY_RIGHT);
		}
		
		// down
		if (_joystick_angle > 0 && _joystick_angle < 5)
		{
			inputSetTouchStatusOn(IH_KEY_DOWN);
		}
		
		// left
		if (_joystick_angle > 3 && _joystick_angle < 8)
		{
			inputSetTouchStatusOn(IH_KEY_LEFT);
		}
	}
	
	px = _touch_right_box[0] + _joystick_center[0] * _ui_z;
	py = _touch_right_box[1] + _joystick_center[1] * _ui_z;
	pr = radius * _ui_z;
	
	_ui_ctx.beginPath();
	_ui_ctx.arc(px, py, pr, 0, 2 * Math.PI);
	_ui_ctx.stroke();
}

function touchUpdate()
{
	inputClearTouchStatuses();
	
	_ui_ctx.textAlign = "right";
	_ui_ctx.lineWidth = _ui_z * 0.8;
	
	touchDrawAndProcessBox(0, "Mute", IH_KEY_MUTE);
	touchDrawAndProcessBox(1, "Use", IH_KEY_USE);
	touchDrawAndProcessBox(2, "Grab", IH_KEY_GRAB);
	touchDrawAndProcessCircle(35);
}

function touchInit()
{
	// thx David @ http://stackoverflow.com/a/15439809
	if (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0))
	{
		_touch_available = true;
		
		_ui_canvas.addEventListener("touchstart", touchHandler);
		_ui_canvas.addEventListener("touchmove", touchHandler);
		_ui_canvas.addEventListener("touchend", touchHandler);
		_ui_canvas.addEventListener("touchcancel", touchHandler);
	}
}
