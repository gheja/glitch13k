"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjSwitch2 = function(x, y)
{
	this.initObj(x, y, 0, 0, 1);
	
	this.switchStatus = false;
	this.overlaySpritePalette = _animated_palettes[4];
}

ObjSwitch2.prototype = new Obj();

ObjSwitch2.prototype.tick = function()
{
	var i, newStatus;
	
	newStatus = false;
	
	for (i=0; i<_objs.length; i++)
	{
		if (_objs[i] != this && !_objs[i].floating && distanceReal(_objs[i], this) < 10)
		{
			newStatus = true;
			break;
		}
	}
	
	if (newStatus != this.switchStatus)
	{
		_synth.playSound(SOUND_SWITCH);
		this.switchStatus = newStatus;
	}
	
	this.sprites = T_SW2_OFF;
	this.overlaySprite = -1;
	
	if (this.switchStatus)
	{
		this.sprites = T_SW2_ON;
		this.overlaySprite = T_SW2_ON_LAYER;
	}
}
