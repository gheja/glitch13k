"use strict";

var _object_id_sequence;

function resetObjectIdSequence()
{
	_object_id_sequence = 1;
}

function getObjectId()
{
/*
	_object_id_sequence++;
	
	return _object_id_sequence - 1;
*/
	return _object_id_sequence++;
}

/**
 * @constructor
 */
var Obj = function()
{
	this.id = 0;
	this.realX = 0;
	this.realY = 0;
	this.direction = 0;
	
	// sprites: number: one sprite for all directions
	// sprites: [ number, number, number, number ]: one sprite for each direction (up, right, down, left)
	// sprites: [ [ number, mirrored ], [ number, mirrored ], [ number, mirrored ], [ number, mirrored ] ]: one sprite for each direction and if mirrored
	this.sprites = 0;
	this.layer = 0;
	
	this.tickCount = 0;
	this.animationFrame = 0;
	this.destroyed = 0; // bool
	this.canBeGrabbed = 0; // bool
	this.canBeUsed = 0; // bool
	this.glitchTime = 0;
	this.floating = 0; // bool
	this.floatX = 0;
	this.floatY = 0;
	this.seed = 0;
	this.persistent = 0; // bool (true if player keeps it when dies)
	// this.flySpeed = 0; // bool
	// this.canBeThrown = 1;
	this.spritePalette = -1; // == use default
	this.overlaySprite = -1;
	this.overlaySpritePalette = -1;
	this.grabSound = SOUND_GRAB;
}

Obj.prototype.initObj = function(x, y, direction, sprites, layer)
{
	this.id = getObjectId();
	this.realX = x * 16;
	this.realY = y * 16;
	this.direction = direction;
	this.sprites = sprites;
	this.layer = layer;
	
	this.seed = randomPosNeg(1000);
}

Obj.prototype.glitchStart = function()
{
	this.glitchTime = 15;
}

Obj.prototype.glitch = function()
{
}

Obj.prototype.glitchEnd = function()
{
}

Obj.prototype.tick = function()
{
}

Obj.prototype.tickHandler = function()
{
	this.tickCount++;
	this.animationFrame = Math.floor(this.tickCount / 3);
	
	if (this.glitchTime > 0)
	{
		this.glitch();
		
		if (this.glitchTime == 1)
		{
			this.glitchEnd();
		}
		
		this.glitchTime--;
	}
	
	this.floatX = 0;
	this.floatY = 0;
	
	if (this.floating && _player_obj.grabbedObject != this)
	{
		this.floatX = Math.floor(Math.sin((this.tickCount + this.seed) / 30) * 3);
		this.floatY = Math.floor(Math.cos((this.tickCount + this.seed) / 50) * 3 - 4);
	}
	
	this.tick();
}

Obj.prototype.use = function()
{
}
