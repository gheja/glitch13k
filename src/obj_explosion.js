"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjExplosion = function(x, y, sound)
{
	this.initObj(x, y, 0, 0, 3);
	
	this.spriteAnimation = [ T_EXPLOSION_1, T_EXPLOSION_2, T_EXPLOSION_3 ];
	
	if (sound)
	{
		_synth.playSound(sound);
	}
}

ObjExplosion.prototype = new Obj();

ObjExplosion.prototype.tick = function()
{
	if (this.animationFrame == 3)
	{
		this.destroyed = true;
		return;
	}
	
	this.sprites = this.spriteAnimation[this.animationFrame];
}
