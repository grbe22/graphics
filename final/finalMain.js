'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // GLSL programs
  let generalProgram;
  let textureProgram;
  
  // VAOs for the objects
  var water = null;
  var sky = null;
  var pillar = null;
  var bridge = null;

  // textures
  let woodTexture;
  let skyTexture;
  let pillarTexture;
  let waterTexture;

  // rotation
  var angles = [90.0, 90.0, 0.0];
 
//
// create shapes and VAOs for objects.
// Note that you will need to bindVAO separately for each object / program based
// upon the vertex attributes found in each program
//
function createShapes() {
    water = new Cube(1);
    sky = new Cube(1);
    pillar = new Cylinder(20, 20);
    bridge = new Cube(1);

    water.VAO = bindVAO (water, textureProgram);
    sky.VAO = bindVAO( sky, textureProgram );
    pillar.VAO = bindVAO( pillar, textureProgram );
    bridge.VAO = bindVAO( bridge, textureProgram );
}


//
// Here you set up your camera position, orientation, and projection
// Remember that your projection and view matrices are sent to the vertex shader
// as uniforms, using whatever name you supply in the shaders
//
function setUpCamera(program) {
    
    gl.useProgram (program);
    
    // set up your projection
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projMatrix, radians(90), 1, 3, 100);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);
    
    // set up your view
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0, 4, -15], [0, 2, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
}


