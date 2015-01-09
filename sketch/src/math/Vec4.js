
SKETCH.Vec4 = function()
{
		
};

SKETCH.Vec4.prototype = Object.create( Float32Array.prototype );

SKETCH.Vec4.prototype.set = function( x, y, z, w )
{
	var defaultValue = [ 0, 0, 0, 1 ];

	for( var i = 0; i < 4; i++ )
	{
		this[i] = arguments[i] || defaultValue[i];
	}
};

SKETCH.Vec4.prototype.getX = function()
{
	return this[0];
};