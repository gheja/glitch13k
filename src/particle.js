"use strict";

/**
 * @constructor
 */
var Particle = function(obj, realX, realY, realZ speed, color1, color2, duration)
{
	this.obj = obj;
	this.realX = realX;
	this.realY = realY;
	this.realZ = realZ;
	this.speed = speed;
	this.color1 = color1;
	this.color2 = color2;
	this.duration = duration;
	this.tickCount = 0;
}

Particle.prototype.tick = function()
{
	this.tickCount++;
}