//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures(){
    
    // flip Y for WebGL
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
    
    // get some texture space from the gpu
    woodTexture = gl.createTexture();
    skyTexture = gl.createTexture();
    pillarTexture = gl.createTexture();
    waterTexture = gl.createTexture();
    
    // load the actual image
    var woodImage = document.getElementById ('wood-texture')
    woodImage.crossOrigin = "";
    
    // bind the texture so we can perform operations on it
    gl.bindTexture(gl.TEXTURE_2D, woodTexture );
    
    // load the texture data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, woodImage.width, woodImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, woodImage);
    
    // set texturing parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var skyImage = document.getElementById('sky-texture');
    skyImage.crossOrigin = "";
    gl.bindTexture(gl.TEXTURE_2D, skyTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, skyImage.width, skyImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, skyImage);    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
    var pillarImage = document.getElementById('pillar-texture');
    pillarImage.crossOrigin = "";
    gl.bindTexture(gl.TEXTURE_2D, pillarTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, pillarImage.width, pillarImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pillarImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var waterImage = document.getElementById('water-texture');
    waterImage.crossOrigin = "";
    gl.bindTexture(gl.TEXTURE_2D, waterTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, waterImage.width, waterImage.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, waterImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

function transformMatrix( matIn, matOut, type, x, y, z, rad ) {
    if( type == 's' ) {
        glMatrix.mat4.scale( matOut, matIn, [x, y, z] );
    } else if ( type == 't' ) {
        glMatrix.mat4.translate( matOut, matIn, [x, y, z]);
    } else if( type == 'rx' ) {
        glMatrix.mat4.rotateX( matOut, matIn, rad );
    } else if( type == 'ry' ) {
        glMatrix.mat4.rotateY( matOut, matIn, rad );
    } else if( type == 'rz' ) {
        glMatrix.mat4.rotateZ( matOut, matIn, rad );
    }
    return matOut;
}

//
//  This function draws all of the shapes required for your scene
//
    function drawShapes() {
        let waterMatrix = glMatrix.mat4.create();
        let bridgeMatrix = glMatrix.mat4.create();
        let skyMatrix = glMatrix.mat4.create();
        let pillarMatrix = glMatrix.mat4.create();
        var program;
        program = textureProgram;
        gl.useProgram(program);

		// water
		transformMatrix(waterMatrix, waterMatrix, 't', 0, -20, 10, 0);
		transformMatrix(waterMatrix, waterMatrix, 's', 60, 40, 1, 1);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, waterTexture);
		gl.uniform1i(program.uTheTexture, 1);
		gl.uniform3fv(program.uTheta, new Float32Array(angles));
		gl.uniformMatrix4fv(program.uModelT, false, waterMatrix);
		gl.uniform4fv(program.colorChange, [.8, .8, .8, 1]);
		gl.bindVertexArray(water.VAO);
		gl.drawElements(gl.TRIANGLES, bridge.indices.length, gl.UNSIGNED_SHORT, 0);

		// bridge
        transformMatrix( bridgeMatrix, bridgeMatrix, 'ry', 0, 0, 0, radians(90) );
        transformMatrix( bridgeMatrix, bridgeMatrix, 't', 10, -1, 0, 1);
        transformMatrix( bridgeMatrix, bridgeMatrix, "s", 45, .2, 5, 5);
        gl.activeTexture (gl.TEXTURE0);
        gl.bindTexture (gl.TEXTURE_2D, woodTexture);
        gl.uniform1i (program.uTheTexture, 0);
        gl.uniform3fv (program.uTheta, new Float32Array(angles));
        gl.uniformMatrix4fv (program.uModelT, false, bridgeMatrix);
        gl.uniform4fv (program.colorChange, [.4,.4,.4,1]);
        gl.bindVertexArray(bridge.VAO);
        gl.drawElements(gl.TRIANGLES, bridge.indices.length, gl.UNSIGNED_SHORT, 0);
        
		// sky
        transformMatrix(skyMatrix, skyMatrix, 't', 0,10,10,0);
		transformMatrix(skyMatrix, skyMatrix, 's', 60, 40, 1, 1);
        gl.activeTexture (gl.TEXTURE1);
        gl.bindTexture (gl.TEXTURE_2D, skyTexture);
        gl.uniform1i (program.uTheTexture, 1);
        gl.uniform3fv (program.uTheta, new Float32Array(angles));
        gl.uniformMatrix4fv (program.uModelT, false, skyMatrix);
        gl.uniform4fv (program.colorChange, [.6,.6,.8,1]);
        gl.bindVertexArray(sky.VAO);
        gl.drawElements(gl.TRIANGLES, sky.indices.length, gl.UNSIGNED_SHORT, 0);

		// pillars
        transformMatrix( pillarMatrix, pillarMatrix, 's', .5,6,.5,0);
		transformMatrix(pillarMatrix, pillarMatrix, 't', 3.5, -.25, -20, 0);
        gl.activeTexture (gl.TEXTURE2);
        gl.bindTexture (gl.TEXTURE_2D, pillarTexture);
        gl.uniform1i (program.uTheTexture, 2);
        gl.uniform3fv (program.uTheta, new Float32Array(angles));

        gl.uniformMatrix4fv (program.uModelT, false, pillarMatrix);
        gl.uniform4fv (program.colorChange, [.4,.4,.5,1]);		
        gl.bindVertexArray(pillar.VAO);
        gl.drawElements(gl.TRIANGLES, pillar.indices.length, gl.UNSIGNED_SHORT, 0);
		
		transformMatrix(pillarMatrix, pillarMatrix, 't', -7, 0, 0, 0);
		gl.uniformMatrix4fv(program.uModelT, false, pillarMatrix);
		gl.bindVertexArray(pillar.VAO);
		gl.drawElements(gl.TRIANGLES, pillar.indices.length, gl.UNSIGNED_SHORT, 0);
		
		for (let i = 0; i < 5; i++) {
			transformMatrix(pillarMatrix, pillarMatrix, 't', 7, 0, 8, 0);
			gl.uniformMatrix4fv(program.uModelT, false, pillarMatrix);
			gl.bindVertexArray(pillar.VAO);
			gl.drawElements(gl.TRIANGLES, pillar.indices.length, gl.UNSIGNED_SHORT, 0);
			
			transformMatrix(pillarMatrix, pillarMatrix, 't', -7, 0, 0, 0);
			gl.uniformMatrix4fv(program.uModelT, false, pillarMatrix);
			gl.bindVertexArray(pillar.VAO);
			gl.drawElements(gl.TRIANGLES, pillar.indices.length, gl.UNSIGNED_SHORT, 0);
		}
  }


  //
  // Use this function to create all the programs that you need
  // You can make use of the auxillary function initProgram
  // which takes the name of a vertex shader and fragment shader
  //
  // Note that after successfully obtaining a program using the initProgram
  // function, you will beed to assign locations of attribute and unifirm variable
  // based on the in variables to the shaders.   This will vary from program
  // to program.
  //
  function initPrograms() {
      generalProgram = initProgram( "vertex-shader", "fragment-shader");
      textureProgram = initProgram('sphereMap-V', 'sphereMap-F');
  }


  // creates a VAO and returns its ID
  function bindVAO (shape, program) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      
      // add code for any additional vertex attribute
      

      
      if( program == generalProgram) {
        // create and bind bary buffer
        let myNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.aNormal);
        gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
      } else if( program == textureProgram ) {
        let myNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.aNormal);
        gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);
          
        let uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.aUV);
        gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);
      }
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
  }

