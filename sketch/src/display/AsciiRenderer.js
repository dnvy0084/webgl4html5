
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
	this.uniform = [];

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

SKETCH.AsciiRenderer.prototype.evaluateVertex = function( va, vc )
{
	if( typeof this.vertexProgram === "undefined" )
	{
		console.log( "Cannot find VertexShader, substitution defalut shader" );

		this.vertexProgram = function( va, vc )
		{
			console.log( va, vc );
		}
	}

	return this.vertexProgram.apply( this, [ va, vc ] );
};

SKETCH.AsciiRenderer.prototype.evaluatePixel = function( x, y )
{
	if( typeof this.fragmentProgram === "undefined" )
	{
		console.log( "Cannot find FragmentShader, substitution default shader" );

		this.fragmentProgram = function()
		{
			return "X";
		}
	}

	if( x < 0 || x >= this.col ) return;
	if( y < 0 || y >= this.row ) return;

	var oc = this.fragmentProgram.apply( this, [ x, y ] );

	this.renderText = this.replaceAt( this.renderText, y * this.col + x, oc );

	//console.log( this.renderText.length );
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

SKETCH.AsciiRenderer.prototype.setUniform = function( index, value )
{
	this.uniform[ index ] = value;
};

SKETCH.AsciiRenderer.prototype.drawTriangles = function( indices, count, offset )
{
	count = count || 3;
	offset = offset || 0;

	var vo, va, bufOffset, evaluatedVertices = [];

	for( var i = offset; i < offset + count; i += 3 )
	{
		evaluatedVertices.length = 0;

		for( var m = i; m < i + 3; m++ )
		{
			va = [];

			for( var j = 0; j < this.mem.length; j++ )
			{
				vo = this.mem[j];

				bufOffset = indices[m] * vo.stride + vo.offset;

				va[ vo.index ] = vo.buf.subarray( bufOffset, bufOffset + vo.size );
			}

			evaluatedVertices.push( this.evaluateVertex( va, this.uniform ) );
		}

		this.rasterize( evaluatedVertices );
	}

	this.mem = [];
	this.uniform = [];
};


/**
*	Standard Rasterization Algorithm
*/
SKETCH.AsciiRenderer.prototype.rasterize = function( triangle )
{
	var a = new SKETCH.Vec4( this.projectionTo(triangle[0]) ),
	 	b = new SKETCH.Vec4( this.projectionTo(triangle[1]) ),
	 	c = new SKETCH.Vec4( this.projectionTo(triangle[2]) );

	// sort points in order y value;
	var arr = [ a, b, c ];

	arr.sort( 
		function( a, b )
		{
			return a.y < b.y ? -1 : parseInt( a.y > b.y );
		}
	);

	a = arr[0];
	b = arr[1];
	c = arr[2];

	// console.log( "(" + a.x, a.y + ")" );
	// console.log( "(" + b.x, b.y + ")" );
	// console.log( "(" + c.x, c.y + ")" );

	var slopeAB = ( b.x - a.x ) / Math.abs( b.y - a.y );
	var slopeAC = ( c.x - a.x ) / Math.abs( c.y - a.y );

	if( Math.abs(slopeAB) === Infinity ) slopeAB = 0;
	if( Math.abs(slopeAC) === Infinity ) slopeAC = 0;

	var y = a.y;
	var x, tx, dx, x0 = a.x, x1 = a.x;

	for( ; y <= b.y; y++ )
	{
		if( b.x < c.x ) x = x0, tx = x1;
		else 			x = x1, tx = x0;

		//console.log( "y:", y, "x0:", x0, "x1:", x1, "start:", x, "dest:", tx );

		for( ; x <= tx; x++ )
		{
			this.evaluatePixel( x, y );
		}

		x0 += slopeAB;
		x1 += slopeAC;
	}

	//console.log( "---------------------------------------------" );

	var slopeCA = ( a.x - c.x ) / Math.abs( a.y - c.y );
	var slopeCB = ( b.x - c.x ) / Math.abs( b.y - c.y );

	if( Math.abs(slopeCA) === Infinity ) slopeCA = 0;
	if( Math.abs(slopeCB) === Infinity ) slopeCB = 0;

	y = c.y;
	x0 = c.x, x1 = c.x;

	for( ; y >= b.y; y-- )
	{
		if( b.x < a.x ) x = x0, tx = x1;
		else 			x = x1, tx = x0;

		//console.log( "y:", y, "x0:", x0, "x1:", x1, "start:", x, "dest:", tx, "CA", slopeCA, "CB", slopeCB );

		for( ; x <= tx; x++ )
		{
			this.evaluatePixel( x, y );
		}

		x1 += slopeCA;
		x0 += slopeCB;
	}
};

SKETCH.AsciiRenderer.prototype.projectionTo = function( vertex )
{
	return new Float32Array([
		parseInt( vertex[0] * ( this.col - 1 ) ),
		parseInt( vertex[1] * ( this.row - 1 ) ),
		vertex[2] || 0.0,
		vertex[3] || 1.0
	])
}


SKETCH.AsciiRenderer.prototype.replaceAt = function( str, index, c )
{
	return str.substr( 0, index ) + c + str.substr( index + 1, str.length );
};