BodyGenerator = function(n)
{
	this.position = new Position();
	this.last_points = [];
	this.side_count = n;
	this.triangles = [];
	this.colors = [];
	this.slice_points = [];
	this.color = [ 0.7, 0.7, 0.7 ];
	
	this.clear = function()
	{
		this.position.x = 0;
		this.position.y = 0;
		this.position.z = 0;
		this.last_points = [];
		this.side_count = n;
		this.triangles = [];
		this.colors = [];
		this.color = [ 0.7, 0.7, 0.7 ];
	}
	
	this.regularPolygon = function(side_count, sides_to_draw)
	{
		var i;
		
		this.slice_points = [];
		for (i=0; i<sides_to_draw; i++)
		{
			this.slice_points.push([
					Math.cos(2 * Math.PI * (i / side_count)),
					Math.sin(2 * Math.PI * (i / side_count))
			]);
		}
	}
	
	this.moveBy = function(x, y, z)
	{
		this.position.x += x;
		this.position.y += y;
		this.position.z += z;
	}
	
	this.moveByDistance = function(d)
	{
		this.moveBy(0, 0, d);
	}
	
	this.makeSlice = function(radius, distance)
	{
		var i, j, a, b, c, p, new_points;
		
		new_points = [];
		
		for (i=0; i<this.slice_points.length; i++)
		{
			p = this.slice_points[i];
			new_points.push([ p[0] * radius, p[1] * radius, this.position.z ]);
		}
		
		if (this.last_points.length > 0)
		{
			a = this.last_points;
			b = new_points;
			c = this.color;
			
			for (i=0; i<a.length; i++)
			{
				j = (i + 1) % a.length;
				
				this.triangles.push(
					a[j][0], a[j][1], a[j][2],
					b[i][0], b[i][1], b[i][2],
					a[i][0], a[i][1], a[i][2],
					
					b[j][0], b[j][1], b[j][2],
					b[i][0], b[i][1], b[i][2],
					a[j][0], a[j][1], a[j][2]
				);
				
				this.colors.push(
					c[0], c[1], c[2], 1.0,
					c[0], c[1], c[2], 1.0,
					c[0], c[1], c[2], 1.0,
					
					c[0], c[1], c[2], 1.0,
					c[0], c[1], c[2], 1.0,
					c[0], c[1], c[2], 1.0
				);
			}
		}
		
		if (distance)
		{
			this.moveByDistance(distance);
		}
		
		this.last_points = new_points;
	}
	
	this.close = function(distance)
	{
		// TODO: this will make the triangle pairs overlap! but... it's cheap
		this.makeSlice(0, distance);
	}
	
	this.getData = function()
	{
		return [
			this.triangles,
			this.colors
		];
	}
	
	this.generate = function(recipe, body_register_function)
	{
		var bodies;
		
		bodies = [];
		
		a = new ArbitaryArray(recipe);
		while (!a.eof())
		{
			switch (a.readOne())
			{
				case 1:
					this.clear();
				break;
				
				case 5:
					this.regularPolygon(a.readOne(), a.readOne());
				break;
				
				case 2:
					this.makeSlice(a.readOne() / 10, a.readOne() / 10);
				break;
				
				case 3:
					this.close(a.readOne() / 10);
				break;
				
				case 4:
					id = body_register_function(this.triangles, this.colors);
					bodies.push(new Body(a.readOne() - 1, id, 8));
				break;
				
				case 14:
					this.color = [ 0.7, 0.7, 0.7 ];
				break;
				
				case 15:
					this.color = [ 0.1, 0.2, 0.8 ];
				break;
			}
		}
		
		return bodies;
	}
}
