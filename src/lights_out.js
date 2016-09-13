"use strict";

/** @constructor */
var LightsOut = function(posX, posY, width, height, difficulty)
{
	this.fields = [];
	
	this.toggleField = function(x, y)
	{
		if (x >= 0 && x < width && y >= 0 && y < height)
		{
			this.fields[y][x].switchStatus = !this.fields[y][x].switchStatus;
		}
	}
	
	this.toggle = function(a, b, muted)
	{
		var x, y;
		
		if (!muted)
		{
			_synth.playSound(SOUND_SWITCH);
		}
		
		this.toggleField(a, b);
		this.toggleField(a+1, b);
		this.toggleField(a-1, b);
		this.toggleField(a, b+1);
		this.toggleField(a, b-1);
		
		this.solved = true;
		for (y=0; y<height; y++)
		{
			for (x=0; x<width; x++)
			{
				if (this.fields[y][x].switchStatus == false)
				{
					this.solved = false;
					return; // remove?
				}
			}
		}
	}
	
	var x, y, a;
	
	for (y=0; y<height; y++)
	{
		this.fields.push([]);
		
		for (x=0; x<width; x++)
		{
			a = new ObjSwitch(posX + x, posY + y, 1);
			a.use = this.toggle.bind(this, x, y);
			this.fields[y].push(a);
			_objs.push(a);
		}
	}
	
	for (x=0; x<difficulty; x++)
	{
		this.toggle(randomInt(0, height - 1), randomInt(0, width - 1), true);
	}
}
