( function( global ){
	
	var wglu = {};

	wglu.createBuffer = function( gl, target, bufferData, usage )
	{
		var buffer = gl.createBuffer();

		gl.bindBuffer( target, buffer );
		gl.bufferData( target, bufferData, usage );

		return buffer;
	}

	wglu.createProgram = function( gl, vertexSource, fragmentSource )
	{
		var program = gl.createProgram();

		gl.attachShader( program, wglu.makeAndCompileShader( gl, gl.VERTEX_SHADER, vertexSource ) );
		gl.attachShader( program, wglu.makeAndCompileShader( gl, gl.FRAGMENT_SHADER, fragmentSource ) );

		gl.linkProgram( program );

		if( !gl.getProgramParameter( program, gl.LINK_STATUS ) )
		{
			alert( "Error: " + gl.getProgramInfoLog( program ) );
		}

 		return program;
	}

	wglu.makeAndCompileShader = function( gl, type, source )
	{
		var shader = gl.createShader( type );

		gl.shaderSource( shader, source );
		gl.compileShader( shader );

		if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
		{
			alert( "Error: " + gl.getShaderInfoLog( shader ) );
		}

		return shader;
	}

	global.wglu = wglu;

})( this );