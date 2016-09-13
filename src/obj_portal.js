"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjPortal = function(x, y, diffViewX, diffViewY, diffViewKillX, diffViewKillY, tricky)
{
	this.initObj(x, y, 0, 25, 1);
	
	this.diffViewX = diffViewX;
	this.diffViewY = diffViewY;
	this.diffViewKillX = diffViewKillX;
	this.diffViewKillY = diffViewKillY;
	this.tricky = tricky;
	this.kill = true;
	this.canBeUsed = true;
	this.spritePalette = FIRST_CUSTOM_PALETTE + 3;
}

ObjPortal.prototype = new Obj();

ObjPortal.prototype.tick = function()
{
	this.overlaySprite = 0;
	
	if (this.tricky)
	{
		this.overlaySprite = 25;
		this.overlaySpritePalette = _animated_palettes[5];
	}
	else if (!this.kill)
	{
		this.overlaySprite = 25;
		this.overlaySpritePalette = _animated_palettes[4];
	}
}

ObjPortal.prototype.use = function()
{
	var i, a, b;
	
	if (this.kill)
	{
		a = mapApplyDirection(this.diffViewKillX, this.diffViewKillY, (4 - _center_state.direction + 4) % 4);
	}
	else
	{
		a = mapApplyDirection(this.diffViewX, this.diffViewY, (4 - _center_state.direction + 4) % 4);
	}
	
	b = _view_map[VIEW_CENTER_Y + a[1]][VIEW_CENTER_X + a[0]];
	
	for (i=0; i<_objs.length; i++)
	{
		if (_objs[i] != this && distanceReal(this, _objs[i]) < 7)
		{
			_objs[i].realX += b.realX - _center_state.realX;
			_objs[i].realY += b.realY - _center_state.realY;
		}
	}
	
	// == same as b.viewX - _a.viewX
	_a.viewX += a[0] * 16;
	_a.viewY += a[1] * 16;
	
	_objs.push(new ObjExplosion(b.realX / 16, b.realY / 16, 0));
	_objs.push(new ObjExplosion(this.realX / 16, this.realY / 16, SOUND_TELEPORT));
}
