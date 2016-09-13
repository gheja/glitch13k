"use strict";

var _width = 512;
var _height = 40;
var _sprite_count = 0;

var _canvas;
var _ctx;
var _body;

var _spritesheet_original;
var _spritesheet_colors;
var spritesheet;
var palettes = [];
var sprite_to_palette = [];

function createColors()
{
	var x, y, a, ctx1, ctx2, d1, d2;
	
	function reduce(x)
	{
		x = Math.floor(x / 16);
		
		return x * 16 + x;
	}
	
	ctx1 = _spritesheet_original.getContext("2d");
	ctx2 = _spritesheet_colors.getContext("2d");
	
	d1 = ctx1.getImageData(0, 0, _width, _height);
	d2 = ctx2.getImageData(0, 0, _width, _height);
	
	for (x=0; x<_width; x++)
	{
		for (y=0; y<_height; y++)
		{
			a = (y * _width + x) * 4;
			d2.data[a  ] = reduce(d1.data[a  ]);
			d2.data[a+1] = reduce(d1.data[a+1]);
			d2.data[a+2] = reduce(d1.data[a+2]);
			d2.data[a+3] = reduce(d1.data[a+3]);
		}
	}
	
	ctx2.putImageData(d2, 0, 0);
}

function createFinal()
{
	var x, y, a, ctx1, ctx2, d1, d2, ax, ay, colors, c, i, j, k, l, id, found, found2, last_sprite;
	
	function color_compare(a, b)
	{
		var a2, b2;
		
		a2 = a[0] * 256 * 256 * 256 + a[1] * 256 * 256 + a[2] * 256 + a[3];
		b2 = b[0] * 256 * 256 * 256 + b[1] * 256 * 256 + b[2] * 256 + b[3];
		
		if (a2 > b2)
		{
			return 1;
		}
		
		if (a2 < b2)
		{
			return -1;
		}
		
		return 0;
		
		// == return a - b;
	}
	
	function color_match(a, b)
	{
		if (a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3])
		{
			return true;
		}
		
		return false;
	}
	
	function color_match_data(color, d, a)
	{
		return color_match(color, [ d.data[a + 0], d.data[a + 1], d.data[a + 2], d.data[a + 3] ]);
	}
	
	colors = [];
	palettes.length = 0;
	sprite_to_palette.length = 0;
	
	ctx1 = _spritesheet_colors.getContext("2d");
	ctx2 = spritesheet.getContext("2d");
	
	d1 = ctx1.getImageData(0, 0, _width, _height);
	d2 = ctx2.getImageData(0, 0, _width, _height);
	
	// TODO: megtalalni az olyan palettat, ami kevesebb szinbol all, mint egy masik
	// es azt eldobni, majd a masikat hasznalni, azaz...
	// [ piros, kek, n/a, n/a ], [ piros, kek, zold, sarga ]
	// itt az elsot el lehet dobni, mert a masodik lefedi az elsot
	
	last_sprite = 0;
	
	for (i=0; i<Math.floor(_width / 16); i++)
	{
		ay = 0;
		ax = i * 16;
		
		// collect all the colors
		colors.length = 0;
		
		for (x=0; x<16; x++)
		{
			for (y=0; y<16; y++)
			{
				a = ((y + ay) * _width + (x + ax)) * 4;
				
				found = false;
				
				// check if we already have it
				for (j=0; j<colors.length; j++)
				{
					// if (colors[j][0] == d1.data[a] && colors[j][1] == d1.data[a+1] && colors[j][2] == d1.data[a+2] && colors[j][3] == d1.data[a+3])
					if (color_match_data(colors[j], d1, a))
					{
						id = j;
						found = true;
						break;
					}
				}
				
				// if we do not have it yet
				if (!found)
				{
					colors.push([ d1.data[a], d1.data[a+1], d1.data[a+2], d1.data[a+3] ]);
				}
			}
		}
		
		last_sprite = i;
		
		if (colors.length == 1)
		{
			break;
		}
		
		// keep first 4 colors
		colors = colors.slice(0, 4);
		
		// store to palettes
		palettes.push({ colors: _copy(colors), dropped: false });
		
		// sprite_to_palette.push({ sprite: i, palette_id: palettes.length - 1 });
		sprite_to_palette[i] = palettes.length - 1;
	}
	
	drawPalettes(0, 140);
	
	for (i=0; i<palettes.length; i++)
	{
		if (palettes[i].dropped)
		{
			continue;
		}
		
		for (j=0; j<palettes.length; j++)
		{
			if (palettes[j].dropped)
			{
				continue;
			}
			
			if (i == j)
			{
				continue;
			}
			
			found = true;
			for (k=0; k<palettes[i].colors.length; k++)
			{
				found2 = false;
				
				for (l=0; l<palettes[j].colors.length; l++)
				{
					if (color_match(palettes[i].colors[k], palettes[j].colors[l]))
					{
						found2 = true;
						break;
					}
				}
				
				if (!found2)
				{
					found = false;
					break;
				}
			}
			
			if (found)
			{
				for (k=0; k<sprite_to_palette.length; k++)
				{
					if (sprite_to_palette[k] == i)
					{
						sprite_to_palette[k] = j;
					}
				}
				
				// replace palette "i" with "j"
				palettes[i].dropped = true;
			}
		}
	}
	drawPalettes(100, 140);
	
	for (i=palettes.length - 1; i>=0; i--)
	{
		if (palettes[i].dropped)
		{
			for (j=0; j<sprite_to_palette.length; j++)
			{
				if (sprite_to_palette[j] >= i)
				{
					sprite_to_palette[j]--;
				}
			}
			
			palettes.splice(i, 1);
		}
	}
	
	drawPalettes(200, 140);
	
	for (i=0; i<palettes.length; i++)
	{
		while (palettes[i].colors.length < 4)
		{
			palettes[i].colors.push([ 0, 0, 0, 0 ]);
		}
		
		// reorder colors
		palettes[i].colors.sort(color_compare);
	}
	
	drawPalettes(300, 140);
	
	for (i=0; i<last_sprite+1; i++)
	{
/*
		// remove duplicate palettes
		for (j=0; j<palettes.length; j++)
		{
			found = true;
			
			for (k=0; k<4; k++)
			{
				if (
					palettes[j][k][0] != colors[k][0] ||
					palettes[j][k][1] != colors[k][1] ||
					palettes[j][k][2] != colors[k][2] ||
					palettes[j][k][3] != colors[k][3]
				)
				{
					found = false;
					id = j;
					break;
				}
			}
			
			if (found)
			{
				break;
			}
		}
*/
		colors = palettes[sprite_to_palette[i]].colors;
		console.log(sprite_to_palette[i]);
		
		ay = 0;
		ax = i * 16;
		
		// redraw sprites in 4-color grayscale
		for (x=0; x<16; x++)
		{
			for (y=0; y<16; y++)
			{
				a = ((y + ay) * _width + (x + ax)) * 4;
				
				// the "invalid" color
				c = [ 255, 0, 0 ];
				
				found = false;
				
				// find the color
				for (j=0; j<colors.length; j++)
				{
					// if (colors[j][0] == d1.data[a] && colors[j][1] == d1.data[a+1] && colors[j][2] == d1.data[a+2] && colors[j][3] == d1.data[a+3])
					if (color_match_data(colors[j], d1, a))
					{
						id = j;
						found = true;
						break;
					}
				}
				
				if (found)
				{
					c = [ id * 64, id * 64, id * 64 ];
				}
				
				d2.data[a  ] = c[0];
				d2.data[a+1] = c[1];
				d2.data[a+2] = c[2];
				d2.data[a+3] = 255;
			}
		}
	}
	
	ctx2.putImageData(d2, 0, 0);
	console.log(palettes);
}

