// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 68;
var MAP_HEIGHT = 37;
var MAP_DATA = "00000000000000000000000000000000000000000000000000000000000000000000000033133000000000000000000003331313333300000000033333331333333300000000311130033333333333333333031116116113000000000336666616666633000000003111300111111116111111130311161161110000000003666666666666630000000031113003111111161166666303111611611300000000011666666666661100000333311133331111111611111113031116113333313330000366666666666663000003111111111333333333333333130311161130311111300003666666666666630000011111111111000000000000031303111611301111113000011666661666661100000311111111130000000003313313333313133031166633330366666666666663000003333111333303333133031116161130000000311611111103666666666666630000031111111113031111130311161611103331333116113333011661666661661100000111111111110111111303111616113031111131161111110366666666666663000003111111111303111113033333333330311111311666333303666666666666630000033331113333333311130333333333303111113111113000011666661666661100000311111111130003111300311111113031111131111130000366666666666663000003111111111100031113003111111110311111333133300003666666666666630000031111111113000311130031111111303111113000000000011666661666661100000313333333330003111300311133333033666333330000000366666666666663000000000000000000031113003111111130031116666300000003666666666666630000031333330000000311133331111111300311166663000000011666666666661100300311111300000003111111311111113003666366630000000366666616666663000003111113000000031111113313331333331113666300000003666666666666630000011111110000000311111130000000031111136663000000011661666661661100000311111300000003313333300000000313313366630000000366666666666663000003111113000000000000000003333333130003666300000003666666666666630000031111130331330000000000031111111333336663000000011666666666661100000311111303666300000000000313333333666666630000000366666666666663000003111113036663000000000003111111116666666300000003666666666666630000031111130333333333333333333333331166333333333300011666661666661100000311111303111111116166616113000333333111111113000366666666666663000003331333031111111161666161130000000031131131130003361661616616330000000000000311111111616161611300000000311111111300033313313133133300000000000003111111116161616111000000003113113113000000000000000000000000000000031111111166616661130000000031113311130000000000000000000000000000000311111111666166611300000000311111111300000000000000000000000000000003333313333333333333000000003133333313000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
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
		new ObjDoor(37, 35, 2),
		new ObjDoor(44, 35, 2),
		new ObjDoor(2, 19, 2),
		new ObjDoor(7, 22, 1),
		new ObjDoor(4, 30, 0),
		new ObjDoor(1, 22, 3),
		new ObjDoor(14, 35, 1),
		new ObjDoor(27, 32, 2),
		new ObjDoor(11, 25, 2),
		new ObjCube(4, 22, 1),
		new ObjSwitch2(4, 28),
		new ObjSwitch(11, 30),
		new ObjSwitch(11, 31),
		new ObjSwitch(11, 32),
		new ObjSwitch(11, 33),
		new ObjSwitch(12, 30),
		new ObjSwitch(12, 31),
		new ObjSwitch(12, 32),
		new ObjSwitch(12, 33),
		new ObjSwitch(13, 30),
		new ObjSwitch(13, 31),
		new ObjSwitch(13, 32),
		new ObjSwitch(13, 33),
		new ObjPortal(16, 30, 3, 0, 2, 0, 1),
		new ObjPortal(19, 32, 2, 0, 1, 0, 1),
		new ObjPortal(21, 31, 2, 0, 1, 0, 1),
		new ObjPortal(23, 32, 2, 0, 1, 0, 1),
		new ObjDoor(56, 1, 2),
		new ObjDoor(63, 16, 0),
		new ObjDoor(55, 31, 0),
		new ObjDoor(63, 25, 0),
		new ObjDoor(57, 31, 0),
		new ObjDoor(49, 4, 1),
		new ObjDoor(49, 7, 1),
		new ObjDoor(49, 10, 1),
		new ObjDoor(49, 13, 1),
		new ObjDoor(49, 19, 1),
		new ObjDoor(49, 22, 1),
		new ObjDoor(49, 28, 1),
		new ObjDoor(49, 16, 1),
		new ObjDoor(49, 25, 1),
		new ObjDoor(63, 4, 1),
		new ObjDoor(63, 7, 1),
		new ObjDoor(63, 10, 1),
		new ObjDoor(63, 13, 1),
		new ObjDoor(63, 19, 1),
		new ObjDoor(63, 22, 1),
		new ObjDoor(63, 28, 1),
		new ObjDoor(41, 15, 2),
		new ObjDoor(41, 5, 0),
		new ObjDoor(38, 7, 1),
		new ObjDoor(47, 9, 1),
		new ObjDoor(47, 11, 3),
		new ObjCube(42, 7, 0),
		new ObjSwitch2(42, 13),
		new ObjPortal(40, 10, 2, 0, 1, 0, 1),
		new ObjSwitch2(43, 10),
		new ObjPortal(42, 10, -2, 0, -2, 0, 1),
		new ObjPortal(35, 16, 0, 2, 0, 1, 1),
		new ObjDoor(35, 10, 2),
		new ObjDoor(35, 23, 0),
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
		new ObjDoor(1, 11, 1),
		new ObjDoor(11, 15, 1),
		new ObjDoor(2, 17, 2),
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
		new ObjPotion(56, 2, 2),
		new ObjPotion(56, 16, 0),
		new ObjPotion(56, 28, 2),
		new ObjPotion(34, 16, 0),
		new ObjPotion(36, 16, 0),
		new ObjPotion(35, 19, 2)
	);
	L2_LO1 = new LightsOut(34, 12, 3, 3, 3);

	MAP_OBJECT_NAMES = [ 'PLAYER', 'BONUS_DOOR1', 'BONUS_DOOR2', 'L5_DOOR1A', 'L5_DOOR2', 'L5_DOOR3', 'L5_DOOR4', 'L5_DOOR5', 'L5_DOOR6', 'L5_DOOR7', 'L5_CUBE', 'L5_SW', 'L5_SW1_1', 'L5_SW1_2', 'L5_SW1_3', 'L5_SW1_4', 'L5_SW2_1', 'L5_SW2_2', 'L5_SW2_3', 'L5_SW2_4', 'L5_SW3_1', 'L5_SW3_2', 'L5_SW3_3', 'L5_SW3_4', 'L5_PORTAL0', 'L5_PORTAL1', 'L5_PORTAL2', 'L5_PORTAL3', 'L4_DOOR1', 'L4_DOOR2', 'L4_DOOR3', 'L4_DOOR4', 'L4_DOOR5', 'L4_DOOR_X1', 'L4_DOOR_X2', 'L4_DOOR_X3', 'L4_DOOR_X4', 'L4_DOOR_X5', 'L4_DOOR_X6', 'L4_DOOR_X7', 'L4_DOOR_X8', 'L4_DOOR_X9', 'L4_DOOR_Y1', 'L4_DOOR_Y2', 'L4_DOOR_Y3', 'L4_DOOR_Y4', 'L4_DOOR_Y5', 'L4_DOOR_Y6', 'L4_DOOR_Y7', 'L3_DOOR1', 'L3_DOOR2', 'L3_DOOR3', 'L3_DOOR4', 'L3_DOOR5', 'L3_CUBE1', 'L3_SW1', 'L3_PORTAL1', 'L3_SW2', 'L3_PORTAL2', 'L2_PORTAL1', 'L2_DOOR1', 'L2_DOOR2', 'L1_DOOR1', 'L1_DOOR2', 'L1_DOOR3', 'L1_DOOR4', 'L1_SW1', 'L1_SW2', 'L1_PORTAL1', 'L1_CUBE1', 'L1_DOOR5', 'LIMBO_DOOR1', 'LIMBO_DOOR2', 'LIMBO_DOOR3', 'LIMBO_DOOR4', 'LIMBO_DOOR5', 'LIMBO_DOOR6', 'LIMBO_DOOR7A', 'TUT_DOOR2', 'TUT_CUBE1', 'TUT_SW1', 'TUT_DOOR3', 'TUT_DOOR4', 'TUT_DOOR5', 'TUT_DOOR6', 'TUT_DOOR7', 'TUT_CRYSTAL', 'TUT_SW2', 'TUT_DOOR8', 'TUT_DOOR9', 'TUT_PORTAL1', 'TUT_SW3', 'TUT_PORTAL2', 'TUT_SW4', 'TUT_SW5', 'TUT_SW6', 'TUT_DOOR10', 'L4_POT1', 'L4_POT2', 'L4_POT3', 'L2_POT1', 'L2_POT2', 'L2_POT3'];


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
	var BONUS_DOOR1 = _objs[1];
	var BONUS_DOOR2 = _objs[2];
	var L5_DOOR1A = _objs[3];
	var L5_DOOR2 = _objs[4];
	var L5_DOOR3 = _objs[5];
	var L5_DOOR4 = _objs[6];
	var L5_DOOR5 = _objs[7];
	var L5_DOOR6 = _objs[8];
	var L5_DOOR7 = _objs[9];
	var L5_CUBE = _objs[10];
	var L5_SW = _objs[11];
	var L5_SW1_1 = _objs[12];
	var L5_SW1_2 = _objs[13];
	var L5_SW1_3 = _objs[14];
	var L5_SW1_4 = _objs[15];
	var L5_SW2_1 = _objs[16];
	var L5_SW2_2 = _objs[17];
	var L5_SW2_3 = _objs[18];
	var L5_SW2_4 = _objs[19];
	var L5_SW3_1 = _objs[20];
	var L5_SW3_2 = _objs[21];
	var L5_SW3_3 = _objs[22];
	var L5_SW3_4 = _objs[23];
	var L5_PORTAL0 = _objs[24];
	var L5_PORTAL1 = _objs[25];
	var L5_PORTAL2 = _objs[26];
	var L5_PORTAL3 = _objs[27];
	var L4_DOOR1 = _objs[28];
	var L4_DOOR2 = _objs[29];
	var L4_DOOR3 = _objs[30];
	var L4_DOOR4 = _objs[31];
	var L4_DOOR5 = _objs[32];
	var L4_DOOR_X1 = _objs[33];
	var L4_DOOR_X2 = _objs[34];
	var L4_DOOR_X3 = _objs[35];
	var L4_DOOR_X4 = _objs[36];
	var L4_DOOR_X5 = _objs[37];
	var L4_DOOR_X6 = _objs[38];
	var L4_DOOR_X7 = _objs[39];
	var L4_DOOR_X8 = _objs[40];
	var L4_DOOR_X9 = _objs[41];
	var L4_DOOR_Y1 = _objs[42];
	var L4_DOOR_Y2 = _objs[43];
	var L4_DOOR_Y3 = _objs[44];
	var L4_DOOR_Y4 = _objs[45];
	var L4_DOOR_Y5 = _objs[46];
	var L4_DOOR_Y6 = _objs[47];
	var L4_DOOR_Y7 = _objs[48];
	var L3_DOOR1 = _objs[49];
	var L3_DOOR2 = _objs[50];
	var L3_DOOR3 = _objs[51];
	var L3_DOOR4 = _objs[52];
	var L3_DOOR5 = _objs[53];
	var L3_CUBE1 = _objs[54];
	var L3_SW1 = _objs[55];
	var L3_PORTAL1 = _objs[56];
	var L3_SW2 = _objs[57];
	var L3_PORTAL2 = _objs[58];
	var L2_PORTAL1 = _objs[59];
	var L2_DOOR1 = _objs[60];
	var L2_DOOR2 = _objs[61];
	var L1_DOOR1 = _objs[62];
	var L1_DOOR2 = _objs[63];
	var L1_DOOR3 = _objs[64];
	var L1_DOOR4 = _objs[65];
	var L1_SW1 = _objs[66];
	var L1_SW2 = _objs[67];
	var L1_PORTAL1 = _objs[68];
	var L1_CUBE1 = _objs[69];
	var L1_DOOR5 = _objs[70];
	var LIMBO_DOOR1 = _objs[71];
	var LIMBO_DOOR2 = _objs[72];
	var LIMBO_DOOR3 = _objs[73];
	var LIMBO_DOOR4 = _objs[74];
	var LIMBO_DOOR5 = _objs[75];
	var LIMBO_DOOR6 = _objs[76];
	var LIMBO_DOOR7A = _objs[77];
	var TUT_DOOR2 = _objs[78];
	var TUT_CUBE1 = _objs[79];
	var TUT_SW1 = _objs[80];
	var TUT_DOOR3 = _objs[81];
	var TUT_DOOR4 = _objs[82];
	var TUT_DOOR5 = _objs[83];
	var TUT_DOOR6 = _objs[84];
	var TUT_DOOR7 = _objs[85];
	var TUT_CRYSTAL = _objs[86];
	var TUT_SW2 = _objs[87];
	var TUT_DOOR8 = _objs[88];
	var TUT_DOOR9 = _objs[89];
	var TUT_PORTAL1 = _objs[90];
	var TUT_SW3 = _objs[91];
	var TUT_PORTAL2 = _objs[92];
	var TUT_SW4 = _objs[93];
	var TUT_SW5 = _objs[94];
	var TUT_SW6 = _objs[95];
	var TUT_DOOR10 = _objs[96];
	var L4_POT1 = _objs[97];
	var L4_POT2 = _objs[98];
	var L4_POT3 = _objs[99];
	var L2_POT1 = _objs[100];
	var L2_POT2 = _objs[101];
	var L2_POT3 = _objs[102];
