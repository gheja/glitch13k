// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 49;
var MAP_HEIGHT = 25;
var MAP_DATA = "0000000000000000000000000000000000000000000000000000033133000000000000000000003331313333300000000000003111300333333333333333330311161161130000000000000311130011111111611111113031116116111000000000000031113003111111161166666303111611611300000000003333111333311111116111111130311161133333133300000311111111133333333333333313031116113031111130000011111111111000000000000031303111611301111113000003111111111300000000033133133333131330311666333300333311133330333313303111616113000000031161111110031111111113031111130311161611103331333116113333001111111111101111113031116161130311111311611111100311111111130311111303333333333031111131166633330033331113333333311130333333333303111113111113000003111111111111131113003111111130311111311111300000111111111111113111300311111111031111133313330000031111111111111311130031111111303111113000000000003333333333311131113003111333330336663333300000000000000000031113111300311111113003111611130000000033133133133111311133331111111300311161113000000003111111111111131111113111111130036663111300000000311111111111113111111331333133003111311130000000031111111111111311111130000000000311131113000000003333333333333333133333000000000033133333300000000000000000000000000000000000000000000000000000000";
var MAP_OBJECT_NAMES;
	var L2_LO1;
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
		new ObjPlayer(6, 3),
		new ObjDoor(41, 15, 2),
		new ObjDoor(41, 5, 0),
		new ObjDoor(38, 7, 1),
		new ObjDoor(47, 9, 1),
		new ObjDoor(47, 11, 3),
		new ObjCube(39, 10),
		new ObjSwitch2(42, 13),
		new ObjPortal(42, 7, 0, 3, 0, 1, 0),
		new ObjSwitch2(43, 10),
		new ObjPortal(42, 10, -2, 0, 0, 0, 0),
		new ObjPortal(35, 16, 0, 2, 0, 1, 1),
		new ObjDoor(35, 10, 2),
		new ObjDoor(35, 23, 2),
		new ObjDoor(34, 8, 0),
		new ObjDoor(34, 1, 0),
		new ObjDoor(32, 8, 0),
		new ObjDoor(32, 1, 0),
		new ObjSwitch(34, 4),
		new ObjSwitch2(31, 5),
		new ObjPortal(31, 3, 6, 0, 2, 0, 0),
		new ObjCube(35, 5),
		new ObjDoor(39, 3, 1),
		new ObjDoor(6, 1, 0),
		new ObjDoor(11, 7, 1),
		new ObjDoor(1, 7, 3),
		new ObjDoor(11, 11, 1),
		new ObjDoor(1, 11, 3),
		new ObjDoor(13, 11, 1),
		new ObjCube(24, 15),
		new ObjSwitch(20, 21),
		new ObjDoor(17, 9, 0),
		new ObjDoor(17, 23, 0),
		new ObjDoor(24, 21, 2),
		new ObjDoor(30, 15, 1),
		new ObjDoor(28, 21, 0),
		new ObjCrystal(24, 19),
		new ObjSwitch2(27, 14),
		new ObjDoor(23, 8, 2),
		new ObjDoor(30, 10, 1),
		new ObjPortal(23, 10, 3, 0, 1, 0, 0),
		new ObjSwitch(28, 10),
		new ObjPortal(20, 4, -2, 0, 6, 2, 1),
		new ObjSwitch(24, 3),
		new ObjSwitch(25, 3),
		new ObjSwitch(26, 3),
		new ObjDoor(11, 3, 1),
		new ObjPotion(34, 16, 0),
		new ObjPotion(36, 16, 0),
		new ObjPotion(35, 19, 2)
	);
	L2_LO1 = new LightsOut(34, 12, 3, 3, 3);

	MAP_OBJECT_NAMES = [ 'PLAYER', 'L3_DOOR1', 'L3_DOOR2', 'L3_DOOR3', 'L3_DOOR4', 'L3_DOOR5', 'L3_CUBE1', 'L3_SW1', 'L3_PORTAL1', 'L3_SW2', 'L3_PORTAL2', 'L2_PORTAL1', 'L2_DOOR1', 'L2_DOOR2', 'L1_DOOR1', 'L1_DOOR2', 'L1_DOOR3', 'L1_DOOR4', 'L1_SW1', 'L1_SW2', 'L1_PORTAL1', 'L1_CUBE1', 'L1_DOOR5', 'LIMBO_DOOR1', 'LIMBO_DOOR2', 'LIMBO_DOOR3', 'LIMBO_DOOR4', 'LIMBO_DOOR5', 'TUT_DOOR2', 'TUT_CUBE1', 'TUT_SW1', 'TUT_DOOR3', 'TUT_DOOR4', 'TUT_DOOR5', 'TUT_DOOR6', 'TUT_DOOR7', 'TUT_CRYSTAL', 'TUT_SW2', 'TUT_DOOR8', 'TUT_DOOR9', 'TUT_PORTAL1', 'TUT_SW3', 'TUT_PORTAL2', 'TUT_SW4', 'TUT_SW5', 'TUT_SW6', 'TUT_DOOR10', 'L2_POT1', 'L2_POT2', 'L2_POT3'];


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
	var L3_DOOR1 = _objs[1];
	var L3_DOOR2 = _objs[2];
	var L3_DOOR3 = _objs[3];
	var L3_DOOR4 = _objs[4];
	var L3_DOOR5 = _objs[5];
	var L3_CUBE1 = _objs[6];
	var L3_SW1 = _objs[7];
	var L3_PORTAL1 = _objs[8];
	var L3_SW2 = _objs[9];
	var L3_PORTAL2 = _objs[10];
	var L2_PORTAL1 = _objs[11];
	var L2_DOOR1 = _objs[12];
	var L2_DOOR2 = _objs[13];
	var L1_DOOR1 = _objs[14];
	var L1_DOOR2 = _objs[15];
	var L1_DOOR3 = _objs[16];
	var L1_DOOR4 = _objs[17];
	var L1_SW1 = _objs[18];
	var L1_SW2 = _objs[19];
	var L1_PORTAL1 = _objs[20];
	var L1_CUBE1 = _objs[21];
	var L1_DOOR5 = _objs[22];
	var LIMBO_DOOR1 = _objs[23];
	var LIMBO_DOOR2 = _objs[24];
	var LIMBO_DOOR3 = _objs[25];
	var LIMBO_DOOR4 = _objs[26];
	var LIMBO_DOOR5 = _objs[27];
	var TUT_DOOR2 = _objs[28];
	var TUT_CUBE1 = _objs[29];
	var TUT_SW1 = _objs[30];
	var TUT_DOOR3 = _objs[31];
	var TUT_DOOR4 = _objs[32];
	var TUT_DOOR5 = _objs[33];
	var TUT_DOOR6 = _objs[34];
	var TUT_DOOR7 = _objs[35];
	var TUT_CRYSTAL = _objs[36];
	var TUT_SW2 = _objs[37];
	var TUT_DOOR8 = _objs[38];
	var TUT_DOOR9 = _objs[39];
	var TUT_PORTAL1 = _objs[40];
	var TUT_SW3 = _objs[41];
	var TUT_PORTAL2 = _objs[42];
	var TUT_SW4 = _objs[43];
	var TUT_SW5 = _objs[44];
	var TUT_SW6 = _objs[45];
	var TUT_DOOR10 = _objs[46];
	var L2_POT1 = _objs[47];
	var L2_POT2 = _objs[48];
	var L2_POT3 = _objs[49];
