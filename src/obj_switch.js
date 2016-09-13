"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjSwitch = function(x, y, status)
{
	this.initObj(x, y, 0, 0, 1);
	
	this.canBeUsed = true;
	this.switchStatus = status;
	this.overlaySpritePalette = _animated_palettes[4];
}

ObjSwitch.prototype = new Obj();

ObjSwitch.prototype.tick = function()
{
	this.sprites = T_SW_OFF;
	this.spritePalette = -1;
	this.overlaySprite = -1;
	
	if (this.switchStatus)
	{
		this.overlaySprite = T_SW_ON;
		this.spritePalette = FIRST_CUSTOM_PALETTE + 6;
	}
}

ObjSwitch.prototype.use = function()
{
	_synth.playSound(SOUND_SWITCH);
	this.switchStatus = !this.switchStatus;
}
