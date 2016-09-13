// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 49;
var MAP_HEIGHT = 13;
var MAP_DATA = "0000000000000000000000000000000000000000000000000033331313300000000000000000000000000000000000000003111111130000000000000000000000000000000000000000333333333031300000000000000000000000000000000000000000000003130000000000000000000000000000000000003331333300313000000000000000000000000000000000000316111130000000000000000000000000000000000000000031611113000000033333333333333333333333333333333001161511333333001131113111311111111111111111111300316111111611300313131313131111111111111111111130031611111161110031113111311111111111111111111111003133333313333003333333333333333333333333333333300000000000000000000000000000000000000000000000000";
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
		new ObjDoor(16, 8, 1),
		new ObjDoor(1, 8, 2),
		new ObjDoor(13, 10, 3),
		new ObjCrystal(12, 9),
		new ObjPortal(7, 9, 4, 0),
		new ObjSwitch(6, 6, 0),
		new ObjSwitch2(2, 6),
		new ObjDoor(5, 1, 0),
		new ObjDoor(7, 1, 0),
		new ObjPotion(2, 9, 0),
		new ObjPotion(5, 7, 1)
	);

	MAP_OBJECT_NAMES = [ 'PLAYER', 'CUBE1', 'CUBE2', 'DOOR1', 'DOOR2', 'DOOR3', 'DOOR4', 'DOOR5', 'DOOR6', 'DOOR7', 'DOOR8', 'CRYSTAL1', 'PORTAL1', 'SW1', 'SW2', 'DOOR9', 'DOOR10', 'POT1', 'POT2'];


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
	var DOOR7 = _objs[9];
	var DOOR8 = _objs[10];
	var CRYSTAL1 = _objs[11];
	var PORTAL1 = _objs[12];
	var SW1 = _objs[13];
	var SW2 = _objs[14];
	var DOOR9 = _objs[15];
	var DOOR10 = _objs[16];
	var POT1 = _objs[17];
	var POT2 = _objs[18];
_glitch_time_left = 9999999;

DOOR1.targetDoor = DOOR4;
DOOR2.targetDoor = DOOR3;
DOOR3.targetDoor = DOOR2;
DOOR4.targetDoor = DOOR1;
DOOR5.targetDoor = DOOR5;
DOOR6.targetDoor = DOOR6;
DOOR7.targetDoor = DOOR7;
DOOR8.targetDoor = DOOR8;

DOOR9.targetDoor = DOOR2;
DOOR10.targetDoor = DOOR2;

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
// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}
