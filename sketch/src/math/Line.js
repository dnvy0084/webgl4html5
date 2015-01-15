
SKETCH.Line = function(){};

SKETCH.Line.lineTo = function( ax, ay, bx, by, vector, offset )
{
	vector = vector || [];
	offset = offset || 0;

	var e = 0, p = offset;
		dx = Math.abs( bx - ax ),
		dy = Math.abs( by - ay );

	var d, t, x = ax, y = ay, cmp;

	if( dx > dy )
	{
		d = by - ay > 0 ?  1 : -1;
		di = bx - ax > 0 ? 1 : -1;
		cmp = di == 1 ? SKETCH.Line.cmplt : SKETCH.Line.cmpgt;

		for( ; cmp( x, bx ); x += di )
		{
			vector[ p++ ] = x;
			vector[ p++ ] = y;

			e += dy

			if( e << 1 > dx )
			{
				y += d;
				e -= dx;
			}
		}
	}
	else
	{
		d = bx - ax > 0 ?  1 : -1;
		di = by - ay > 0 ? 1 : -1;
		cmp = di == 1 ? SKETCH.Line.cmplt : SKETCH.Line.cmpgt;

		for( ; cmp( y, by ); y += di )
		{
			vector[ p++ ] = x;
			vector[ p++ ] = y;

			e += dx;

			if( e << 1 > dy )
			{
				x += d;
				e += -dy;
			}
		}
	}

	return p;
}

SKETCH.Line.cmplt = function( a, b )
{
	return a <= b;
};

SKETCH.Line.cmpgt = function( a, b )
{
	return a >= b;
};