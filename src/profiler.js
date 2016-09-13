"use strict";

// DEBUG BEGIN

/**
 * @constructor
 */
var Profiler = function()
{
	this.colors = [ "#e00", "#0e0", "#00e", "#0dd", "#e0d", "#ed0" ];
	this.data = [];
	this.startTimes = [];
	this.count = 60;
	this.pointer = 0;
	this.columnCount = 3;
	this.lastTimestamp = 0;
	this.lastStartTimestamp = 0;
	
	this.frameTime = (1000 / FPS);
	this.scale = 1;
	this.width = 0;
	this.height = 0;
	this.canvas = null;
	this.ctx = null;
};

Profiler.prototype.init = function(canvas_id, width, height, columns)
{
	var i, j, a;
	
	this.canvas = getDomElement(canvas_id);
	this.ctx = this.canvas.getContext("2d");
	this.width = width;
	this.height = height;
	this.count = this.width;
	
	this.scale = this.height * 0.8 / this.frameTime;
	
	fixCanvasContextSmoothing(this.ctx);
	
	this.columnCount = columns;
	this.data = [];
	this.startTimes = [];
	
	for (i=0; i<this.count; i++)
	{
		a = [];
		for (j=0; j<this.columnCount; j++)
		{
			a.push(0);
		}
		this.data.push(a);
		this.startTimes.push(0);
	}
}

Profiler.prototype.start = function()
{
	this.lastTimestamp = Date.now();
	this.currentColumn = 0;
	this.pointer++;
	
	if (this.pointer >= this.count)
	{
		this.pointer = 0;
	}
}

Profiler.prototype.mark = function()
{
	var a;
	
	a = Date.now();
	
	this.data[this.pointer][this.currentColumn] = a - this.lastTimestamp;
	this.startTimes[this.pointer] = a;
	this.currentColumn++;
	this.lastTimestamp = a;
}

Profiler.prototype.draw = function()
{
	var a, b, c, r, i, j, sum, percent1, percent2, fps, px, py;
	
	a = (this.pointer - 1 + this.count) % this.count;
	b = this.pointer;
	
	if (a < 0)
	{
		return;
	}
	
	px = a;
	py = this.height;
	
	this.ctx.fillStyle = "#000";
	this.ctx.fillRect(a, 0, 1, this.height);
	
	this.ctx.fillStyle = "#333";
	this.ctx.fillRect(a, py - (this.frameTime * this.scale), 1, (this.frameTime * this.scale));
	
	for (i=0; i<this.columnCount; i++)
	{
		r = Math.round(this.data[a][i] * this.scale);
		
		this.ctx.fillStyle = this.colors[i % this.colors.length];
		this.ctx.fillRect(px, py - r, 1, r);
		
		py -= r;
	}
	
	this.ctx.fillStyle = "#fff";
	this.ctx.fillRect(b, 0, 1, this.height);
	
	if (a % 10 == 0)
	{
		sum = 0;
		for (i=0; i<this.count; i++)
		{
			for (j=0; j<this.columnCount; j++)
			{
				sum += this.data[i][j];
			}
		}
		percent1 = Math.round(sum / (this.count * (1000 / FPS)) * 100);
		
		sum = 0;
		for (i=0; i<10; i++)
		{
			for (j=0; j<this.columnCount; j++)
			{
				sum += this.data[(a - i + this.count) % this.count][j];
			}
		}
		percent2 = Math.round(sum / (10 * (1000 / FPS)) * 100);
		
		c = this.startTimes[a] - this.startTimes[(a - 10 + this.count) % this.count];
		fps = round2(1000 / (c / 10));
		
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, 110, 13);
		this.ctx.font = "9px Sans";
		
		if (percent2 > 40)
		{
			this.ctx.fillStyle = "#ff0";
		}
		else
		{
			this.ctx.fillStyle = "#ddd";
		}
		this.ctx.fillText(percent2 + "%", 2, 10);
		
		if (percent1 > 60)
		{
			this.ctx.fillStyle = "#e00";
		}
		else if (percent1 > 40)
		{
			this.ctx.fillStyle = "#ff0";
		}
		else
		{
			this.ctx.fillStyle = "#ddd";
		}
		this.ctx.fillText(percent1 + "%", 32, 10);
		
		this.ctx.fillStyle = "#ddd";
		this.ctx.fillText(fps + " fps", 62, 10);
	}
}

// DEBUG END
