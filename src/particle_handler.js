"use strict";

/**
 * @constructor
 */
var ParticleHandler = function()
{
	this.particles = [];
}

ParticleHandler.prototype.add = function(obj, pixelX, pixelY, speedX, speedY, color1, color2, duration)
{
	this.particles.push(new Particle(obj, pixelX, pixelY, speedX, speedY, color1, color2, duration));
}

ParticleHandler.prototype.tick = function()
{
	var i;
	
	// reverse walk as there is removal and this way the indexes will not be shifted
	for (i = this.particles.length -1; i >= 0; i--)
	{
		this.particles[i].tick();
		
		// clear if this particle is expired
		if (this.particles[i].tickCount > this.particles[i].duration)
		{
			this.particles.splice(i, 1);
		}
	}
}
