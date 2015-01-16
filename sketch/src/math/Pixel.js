
SKETCH.Pixel = function(){};

SKETCH.Pixel.lineTo = function( ax, ay, bx, by, vector, offset )
{
	vector = vector || [];
	offset = offset || 0;

	var e = 0, p = offset;
		dx = Math.abs( bx - ax ),
		dy = Math.abs( by - ay );

	var ix, iy, t, x = ax, y = ay, cmp;

	if( dx > dy )
	{
		iy = by > ay ? 1 : -1;
		ix = bx > ax ? 1 : -1;
		t = bx + ix;

		for( ; x != t; x += ix )
		{
			vector[ p++ ] = x;
			vector[ p++ ] = y;

			e += dy;

			if( e << 1 > dx )
			{
				y += iy;
				e -= dx;
			}
		}
	}
	else
	{
		iy = bx > ax ?  1 : -1;
		ix = by > ay ? 1 : -1;
		t = by + ix;

		for( ; y != t; y += ix )
		{
			vector[ p++ ] = x;
			vector[ p++ ] = y;

			e += dx;

			if( e << 1 > dy )
			{
				x += iy;
				e += -dy;
			}
		}
	}

	return p;
};


// ( ay <= by <= cy ) need to sort by y value
SKETCH.Pixel.rasterize = function( ax, ay, bx, by, cx, cy, pixels, offset )
{
	// console.log( 
	// 	"A(%d,%d), B(%d,%d), C(%d,%d)",
	// 	ax, ay, bx, by, cx, cy
	// );

	pixels = pixels || [];
	offset = offset || 0;

	var x, y = ay, t = cy, vector, p, v, 
		minX = 0xffffff, maxX = -0xffffff,
		vectors = [ [], [], [] ],
		points = [ 1, 1, 1 ],
		lengths = [ 
			SKETCH.Pixel.lineTo( ax, ay, bx, by, vectors[0] ), 
			SKETCH.Pixel.lineTo( ax, ay, cx, cy, vectors[1] ), 
			SKETCH.Pixel.lineTo( bx, by, cx, cy, vectors[2] ) 
		];

	for( ; y <= t; y++ )
	{
		minX = 0xffffff;
		maxX = -1;

		for( var n = vectors.length; n--; )
		{
			vector = vectors[n];

			for( ;; points[n] += 2 )
			{
				if( p = points[n], p >= lengths[n] ) break;
				if( vector[p] != y ) break;

				v = vector[p-1];

				if( v < minX ) minX = v;
				if( v > maxX ) maxX = v;

				//console.log( "y(%d)->t(%d), n: %d, p: %d, value: %d", y, t, n, p, vector[p] );
			}
		}

		//console.log( "min(%d)-->max(%d)", minX, maxX );

		for( x = minX; x <= maxX; x++ )
		{
			pixels[ offset++ ] = x;
			pixels[ offset++ ] = y;
		}
	}

	return offset;
};
