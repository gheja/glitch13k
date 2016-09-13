/**
  * Part of https://github.com/gheja/jsstuffs/
  */
/** @constructor */
SynthSampleGenerator = function(file, return_final)
{
	// DEBGUG BEGIN
	this.after_block_callback = null;
	
	this.setAfterBlockCallback = function(callback)
	{
		this.after_block_callback = callback;
	}
	
	// DEBUG END
	this.render = function(file, return_final)
	{
		var i, j, a, b,
			file, // 8-bit unsigned integer
			component = [], // float
			final_component = [], // 16-bit signed integer
			points,
			random = new AlmostRandom();
		
		// DEBUG BEGIN
		if (file == null)
		{
			return;
		}
		
		var block_number = 0;
		// DEBUG END
		
		while (!file.eof())
		{
			switch (file.readOne())
			{
				// stored raw sample, signed 8-bit
				case 1:
					// 0-1: input length
					
					a = file.readTwo();
					
					for (i=0; i<a; i++)
					{
						component[i] = file.readOne() * 256 - 32768;
					}
				break;
				
				// stored raw sample, signed 16-bit
				case 2:
					// 0-1: input length
					
					a = file.readTwo();
					
					for (i=0; i<args.length/2; i++)
					{
						component[i] = (file.readTwo()) - 32768;
					}
				break;
				
				// four points
				case 3:
					// 0-1: component length
					// 2: first point value
					// 3: second point x-offset (from the first)
					// 4: second point value
					// 5: third point x-offset (from the second)
					// 6: third point value
					// 7: fourth point x-offset (from the third)
					// 8: fourth point value
					// 9: trailing offset
					
					a = file.readTwo() / 64;
					
					points = [
						[ 0, file.readOne() ],
						[ file.readOne() * a, file.readOne() ],
						[ file.readOne() * a, file.readOne() ],
						[ file.readOne() * a, file.readOne() ],
						[ file.readOne() * a, 0 ]
					];
					
					k = 0;
					points[4][1] = points[0][1];
					for (i=1; i<5; i++)
					{
						for (j=0; j<points[i][0]; j++)
						{
							component[k++] = (points[i-1][1] + (points[i][1] - points[i-1][1]) * (j/points[i][0])) * 256 - 32768;
						}
					}
				break;
				
				// sine
				case 4:
					// 0-1: component length
					
					a = file.readTwo();
					
					for (i=1; i<a; i++)
					{
						component[i] = Math.sin((i/a) * 2 * Math.PI) * 32767;
					}
				break;
				
				// noise
				case 5:
					// 0-1: component length
					// 2: volume
					
					a = file.readTwo();
					
					random.setSeed(file.readTwo());
					
					for (i=0; i<a; i++)
					{
						component[i] = (random.random()-0.5) * 65536;
					}
				break;
				
				// volume
				case 51:
					// 0: volume (0: 0, 64: 1.0, 128: 2.0, 256: 4.0)
					
					a = file.readOne() / 64;
					
					for (i=0; i<component.length; i++)
					{
						component[i] = clamp_and_round_int16(component[i] * a);
					}
				break;
				
				// volume2
				case 52:
					// 0: volume point #0
					// 1: volume point #1
					// 2: volume point #2
					// 3: volume point #3
					// 4: volume point #4
					// 5: volume point #5
					// 6: volume point #6
					// 7: volume point #7
					
					points = [ file.readOne(), file.readOne(), file.readOne(), file.readOne(), file.readOne(), file.readOne(), file.readOne(), file.readOne() ];
					
					a = component.length/7;
					
					for (i=0; i<component.length; i++)
					{
						b = (i/a) | 0;
						component[i] = clamp_and_round_int16(component[i] * (points[b] + (points[b+1] - points[b]) * ((i%a) / a)) / 64);
					}
				break;
				
				// repeat
				case 53:
					// 0: repeat count
					
					a = file.readOne();
					
					b = component.length;
					
					for (i=0; i<a; i++)
					{
						for (j=0; j<b; j++)
						{
							component[i*b+j] = component[j];
						}
					}
				break;
				
				// overwrite/add/subtract/multiply/divide the final with component
				case 101:
					// 0: operation (see code)
					
					a = file.readOne();
					
					for (i=0; i<component.length; i++)
					{
						b = final_component[i] ? final_component[i] : 0;
						if (a == 0)
						{
							b = component[i];
						}
						else if (a == 1)
						{
							b += component[i];
						}
						else if (a == 2)
						{
							b -= component[i];
						}
						else if (a == 3)
						{
							b *= (component[i] / 32768);
						}
						
						final_component[i] = clamp_and_round_int16(b);
					}
					component = [];
				break;
			}
			
			// DEBUG BEGIN
			if (this.after_block_callback)
			{
				this.after_block_callback(block_number, component);
				block_number++;
			}
			// DEBUG END
		}
		
		// DEBUG BEGIN
		if (this.after_block_callback)
		{
			this.after_block_callback(block_number, final_component);
		}
		// DEBUG END
		
		// return new Int16Array(final_component);
		return new Int16Array(return_final ? final_component : component);
	}
	
	return this.render(file, return_final);
}
