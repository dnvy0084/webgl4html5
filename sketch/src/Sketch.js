
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