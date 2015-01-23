/*************************************************
*
* Opcodes methods for shader program;
*
*************************************************/

var OP = { version: "Sketch opcodes for shader program Ver. 1.0.0" };



/*************************************************
*
* Opcodes methods - arithmetic
*
*************************************************/

/**
 *	a + b
 */
OP.add = function( a, b, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = a[i] + b[i];
	}

	return dest;
};


/**
 *	a - b
 */
OP.sub = function( a, b, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = a[i] - b[i];
	}

	return dest;
};


/**
 *	a * b
 */
OP.mul = function( a, b, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = a[i] * b[i];
	}

	return dest;
};

/**
 *	a / b
 */
OP.div = function( a, b, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = a[i] / b[i];
	}

	return dest;
};

/**
 *	1 / a
 */
OP.rcp = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = 1 / a[i];
	}

	return dest;
};

/**
 *	a - floor(a)
 */
OP.frc = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = a[i] - parseInt( a[i] );
	}

	return dest;
};

/**
 *	-a
 */
OP.neg = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = -a[i];
	}

	return dest;
};



/*************************************************
*
* Opcodes methods - trigonometric
*
*************************************************/

/**
 *	sin(a);
 */
OP.sin = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = Math.sin( a[i] );
	}

	return dest;
};

/**
 *	cos(a);
 */
OP.frc = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = Math.cos( a[i] );
	}

	return dest;
};

/*************************************************
*
* Opcodes methods - algebraic
*
*************************************************/

/**
 *	minimum between a and b
 */
OP.min = function( a, b, dest )
{
	dest = dest || a;

	var v0, v1;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		v0 = a[i], v1 = b[i];

		dest[i] = v0 <= v1 ? v0 : v1;
	}

	return dest;
};


/**
 *	maximum between a and b
 */
OP.max = function( a, b, dest )
{
	dest = dest || a;

	var v0, v1;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		v0 = a[i], v1 = b[i];

		dest[i] = v0 >= v1 ? v0 : v1;
	}

	return dest;
};


/**
 *	Math.sqrt, component-wise
 */
OP.sqrt = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = Math.sqrt( a[i] );
	}

	return dest;
};


/**
 *	1 / Math.sqrt, component-wise
 */
OP.rsq = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = 1 / Math.sqrt( a[i] );
	}

	return dest;
};


/**
 *	Math.pow, component-wise
 */
OP.pow = function( a, value, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		if( typeof a[i] === "undefined" ) break;

		dest[i] = Math.pow( a[i], value );
	}

	return dest;
};


/**
 *	Math.log2, component-wise
 */
OP.log = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = Math.log2( a[i] );
	}

	return dest;
};


/**
 *	Math.exp, component-wise
 */
OP.exp = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = Math.exp( a[i] );
	}

	return dest;
};


/**
 *	normalize
 */
OP.nrm = function( a, dest )
{
	dest = dest || a;

	var len = 0;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		var x = a[i];

		len += x*x;
	}

	if( len == 0 ) return;

	len = 1 / Math.sqrt( len );

	for( i = 0; i < n; i++ )
	{
		dest[i] = a[i] * len;
	}

	return dest;
};


/**
 *	Math.abs, component-wise
 */
OP.abs = function( a, dest )
{
	dest = dest || a;
	
	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = a[i] >= 0 ? a[i] : -a[i];
	}

	return dest;
};


/**
 *	Math.min( 1.0, Math.max( 0.0, n ) ), component-wise
 */
OP.sat = function( a, dest )
{
	dest = dest || a;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		dest[i] = Math.min( 1.0, Math.max( 0.0, a[i] ) );
	}

	return dest;
};




/*************************************************
*
* Opcodes methods - vector and matrix
*
*************************************************/

OP.crs = function( a, b, dest )
{
	
}

OP.dot = function( a, b )
{
	var value = 0;

	for( var i = 0, n = a.length; i < n; i++ )
	{
		value += a[i] * b[i];
	}

	return value;
}

OP.mat = function( a, m, dest )
{
	dest = dest || a;

	var b = [];

	for( var i = 0, n = a.length; i < n; i++ ) 
		b[i] = a[i];

	for( i = 0; i < n; i++ )
	{
		dest[i] = 0;

		for( var j = 0; j < n; j++ )
		{
			dest[i] += m[ i + j * 4 ] * b[j];
		}
	}

	return dest;
}