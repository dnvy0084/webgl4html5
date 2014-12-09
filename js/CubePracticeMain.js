(function( global )
{
	if( global == null )
		global = window;

	var canvas,
		gl,
		program,
		vertexShader,
		fragmentShader,
		vertexBuffer,
		indexBuffer,
		indexDrawCount;

	var projection,
		modelView;

	var frame;

	function init()
	{
		frame = document.getElementById( "frameRate" );
 
		initWebGL();
	};


	function initWebGL()
	{
		canvas = global.document.getElementById( "canvas" );
		gl = canvas.getContext( "webgl" );

		gl.enable( gl.DEPTH_TEST );

		initBuffers();
		initShaders();
		initMatrices();
		startRender();
	};



	function initBuffers()
	{
		var r = 1;

		var vertices = [
			-r, r, r, 	1, 0, 0, 
			r, r, r,	0, 1, 0,
			r, -r, r,	0, 0, 1,
			-r, -r, r,	1, 1, 0,

			-r, r, -r, 	1, 0, 0, 
			r, r, -r,	0, 1, 0,
			r, -r, -r,	0, 0, 1,
			-r, -r, -r,	1, 1, 0
		];

		var indices = [
			0, 1, 2,  	0, 2, 3, //front
			4, 5, 6, 	4, 6, 7, //back
			1, 5, 6, 	1, 6, 2, //left
			0, 4, 7,	0, 7, 3, //right
			4, 5, 1, 	4, 1, 0, //top
			3, 2, 6,	3, 6, 7, //bottom
		];

		vertexBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

		indexDrawCount = indices.length;

		indexBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
	};

	function calcNormals( vertices, indices, data32perVertex, vertexOffset )
	{
		var vDataI, vPosI;

		for (var i = 0; i < indices.length; i++) 
		{
			vDataI = data32perVertex * indices[i];
			vPosI = vDataI + vertexOffset;

			vertices.slice( data32perVertex * indices[i] + vertexOffset, 3 );
		};
	}

	function initShaders()
	{
		console.log( "vertex", gl.VERTEX_SHADER );
		vertexShader = makeShader( gl.VERTEX_SHADER, document.getElementById( "vertexShader" ).innerHTML );
		console.log( "fragment", gl.FRAGMENT_SHADER );
		fragmentShader = makeShader( gl.FRAGMENT_SHADER, document.getElementById( "fragmentShader" ).innerHTML );

		program = gl.createProgram();

		gl.attachShader( program, vertexShader );
		gl.attachShader( program, fragmentShader );

		gl.linkProgram( program );

		if( !gl.getProgramParameter( program, gl.LINK_STATUS ) )
		{
			console.log( "Error Link: " + gl.getProgramInfoLog( program ) );
		}
	};

	function makeShader( eType, sCode )
	{
		var shader = gl.createShader( eType );

		gl.shaderSource( shader, sCode );
		gl.compileShader( shader );

		if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
		{
			console.log( eType, "Error Compile: " + gl.getShaderInfoLog( shader ) );
		}

		return shader;
	};

	function initMatrices()
	{
		modelView = mat4.create();
		projection = mat4.create();
		console.log( gl.canvas.width, gl.canvas.height );
		projection = mat4.perspective( projection, 45, 1024 / 768, 0.1, 1000 );
	};


	var start = -1;

	function startRender()
	{
		(function render( ms ){
			changeModelViewMatrix();
			setProgramAndUniforms();
			setBufferData();
			drawScene();

			if( start != -1 )
				frame.innerHTML = Math.floor( 1000 / ( ms - start ) );

			start = ms;

			requestAnimationFrame( render, gl.canvas );
		})();
	};

	var c = 0;

	function changeModelViewMatrix()
	{
		modelView = mat4.identity( modelView );

		mat4.translate( modelView, modelView, [ 0, 0, -4 ] );
		mat4.rotate( modelView, modelView, ++c / 50, [ 1, 1, 1 ] );
	};

	function setProgramAndUniforms()
	{
		gl.useProgram( program );

		var transform = gl.getUniformLocation( program, "transform" );

		gl.uniformMatrix4fv( transform, false, mat4.multiply( mat4.create(), projection, modelView ) );

		var light = gl.getUniformLocation( program, "light" );
		var ambient = gl.getUniformLocation( program, "ambient" );

		light = 

		gl.uniform3f( light, 1.0, 1.0, 1.0 );
		gl.uniform4f( ambient, 0.1, 0.1, 0.1, 1.0 );
	};

	function setBufferData()
	{
		var position = gl.getAttribLocation( program, "position" );
		var color = gl.getAttribLocation( program, "color" );

		gl.enableVertexAttribArray( position );
		gl.enableVertexAttribArray( color );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( position, 3, gl.FLOAT, false, 4 * 6, 4 * 0 );	
		gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 4 * 6, 4 * 3 );
	};

	function drawScene()
	{
		gl.clear( gl.COLOR_BUFFER_BIT );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		gl.drawElements( gl.TRIANGLES, indexDrawCount, gl.UNSIGNED_SHORT, 0 );
	};

	

	global.onload = init;

})(); // self invoke 