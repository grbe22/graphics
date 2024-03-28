//
// fill in code that creates the triangles for a cube with dimensions 1x1x1
// on each side (and the origin in the center of the cube). with an equal
// number of subdivisions along each cube face as given by the parameter
//subdivisions
//
function makeCube (subdivisions)  {
    // subdivision is an integer value
	var w = 0.5;
	// quality control
	if (subdivisions < 1) {
		subdivisions = 1;
	}
	genFace(w, 0, 0, subdivisions);
	genFace(w, Math.PI / 2, 0, subdivisions);
	genFace(w, Math.PI, 0, subdivisions);
	genFace(w, 3 * (Math.PI / 2), 0, subdivisions);
	genFace(w, 0, Math.PI / 2, subdivisions);
	genFace(w, 0, 3 * (Math.PI / 2), subdivisions);
}


function genFace(w, xRot, zRot, subdivisions) {
	// front facing face
	var points = [
		[ w, w, -w ],
		[ -w, w, -w ],
		[ -w, -w, -w ],
		[ w, -w, -w ]
	];
	// rotation in the x-direction
	var rx = [
		[1, 0, 0],
		[0, Math.cos(xRot), -Math.sin(xRot)],
		[0, Math.sin(xRot), Math.cos(xRot)]
	]
	// rotation in the z-direction
	var rz = [
        [Math.cos(zRot), 0, Math.sin(zRot)],
        [0, 1, 0],
        [-Math.sin(zRot), 0, Math.cos(zRot)]
    ];
	points = multiplyMatrices(points, rx);
	points = multiplyMatrices(points, rz);
	drawFace(points, subdivisions, w)
}

// simple matrix multiplication algorithm. Stolen off stackoverflow.
function multiplyMatrices(a, b) {
    var result = [];
    for (var i = 0; i < a.length; i++) {
        result[i] = [];
        for (var j = 0; j < 3; j++) {
            var sum = 0;
            for (var k = 0; k < 3; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function drawFace(points, subdivisions) {
	if (subdivisions == 1) {
		addTri(points[0], points[1], points[2]);
		addTri(points[2], points[3], points[0]);
	} else {
		for (let i = 0; i < 4; i ++) {
			let pts = [];
			for (let j = 0; j < 4; j ++) {
				pts.push(vec3Avg(points[i], points[j]));
			}
			drawFace(pts, subdivisions - 1);
		}
	}
}

function vec3Avg(father, p) {
	point = [];
	point.push((father[0] + p[0]) / 2);
	point.push((father[1] + p[1]) / 2);
	point.push((father[2] + p[2]) / 2);
	return point;
}

// IMO all functions should accept a three-vector input, not x, y, z, x, y, z, x, y, z.
function addTri(p1, p2, p3) {
	addTriangle(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
}

//
// fill in code that creates the triangles for a cylinder with diameter 1
// and height of 1 (centered at the origin) with the number of subdivisions
// around the base and top of the cylinder (given by radialdivision) and
// the number of subdivisions along the surface of the cylinder given by
//heightdivision.
//
function makeCylinder (radialdivision,heightdivision){
    // fill in your code here.
}


//
// fill in code that creates the triangles for a cone with diameter 1
// and height of 1 (centered at the origin) with the number of
// subdivisions around the base of the cone (given by radialdivision)
// and the number of subdivisions along the surface of the cone
//given by heightdivision.
//
function makeCone (radialdivision, heightdivision) {
    // fill in your code here.
}
    
//
// fill in code that creates the triangles for a sphere with diameter 1
// (centered at the origin) with number of slides (longitude) given by
// slices and the number of stacks (lattitude) given by stacks.
// For this function, you will implement the tessellation method based
// on spherical coordinates as described in the video (as opposed to the
//recursive subdivision method).
//
function makeSphere(slices, stacks) {
    var vertices = [];
    var normals = [];
    var indices = [];
	var radius = 0.5;
    console.log("Pee");

    for (var lat = 0; lat <= stacks; lat++) {
        var theta = lat * Math.PI / stacks;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var long = 0; long <= slices; long++) {
            var phi = long * 2 * Math.PI / slices;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (long / slices);
            var v = 1 - (lat / stacks);

            vertices.push(radius * x, radius * y, radius * z);
            normals.push(x, y, z);

            if (lat < stacks && long < slices) {
                var first = (lat * (slices + 1)) + long;
                var second = first + slices + 1;
                var p1 = [vertices[first * 3], vertices[first * 3 + 1], vertices[first * 3 + 2]];
                var p2 = [vertices[second * 3], vertices[second * 3 + 1], vertices[second * 3 + 2]];
                var p3 = [vertices[(first + 1) * 3], vertices[(first + 1) * 3 + 1], vertices[(first + 1) * 3 + 2]];
                addTri(p1, p2, p3);
                var p4 = [vertices[second * 3], vertices[second * 3 + 1], vertices[second * 3 + 2]];
                var p5 = [vertices[(second + 1) * 3], vertices[(second + 1) * 3 + 1], vertices[(second + 1) * 3 + 2]];
                var p6 = [vertices[(first + 1) * 3], vertices[(first + 1) * 3 + 1], vertices[(first + 1) * 3 + 2]];
                addTri(p4, p5, p6);
            }
        }
    }
}

////////////////////////////////////////////////////////////////////
//
//  Do not edit below this line
//
///////////////////////////////////////////////////////////////////

function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {

    
    var nverts = points.length / 4;
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
    
    // push second vertex
    points.push(x1); bary.push (0.0);
    points.push(y1); bary.push (1.0);
    points.push(z1); bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++
    
    // push third vertex
    points.push(x2); bary.push (0.0);
    points.push(y2); bary.push (0.0);
    points.push(z2); bary.push (1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}