LIMBO_DOOR1.targetDoor = TUT_DOOR2;
LIMBO_DOOR2.targetDoor = TUT_DOOR10;
LIMBO_DOOR3.targetDoor = L1_DOOR1;
LIMBO_DOOR4.targetDoor = L2_DOOR1;
LIMBO_DOOR5.targetDoor = L3_DOOR1;
LIMBO_DOOR6.targetDoor = L4_DOOR1;
LIMBO_DOOR7A.targetDoor = L5_DOOR1A;

LIMBO_DOOR2.doorLockId = 1;
LIMBO_DOOR3.doorLockId = 2;
LIMBO_DOOR4.doorLockId = 3;
LIMBO_DOOR5.doorLockId = 4;
LIMBO_DOOR6.doorLockId = 5;
LIMBO_DOOR7A.doorLockId = 6;

///

TUT_DOOR2.targetDoor = LIMBO_DOOR1;
TUT_DOOR10.targetDoor = LIMBO_DOOR2;
linkDoors(TUT_DOOR8, TUT_DOOR9);
linkDoors(TUT_DOOR3, TUT_DOOR4);
linkDoors(TUT_DOOR6, TUT_DOOR7);


if (TUT_SW1.switchStatus)
{
linkDoors(TUT_DOOR4, TUT_DOOR5);
}

