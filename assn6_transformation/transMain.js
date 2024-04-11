  'use strict';

  // Global variables that are set and used
  // across the application
  let gl, program;
  
  // Global declarations of objects that you will be drawing
  var myTeapot = null;
  var myCube = null;
  var mySphere = null;
  var myCyli = null;
  var myCone = null;

//
// A function that creates shapes to be drawn and creates a VAO for each
//
// We start you out with an example for the teapot.
//
function createShapes() {

    myTeapot = new Teapot();
    myTeapot.VAO = bindVAO (myTeapot);
	
	myCube = new Cube(2);
	myCube.VAO = bindVAO(myCube);
	
	myCyli = new Cylinder(10, 10);
	myCyli.VAO = bindVAO(myCyli);
	
	mySphere = new Sphere(10, 10);
	mySphere.VAO = bindVAO(mySphere);
	
	myCone = new Cone(10, 10);
	myCone.VAO = bindVAO(myCone);
}


//
// Set up your camera and your projection matrices
//
function setUpCamera() {
    
    // set up your projection
    // defualt is orthographic projection
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.ortho(projMatrix, -5, 5, -5, 5, 1.0, 300.0);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);

    
    // set up your view
    // defaut is at (0,0,-5) looking at the origin
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0.2, 3, 5], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
}


//
// Use this function to draw all of your shapes.
// Recall that VAOs should have been set up the call to createShapes()
// You'll have to provide a Model Matrix for each shape to be drawn that
// places the object in the world.
//
// An example is shown for placing the teapot
//
function drawShapes() {
    
    
    let t_matrix = glMatrix.mat4.create();
    // send the model matrix to the shader and draw.
	glMatrix.mat4.translate(t_matrix, t_matrix, [0, 2, 0]);
	gl.uniformMatrix4fv (program.uModelT, false, t_matrix);
    gl.bindVertexArray(myTeapot.VAO);
    gl.drawElements(gl.TRIANGLES, myTeapot.indices.length, gl.UNSIGNED_SHORT, 0);
	
	let c_matrix = glMatrix.mat4.create();
	glMatrix.mat4.translate(c_matrix, c_matrix, [0, 1.75, 0]);
	glMatrix.mat4.scale(c_matrix, c_matrix, [2, .35, 2]);
	gl.uniformMatrix4fv(program.uModelT, false, c_matrix);
	gl.bindVertexArray(myCube.VAO);
	gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
	
	glMatrix.mat4.translate(c_matrix, c_matrix, [1.4, 0, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, c_matrix);
	gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
	
	glMatrix.mat4.translate(c_matrix, c_matrix, [0, -8, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, c_matrix);
	gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
	
	glMatrix.mat4.translate(c_matrix, c_matrix, [-1.4, 0, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, c_matrix);
	gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
	
	glMatrix.mat4.translate(c_matrix, c_matrix, [-1.4, 0, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, c_matrix);
	gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
	
	glMatrix.mat4.translate(c_matrix, c_matrix, [0, 8, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, c_matrix);
	gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);
	
	
	// cylinders
	let long_cube = glMatrix.mat4.create();
	gl.bindVertexArray(myCyli.VAO);
	glMatrix.mat4.scale(long_cube, long_cube, [1, 2.5, 1]);
	glMatrix.mat4.translate(long_cube, long_cube, [0, .1, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, long_cube);
	gl.drawElements(gl.TRIANGLES, myCyli.indices.length, gl.UNSIGNED_SHORT, 0);
	
	glMatrix.mat4.translate(long_cube, long_cube, [2.8, 0, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, long_cube);
	gl.drawElements(gl.TRIANGLES, myCyli.indices.length, gl.UNSIGNED_SHORT, 0);
	
	glMatrix.mat4.translate(long_cube, long_cube, [-5.6, 0, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, long_cube);
	gl.drawElements(gl.TRIANGLES, myCyli.indices.length, gl.UNSIGNED_SHORT, 0);
	
	let s_matrix = glMatrix.mat4.create();
	glMatrix.mat4.translate(s_matrix, s_matrix, [3, 2.70, 0]);
	glMatrix.mat4.scale(s_matrix, s_matrix, [1.5, 1.5, 1.5]);
	gl.uniformMatrix4fv(program.uModelT, false, s_matrix);
	gl.bindVertexArray(mySphere.VAO);
	gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);
	
	let cone_mat = glMatrix.mat4.create();
	glMatrix.mat4.scale(cone_mat, cone_mat, [1.5, 1.5, 1.5]);
	glMatrix.mat4.translate(cone_mat, cone_mat, [-1.9, 1.25, 0]);
	gl.uniformMatrix4fv(program.uModelT, false, cone_mat);
	gl.bindVertexArray(myCone.VAO);
	gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);
}

///////////////////////////////////////////////////////////////////
//
//   You shouldn't have to edit below this line
//
///////////////////////////////////////////////////////////////////

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

  // Create a program with the appropriate vertex and fragment shaders
  function initProgram() {
    const vertexShader = getShader('vertex-shader');
    const fragmentShader = getShader('fragment-shader');

    // Create a program
    program = gl.createProgram();
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
    program.aBary = gl.getAttribLocation(program, 'bary');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
  }

  // creates a VAO and returns its ID
  function bindVAO (shape) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      let myBaryBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aBary);
      gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      
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

  
  // We call draw to render to our canvas
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

    // Read, compile, and link your shaders
    initProgram();
    
    // create and bind your current object
    createShapes();
    
    // set up your camera
    setUpCamera();
    
    // do a draw
    draw();
  }
