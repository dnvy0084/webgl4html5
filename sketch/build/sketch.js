
/*************************************************
*
* Graphics library
*
*************************************************/

var SKETCH = { version: "Sketch lib 1.0.0" };


SKETCH.RAD = 1 * Math.PI / 180;

SKETCH.context2d = null;
SKETCH.context3d = null;

SKETCH.defineProperty = function( o, property, getter, setter )
{
	if( typeof getter === "function" )
		o.__defineGetter__( property, getter );

	if( typeof setter === "function" )
		o.__defineSetter__( property, setter );
};

SKETCH.defineProperties = function( o, propertyNames, getters, setters )
{
	getters = getters || [];
	setters = setters || [];

	for( var i = 0; i < propertyNames.length; i++ )
	{
		SKETCH.defineProperty( o, propertyNames[i], getters[i], setters[i] );
	}
};


SKETCH.error = function( message )
{
	throw new Error( message );
};

SKETCH.errorCallback = function( message )
{
	return function()
	{
		SKETCH.error( message );
	}
}

SKETCH.assert = function( assertion, message )
{
	if( !assertion )
		SKETCH.error( "Assertion Error: " + message );
};

SKETCH.Mat4 = function()
{
	this.rawData = new Float32Array([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	]);
}

SKETCH.Mat4.prototype = 
{
	constructor: SKETCH.Mat4,

	add: function( b )
	{

	},

	sub: function( b )
	{

	},

	mul: function( b )
	{

	},

	mulScalar: function( scalar )
	{

	},

	translate: function( x, y, z )
	{
		x = x || 0;
		y = y || 0;
		z = z || 0;

		this.rawData[12] += x;
		this.rawData[13] += y;
		this.rawData[14] += z;
	},

	rotationX: function( rad )
	{

	}
};
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

SKETCH.Pixel = function(){};

SKETCH.Pixel.lineTo = function( ax, ay, bx, by, vector, offset )
{
	vector = vector || [];
	offset = offset || 0;

	var e = 0,
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
			vector[ offset++ ] = x;
			vector[ offset++ ] = y;

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
			vector[ offset++ ] = x;
			vector[ offset++ ] = y;

			e += dx;

			if( e << 1 > dy )
			{
				x += iy;
				e -= dy;
			}
		}
	}

	return offset;
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


/*************************************************
*
* Vector3( x, y, z )
*
*************************************************/

SKETCH.Vec3 = function( rawData )
{
	if( typeof rawData !== "undefined" )
	{
		this.set( rawData );
	}
	else
	{
		this.rawData = new Float32Array( 3 );
	}
};

SKETCH.Vec3.random = function( min, max )
{
	min = min || 0;
	max = max || 1.0;

	d = max - min;

	return new SKETCH.Vec4([
		min + d * Math.random(),
		min + d * Math.random(),
		min + d * Math.random()
	])
};

SKETCH.Vec3.prototype = 
{
	constructor: SKETCH.Vec3,

	set: function( value )
	{
		if( value.constructor == SKETCH.Vec3 ||
			value.constructor == SKETCH.Vec4 )
		{
			this.set( value.rawData );
			return;
		}

		if( value.constructor !== Float32Array && 
			value.constructor !== Array )
			throw new Error( "unrecognized constructor, cannot convert Vec3" );
 
		this.rawData = new Float32Array(4);

		for( var i = 0; i < 4; i++ )
		{
			this.rawData[i] = typeof value[i] !== "undefined" ? value[i] : 0.0;
		}
	},

	get x(){ return this.rawData[0] },
	set x( value ){ this.rawData[0] = value }, 

	get y(){ return this.rawData[1] },
	set y( value ){ this.rawData[1] = value }, 

	get z(){ return this.rawData[2] },
	set z( value ){ this.rawData[2] = value },

	length: function()
	{
		var x = this.x,
			y = this.y,
			z = this.z;

		return Math.sqrt( x*x + y*y + z*z );
	},

	add: function( v )
	{
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	},

	sub: function( v )
	{
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	},

	mul: function( v )
	{
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
	},

	div: function( v )
	{
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
	},

	scale: function( n )
	{
		this.x *= n;
		this.y *= n;
		this.z *= n;
	},

	negate: function()
	{
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
	},

	dot: function( v )
	{
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},

	normalize: function()
	{
		var x = this.x,
			y = this.y,
			z = this.z;

		var len = x*x + y*y + z*z;

		if( len <= 0 ) return;

		len = 1 / Math.sqrt( len );

		this.x = x * len;
		this.y = y * len;
		this.z = z * len;
	},
}


