/**
  * @module object_factory
  */

/**
  * This is a rather strange class, it takes an array of ids, an array of
  * classes, and an arbitary parameter. It creates one instance of all the
  * classes into class_cache, invoking their constructors with the third
  * parameter. Later it runs the getNewInstance() of the generated classes
  * based on their given ids.
  *
  * This is basically just a quick (and dirty) way to have all the classes in
  * one palce and call their constructors and getNewInstance()s by a single
  * integer.
  *
  * @constructor
  * @parameter ids {Array} an array of ids identifying the classes
  * @parameter classes {Array} an array of classes
  * @parameter constructor_options {?} arbitary constructor option (optional)
  * @class ObjectFactory
  */
ObjectFactory = function(ids, classes, constructor_options)
{
	this.class_cache = {};
	
	for (i=0;i<ids.length;i++)
	{
		this.class_cache[ids[i]] = new classes[i](constructor_options);
	}
	
	this.getNewClassInstance = function(id, options)
	{
		if (!this.class_cache[id])
		{
			console.log("ObjectFactory: unknown id: " + id);
			return null;
		}
		
		return this.class_cache[id].getNewInstance(options);
	}
}
