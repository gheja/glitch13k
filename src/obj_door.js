"use strict";

/**
 * @constructor
 * @extends {Obj}
 */
var ObjDoor = function(x, y, direction)
{
	this.initObj(x, y, direction, [ T_DOOR_1_3, T_DOOR_2_4, T_DOOR_1_3, T_DOOR_2_4 ], 2);
	this.doorLockId = 0;
	/** @type {ObjDoor|null} */ this.targetDoor = null;
}

ObjDoor.prototype = new Obj();

ObjDoor.prototype.checkAccess = function()
{
	return _keys_found[this.doorLockId];
}