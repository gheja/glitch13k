// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 12;
var MAP_HEIGHT = 13;
var MAP_DATA = "000000000000033333333330031111166630031111166630031111166630031111166630031111161130031111161130031115161130031111166630031111166630033333333330000000000000";
var PLAYER;
var PORTAL;
var LO1;
var POT1;
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
		new ObjPortal(4, 7, 4, 0),
		new ObjPotion(9, 7, 0)
	);
	PLAYER = _objs[0];
	PORTAL = _objs[1];
	POT1 = _objs[2];
	LO1 = new LightsOut(3, 3, 3, 3, 3);

	var MAP_OBJECT_NAMES = [ 'PLAYER', 'PORTAL', 'POT1'];


// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}

function mapUpdate()
{
// DEBUG BEGIN
try {
// DEBUG END
PORTAL.kill = true;

if (LO1.solved)
{
PORTAL.kill = false;
}
// DEBUG BEGIN
} catch (err) { alert(err); }
// DEBUG END
}