function setUpPhong(program, color, lightPosition) {
    gl.useProgram (program);
    var lightPos = [lightPosition[0], lightPosition[1], lightPosition[2]];
    var ambLight = [10, .6, .8];
    var lightClr = [color[0], color[1], color[2]];
    var baseClr = [.1, .2, .2];
    var specHighlightClr = [.2, .2, .2];
    var Ka = .2;
    var Kd = 1.4;
    var Ks = 1;
    var Ke = .4;
    
    gl.uniform3fv( program.ambientLight, ambLight);
    gl.uniform3fv( program.lightPosition, lightPos );
    gl.uniform3fv( program.lightColor, lightClr );
    gl.uniform3fv( program.baseColor, baseClr );
    gl.uniform1f( program.ka, Ka);
    gl.uniform1f( program.kd, Kd);
    gl.uniform1f( program.ks, Ks);
    gl.uniform1f( program.ke, Ke); 
}

function setUpTexturePhong(program) {
    gl.useProgram (program);
    var lightPos = [-3, 4, 4];
    var ambLight = [.4, .4, .4];
    var lightClr = [1, 1, 1];
    var baseClr = [.4, .4, .4];
    var Ka = 1;
    var Kd = 1.4;
    var Ks = 1;
    var Ke = .4;
    gl.uniform3fv( program.ambientLight, ambLight);
    gl.uniform3fv( program.lightPosition, lightPos );
    gl.uniform3fv( program.lightColor, lightClr );
    gl.uniform3fv( program.baseColor, baseClr );
    gl.uniform1f( program.ka, Ka);
    gl.uniform1f( program.kd, Kd);
    gl.uniform1f( program.ks, Ks);
    gl.uniform1f( program.ke, Ke); 
}

/////////////////////////////////////////////////////////////////////////////
//
//  You shouldn't have to edit anything below this line...but you can
//  if you find the need
//
/////////////////////////////////////////////////////////////////////////////

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }


  //
  // compiles, loads, links and returns a program (vertex/fragment shader pair)
  //
  // takes in the id of the vertex and fragment shaders (as given in the HTML file)
  // and returns a program object.
  //
  // will return null if something went wrong
  //
  function initProgram(vertex_id, fragment_id) {
    const vertexShader = getShader(vertex_id);
    const fragmentShader = getShader(fragment_id);

    // Create a program
    let program = gl.createProgram();
      
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
      return null;
    }

    gl.useProgram(program);
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aNormal = gl.getAttribLocation(program, 'aNormal');
    program.aUV = gl.getAttribLocation( program, 'aUV');
    program.uTheTexture = gl.getUniformLocation (program, 'theTexture');
    program.uTheta = gl.getUniformLocation (program, 'theta');
    program.colorChange = gl.getUniformLocation( program, 'colorChange');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
    program.ambientLight = gl.getUniformLocation (program, 'ambientLight');
    program.lightPosition = gl.getUniformLocation (program, 'lightPosition');
    program.lightColor = gl.getUniformLocation (program, 'lightColor');
    program.baseColor = gl.getUniformLocation (program, 'baseColor');
    program.specHighlightColor = gl.getUniformLocation (program, 'specHighlightColor');
    program.ka = gl.getUniformLocation (program, 'ka');
    program.kd = gl.getUniformLocation (program, 'kd');
    program.ks = gl.getUniformLocation (program, 'ks');
    program.ke = gl.getUniformLocation (program, 'ke');
    return program;
  }
  

  //
  // We call draw to render to our canvas
  //
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }

    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initPrograms();

    // create and bind your current object
    createShapes();
      
    setUpTextures();
      
    setUpCamera(generalProgram);
    setUpCamera(textureProgram);
      
    // set up Phong parameters (light Color, light Position)
    setUpPhong(generalProgram, [2, 2, 10], [20, -2, 10]);
    setUpTexturePhong(textureProgram);
    
    // do a draw
    draw();
  }