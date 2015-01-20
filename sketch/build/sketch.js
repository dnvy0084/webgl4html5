
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


/*************************************************
*
* Vector 2
*
*************************************************/

SKETCH.Vec2 = function( x, y )
{
	this._x = x || 0;
	this._y = y || 0;
};

SKETCH.Vec2.prototype = 
{
	constructor: SKETCH.Vec2,

	get x()
	{
		return this._x;
	},
	set x( value )
	{
		this._x = value;
	},

	get y()
	{
		return this._y;
	},
	set y( value )
	{
		this._y = value;
	},

	get length()
	{
		return Math.sqrt( this._x * this._x + this._y * this._y );
	},
}

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


SKETCH.Vec4.prototype = 
{
	constructor: SKETCH.Vec4,

	set: function( value )
	{
		if( value.constructor !== Float32Array )
			throw new Error( "must be the Float32Array" );
 
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
	
	get w(){ return this.rawData[3] },
	set w( value ){ this.rawData[3] = value },

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

	var len = SKETCH.Pixel.rasterize( ax, ay, bx, by, cx, cy, frags );

	for( var i = 0; i < len; i += 2 )
	{
		this.evaluatePixel( frags[i], frags[i+1], varying );
	}
};