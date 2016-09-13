"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjPotion = function(x, y, type)
{
	this.initObj(x, y, 0, 12, 2);
	
	this.canBeGrabbed = true;
	this.canBeUsed = true;
	this.type = type;
	this.floating = true;
	this.glitchChance = 0.005;
}

ObjPotion.prototype = new Obj();

ObjPotion.prototype.use = function()
{
	if (this.type == POTION_TYPE_HEALTH)
	{
		_synth.playSound(SOUND_POWERUP);
		_glitch_time_left += 1000;
		layerAddDroplet(0, VIEW_CENTER_X, VIEW_CENTER_Y, 500);
	}
	else if (this.type == POTION_TYPE_SUPER)
	{
		_synth.playSound(SOUND_SUPER);
		_glitch_time_left += 1000;
		_player_obj.superTime += 150;
	}
	else
	{
		gameExplodeAndRestart();
	}
	
	this.destroyed = true;
}

ObjPotion.prototype.glitch = function()
{
	this.type = randomInt(0, 1);
}

ObjPotion.prototype.tick = function()
{
	if (chance(0.005) && this.type < POTION_TYPE_SUPER)
	{
		this.glitchStart();
	}
	
	this.spritePalette = FIRST_CUSTOM_PALETTE + 1;
	
	if (this.type == POTION_TYPE_HEALTH)
	{
		this.spritePalette = FIRST_CUSTOM_PALETTE + 0;
	}
	else if (this.type == POTION_TYPE_SUPER)
	{
		this.spritePalette = FIRST_CUSTOM_PALETTE + 2;
	}
}
