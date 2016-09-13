// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 9;
var MAP_HEIGHT = 10;
var MAP_DATA = "000000000000000000000000000000000000000000000000000000000001110000001110000005110000000000";
var PLAYER;
var CUBE1;
var CUBE2;
var DOOR1;
var DOOR2;
var DOOR3;
var DOOR4;
var DOOR5;
var DOOR6;
var CRYSTAL1;
var PORTAL1;
var SW1;
var SW2;
var POT1;
var POT2;
var MAP_OBJECT_NAMES = [ 'PLAYER', 'CUBE1', 'CUBE2', 'DOOR1', 'DOOR2', 'DOOR3', 'DOOR4', 'DOOR5', 'DOOR6', 'CRYSTAL1', 'PORTAL1', 'SW1', 'SW2', 'POT1', 'POT2'];
// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END

function mapInit()
{
// DEBUG BEGIN
	try {
// DEBUG END
	_objs.length = 0;
	
	mapLoadFromString(MAP_WIDTH, MAP_HEIGHT, MAP_DATA);
	
	_objs.push(
		new ObjPlayer(6, 7),
		new ObjCube(5, 6, 0),
		new ObjCube(6, 8, 2),
		new ObjDoor(4, 5, 0),
		new ObjDoor(9, 11, 0),
		new ObjDoor(12, 3, 0),
		new ObjDoor(12, 5, 0),
		new ObjDoor(2, 11, 0),
		new ObjDoor(16, 8, 1),
		new ObjCrystal(12, 9),
		new ObjPortal(7, 9, 4, 0),
		new ObjSwitch(6, 6, 0),
		new ObjSwitch2(2, 6),
		new ObjPotion(2, 9, 0),
		new ObjPotion(5, 7, 1)
		);
	PLAYER = _objs[0];
	CUBE1 = _objs[1];
	CUBE2 = _objs[2];
	DOOR1 = _objs[3];
	DOOR2 = _objs[4];
	DOOR3 = _objs[5];
	DOOR4 = _objs[6];
	DOOR5 = _objs[7];
	DOOR6 = _objs[8];
	CRYSTAL1 = _objs[9];
	PORTAL1 = _objs[10];
	SW1 = _objs[11];
	SW2 = _objs[12];
	POT1 = _objs[13];
	POT2 = _objs[14];


// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}

function mapUpdate()
{
// DEBUG BEGIN
try {
// DEBUG END

// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}
