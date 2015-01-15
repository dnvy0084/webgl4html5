
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
SKETCH.CanvasRenderer.prototype.rasterize = function( triangle )
{
	var a = new SKETCH.Vec4( this.projectionTo(triangle[0]) ),
	 	b = new SKETCH.Vec4( this.projectionTo(triangle[1]) ),
	 	c = new SKETCH.Vec4( this.projectionTo(triangle[2]) );

	// sort points in order y value;
	var arr = [ a, b, c ];

	arr.sort( 
		function( a, b )
		{
			return a.y < b.y ? -1 : parseInt( a.y > b.y );
		}
	);

	a = arr[0];
	b = arr[1];
	c = arr[2];

	console.log( "(" + a.x, a.y + ")" );
	console.log( "(" + b.x, b.y + ")" );
	console.log( "(" + c.x, c.y + ")" );

	var slopeAB = ( b.x - a.x ) / Math.abs( b.y - a.y );
	var slopeAC = ( c.x - a.x ) / Math.abs( c.y - a.y );

	if( Math.abs(slopeAB) === Infinity ) slopeAB = 0;
	if( Math.abs(slopeAC) === Infinity ) slopeAC = 0;

	var y = a.y;
	var x, tx, dx, x0 = a.x, x1 = a.x;

	for( ; y <= b.y; y++ )
	{
		if( b.x < c.x ) x = x0, tx = x1;
		else 			x = x1, tx = x0;

		console.log( "y:", y, "x0:", x0, "x1:", x1, "start:", x, "dest:", tx );

		for( ; x <= tx; x++ )
		{
			this.evaluatePixel( x, y );
		}

		x0 += slopeAB;
		x1 += slopeAC;
	}

	console.log( "---------------------------------------------" );

	var slopeCA = ( a.x - c.x ) / Math.abs( a.y - c.y );
	var slopeCB = ( b.x - c.x ) / Math.abs( b.y - c.y );

	if( Math.abs(slopeCA) === Infinity ) slopeCA = 0;
	if( Math.abs(slopeCB) === Infinity ) slopeCB = 0;

	y = c.y;
	x0 = c.x, x1 = c.x;

	for( ; y >= b.y; y-- )
	{
		if( b.x < a.x ) x = x0, tx = x1;
		else 			x = x1, tx = x0;

		console.log( "y:", y, "x0:", x0, "x1:", x1, "start:", x, "dest:", tx, "CA", slopeCA, "CB", slopeCB );

		for( ; x <= tx; x++ )
		{
			this.evaluatePixel( x, y );
		}

		x1 += slopeCA;
		x0 += slopeCB;
	}
};

SKETCH.CanvasRenderer.prototype.projectionTo = function( vertex )
{
	return new Float32Array([
		parseInt( vertex[0] * ( this.col - 1 ) ),
		parseInt( vertex[1] * ( this.row - 1 ) ),
		vertex[2] || 0.0,
		vertex[3] || 1.0
	])
};