/*************************************************
*
* Vector4( x, y, z, w )
*
*************************************************/

SKETCH.Vec4 = function( rawData )
{
	if( typeof rawData !== "undefined" )
	{
		this.set( rawData );
	}
	else
	{
		this.rawData = new Float32Array(4);
	}
};

SKETCH.Vec4.random = function( min, max )
{
	min = min || 0;
	max = max || 1.0;

	d = max - min;

	return new SKETCH.Vec4([
		min + d * Math.random(),
		min + d * Math.random(),
		min + d * Math.random(),
		min + d * Math.random()
	])
};


SKETCH.Vec4.prototype = 
{
	constructor: SKETCH.Vec4,

	set: function( value )
	{
		if( value.constructor == SKETCH.Vec3 ||
			value.constructor == SKETCH.Vec4 )
		{
			this.set( value.rawData );
			return;
		}
			
		if( value.constructor !== Float32Array && 
			value.constructor !== Array )
			throw new Error( "unrecognized constructor, cannot convert Vec4" );
 
		this.rawData = new Float32Array(4);

		var defaultValues = [ 0, 0, 0, 1 ];

		for( var i = 0; i < 4; i++ )
		{
			this.rawData[i] = typeof value[i] !== "undefined" ? value[i] : defaultValues[i];
		}
	},

	get x(){ return this.rawData[0] },
	set x( value ){ this.rawData[0] = value }, 

	get y(){ return this.rawData[1] },
	set y( value ){ this.rawData[1] = value }, 

	get z(){ return this.rawData[2] },
	set z( value ){ this.rawData[2] = value }, 
	
	get w(){ return this.rawData[3] },
	set w( value ){ this.rawData[3] = value },

	dot: function( vec4 )
	{
		return this.x * vec4.x + this.y * vec4.y + this.z * vec4.z + this.w * vec4.w;
	},

	add: function( vec4 )
	{
		this.x += vec4.x;
		this.y += vec4.y;
		this.z += vec4.z;
		this.w += vec4.w;
	},

	sub: function( vec4 )
	{
		this.x -= vec4.x;
		this.y -= vec4.y;
		this.z -= vec4.z;
		this.w -= vec4.w;
	},

	mul: function( vec4 )
	{
		this.x *= vec4.x;
		this.y *= vec4.y;
		this.z *= vec4.z;
		this.w *= vec4.w;
	},

	div: function( vec4 )
	{
		this.x /= vec4.x;
		this.y /= vec4.y;
		this.z /= vec4.z;
		this.w /= vec4.w;
	},

	scale: function( value )
	{
		this.x *= value;
		this.y *= value;
		this.z *= value;
		this.w *= value;
	},

	normalize: function()
	{
		var x = this.x,
			y = this.y,
			z = this.z,
			w = this.w;

		var len = x*x + y*y + z*z + w*w;

		if( len <= 0 ) return;

		len = 1 / Math.sqrt( len );

		this.x *= len;
		this.y *= len;
		this.z *= len;
		this.w *= len;
	},

	length: function()
	{
		return Math.sqrt(
			this.x * this.x +
			this.y * this.y +
			this.z * this.z +
			this.w * this.w 
		)
	},

	negate: function()
	{
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		this.w = -this.w;
	},

	transformMat4: function( m )
	{
		var _x = this.x, _y = this.y, _z = this.z, _w = this.w;

		var x = m[0] * _x + m[4] * _y + m[8] * _z + m[12] * _w,
			y = m[1] * _x + m[5] * _y + m[9] * _z + m[13] * _w,
			z = m[2] * _x + m[6] * _y + m[10] * _z + m[14] * _w,
			w = m[3] * _x + m[7] * _y + m[11] * _z + m[15] * _w;

		this.x = x,
		this.y = y,
		this.z = z,
		this.w = w;
	},


	clone: function()
	{
		return new SKETCH.Vec4([
			this.x,
			this.y, 
			this.z,
			this.w
		]);
	},

	toString: function()
	{
		return "[" + this.rawData + "]";
	}
}

