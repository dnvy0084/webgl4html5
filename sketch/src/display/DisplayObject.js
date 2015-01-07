
SKETCH.DisplayObject = function() 
{
	SKETCH.EventDispatcher.call( this );

	this.__init();
};

SKETCH.DisplayObject.prototype = Object.create( SKETCH.EventDispatcher.prototype );

SKETCH.DisplayObject.prototype.__init = function()
{
	
};