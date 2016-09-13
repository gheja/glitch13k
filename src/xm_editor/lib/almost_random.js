/**
  * @module almost_random
  */

/**
  * This is simple, ugly but really useful PRNG. The random numbers are always
  * predictable from the seed so two sequence of random numbers are guaranteed
  * to be the same if the same seed is used - useful for simulations and
  * debugging purposes.
  *
  * @constructor
  * @class AlmostRandom
  * @param {number} seed (optional) initial seed
  */
AlmostRandom = function(seed)
{
	/** @private {number} */ this.seed = 42;
	
	if (seed !== undefined)
	{
		this.seed = seed;
	}
	
	/**
	  * Returns a "random" float between 0.0 and 1.0.
	  *
	  * @method random
	  * @returns {number} the generated random number
	  */
	this.random = function()
	{
		// these numbers are from random.org
		this.seed = (this.seed * 26031 + 35803270) % 5886503;
		
		// really.
		return (this.seed % 73727) / 73727;
	}
	
	this.randomInteger = function(min, max)
	{
		return (this.random() * (max - min) + min) | 0;
	}
	
	this.randomUInt32 = function(min, max)
	{
		return this.randomInteger(0, 65535);
	}
}
