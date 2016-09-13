"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjPlayer = function(x, y)
{
	this.initObj(x, y, 1, 0, 3);
	this.superTime = 0;
	
	this.spriteAnimation = [
		[ [ 9, 0 ], [ 10, 1 ], [ 7, 0 ], [ 10, 0 ] ],
		[ [ 9, 1 ], [ 11, 1 ], [ 7, 1 ], [ 11, 0 ] ],
		[ [ 9, 0 ], [ 10, 1 ], [ 7, 0 ], [ 10, 0 ] ],
		[ [ 9, 1 ], [ 11, 1 ], [ 7, 1 ], [ 11, 0 ] ]
	];
/*
		[ [ 8, 0 ], [ 10, 1 ], [ 6, 0 ], [ 10, 0 ] ],
		[ [ 9, 0 ], [ 11, 1 ], [ 7, 0 ], [ 11, 0 ] ],
		[ [ 8, 1 ], [ 10, 1 ], [ 6, 1 ], [ 10, 0 ] ],
		[ [ 9, 1 ], [ 11, 1 ], [ 7, 1 ], [ 11, 0 ] ]
*/
	
	/** @type {Object|null} */ this.grabbedObject = null;
}

ObjPlayer.prototype = new Obj();

ObjPlayer.prototype.getNearObject = function(grabbable)
{
	var i;
	
	for (i=1; i<_objs.length; i++)
	{
		// TODO: is "this.grabbedObject != _objs[i]" needed?
		if (distanceReal(this, _objs[i]) < 10 && this.grabbedObject != _objs[i] && _objs[i].canBeGrabbed == grabbable)
		{
			return _objs[i];
		}
	}
	
	return null;
}

ObjPlayer.prototype.tryGrabOrRelease = function()
{
	var newObject;
	
	if (this.grabbedObject == null)
	{
		newObject = this.getNearObject(true);
		// TODO: if item is not grabbable maybe convert this action to "use"?
	}
	else
	{
		this.grabbedObject.realY = this.realY;
		newObject = null;
	}
	
	if (newObject != this.grabbedObject)
	{
		this.grabbedObject = newObject;
		if (newObject)
		{
			_synth.playSound(newObject.grabSound);
		}
		else
		{
			_synth.playSound(SOUND_RELEASE);
		}
	}
}

ObjPlayer.prototype.updateGrabbedObjectRotation = function(a, b)
{
	if (this.grabbedObject != null)
	{
		this.grabbedObject.direction = (this.grabbedObject.direction + (a.direction - b.direction) + 4) % 4;
	}
}

ObjPlayer.prototype.tryUse = function()
{
	var obj;
	
	if (this.grabbedObject != null)
	{
		this.grabbedObject.use();
		
		if (this.grabbedObject.destroyed)
		{
			this.grabbedObject = null;
		}
	}
	else
	{
		obj = this.getNearObject(false);
		if (obj)
		{
			obj.use();
		}
	}
}

ObjPlayer.prototype.tick = function()
{
	var a;
	
	if (this.grabbedObject != null)
	{
		this.grabbedObject.realX = this.realX;
		this.grabbedObject.realY = this.realY;
	}
	
	if (this.tickCount % 4 == 0 && this.superTime > 0)
	{
		layerAddDroplet(1, Math.floor(VIEW_CENTER_X + randomPosNeg(2)), Math.floor(VIEW_CENTER_Y + randomPosNeg(2)), 20);
		layerAddDroplet(2, Math.floor(VIEW_CENTER_X + randomPosNeg(2)), Math.floor(VIEW_CENTER_Y + randomPosNeg(2)), 20);
	}
	
	a = this.animationFrame % 4;
	
	if (_a.speedX == 0 && _a.speedY == 0)
	{
		a = 0;
	}
	
	this.sprites = this.spriteAnimation[a];
	
	if (this.superTime > 0)
	{
		this.superTime--;
	}
	
}
