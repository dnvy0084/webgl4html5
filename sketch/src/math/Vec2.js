
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