if (TUT_SW2.switchStatus)
{
linkDoors(TUT_DOOR6, TUT_DOOR8);
linkDoors(TUT_DOOR7, TUT_DOOR9);
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

linkDoors(L1_DOOR1, L1_DOOR2);
linkDoors(L1_DOOR3, L1_DOOR4);
L1_DOOR5.targetDoor = L2_DOOR1;

if (L1_SW1.switchStatus)
{
linkDoors(L1_DOOR1, L1_DOOR4);
linkDoors(L1_DOOR2, L1_DOOR3);
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
linkDoors(L3_DOOR2, L3_DOOR3);
linkDoors(L3_DOOR4, L3_DOOR5);

L3_PORTAL1.kill = true;
if (L3_SW1.switchStatus)
{
L3_PORTAL1.kill = false;
}

if (L3_SW2.switchStatus)
{
L3_DOOR4.targetDoor = L4_DOOR1;
// L3_DOOR5.targetDoor = L4_DOOR1;
}

/////////////

L4_DOOR1.targetDoor = L3_DOOR4;
L4_DOOR5.targetDoor = L5_DOOR1A;

linkDoors(L4_DOOR2, L4_DOOR4);

linkDoors(L4_DOOR_X1, L4_DOOR_Y2);
linkDoors(L4_DOOR_X2, L4_DOOR_Y1);
linkDoors(L4_DOOR_X3, L4_DOOR_Y3);
linkDoors(L4_DOOR_X4, L4_DOOR_Y4);
linkDoors(L4_DOOR_X5, L4_DOOR_Y5);
linkDoors(L4_DOOR_X6, L4_DOOR_X9);
linkDoors(L4_DOOR_X7, L4_DOOR_Y7);
linkDoors(L4_DOOR_X8, L4_DOOR_Y6);

///////
L5_DOOR1A.targetDoor = L4_DOOR5;
L5_DOOR2.targetDoor = L5_DOOR7;
L5_DOOR3.targetDoor = L5_DOOR7;
L5_DOOR7.targetDoor = L5_DOOR3;

L5_PORTAL0.kill = true;
if (L5_SW.switchStatus == true)
{
L5_DOOR2.targetDoor = L5_DOOR3;
L5_DOOR3.targetDoor = L5_DOOR2;
L5_PORTAL0.kill = false;
}

L5_PORTAL1.kill = true;
if (L5_SW1_1.switchStatus == false && L5_SW1_2.switchStatus == false && L5_SW1_3.switchStatus == true && L5_SW1_4.switchStatus == false)
{
L5_PORTAL1.kill = false;
}

L5_PORTAL2.kill = true;
if (L5_SW2_1.switchStatus == true && L5_SW2_2.switchStatus == false && L5_SW2_3.switchStatus == false && L5_SW2_4.switchStatus == false)
{
L5_PORTAL2.kill = false;
}

L5_PORTAL3.kill = true;
if (L5_SW3_1.switchStatus == false && L5_SW3_2.switchStatus == false && L5_SW3_3.switchStatus == false && L5_SW3_4.switchStatus == true)
{
L5_PORTAL3.kill = false;
}

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
