function mapLoadFromString(width, height, s)
{
	var x, y, i;
	
	_map.length = 0;
	i = 0;
	for (y=0; y<height; y++)
	{
		_map[y] = [];
		
		for (x=0; x<width; x++)
		{
			_map[y][x] = s[i] * 1; // == parseInt(s[i], 10);
			i++;
		}
	}
}

function mapApplyDirection(dx, dy, direction)
{
	var a;
	
	a = [ [ dx, dy ], [ dy, -dx ], [ -dx, -dy ], [ -dy, dx ] ];
	
	return a[direction];
}

function mapDoorByCoordinates(x, y)
{
	var i;
	
	for (i=0; i<_objs.length; i++)
	{
		if (_objs[i] instanceof ObjDoor && _objs[i].realX == x && _objs[i].realY == y)
		{
			return _objs[i];
		}
	}
	
	return null;
}

function mapProcessState(state, dx, dy)
{
	var door, door2, a, newState;
	
	newState = _copy(state);
	
	door = mapDoorByCoordinates(state.realX, state.realY);
	
	if (door !== null && door.checkAccess())
	{
		a = mapApplyDirection(dx, dy, newState.direction);
		
		// if the next step would be out of play area then warp to the target door
		if (_map[toTile(newState.realY) + a[1]][toTile(newState.realX) + a[0]] == TILE_VOID)
		{
			door2 = door.targetDoor;
			newState.realX = door2.realX;
			newState.realY = door2.realY;
			newState.direction = (newState.direction + (door.direction - door2.direction) + 4) % 4;
		}
	}
	
	a = mapApplyDirection(dx, dy, newState.direction);
	newState.viewX += dx * 16;
	newState.viewY += dy * 16;
	newState.realX = clip(newState.realX + a[0] * 16, 0, (MAP_WIDTH - 1) * 16);
	newState.realY = clip(newState.realY + a[1] * 16, 0, (MAP_HEIGHT - 1) * 16);
	newState.status = STATUS_VALID;
	newState.tile = _map[toTile(newState.realY)][toTile(newState.realX)];
	
	return newState;
}