function drawPalettes(x, y)
{
	var i, j, a, b;
	
	for (i=0; i<palettes.length; i++)
	{
		_ctx.fillStyle = "#fff";
		_ctx.font = "14px Arial";
		_ctx.fillText(i, x, y + (i + 1)*16 - 2);
		
		for (a=0; a<16 * 4; a+=2)
		{
			for (b=0; b<16; b+=2)
			{
				if (Math.floor((a + b) / 2) % 2)
				{
					_ctx.fillStyle = "#333";
				}
				else
				{
					_ctx.fillStyle = "#000";
				}
				_ctx.fillRect(x + 16 + a, y + i*16 + b, 2, 2);
			}
		}
		
		for (j=0; j<palettes[i].colors.length; j++)
		{
			
			_ctx.fillStyle = arrayToRgba(palettes[i].colors[j]);
			_ctx.fillRect(x + j*16 + 16, y + i*16, 16, 16);
		}
		
		if (palettes[i].dropped)
		{
			_ctx.fillStyle = "#e00";
			_ctx.fillRect(x, y + i*16 + 7, 80, 2);
		}
	}
}

function getPalettesText()
{
	var i, j, result;
	
	result = "PALETTES = \"\n";
	
	for (i=0; i<palettes.length; i++)
	{
		for (j=0; j<palettes[i].colors.length; j++)
		{
			result += arrayToHex(palettes[i].colors[j])
		}
		result += "\n";
	}
	
	result += "\";\n";
	
	return result;
}

function getObjPaletteText()
{
	return "DEFAULT_PALETTES = [ " + sprite_to_palette.join(", ") + " ];\n";
}

function init()
{
	var tmp, ctx;
	
	_body = document.getElementsByTagName("body")[0];
	_canvas = getDomElement("canvas1");
	_ctx = _canvas.getContext("2d");
	fixCanvasContextSmoothing(_ctx);
	
	tmp = new Image();
	tmp.src = SPRITESHEET_URL;
	
	_spritesheet_original = newCanvas();
	_spritesheet_original.width = _width;
	_spritesheet_original.height = _height;
	ctx = _spritesheet_original.getContext("2d");
	ctx.drawImage(tmp, 0, 0);
	
	_spritesheet_colors = newCanvas();
	_spritesheet_colors.width = _width;
	_spritesheet_colors.height = _height;
	
	spritesheet = newCanvas();
	spritesheet.width = _width;
	spritesheet.height = _height;
	
	createColors();
	createFinal();
	getDomElement("palettes_text").value = getPalettesText();
	getDomElement("obj_palette_text").value = getObjPaletteText();
	
	_ctx.drawImage(_spritesheet_original, 0, 0);
	_ctx.drawImage(_spritesheet_colors, 0, _height * 1);
	_ctx.drawImage(spritesheet, 0, _height * 2);
}

window.onload = init;
