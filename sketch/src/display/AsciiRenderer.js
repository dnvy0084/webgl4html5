
/*************************************************
*
* AsciiRenderer
*
*************************************************/

SKETCH.AsciiRenderer = function( col, row, font, verticalSpace, horizontalSpace, fillStyle, strokeStyle )
{
	SKETCH.DisplayObject.call( this );

	this.row = parseInt( row ) || 50;
	this.col = parseInt( col ) || 50;
	this.font = font || "10px dotum";
	this.verticalSpace = verticalSpace || 10;
	this.horizontalSpace = horizontalSpace || 10;
	this.fillStyle = fillStyle;
	this.strokeStyle = strokeStyle;
	this.backgroundText = "";
	this.renderText = "";
	this.mem = [];
	this.uniform = {};

	if( typeof this.fillStyle === "undefined" && typeof this.strokeStyle === "undefined" )
		this.fillStyle = "#3d3d3d";

	this.clearChar( "-" );
	this.clear();
};

/*************************************************
*
* AsciiRenderer
*
*************************************************/

SKETCH.AsciiRenderer.prototype = Object.create( SKETCH.DisplayObject.prototype );

SKETCH.AsciiRenderer.prototype.clearChar = function( c )
{
	this.backgroundText = "";

	for( var i = 0; i < this.row * this.col; i++ )
	{
		this.backgroundText += c;
	};
};

SKETCH.AsciiRenderer.prototype.clear = function()
{
	this.renderText = this.backgroundText;
};

SKETCH.AsciiRenderer.prototype.render = function( context )
{
	this.update();

	context.save();

	context.font = this.font;
	context.fillStyle = this.fillStyle;
	context.textAlign = "left";
	context.textBaseline = "top";

	context.transform( 1,0,0,1, this.x, this.y );

	var n;

	for( var y = 0; y < this.row; y++ )
	{
		for( var x = 0; x < this.col; x++ )
		{
			n = y * this.col + x;

			context.fillText ( 
				this.renderText[n], 
				this.horizontalSpace * x,
				this.verticalSpace * y
			);
		}
	}

	context.restore();
};

SKETCH.AsciiRenderer.prototype.vertexShader = function()
{
	var pos = arguments[0];
	var color = arguments[1];
	var uv = arguments[2];

	console.log( pos, color, uv );

	return [ pos[0], pos[1], pos[2], 1.0 ];
};

SKETCH.AsciiRenderer.prototype.fragmentShader = function()
{

};

SKETCH.AsciiRenderer.prototype.vertexAttribPointer = function( buf, index, size, stride, offset )
{
	var vo = {};

	vo.buf = buf;
	vo.index = index || 0;
	vo.size = size || 3;
	vo.stride = stride || 3;
	vo.offset = offset || 0;

	this.mem.push( vo );
};

SKETCH.AsciiRenderer.prototype.setUniform = function( key, value )
{
	this.uniform[ key ] = value;
};

SKETCH.AsciiRenderer.prototype.drawTriangles = function( indices, count, offset )
{
	count = count || 3;
	offset = offset || 0;

	var vo, vertexargs, bufOffset;

	for( var i = offset; i < offset + count; i += 3 )
	{
		for( var m = i; m < i + 3; m++ )
		{
			vertexargs = [];

			for( var j = 0; j < this.mem.length; j++ )
			{
				vo = this.mem[j];

				bufOffset = indices[m] * vo.stride + vo.offset;

				vertexargs[ vo.index ] = vo.buf.subarray( bufOffset, bufOffset + vo.size );
			}

			this.vertexShader.apply( this, vertexargs );
		}
	}

	this.mem = [];
	this.uniform = {};
};