  'use strict';

  // Global variables that are set and used
  // across the application
  let gl;

  // The programs
  let sphereGlobeProgram;

  // the textures
  let worldTexture;
  let guyTexture;
  let perlTexture;
  
  // I have it global in my C# implementation and im basically ripping it off here
  let miniMap;
  
  // VAOs for the objects
  var mySphere = null;
  var myCube = null;

  // what is currently showing
  let nowShowing = 'Sphere';

  // what texure are you using
  // valid values = "globe", "myimage" or "proc"
  let curTexture = "globe";

  var anglesReset = [30.0, 30.0, 0.0];
  var cube_angles = [30.0, 30.0, 0.0];
  var sphere_angles = [180.0, 180.0, 0.0];
  var angles = sphere_angles;
  var angleInc = 5.0;

function doLoad(theTexture, theImage) {
    gl.bindTexture(gl.TEXTURE_2D, theTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, theImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    draw();
}

// credit to yckart and matthew crumley on stack overflow.
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}


function perlinFill() {
	// creates a 2d array of size [64, 64]
	const perlMap = createArray(64, 64);
	// dimensions of big & little array
	let big = 64.0;
	let little = 6.0;
	// creates the smaller map
	// I implemented perlin in python AND c# earlier this semester for the fun of it. wild that it actually came into play here.
	// the smaller map is the randomly assigned map.
	miniMap = createArray(6, 6, 2);
	
	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 6; j++) {
			miniMap[i, j, 0] = Math.random();
			miniMap[i, j, 1] = Math.random();
		}
	}
	
	// now we fill the array with useless values
	// eqp (equivalent position) is the relative position of the element compared to the board.
	let eqp = little / big;
	for (let i = 0; i < big; i++) {
		for (let j = 0; j < big; j++) {
			let output = noiseMaker(eqp * i, eqp * j);
			perlMap[i, j] = output;
		}
	}
	
	console.log(perlMap);
}

function noiseMaker(i, j) {
	let x = Math.floor(i);
	let y = Math.floor(j);
	
	let xSmooth = smooth(i - x);
	let ySmooth = smooth(j - y);
	
	let ltDot = dotProduct(i, j, x, y);
	let rtDot = dotProduct(i + 1, j, x, y);
	let lbDot = dotProduct(i, j + 1, x, y);
	let rbDot = dotProduct(i + 1, j + 1, x, y);
	
	let topNoise = ltDot + xSmooth * (rtDot - ltDot);
	let bottomNoise = lbDot + xSmooth * (rbDot - lbDot);

	return (topNoise + ySmooth * (bottomNoise - topNoise));
}

function smooth(value) {
	return (value * value * (3 - (2 * value)));
}

function dotProduct(i, j, x, y) {
	let xDiff = i - x;
	let yDiff = j - y;
	
	x = miniMap[i, j, 0];
	y = miniMap[i, j, 1];
	
	// simple and plainly, the dot product
	return (xDiff * x + yDiff * y);
}

//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures() {
    
    // get some texture space from the gpu
    worldTexture = gl.createTexture();
    guyTexture = gl.createTexture();
    // load the actual image
    const worldImage = new Image();
    worldImage.src = '1_earth_16k.jpg';
	
	const guyImage = new Image();
	guyImage.src = 'guy.jpg';

	const perlImage = new Image();
	perlMap = perlinFill();

    worldImage.onload = () => {
        doLoad (worldTexture, worldImage);
    };
	
	guyImage.onload = () => {
		doLoad(guyTexture, guyImage);
	};
	
	perlTexture.onload = () => {
		doLoad(perlTexture, perlImage);
	}
}

