// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 27;
var MAP_HEIGHT = 15;
var MAP_DATA = "000000000000000000000000000033331333300000333333333330031111111300000311116661130033333333303130311116111130000000000003130311116661130033313333003130333333333330031611113000000000000000000031611113000000000000000000031615113333330033333333330031611111161130031111111130031611111161130011111111110031333333133330031111111130036300000000000033333333330033300000000000000000000000000000000000000000000000000";
var MAP_OBJECT_NAMES;
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
		new ObjPlayer(3, 2),
		new ObjCube(5, 6, 0),
		new ObjCube(6, 8, 2),
		new ObjDoor(4, 5, 0),
		new ObjDoor(9, 11, 0),
		new ObjDoor(12, 3, 0),
		new ObjDoor(12, 5, 0),
		new ObjDoor(2, 11, 0),
		new ObjDoor(16, 10, 1),
		new ObjCrystal(12, 9),
		new ObjPortal(7, 9, 4, 0),
		new ObjSwitch(6, 6, 0),
		new ObjSwitch2(2, 6),
		new ObjDoor(5, 1, 0),
		new ObjDoor(25, 10, 1),
		new ObjPotion(2, 9, 0),
		new ObjPotion(5, 7, 1)
	);

	MAP_OBJECT_NAMES = [ 'PLAYER', 'CUBE1', 'CUBE2', 'DOOR1', 'DOOR2', 'DOOR3', 'DOOR4', 'DOOR5', 'DOOR6', 'CRYSTAL1', 'PORTAL1', 'SW1', 'SW2', 'DOOR9', 'DOOR11', 'POT1', 'POT2'];


// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}

function mapUpdate()
{
// DEBUG BEGIN
try {
// DEBUG END
	var PLAYER = _objs[0];
	var CUBE1 = _objs[1];
	var CUBE2 = _objs[2];
	var DOOR1 = _objs[3];
	var DOOR2 = _objs[4];
	var DOOR3 = _objs[5];
	var DOOR4 = _objs[6];
	var DOOR5 = _objs[7];
	var DOOR6 = _objs[8];
	var CRYSTAL1 = _objs[9];
	var PORTAL1 = _objs[10];
	var SW1 = _objs[11];
	var SW2 = _objs[12];
	var DOOR9 = _objs[13];
	var DOOR11 = _objs[14];
	var POT1 = _objs[15];
	var POT2 = _objs[16];
_glitch_time_left = 9999999;

DOOR1.targetDoor = DOOR4;
DOOR2.targetDoor = DOOR3;
DOOR3.targetDoor = DOOR2;
DOOR4.targetDoor = DOOR1;
DOOR5.targetDoor = DOOR5;
DOOR6.targetDoor = DOOR6;
DOOR9.targetDoor = DOOR2;
DOOR11.targetDoor = DOOR11;

PORTAL1.kill = true;

if (SW1.switchStatus == true)
{
//	DOOR1.targetDoor = DOOR5;
//	DOOR5.targetDoor = DOOR1;
	DOOR1.targetDoor = DOOR6;
	DOOR6.targetDoor = DOOR1;
}

if (SW2.switchStatus == true)
{
	PORTAL1.kill = false;
}

if (_fhdk_done == true)
{
	DOOR11.targetDoor = DOOR2;
}

// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}
