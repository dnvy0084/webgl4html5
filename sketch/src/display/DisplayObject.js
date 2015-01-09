
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