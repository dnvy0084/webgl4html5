( function( global )
{
	if( global == null )
		global = window;

	function Camera( lookAtObject )
	{
		this.__init();

		this.__defineGetter__( "transform", this._gettransform );
		this.__defineSetter__( "transform", this._settransform );

		this.__defineGetter__( "cameraMatrix", this._getcameraMatrix );
	}

	Camera.prototype = Pivot3D.prototype;

	Camera.prototype._gettransform = function()
	{
		return this.mat;
	}

	Camera.prototype._settransform = function( value )
	{
		this.mat = value;
	}

	Camera.prototype._getcameraMatrix = function()
	{
		return mat4.invert( mat4.create(), this.transform );
	}

	var canvas,
		gl,
		camera,
		program,
		vertexShader,
		fragmentShader,
		vertexBuffer,
		indexBuffer;

	var indexDrawCount,
		data32PerVertex,
		vertexOffset,
		colorOffset,
		normalOffset,
		totalVertexBufferCount;

	var projection,
		modelView;

	var frameDiv;

	function init()
	{
		frameDiv = document.getElementById( "frameRate" );

		initWebGL();
		initMouseEvents();
	};

	function initMouseEvents()
	{
		var req = -1,
			keys = {},
			speed = 0.1;

		function onDown( e )
		{
			console.log( e );
		};

		function onUp( e )
		{
			console.log( e );
		};

		function onWheel( e )
		{
			camera.z += e.wheelDelta / 200;	
		};

		function onKeyDown( e )
		{
			keys[ e.keyCode ] = 1;

			if( req == -1 )
				req = requestAnimationFrame( checkKeydown );
		};

		function onKeyUp( e )
		{
			delete keys[ e.keyCode ];
		}

		function checkKeydown( ms )
		{
			var n = 0;

			for( var s in keys )
			{
				n = 1;
				break;
			}

			if( n ) 
			{
				excuKeyControls( keys );
				req = requestAnimationFrame( checkKeydown );
			}
			else 	
			{
				cancelAnimationFrame( req );
				req = -1;
			}
		}

		function excuKeyControls( keys )
		{
			for( var s in keys )
			{
				switch( Number( s ) )
				{
					case 37:
						camera.x += -speed;
						break;

					case 38:
						camera.y += speed;
						break;

					case 39:
						camera.x += speed;
						break;

					case 40:
						camera.y += -speed;
						break;
				}
			}
		}

		canvas.addEventListener( "mousedown", onDown );
		canvas.addEventListener( "mouseup", onUp );
		canvas.addEventListener( "mousewheel", onWheel );

		document.addEventListener( "keydown", onKeyDown );
		document.addEventListener( "keyup", onKeyUp );
	};


	function initWebGL()
	{
		canvas = global.document.getElementById( "canvas" );
		gl = canvas.getContext( "webgl" );

		gl.enable( gl.DEPTH_TEST );
		gl.enable( gl.CULL_FACE );
		gl.cullFace( gl.FRONT );

		initCameras();
		initBuffers();
		initShaders();
		initMatrices();
		startRender();
	};


	function initCameras()
	{
		camera = new Camera();

		camera.z = 5;	
	};

	function initBuffers()
	{
		var r = 0.8;

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
			0, 1, 2,  	0, 2, 3, // front
			5, 4, 7, 	5, 7, 6, // back
			1, 5, 6, 	1, 6, 2, // left
			4, 0, 3,	4, 3, 7, // right
			4, 5, 1, 	4, 1, 0, // top
			3, 2, 6,	3, 6, 7, // bottom
		];

		vertexBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( calcNormals( vertices, indices, 6, 0 ) ), gl.STATIC_DRAW );

		indexDrawCount = indices.length;

		indexBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );

		data32PerVertex = 9;
		vertexOffset = 0;
		colorOffset = 3;
		normalOffset = 6;

		totalVertexBufferCount = indices.length;
	};

	function calcNormals( vertices, indices, data32perVertex, vertexOffset )
	{
		var calcVertices = [];
		var vDataI, vPosI;
		var a, b, c, ba, bc, cross;

		for (var i = 0; i < indices.length; i += 3 )
		{
			a = vertices.slice( data32perVertex * indices[i] + vertexOffset, data32perVertex * indices[i] + vertexOffset + 3 );
			b = vertices.slice( data32perVertex * indices[i+1] + vertexOffset, data32perVertex * indices[i+1] + vertexOffset + 3 );
			c = vertices.slice( data32perVertex * indices[i+2] + vertexOffset, data32perVertex * indices[i+2] + vertexOffset + 3 );

			ba = vec3.subtract( vec3.create(), b, a );
			bc = vec3.subtract( vec3.create(), b, c );

			cross = vec3.cross( vec3.create(), ba, bc );
			cross = vec3.normalize( cross, cross );

			for (var j = 0; j < 3; j++) 
			{
				vDataI = data32perVertex * indices[i+j];

				calcVertices = calcVertices.concat( vertices.slice( vDataI, vDataI + data32perVertex ) );
				calcVertices = calcVertices.concat( [ cross[0], cross[1], cross[2] ] );
			};
		};

		return calcVertices;
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

			if( start != -1 && c % 30 == 0 )
				frameDiv.innerHTML = "FPS: " + Math.floor( 1000 / ( ms - start ) );

			start = ms;

			requestAnimationFrame( render );
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

		var uProjection = gl.getUniformLocation( program, "projection" );
		var uModelView = gl.getUniformLocation( program, "modelView" );
		var uCamera = gl.getUniformLocation( program, "camera" );

		gl.uniformMatrix4fv( uModelView, false, modelView );
		gl.uniformMatrix4fv( uProjection, false, projection );
		gl.uniformMatrix4fv( uCamera, false, camera.cameraMatrix );

		var light = gl.getUniformLocation( program, "light" );
		var ambient = gl.getUniformLocation( program, "ambient" );
		var view = gl.getUniformLocation( program, "view" );

		var vLight = vec3.fromValues( -1.0, 1.0, 1.0 );
		vec3.normalize( vLight, vLight );

		var vCamera = vec3.fromValues( camera.x, camera.y, camera.z );
		vec3.normalize( vCamera, vCamera );

		gl.uniform3f( light, vLight[0], vLight[1], vLight[2] );
		gl.uniform4f( ambient, 0.1, 0.1, 0.1, 1.0 );
		gl.uniform3f( view, vCamera[0], vCamera[1], vCamera[2] );
	};

	function setBufferData()
	{
		var position = gl.getAttribLocation( program, "position" );
		var color = gl.getAttribLocation( program, "color" );
		var normal = gl.getAttribLocation( program, "normal" );

		gl.enableVertexAttribArray( position );
		gl.enableVertexAttribArray( color );
		gl.enableVertexAttribArray( normal );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );

		gl.vertexAttribPointer( position, 3, gl.FLOAT, false, 4 * data32PerVertex, 4 * 0 );	
		gl.vertexAttribPointer( color, 3, gl.FLOAT, false, 4 * data32PerVertex, 4 * colorOffset );
		gl.vertexAttribPointer( normal, 3, gl.FLOAT, false, 4 * data32PerVertex, 4 * normalOffset )
	};

	function drawScene()
	{
		gl.clear( gl.COLOR_BUFFER_BIT );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.drawArrays( gl.TRIANGLES, 0, totalVertexBufferCount );
		// gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		// gl.drawElements( gl.TRIANGLES, indexDrawCount, gl.UNSIGNED_SHORT, 0 );
	};

	

	global.onload = init;

})(); // self invoke 