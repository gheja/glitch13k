/**
  * Miscellaneous helpers
  *
  * @module misc
  */

/**
  * Clamps a given value between lower and upper limits.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  * @param {number} lower_limit the lower limit
  * @param {number} upper_limit the upper limit
  */
clamp = function(value, lower_limit, upper_limit)
{
	return Math.min(Math.max(value, lower_limit), upper_limit);
}

/**
  * Rounds then clamps a given value to fit in a signed 6 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int6 = function(value)
{
	return clamp(value | 0, -32, 31);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 6 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint6 = function(value)
{
	return clamp(value | 0, 0, 63);
}

/**
  * Rounds then clamps a given value to fit in a signed 8 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int8 = function(value)
{
	return clamp(value | 0, -128, 127);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 8 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint8 = function(value)
{
	return clamp(value | 0, 0, 255);
}

/**
  * Rounds then clamps a given value to fit in a signed 12 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int12 = function(value)
{
	return clamp(value | 0, -2048, 2047);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 12 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint12 = function(value)
{
	return clamp(value | 0, 0, 4095);
}

/**
  * Rounds then clamps a given value to fit in a signed 16 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int16 = function(value)
{
	return clamp(value | 0, -32768, 32767);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 16 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint16 = function(value)
{
	return clamp(value | 0, 0, 65535);
}

/**
  * Rounds then clamps a given value to fit in a signed 24 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int24 = function(value)
{
	return clamp(value | 0, -8388608, 8388607);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 24 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint24 = function(value)
{
	return clamp(value | 0, 0, 16777215);
}

/**
  * Rounds then clamps a given value to fit in a signed 32 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_int32 = function(value)
{
	/*
	  Note: the bitwise OR operator ("|") is working on 32 bit integers
	  therefore rounding values outside the 32 bits is not working, falling back
	  to Math.round().
	*/
	
	return clamp(Math.round(value), -2147483648, 2147483647);
}

/**
  * Rounds then clamps a given value to fit in an unsigned 32 bit integer.
  *
  * @nosideeffects
  * @param {number} value the value to be clamped
  */
clamp_and_round_uint32 = function(value)
{
	/*
	  Note: the bitwise OR operator ("|") is working on 32 bit integers
	  therefore rounding values outside the 32 bits is not working, falling back
	  to Math.round().
	*/
	return clamp(Math.round(value), 0, 4294967295);
}

/**
  * Copies an object recursively - this is NOT a proper cloning technique! And
  * also this is slow.
  *
  * @nosideeffects
  * @param {Object} obj the object to be copied
  * @returns {Object}
  */
deep_copy_object = function(obj)
{
	return JSON.parse(JSON.stringify(obj));
}

/**
  * Returns a string formatted according to the given number, i.e. "1 sample" or
  * "2 samples".
  *
  * Yes, it really annoyed me this much... :)
  *
  * @nosideeffects
  * @param {number} number number of the things to be considered
  * @param {string) string_one string to be appended if number == 1
  * @param {string} string_other string to be appended if number != 1
  * @returns {string}
  */
plural_or_not = function(number, string_one, string_other)
{
	return number + " " + (number == 1 ? string_one : string_other);
}

get_all_variations = function(recipe)
{
	var i, depth, item, lists, current_list, indexes, variations, finished;
	
	lists = [];
	current_list = [];
	indexes = [];
	variations = [];
	depth = 0;
	item = '';
	
	for (i=0; i<recipe.length; i++)
	{
		if (recipe[i] == '(')
		{
			current_list = [];
			item = '';
		}
		else if (recipe[i] == ')')
		{
			current_list.push(item);
			lists.push(current_list);
			indexes.push(0);
		}
		else if (recipe[i] == ',')
		{
			current_list.push(item);
			item = '';
		}
		else
		{
			item += recipe[i];
		}
	}
	
	finished = 0;
	while (!finished)
	{
		item = '';
		for (i=0; i<lists.length; i++)
		{
			item += lists[i][indexes[i]];
		}
		variations.push(item);
		
		indexes[lists.length-1]++;
		
		for (i=lists.length-1; i>=0; i--)
		{
			if (indexes[i] == lists[i].length)
			{
				if (i == 0)
				{
					finished = 1;
					break;
				}
				indexes[i-1]++;
				indexes[i] = 0;
			}
		}
	}
	
	return variations;
}

array_shuffle = function(array, seed)
{
	var prng;
	
	prng = new AlmostRandom(seed);
	
	array.sort(function(a, b) { return prng.random() - 0.5; } );
}

distance_2d = function(p1, p2)
{
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

canvas_2d_extend = function(ctx)
{
	ctx.drawText = function(x, y, string, color, large, bold, center, shadow)
	{
		if (shadow)
		{
			this.drawText(x, y + 2, string, "rgba(0, 0, 0, 0.25)", large, bold, center, 0);
		}
		this.fillStyle = color;
		this.font = (bold ? "bold " : "") + (large ? "20" : "16") + "px Verdana";
		this.textAlign = center ? "center" : "left";
		this.fillText(string, x, y);
	}
	
	ctx.drawBox = function(x, y, width, height, color)
	{
		this.fillStyle = color;
		this.fillRect(x, y, width, height);
	}
	
	ctx.drawBackgroundBox = function(x, y, width, height)
	{
		this.drawBox(x, y, width, height, "rgba(0,0,0,0.25)");
	}
	
}
