
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