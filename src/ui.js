"use strict";

var _ui_canvas = null;
var _ui_ctx = null;

var _ui_tips = [ "Arrows to move, Q to grab and E to use", "Not all that falls is lost forever.", "Some levels need your ears." ];
var _ui_message;
var _ui_message_color_fg = "#fff";
var _ui_message_color_bg = "#314";
var _ui_tip_index = -1;
var _ui_ticks;
var _ui_z;

function uiResize()
{
	_ui_canvas.width = window.innerWidth;
	_ui_canvas.height = window.innerHeight;
	
	// landscape
	if (_ui_canvas.width > _ui_canvas.height)
	{
		_ui_z = (_ui_canvas.width / 3) / 100;
	}
	else
	{
		_ui_z = (_ui_canvas.width / 2) / 100;
	}
	
	_ui_z = Math.min(_ui_z, _ui_canvas.height / 100);
	
	if (!_touch_available)
	{
		_ui_z /= 2;
	}
	
	_touch_right_box = [ _ui_canvas.width - 100 * _ui_z, _ui_canvas.height - 100 * _ui_z ];
	_touch_left_box = [ 80 * _ui_z, _ui_canvas.height - 100 * _ui_z ];
}

function uiUpdate()
{
	var a;
	
	_ui_ticks++;
	
	_ui_ctx.clearRect(0, 0, _ui_canvas.width, _ui_canvas.height);
	
	a = 0;
	
	if (_ui_ticks < 10)
	{
		a = _ui_ticks / 10;
	}
	else if (_ui_ticks < 150)
	{
		a = 1;
	}
	else if (_ui_ticks < 160)
	{
		a = 1 - (_ui_ticks - 150) / 10;
	}
	
	_ui_ctx.font = (10 * _ui_z) + "px Arial";
	_ui_ctx.textAlign = "center";
	_ui_ctx.textBaseline = "middle";
	_ui_ctx.globalAlpha = a;
	_ui_ctx.fillStyle = _ui_message_color_bg;
	_ui_ctx.fillRect(0, a * 50 - _ui_z * 8, window.innerWidth, _ui_z * 16);
	_ui_ctx.fillStyle = _ui_message_color_fg;
	_ui_ctx.fillText(_ui_message, window.innerWidth / 2, a * 50);
	_ui_ctx.globalAlpha = 1;
/*
	_ui_ticks++;
	
	_ui_ctx.clearRect(0, 0, _ui_canvas.width, _ui_canvas.height);
	
	_ui_ctx.font = (10 * _ui_z) + "px Arial";
	_ui_ctx.textAlign = "center";
	_ui_ctx.textBaseline = "middle";
	
	if (_ui_ticks < 150)
	{
		_ui_ctx.fillStyle = "#333";
		_ui_ctx.fillRect(0, 50 - _ui_z * 8, window.innerWidth, _ui_z * 16);
		_ui_ctx.fillStyle = "#fff";
		_ui_ctx.fillText(_ui_message, window.innerWidth / 2, 50);
	}
*/
	
	if (_touch_available)
	{
		touchUpdate();
	}
}

function uiShowMessage(s, player)
{
	_ui_ticks = 0;
	
	if (player)
	{
		_ui_message = "\"" + s + "\"";
		_ui_message_color_bg = "#fff";
		_ui_message_color_fg = "#f33";
	}
	else
	{
		_ui_message = s;
		_ui_message_color_bg = "#314";
		_ui_message_color_fg = "#fff";
	}
}

function uiReset()
{
	_ui_tip_index = (_ui_tip_index + 1) % _ui_tips.length;
	uiShowMessage(_ui_tips[_ui_tip_index], 0);
}

function uiInit()
{
	_ui_canvas = newCanvas();
	_ui_canvas.style.top = 0;
	_ui_canvas.style.left = 0;
	
	_ui_ctx = _ui_canvas.getContext("2d");
	
	appendCanvas(_ui_canvas);
}

