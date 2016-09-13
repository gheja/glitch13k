	x = 0;
	y = 0;
	for (a=0; a<16; a++)
	{
		for (b=0; b<16; b++)
		{
			for (c=0; c<16; c++)
			{
				_ctx.fillStyle = "rgb(" + (a * 16 + a) + "," + (b * 16 + b) + "," + (c * 16 + c) + ")";
				_ctx.fillRect(x * 4, y * 4, 4, 4);
				x++;
				
				if (x * 4 >= 256)
				{
					x = 0;
					y++;
				}
			}
		}
	}
