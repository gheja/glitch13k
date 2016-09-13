"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjCrystal = function(x, y, sound)
{
	this.initObj(x, y, 0, T_CRYSTAL, 2);
	
	this.canBeGrabbed = true;
	this.floating = true;
	this.persistent = true;
	this.grabSound = SOUND_FIRST_CRYSTAL_SAMPLE + sound - 1;
}

ObjCrystal.prototype = new Obj();
