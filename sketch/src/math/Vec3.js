
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