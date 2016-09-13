"use strict";

var _layers = [ [], [], [] ];

function layersMove(dx, dy)
{
	var temp, x, y, ax, ay, i;
	
	for (i=0; i<3; i++)
	{
		temp = _copy(_layers[i]);
		
		for (x=0; x<VIEW_WIDTH; x++)
		{
			for (y=0; y<VIEW_HEIGHT; y++)
			{
				ax = clip(x + dx / 16, 0, VIEW_WIDTH - 1);
				ay = clip(y + dy / 16, 0, VIEW_HEIGHT - 1);
				
				_layers[i][y][x] = temp[ay][ax];
			}
		}
	}
}

function layerAddDroplet(i, x, y, value)
{
	_layers[i][y][x] += value;
}

function layersUpdate()
{
	var temp, x, y, i;
	
	for (i=0; i<3; i++)
	{
		temp = _copy(_layers[i]);
		
		for (x=1; x<VIEW_WIDTH - 1; x++)
		{
			for (y=1; y<VIEW_HEIGHT - 1; y++)
			{
				_layers[i][y][x] = (
					temp[y-1][x-1] +
					temp[y-1][x  ] +
					temp[y-1][x+1] +
					temp[y  ][x+1] +
					temp[y+1][x+1] +
					temp[y+1][x  ] +
					temp[y+1][x-1] +
					temp[y  ][x-1] +
					temp[y  ][x]
				) / 11; // instead of 9 so there is loss guaranteed
			}
		}
	}
}

function layersInit()
{
	initArray(_layers[0], 0);
	initArray(_layers[1], 0);
	initArray(_layers[2], 0);
}
