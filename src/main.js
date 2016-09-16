"use strict";

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

function spritesheetLoadedCallback()
{
	_spritesheet_loaded = true;
}

function init()
{
	var x, y;
	
	_spritesheet = new Image();
	_spritesheet.addEventListener("load", spritesheetLoadedCallback);
	_spritesheet.src = SPRITESHEET_URL;
	
	_body = document.getElementsByTagName("body")[0];
	
// DEBUG BEGIN
	_profiler = new Profiler();
	_profiler.init("canvas2", 200, 60, 8);
// DEBUG END
	
	_final_canvas = newCanvas();
	_final_ctx = _final_canvas.getContext("2d");
	
	_tile_canvas = newCanvas();
	_tile_canvas.width = WIDTH;
	_tile_canvas.height = HEIGHT;
	_tile_ctx = _tile_canvas.getContext("2d");
	
	_object_canvas = newCanvas();
	_object_canvas.width = WIDTH;
	_object_canvas.height = HEIGHT;
	_object_ctx = _object_canvas.getContext("2d");
	
	appendCanvas(_final_canvas);
	
	gameInit();
	
	mainUpdate();
}

window.onload = init;