/*************************************************
*
* EventDispatcher
*
*************************************************/

SKETCH.EventDispatcher = function() {}

SKETCH.EventDispatcher.prototype = {

	constructor: SKETCH.EventDispatcher,

	addEventListener: function( type, listener )
	{
		if( this._listeners === undefined ) 
			this._listeners = {};

		if( this._listeners[ type ] === undefined )
			this._listeners[ type ] = [];

		var listeners = this._listeners[ type ];

		if( listeners.indexOf( listener ) === -1 )
			listeners.push( listener );
	},

	removeEventListener: function( type, listener )
	{
		if( !this.hasEventListener( type ) ) return;

		var index = this._listeners[ type ].indexOf( listener );

		if( index !== -1 )
			this._listeners[ type ].splice( index, 1 );
	},

	hasEventListener: function( type )
	{
		if( this._listeners === undefined || 
			this._listeners[ type ] === undefined ||
			this._listeners[ type ].length === 0 ) 
			return false;

		return true;
	},

	dispatchEvent: function( e )
	{
		if( !this.hasEventListener( e.type ) ) return;

		var listeners = this._listeners[ e.type ];

		var cache = [],
		 	i,
		 	len;

		e.target = this;

		for( i = 0, len = listeners.length; i < len; i++ )
		{
			cache.push( listeners[i] );
		}

		for( i = 0, len = cache.length; i < len; i++ )
		{
			cache[i].apply( this, [e] );
		}
	},
};

/*************************************************
*
* DisplayObject
*
*************************************************/

SKETCH.DisplayObject = function()
{
	SKETCH.EventDispatcher.call( this );

	this._children = [];

	SKETCH.defineProperty( 
		this, 
		"numChildren", 
		function(){
			return this._children.length;
		},
		SKETCH.errorCallback( "read only: DisplayObject.numChildren" )
	)

	this.__initTransform();
};

SKETCH.DisplayObject.prototype = Object.create( SKETCH.EventDispatcher.prototype );

SKETCH.DisplayObject.prototype.__initTransform = function()
{
	this.mat4 = new SKETCH.Mat4();

	this.x = this.y = 0;
	this.scaleX = this.scaleY = 0;
	this.rotation = 0;
	this.alpha = 0;

	SKETCH.defineProperty( 
		this, 
		"transform", 
		function(){
			return this.mat4;
		},
		SKETCH.errorCallback( "read only: DisplayObject.transform" )
	);
};

SKETCH.DisplayObject.prototype.update = function()
{
	this.mat4.translate( this.x, this.y, 0 );
};

SKETCH.DisplayObject.prototype.addChild = function( child, at )
{
	if( child == null ) return;

	if( typeof at === "undefined" ) at = this.numChildren;

	this._children[ at ] = child;

	child.parent = this;
};

SKETCH.DisplayObject.prototype.removeChild = function( childOrIndex )
{
	if( childOrIndex == null ) return;

	if( typeof childOrIndex !== "number" )
	{
		var index = this._children.indexOf( childOrIndex );

		if( index == -1 ) return;

		childOrIndex = index;
	}
	else if( childOrIndex < 0 || childOrIndex >= this.numChildren ) return;

	this._children.splice( childOrIndex, 1 )[0].parent = null;
};

SKETCH.DisplayObject.prototype.contains = function( child )
{
	return this._children.indexOf( child ) != -1;
};

SKETCH.DisplayObject.prototype.getChildAt = function( at )
{
	return this._children[ at ];
};

/*************************************************
*
* CanvasRenderer
*
*************************************************/

SKETCH.CanvasRenderer = function( col, row )
{
	SKETCH.DisplayObject.call( this );

	this.row = parseInt( row ) || 50;
	this.col = parseInt( col ) || 50;
	
	this.backgroundPixel = null;
	this.backgroundPixelInfo = null;

	this.colorBuffer = [];
	this.depthBuffer = new Float32Array( col * row );
	this.mem = [];
	this.uniform = [];
};

/*************************************************
*
* CanvasRenderer
*
*************************************************/

SKETCH.CanvasRenderer.prototype = Object.create( SKETCH.DisplayObject.prototype );

SKETCH.CanvasRenderer.prototype.clearPixel = function( pixel, pixelInfo )
{
	this.backgroundPixel = pixel;
	this.backgroundPixelInfo = pixelInfo;
};

