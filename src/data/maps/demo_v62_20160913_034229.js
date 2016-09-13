// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 37;
var MAP_HEIGHT = 14;
var MAP_DATA = "00000000000000000000000000000000000000333313333031303333333333333300000000031111111103130311116661611130000000003333133330313031111611161113000000000000000000031303111166616111300000000033313333003130333313333311130033133003161111300313000000000033133003111300316111130000000000000000000000311130031615113333330033333333330331331113003161111116113003111111113031111111300316111111611100111111111103111111110031333333133330031111111130311111113000000000000000003333333333033333333300000000000000000000000000000000000000";
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
		new ObjDoor(12, 1, 0),
		new ObjDoor(12, 6, 0),
		new ObjDoor(2, 11, 0),
		new ObjDoor(16, 10, 1),
		new ObjCrystal(12, 9),
		new ObjPortal(7, 9, 4, 0, 3, 0, 0),
		new ObjSwitch(6, 6, 0),
		new ObjSwitch2(2, 6),
		new ObjDoor(5, 1, 0),
		new ObjDoor(25, 10, 1),
		new ObjDoor(19, 5, 0),
		new ObjDoor(5, 3, 2),
		new ObjDoor(13, 10, 1),
		new ObjPortal(19, 3, 2, 0, 1, 0, 1),
		new ObjDoor(9, 2, 1),
		new ObjDoor(26, 6, 2),
		new ObjDoor(29, 8, 2),
		new ObjDoor(33, 5, 0),
		new ObjDoor(35, 10, 3),
		new ObjPotion(2, 9, 0),
		new ObjPotion(5, 7, 1),
		new ObjPotion(23, 3, 2)
	);
	LO1 = new LightsOut(16, 2, 3, 3, 2);

	MAP_OBJECT_NAMES = [ 'PLAYER', 'CUBE1', 'CUBE2', 'DOOR1', 'DOOR2', 'DOOR3', 'DOOR4', 'DOOR5', 'DOOR6', 'CRYSTAL1', 'PORTAL1', 'SW1', 'SW2', 'DOOR9', 'DOOR11', 'DOOR12', 'DOOR13', 'DOOR14', 'PORTAL2', 'DOOR15', 'DOOR16', 'DOOR_A1', 'DOOR_A2', 'DOOR_A3', 'POT1', 'POT2', 'POT3'];


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
	var DOOR12 = _objs[15];
	var DOOR13 = _objs[16];
	var DOOR14 = _objs[17];
	var PORTAL2 = _objs[18];
	var DOOR15 = _objs[19];
	var DOOR16 = _objs[20];
	var DOOR_A1 = _objs[21];
	var DOOR_A2 = _objs[22];
	var DOOR_A3 = _objs[23];
	var POT1 = _objs[24];
	var POT2 = _objs[25];
	var POT3 = _objs[26];
_glitch_time_left = 9999999;

DOOR1.targetDoor = DOOR4;
DOOR2.targetDoor = DOOR3;
DOOR3.targetDoor = DOOR2;
DOOR4.targetDoor = DOOR1;
DOOR5.targetDoor = DOOR5;
DOOR9.targetDoor = DOOR2;
DOOR11.targetDoor = DOOR6;
DOOR12.targetDoor = DOOR14;
DOOR13.targetDoor = DOOR12;
DOOR14.targetDoor = DOOR12;
DOOR15.targetDoor = DOOR6;
DOOR6.targetDoor = DOOR15;

DOOR16.targetDoor = DOOR_A1;
DOOR_A1.targetDoor = DOOR16;
DOOR_A2.targetDoor = DOOR_A3;
DOOR_A3.targetDoor = DOOR_A2;

PORTAL1.kill = true;

if (SW1.switchStatus == true)
{
	DOOR1.targetDoor = DOOR5;
	DOOR5.targetDoor = DOOR1;
}

if (SW2.switchStatus == true)
{
	PORTAL1.kill = false;
}

if (_fhdk_done)
{
	DOOR11.targetDoor = DOOR2;
}

if (LO1.solved)
{
	PORTAL2.kill = false;
}

// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}
