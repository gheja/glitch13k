var _gfx_tile_cache = {};
// DEBUG BEGIN
var _gfx_tile_cache_length = 0;
// DEBUG END

function drawImageAdvanced(sx, sy, sw, sh, dx, dy, dw, dh, mirrored, palette_id)
{
	var canvas, ctx, cache_id, d, a, i, p, c;
	
	if (typeof palette_id == "number")
	{
		p = _palettes[palette_id];
	}
	else
	{
		p = palette_id;
	}
	
	c = colors_to_string(p);
	
	cache_id = [ sx, sy, sw, sh, mirrored, c ].join();
	
	if (!_gfx_tile_cache[cache_id] || _gfx_force_refresh)
	{
		canvas = newCanvas();
		// TODO: dynamic size?
		canvas.width = 16;
		canvas.width = 16;
		ctx = canvas.getContext("2d");
		
		ctx.translate(dw / 2, dh / 2);
		
		if (mirrored)
		{
			ctx.scale(-1, 1);
		}
		
		// TODO: source.getImageData() -> processing -> destination.setImageData()? faster?
		ctx.drawImage(_spritesheet, sx, sy, sw, sh, - dw / 2, - dh / 2, dw, dh);
		
		// color replace
		d = ctx.getImageData(0, 0, 16, 16);
		for (i=0; i<16*16*4; i+=4)
		{
			a = d.data[i] / 64; // 0, 64, 128, 192
			
			d.data[i    ] = p[a][0];
			d.data[i + 1] = p[a][1];
			d.data[i + 2] = p[a][2];
			d.data[i + 3] = p[a][3];
		}
		ctx.putImageData(d, 0, 0);
		
		_gfx_tile_cache[cache_id] = canvas;
// DEBUG BEGIN
		_gfx_tile_cache_length++;
// DEBUG END
	}
	else
	{
		canvas = _gfx_tile_cache[cache_id];
	}
	
	_ctx.save();
	_ctx.translate(dx, dy);
	_ctx.translate(dw / 2, dh / 2);
	_ctx.drawImage(canvas, 0, 0, sw, sh, - dw / 2, - dh / 2, dw, dh);
	_ctx.restore();
}

function drawTile16(x, y, n, mirror, palette_id)
{
	if (n != -1)
	{
		if (palette_id == -1)
		{
			palette_id = DEFAULT_PALETTES[n];
		}
		
		drawImageAdvanced(n * 16, 0, 16, 16, x, y, 16, 16, mirror, palette_id);
	}
}
