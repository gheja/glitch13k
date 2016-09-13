"use strict";

/*
// NOTE: for old browsers
var _requestAnimationFrame = window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) { window.setTimeout(callback, 1000 / FPS); };
*/

// NOTE: for recent browsers
var _requestAnimationFrame = window.requestAnimationFrame;

// NOTE: supplied "array" will be modified!
function initArray(array, value)
{
	var x, y;
	
	array.length = VIEW_HEIGHT;
	
	for (y=0; y<VIEW_HEIGHT; y++)
	{
		array[y] = [];
		
		for (x=0; x<VIEW_WIDTH; x++)
		{
			// need to do a _copy() as 
			array[y].push(_copy(value));
		}
	}
}

function _copy(a)
{
	return JSON.parse(JSON.stringify(a));
}

function stringReplaceAll(s, search, replacement)
{
	return s.split(search).join(replacement);
}

function arrayInsert(array, position, item)
{
	return array.splice(position, 0, item);
}

function clip(x, min, max)
{
	return Math.min(Math.max(x, min), max);
}

function clip256(x)
{
	return clip(Math.round(x), 0, 255);
}

function round1(x, a)
{
	if (Math.abs(x) < a)
	{
		return 0;
	}
	
	return x;
}

function round2(x)
{
	return Math.round(x * 10) / 10;
}

function sqr(a)
{
	return a * a;
}

function chance(x)
{
	return Math.random() < x;
}

function randomPosNeg(x)
{
	return (Math.random() - 0.5) * 2 * x;
}

function random2()
{
	return randomPosNeg(1);
}

function randomInt(min, max)
{
	return min + Math.round(Math.random() * (max - min));
}

function distance(x1, y1, x2, y2)
{
	return Math.sqrt(sqr(x1 - x2) + sqr(y1 - y2));
}

function distanceView(a, b)
{
	return distance(a.viewX, a.viewY, b.viewX, b.viewY);
}

function distanceReal(a, b)
{
	return distance(a.realX, a.realY, b.realX, b.realY);
}

function toTile(x)
{
	return Math.floor(x / 16);
}

function getDomElement(id)
{
	return document.getElementById(id);
}

function onSameTile(a, b)
{
	if (toTile(a.realX) == toTile(b.realX) && toTile(a.realY) == toTile(b.realY))
	{
		return true;
	}
	
	return false;
}

function fixCanvasContextSmoothing(ctx)
{
/*
	ctx.imageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
*/
	ctx.imageSmoothingEnabled = false;
}

function lerp(a, b, position)
{
	return (a + (b - a) * position);
}

function lerp256(a, b, position)
{
	return clip256(lerp(a, b, position));
}

function colors_to_string(a)
{
	return a[0] + "-" + a[1] + "-" + a[2] + "-" + a[3];
}

function eee(value, min, max, pow)
{
	var a;
	
	// ensure that the result is 0..1
	value = Math.min(Math.max(value, min), max);
	
	a = (value - min) / (max - min);
	a = Math.pow(a, pow);
	
	return a;
}

function newCanvas()
{
	return document.createElement("canvas");
}

function appendCanvas(c)
{
	c.style.position = "fixed";
	_body.appendChild(c);
}

function hexColorToRgba(a)
{
	// numbers = "0123456789abcdef";
	// r = numbers.indexOf(a[0]);
	
	function f(x)
	{
		return parseInt(x + x, 16);
	}
	
	return "rgba(" + f(a[0]) + "," + f(a[1]) + "," + f(a[2]) + "," + (f(a[3]) / 255) + ")";
}

function hexColorToArray(a)
{
	function f(x)
	{
		return parseInt(x + x, 16);
	}
	
	return [ f(a[0]), f(a[1]), f(a[2]), f(a[3]) ];
}

function arrayToRgba(a)
{
	return "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + (a[3]/255) + ")";
}

function arrayToHex(a)
{
	var numbers, output, i;
	
	numbers = "0123456789abcdef";
	
	output = "";
	for (i=0; i<4; i++)
	{
		output += numbers[Math.floor(a[i] / 16)];
	}
	
	return output;
}

function hexToPalette(s)
{
	return [
		hexColorToArray(s.substring(0, 4)),
		hexColorToArray(s.substring(4, 8)),
		hexColorToArray(s.substring(8, 12)),
		hexColorToArray(s.substring(12, 16))
	];
}

function linkDoors(a, b)
{
	a.targetDoor = b;
	b.targetDoor = a;
}

// window.onerror = _error;
// DEBUG BEGIN
function _error(s)
{
	var obj;
	
	obj = getDomElement("errors");
	obj.innerHTML = s + "<br/>" + obj.innerHTML;
	obj.style.display = "block";
}
// DEBUG END
