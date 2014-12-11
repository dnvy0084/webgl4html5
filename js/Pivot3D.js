
__pivot3dPrototype = 
{
	__init: function()
	{
		var a = [
			"x", "y", "z", 
			"rotationX", "rotationY", "rotationZ",
			"scaleX", "scaleY", "scaleZ",
		];

		for( var i = a.length; i--; )
		{
			this.__defineGetter__( a[i], this[ "_get" + a[i] ] );
			this.__defineSetter__( a[i], this[ "_set" + a[i] ] );
		}

		this.mat = mat4.create();
		this.RAD = 1.0 * Math.PI / 180;

		this._rotationX = 
		this._rotationY =
		this._rotationZ = 0.0;

		this._scaleX = 
		this._scaleY = 
		this._scaleZ = 1.0;
	},


	/**
	 * x
	 */
	_getx: function()
	{
		return this.mat[12];
	},

	_setx: function( value )
	{
		this.mat[12] = value;
	},


	/**
	 * y
	 */
	_gety: function()
	{
		return this.mat[13];
	},

	_sety: function( value )
	{
		this.mat[13] = value;
	},


	/**
	 * z
	 */
	_getz: function()
	{
		return this.mat[14];
	},

	_setz: function( value )
	{
		this.mat[14] = value;
	},



	_getrotationX: function()
	{
		return this._rotationX;
	},

	_setrotationX: function( value )
	{
		this._rotationX = value;

		mat4.rotateX( this.mat, this.mat, value * this.RAD );
	},

	_getrotationY: function()
	{
		return this._rotationY;	
	},

	_setrotationY: function( value )
	{
		this._rotationY = value;

		mat4.rotateY( this.mat, this.mat, value * this.RAD );
	},

	_getrotationZ: function()
	{
		return this._rotationZ;	
	},

	_setrotationZ: function( value )
	{
		this._rotationZ = value;

		mat4.rotateZ( this.mat, this.mat, value * this.RAD );
	},



	_getscaleX: function()
	{
		return this._scaleX;
	},

	_setscaleX: function( value )
	{
		this._scaleX = value;

		mat4.scale( this.mat, this.mat, [ value, this.scaleY, this.scaleZ ] );
	},

	_getscaleY: function()
	{
		return this._scaleY;
	},

	_setscaleY: function( value )
	{
		this._scaleY = value;

		mat4.scale( this.mat, this.mat, [ this.scaleX, value, this.scaleZ ] );
	},
	
	_getscaleZ: function()
	{
		return this._scaleZ;
	},

	_setscaleZ: function( value )
	{
		this._scaleZ = value;

		mat4.scale( this.mat, this.mat, [ this.scaleX, value, this.scaleZ ] );
	},
	
};

function Pivot3D( x, y, z )
{
	this.__init();

	this.x = x;
	this.y = y;
	this.z = z;
}

Pivot3D.prototype = __pivot3dPrototype;