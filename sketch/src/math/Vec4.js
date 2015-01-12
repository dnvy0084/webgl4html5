
SKETCH.Vec4 = function( rawData )
{
	if( rawData !== "undefined" )
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