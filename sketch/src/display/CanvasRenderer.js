
/*************************************************
*
* CanvasRenderer
*
*************************************************/

SKETCH.CanvasRenderer = function( col, row )
{
	SKETCH.DisplayObject.call( this );

	this.row = parseInt( row ) || 50;
	this.col = parseInt( col ) || 50;
	
	this.backgroundPixel = null;
	this.backgroundPixelInfo = null;

	this.colorBuffer = [];
	this.depthBuffer = new Float32Array( col * row );
	this.mem = [];
	this.uniform = [];
};

/*************************************************
*
* CanvasRenderer
*
*************************************************/

SKETCH.CanvasRenderer.prototype = Object.create( SKETCH.DisplayObject.prototype );

SKETCH.CanvasRenderer.prototype.clearPixel = function( pixel, pixelInfo )
{
	this.backgroundPixel = pixel;
	this.backgroundPixelInfo = pixelInfo;
};

SKETCH.CanvasRenderer.prototype.clear = function()
{
	this.colorBuffer = [];
};

SKETCH.CanvasRenderer.prototype.render = function( context )
{
	this.update();

	context.save();
	context.transform( 1,0,0,1, this.x, this.y );

	this.backgroundPixel.initialize( context );

	var n;

	for( var y = 0; y < this.row; y++ )
	{
		for( var x = 0; x < this.col; x++ )
		{
			n = y * this.col + x;

			if( typeof this.colorBuffer[n] === "undefined" )
			{
				this.backgroundPixel.draw( x, y, this.backgroundPixelInfo, context );
			}
			else
			{
				this.backgroundPixel.draw( x, y, this.colorBuffer[n], context );
			}
		}
	}

	this.backgroundPixel.finalize( context );
	context.restore();
};

SKETCH.CanvasRenderer.prototype.evaluateVertex = function( va, vc, varying )
{
	if( typeof this.vertexProgram === "undefined" )
	{
		console.log( "Cannot find VertexShader, substitution defalut shader" );

		this.vertexProgram = function( va, vc, varying )
		{
			console.log( va, vc );

			return null;
		}
	}

	return this.vertexProgram.apply( this, [ va, vc, varying ] );
};

SKETCH.CanvasRenderer.prototype.evaluatePixel = function( x, y, varying )
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

	var oc = this.fragmentProgram.apply( this, [ x, y, varying ] );

	this.colorBuffer[ y * this.col + x ] = oc;
};



SKETCH.CanvasRenderer.prototype.vertexAttribPointer = function( buf, index, size, stride, offset )
{
	var vo = {};

	vo.buf = buf;
	vo.index = index || 0;
	vo.size = size || 3;
	vo.stride = stride || 3;
	vo.offset = offset || 0;

	this.mem.push( vo );
};

SKETCH.CanvasRenderer.prototype.setUniform = function( index, value )
{
	this.uniform[ index ] = value;
};

SKETCH.CanvasRenderer.prototype.drawTriangles = function( indices, count, offset )
{
	count = count || 3;
	offset = offset || 0;

	var vo, va, v, bufOffset, evaluatedVertices = [], varying = [];

	for( var i = offset; i < offset + count; i += 3 )
	{
		evaluatedVertices.length = 0;
		varying.length = 0;

		for( var m = i; m < i + 3; m++ )
		{
			va = [];
			v = [];

			for( var j = 0; j < this.mem.length; j++ )
			{
				vo = this.mem[j];

				bufOffset = indices[m] * vo.stride + vo.offset;

				va[ vo.index ] = vo.buf.subarray( bufOffset, bufOffset + vo.size );
			}

			evaluatedVertices.push( this.evaluateVertex( va, this.uniform, v ) );
			varying.push( v );
		}

		this.rasterize( evaluatedVertices, varying );
	}

	this.mem = [];
	this.uniform = [];
};


/**
*	Standard Rasterization Algorithm
*/
SKETCH.CanvasRenderer.prototype.rasterize = function( triangle, varying )
{
	triangle.sort( 
		function( a, b )
		{
			return a[1] < b[1] ? -1 : Number( a[1] > b[1] );
		}
	);

	var frags = [];

	var w = this.col - 1,
		h = this.row - 1;

	var ax = parseInt( triangle[0][0] * w ),
		ay = parseInt( triangle[0][1] * h ),
		bx = parseInt( triangle[1][0] * w ),
		by = parseInt( triangle[1][1] * h ),
		cx = parseInt( triangle[2][0] * w ),
		cy = parseInt( triangle[2][1] * h );

	//console.log( "A(%d,%d), B(%d,%d), C(%d,%d)", ax, ay, bx, by, cx, cy );

	var len = SKETCH.Pixel.rasterize( ax, ay, bx, by, cx, cy, frags );

	for( var i = 0; i < len; i += 2 )
	{
		this.evaluatePixel( frags[i], frags[i+1], varying );
	}
};