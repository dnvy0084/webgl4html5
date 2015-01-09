
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
* AsciiRenderer
*
*************************************************/

SKETCH.AsciiRenderer = function( col, row, font, verticalSpace, horizontalSpace, fillStyle, strokeStyle )
{
	SKETCH.DisplayObject.call( this );

	this.row = parseInt( row ) || 50;
	this.col = parseInt( col ) || 50;
	this.font = font || "10px dotum";
	this.verticalSpace = verticalSpace || 10;
	this.horizontalSpace = horizontalSpace || 10;
	this.fillStyle = fillStyle;
	this.strokeStyle = strokeStyle;
	this.backgroundText = "";
	this.renderText = "";
	this.mem = [];
	this.uniform = {};

	if( typeof this.fillStyle === "undefined" && typeof this.strokeStyle === "undefined" )
		this.fillStyle = "#3d3d3d";

	this.clearChar( "-" );
	this.clear();
};

/*************************************************
*
* AsciiRenderer
*
*************************************************/

SKETCH.AsciiRenderer.prototype = Object.create( SKETCH.DisplayObject.prototype );

SKETCH.AsciiRenderer.prototype.clearChar = function( c )
{
	this.backgroundText = "";

	for( var i = 0; i < this.row * this.col; i++ )
	{
		this.backgroundText += c;
	};
};

SKETCH.AsciiRenderer.prototype.clear = function()
{
	this.renderText = this.backgroundText;
};

SKETCH.AsciiRenderer.prototype.render = function( context )
{
	this.update();

	context.save();

	context.font = this.font;
	context.fillStyle = this.fillStyle;
	context.textAlign = "left";
	context.textBaseline = "top";

	context.transform( 1,0,0,1, this.x, this.y );

	var n;

	for( var y = 0; y < this.row; y++ )
	{
		for( var x = 0; x < this.col; x++ )
		{
			n = y * this.col + x;

			context.fillText ( 
				this.renderText[n], 
				this.horizontalSpace * x,
				this.verticalSpace * y
			);
		}
	}

	context.restore();
};

SKETCH.AsciiRenderer.prototype.vertexShader = function()
{
	var pos = arguments[0];
	var color = arguments[1];
	var uv = arguments[2];

	console.log( pos, color, uv );
};

SKETCH.AsciiRenderer.prototype.fragmentShader = function()
{

};

SKETCH.AsciiRenderer.prototype.vertexAttribPointer = function( buf, index, size, stride, offset )
{
	var vo = {};

	vo.buf = buf;
	vo.index = index || 0;
	vo.size = size || 3;
	vo.stride = stride || 3;
	vo.offset = offset || 0;

	this.mem.push( vo );
};

SKETCH.AsciiRenderer.prototype.setUniform = function( key, value )
{
	this.uniform[ key ] = value;
};

SKETCH.AsciiRenderer.prototype.drawTriangles = function( indices, count, offset )
{
	count = count || 3;
	offset = offset || 0;

	var vo, vertexargs, bufOffset;

	for( var i = offset; i < offset + count; i += 3 )
	{
		for( var m = i; m < i + 3; m++ )
		{
			vertexargs = [];

			for( var j = 0; j < this.mem.length; j++ )
			{
				vo = this.mem[j];

				bufOffset = indices[m] * vo.stride + vo.offset;

				vertexargs[ vo.index ] = vo.buf.subarray( bufOffset, bufOffset + vo.size );
			}

			this.vertexShader.apply( this, vertexargs );
		}
	}

	this.mem = [];
	this.uniform = {};
};