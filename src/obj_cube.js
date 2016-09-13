"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjCube = function(x, y, special)
{
	this.initObj(x, y, 0, special ? [ T_CUBE_SIDE_1, T_CUBE_SIDE_2, T_CUBE_SIDE_3, T_CUBE_SIDE_4 ] : T_CUBE, 2);
	
	this.canBeGrabbed = true;
}

ObjCube.prototype = new Obj();
