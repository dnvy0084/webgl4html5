

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