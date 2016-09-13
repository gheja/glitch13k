// DEBUG BEGIN
try {
// DEBUG END
var MAP_WIDTH = 12;
var MAP_HEIGHT = 13;
var MAP_DATA = "000000000000033333333330031111111130031111111130031111111130031111111130031111111130031111111130031115111130031111111130031111111130033333333330000000000000";
var PLAYER;
var MAP_OBJECT_NAMES = [ 'PLAYER'];
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
		new ObjPlayer(6, 7)
		);
	PLAYER = _objs[0];

var lo1 = new LightsOut(3, 3, 3, 3, 5);
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