SKETCH.CanvasRenderer.prototype.clear = function()
{
	this.colorBuffer = [];
};

SKETCH.CanvasRenderer.prototype.render = function( context )
{
	this.update();

	context.save();
	context.transform( 1,0,0,1, this.x, this.y );

	this.backgroundPixel.initialize( context );

	var n;

	for( var y = 0; y < this.row; y++ )
	{
		for( var x = 0; x < this.col; x++ )
		{
			n = y * this.col + x;

			if( typeof this.colorBuffer[n] === "undefined" )
			{
				this.backgroundPixel.draw( x, y, this.backgroundPixelInfo, context );
			}
			else
			{
				this.backgroundPixel.draw( x, y, this.colorBuffer[n], context );
			}
		}
	}

	this.backgroundPixel.finalize( context );
	context.restore();
};

SKETCH.CanvasRenderer.prototype.evaluateVertex = function( va, vc, varying )
{
	if( typeof this.vertexProgram === "undefined" )
	{
		console.log( "Cannot find VertexShader, substitution defalut shader" );

		this.vertexProgram = function( va, vc, varying )
		{
			console.log( va, vc );

			return null;
		}
	}

	return this.vertexProgram.apply( this, [ va, vc, varying ] );
};

SKETCH.CanvasRenderer.prototype.evaluatePixel = function( x, y, varying )
{
	if( typeof this.fragmentProgram === "undefined" )
	{
		console.log( "Cannot find FragmentShader, substitution default shader" );

		this.fragmentProgram = function()
		{
			return "X";
		}
	}

	if( x < 0 || x >= this.col ) return;
	if( y < 0 || y >= this.row ) return;

	var oc = this.fragmentProgram.apply( this, [ x, y, varying ] );

	this.colorBuffer[ y * this.col + x ] = oc;
};



SKETCH.CanvasRenderer.prototype.vertexAttribPointer = function( buf, index, size, stride, offset )
{
	var vo = {};

	vo.buf = buf;
	vo.index = index || 0;
	vo.size = size || 3;
	vo.stride = stride || 3;
	vo.offset = offset || 0;

	this.mem.push( vo );
};

SKETCH.CanvasRenderer.prototype.setUniform = function( index, value )
{
	this.uniform[ index ] = value;
};

SKETCH.CanvasRenderer.prototype.drawTriangles = function( indices, count, offset )
{
	count = count || 3;
	offset = offset || 0;

	var vo, va, v, bufOffset, evaluatedVertices = [], varying = [];

	for( var i = offset; i < offset + count; i += 3 )
	{
		evaluatedVertices.length = 0;
		varying.length = 0;

		for( var m = i; m < i + 3; m++ )
		{
			va = [];
			v = [];

			for( var j = 0; j < this.mem.length; j++ )
			{
				vo = this.mem[j];

				bufOffset = indices[m] * vo.stride + vo.offset;

				va[ vo.index ] = vo.buf.subarray( bufOffset, bufOffset + vo.size );
			}

			evaluatedVertices.push( this.evaluateVertex( va, this.uniform, v ) );
			varying.push( v );
		}

		this.rasterize( evaluatedVertices, varying );
	}

	this.mem = [];
	this.uniform = [];
};


/**
*	Standard Rasterization Algorithm
*/
SKETCH.CanvasRenderer.prototype.rasterize = function( triangle, varying )
{
	triangle.sort( 
		function( a, b )
		{
			return a[1] < b[1] ? -1 : Number( a[1] > b[1] );
		}
	);

	var frags = [];

	var w = this.col - 1,
		h = this.row - 1;

	var ax = parseInt( triangle[0][0] * w ),
		ay = parseInt( triangle[0][1] * h ),
		bx = parseInt( triangle[1][0] * w ),
		by = parseInt( triangle[1][1] * h ),
		cx = parseInt( triangle[2][0] * w ),
		cy = parseInt( triangle[2][1] * h );

	//console.log( "A(%d,%d), B(%d,%d), C(%d,%d)", ax, ay, bx, by, cx, cy );

	var len = SKETCH.Pixel.rasterize( ax, ay, bx, by, cx, cy, frags );

	for( var i = 0; i < len; i += 2 )
	{
		this.evaluatePixel( frags[i], frags[i+1], varying );
	}
};