LIMBO_DOOR1.targetDoor = TUT_DOOR2;
LIMBO_DOOR2.targetDoor = TUT_DOOR10;
LIMBO_DOOR3.targetDoor = L1_DOOR1;
LIMBO_DOOR4.targetDoor = L2_DOOR1;
LIMBO_DOOR5.targetDoor = L3_DOOR1;

///

TUT_DOOR2.targetDoor = LIMBO_DOOR1;
TUT_DOOR3.targetDoor = TUT_DOOR4;
TUT_DOOR4.targetDoor = TUT_DOOR3;
TUT_DOOR6.targetDoor = TUT_DOOR7;
TUT_DOOR7.targetDoor = TUT_DOOR6;
TUT_DOOR8.targetDoor = TUT_DOOR9;
TUT_DOOR9.targetDoor = TUT_DOOR8;
TUT_DOOR10.targetDoor = LIMBO_DOOR2;


if (TUT_SW1.switchStatus)
{
TUT_DOOR4.targetDoor = TUT_DOOR5;
TUT_DOOR5.targetDoor = TUT_DOOR4;
}

if (TUT_SW2.switchStatus)
{
TUT_DOOR6.targetDoor = TUT_DOOR8;
TUT_DOOR8.targetDoor = TUT_DOOR6;
TUT_DOOR7.targetDoor = TUT_DOOR9;
TUT_DOOR9.targetDoor = TUT_DOOR7;
}

TUT_PORTAL1.kill = true;
if (TUT_SW3.switchStatus)
{
TUT_PORTAL1.kill = false;
}

TUT_PORTAL2.kill = true;
if (TUT_SW5.switchStatus)
{
TUT_PORTAL2.kill = false;
}

///

L1_DOOR1.targetDoor = L1_DOOR2;
L1_DOOR2.targetDoor = L1_DOOR1;
L1_DOOR3.targetDoor = L1_DOOR4;
L1_DOOR4.targetDoor = L1_DOOR3;
L1_DOOR5.targetDoor = L2_DOOR1;

if (L1_SW1.switchStatus)
{
L1_DOOR1.targetDoor = L1_DOOR4;
L1_DOOR2.targetDoor = L1_DOOR3;
L1_DOOR3.targetDoor = L1_DOOR2;
L1_DOOR4.targetDoor = L1_DOOR1;
}

L1_PORTAL1.kill = true;
if (L1_SW2.switchStatus)
{
L1_PORTAL1.kill = false;
}

////////////

L2_DOOR1.targetDoor = L1_DOOR5;

L2_PORTAL1.kill = true;
if (L2_LO1.solved)
{
L2_PORTAL1.kill = false;
}

L2_DOOR2.targetDoor = L3_DOOR1;

////////////

L3_DOOR1.targetDoor = L2_DOOR2;
L3_DOOR2.targetDoor = L3_DOOR3;
L3_DOOR3.targetDoor = L3_DOOR2;
L3_DOOR4.targetDoor = L3_DOOR5;
L3_DOOR5.targetDoor = L3_DOOR4;


_glitch_time_left = 9999999;

// if (_fhdk_done)
// {
// DOOR11.targetDoor = DOOR2;
// }

// if (LO1.solved)
// {
// PORTAL2.kill = false;
// }

// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}