//
// Draws the current shape with the
// current texture
//
function drawCurrentShape () {
    
    // which shape are we drawing
    var object = mySphere;
    if (nowShowing == "Cube") object = myCube;
    
    // may need to set different parameters based on the texture
    // you are using...The current texture is found in the global variable
    // curTexture.   If will have the value of "globe", "myimage" or "proc"
    
    // set up texture uniform & other uniforms that you might
    // have added to the shader
    var program;

    if( curTexture == "globe" ) {
        // which program are we using
        program = sphereGlobeProgram;
        // set up your uniform variables for drawing
        gl.useProgram (program);
        
        gl.activeTexture (gl.TEXTURE0);
        gl.uniform1i (program.uTheTexture, 0);
        gl.bindTexture (gl.TEXTURE_2D, worldTexture);
        
    } else if( curTexture == "myimage" ) {
        // which program are we using
        program = sphereGlobeProgram;
        // set up your uniform variables for drawing
        gl.useProgram (program);
        
        gl.activeTexture (gl.TEXTURE1);
        gl.uniform1i (program.uTheTexture, 1);
        gl.bindTexture( gl.TEXTURE_2D, guyTexture);
        gl.uniform1i (program.uTheTexture, 1);

        
    } else if( curTexture == "proc" ) {
        // which program are we using
        program = sphereGlobeProgram;
        // set up your uniform variables for drawing
        gl.useProgram (program);
    }
    
    // set up rotation uniform
    gl.uniform3fv (program.uTheta, new Float32Array(angles));
    
    //Bind the VAO and draw
    gl.bindVertexArray(object.VAO);
    gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);
    
}

// Create a program with the appropriate vertex and fragment shaders
function initProgram (vertexid, fragmentid) {
    
  // set up the per-vertex program
  const vertexShader = getShader(vertexid);
  const fragmentShader = getShader(fragmentid);

  // Create a program
  let program = gl.createProgram();
  
  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
  }

  // Use this program instance
  gl.useProgram(program);
  // We attach the location of these shader values to the program instance
  // for easy access later in the code
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aUV = gl.getAttribLocation(program, 'aUV');
    
  // uniforms - you will need to add references for any additional
  // uniforms that you add to your shaders
  program.uTheTexture = gl.getUniformLocation (program, 'theTexture');
  program.uTheta = gl.getUniformLocation (program, 'theta');
    
  return program;
}

///////////////////////////////////////////////////////////////////
//
//  No need to edit below this line.
//
////////////////////////////////////////////////////////////////////

// general call to make and bind a new object based on current
// settings..Basically a call to shape specfic calls in cgIshape.js
function createShapes() {
    
    // the sphere
    mySphere = new Sphere (20,20);
    mySphere.VAO = bindVAO (mySphere, sphereGlobeProgram);
    
    // the cube
    myCube = new Cube (20);
    myCube.VAO = bindVAO (myCube, sphereGlobeProgram);
    
}



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
      console.error("Compiling shader " + id + " " + gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

//
// Creates a VAO for a given object and return it.
//
// shape is the object to be bound
// program is the program (vertex/fragment shaders) to use in this VAO
//
//
// Note that the program object has member variables that store the
// location of attributes and uniforms in the shaders.  See the function
// initProgram for details.
//
// You can see the definition of the shaders themselves in the
// HTML file assn6-shading.html.   Though there are 2 sets of shaders
// defined (one for per-vertex shading and one for per-fragment shading,
// each set does have the same list of attributes and uniforms that
// need to be set
//
function bindVAO (shape, program) {
    
    //create and bind VAO
    let theVAO = gl.createVertexArray();
    gl.bindVertexArray(theVAO);
    
    // create, bind, and fill buffer for vertex locations
    // vertex locations can be obtained from the points member of the
    // shape object.  3 floating point values (x,y,z) per vertex are
    // stored in this array.
    let myVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    
    // create, bind, and fill buffer for uv's
    // uvs can be obtained from the uv member of the
    // shape object.  2 floating point values (u,v) per vertex are
    // stored in this array.
    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.aUV);
    gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);
    
    // Setting up element array
    // element indicies can be obtained from the indicies member of the
    // shape object.  3 values per triangle are stored in this
    // array.
    let myIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

    // Do cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    return theVAO;
}



  
  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
 
    // draw your shapes
    drawCurrentShape ();

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
    gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
      
    // deal with keypress
    window.addEventListener('keydown', gotKey ,false);

    // Read, compile, and link your shaders
    sphereGlobeProgram = initProgram('sphereMap-V', 'sphereMap-F');
    
    // create and bind your current object
    createShapes();
    
    // set up your textures
    setUpTextures();
    
    // do a draw
    draw();
  }