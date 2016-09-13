"use strict";

/**
 * @constructor
 */
var Projection = function(obj, state)
{
	var a, b, c, dx, dy;
	
	this.obj = obj;
	this.state = state;
	
	a = (obj.direction + state.direction + 4) % 4;
	b = mapApplyDirection(obj.realX % 16, obj.realY % 16, (4 - state.direction) % 4);
	
	this.viewX = Math.floor(this.state.viewX + b[0]);
	this.viewY = Math.floor(this.state.viewY + b[1]);
	
	if (_player_obj.grabbedObject == this.obj)
	{
		this.viewY -= 4;
	}
	
	if (typeof obj.sprites == "number")
	{
		this.tile = obj.sprites;
	}
	else if (typeof obj.sprites[a] == "number")
	{
		this.tile = obj.sprites[a];
		this.mirrored = false;
	}
	else
	{
		this.tile = obj.sprites[a][0];
		this.mirrored = obj.sprites[a][1];
	}
}
