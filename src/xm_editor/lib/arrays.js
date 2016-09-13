/**
  * arrays
  *
  * @module arrays
  */

/**
  * This is a seekable array handler with the function of adding and returning
  * items, also with the support of two items and the second multiplied by a
  * given multiplier.
  *
  * It is useful to read through a file byte-by-byte and occasionally by word.
  *
  * @constructor
  * @class ArbitaryArray
  * @param {Array} initial_items (optional) initial items in array
  * @param {number} multiplier (optional) multiplier for readTwo()
  */
ArbitaryArray = function(initial_items, multiplier)
{
	/** @private {Array} */ this.array = initial_items ? initial_items : [];
	/** @private {number} */ this.multiplier = multiplier ? multiplier : 256;
	/** @private {number} */ this.pointer = 0;
	
	/**
	  * Add an item into the array.
	  *
	  * @method add
	  * @param {number} value the item to be added
	  */
	this.add = function(value)
	{
		this.array.push(value);
	}
	
	/**
	  * Add two items to the array.
	  *
	  * @method addTwo
	  * @param {number} value the item to be added
	  */
	this.addTwo = function(value)
	{
		this.array.push(value % this.multiplier);
		this.array.push((value / this.multiplier) | 0);
	}
	
	/**
	  * Reads the next item in array.
	  *
	  * @method readOne
	  * @return {number}
	  */
	this.readOne = function()
	{
		return this.array[this.pointer++];
	}
	
	/**
	  * Reads the next two items in array, the second one gets multiplied by the
	  * multiplier given in the constructor.
	  *
	  * @method readTwo
	  * @return {number}
	  */
	this.readTwo = function()
	{
		return this.array[this.pointer++] + this.array[this.pointer++] * this.multiplier;
	}
	
	/**
	  * Checks if the pointer is at the end of the array (or beyond it).
	  *
	  * @method eof
	  * @nosideeffects
	  * @return {Boolean}
	  */
	this.eof = function()
	{
		return this.pointer >= this.array.length;
	}
	
	/**
	  * Seeks into a specified position in array.
	  *
	  * @method seek
	  * @param {number} i the position to seek to
	  * @return {Boolean}
	  */
	this.seek = function(i)
	{
		this.pointer = i;
	}
	
	/**
	  * Returns the whole array as an Uint8Array.
	  *
	  * @method getAsUint8Array
	  * @nosideeffects
	  * @return {Uint8Array}
	  */
	this.getAsUint8Array = function()
	{
		return new Uint8Array(this.array);
	}
	
	/**
	  * Returns the whole array as an Uint16Array.
	  *
	  * @method getAsUint16Array
	  * @nosideeffects
	  * @return {Uint16Array}
	  */
	this.getAsUint16Array = function()
	{
		return new Uint16Array(this.array);
	}
}
