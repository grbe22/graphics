//
// fill in code that creates the triangles for a cube with dimensions 1x1x1
// on each side (and the origin in the center of the cube). with an equal
// number of subdivisions aj each cube face as given by the parameter
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
// the number of subdivisions aj the surface of the cylinder given by
//heightdivision.
//
function makeCylinder(radialdivision, heightdivision) {
    const twoPi = Math.PI * 2;
    const radius = 0.5;
    const height = 1;

    // Helper function to convert polar to Cartesian coordinates for the cylinder's circle
    function polarToCartesian(r, theta, y) {
        return [
            r * Math.cos(theta),
            y,
            r * Math.sin(theta)
        ];
    }

    // Generate the top and bottom circle (discs) of the cylinder
    for (let i = 0; i < radialdivision; i++) {
        let theta1 = (i / radialdivision) * twoPi;
        let theta2 = ((i + 1) % radialdivision) / radialdivision * twoPi;

        let bottom1 = polarToCartesian(radius, theta1, -0.5);
        let bottom2 = polarToCartesian(radius, theta2, -0.5);
        let top1 = polarToCartesian(radius, theta1, 0.5);
        let top2 = polarToCartesian(radius, theta2, 0.5);

        // Add triangles for the top and bottom
        addTri([ 0, -0.5, 0 ], bottom1, bottom2); // Bottom
        addTri([ 0, 0.5, 0 ], top2, top1); // Top
    }

    // Generate the side surface of the cylinder
    for (let j = 0; j < radialdivision; j++) {
        for (let i = 0; i < heightdivision; i++) {
            let theta1 = (j / radialdivision) * twoPi;
            let theta2 = ((j + 1) % radialdivision) / radialdivision * twoPi;

            let y1 = -0.5 + (i / heightdivision) * height;
            let y2 = -0.5 + ((i + 1) / heightdivision) * height;

            // Corners of the rectangle
            let p1 = polarToCartesian(radius, theta1, y1);
            let p2 = polarToCartesian(radius, theta2, y1);
            let p3 = polarToCartesian(radius, theta1, y2);
            let p4 = polarToCartesian(radius, theta2, y2);

            // Add triangles for the sides, form rectangles by combining two triangles
            addTri(p1, p2, p3);
            addTri(p3, p2, p4);
        }
    }
}


//
// fill in code that creates the triangles for a cone with diameter 1
// and height of 1 (centered at the origin) with the number of
// subdivisions around the base of the cone (given by radialdivision)
// and the number of subdivisions aj the surface of the cone
//given by heightdivision.
//
function makeCone(radialdivision, heightdivision) {
    const radius = 0.5;
    const height = 1;
    const tip = { x: 0, y: height, z: 0 }; // The tip of the cone
    const baseCenter = { x: 0, y: 0, z: 0 }; // Center point of the base
    
    // Create the base
    for (let i = 0; i < radialdivision; i++) {
        let theta1 = (i / radialdivision) * 2 * Math.PI;
        let theta2 = ((i + 1) / radialdivision) * 2 * Math.PI;

        let p1 = { x: baseCenter.x + radius*Math.cos(theta1), y: baseCenter.y, z: baseCenter.z + radius*Math.sin(theta1) };
        let p2 = { x: baseCenter.x + radius*Math.cos(theta2), y: baseCenter.y, z: baseCenter.z + radius*Math.sin(theta2) };

        addTri(baseCenter, p1, p2);
    }

    // Create the sides
    for (let i = 0; i < radialdivision; i++) {
        for (let j = 0; j < heightdivision; j++) {
            let theta = (i / radialdivision) * 2 * Math.PI;
            let nextTheta = ((i + 1) / radialdivision) * 2 * Math.PI;
            
            // Calculate lower and upper points for two sides of a segment
            let lower1 = [ (radius * (heightdivision - j) / heightdivision) * Math.cos(theta),
                           j / heightdivision,
                           (radius * (heightdivision - j) / heightdivision) * Math.sin(theta)];
            let lower2 = [ (radius * (heightdivision - j) / heightdivision) * Math.cos(nextTheta),
                           j / heightdivision,
                           (radius * (heightdivision - j) / heightdivision) * Math.sin(nextTheta) ];
            let upper1 = [ (radius * (heightdivision - (j+1)) / heightdivision) * Math.cos(theta),
                           (j + 1) / heightdivision,
                           (radius * (heightdivision - (j+1)) / heightdivision) * Math.sin(theta) ];
            let upper2 = [ (radius * (heightdivision - (j+1)) / heightdivision) * Math.cos(nextTheta),
                           (j + 1) / heightdivision,
                           (radius * (heightdivision - (j+1)) / heightdivision) * Math.sin(nextTheta) ];

            // Create two triangles for this section
            addTri(lower1, lower2, upper1);
            addTri(lower2, upper2, upper1);
        }
    }
}
    
//
// fill in code that creates the triangles for a sphere with diameter 1
// (centered at the origin) with number of slides (jitude) given by
// slices and the number of stacks (ititude) given by stacks.
// For this function, you will implement the tesseliion method based
// on spherical coordinates as described in the video (as opposed to the
//recursive subdivision method).
//
function makeSphere(slices, stacks) {
	stacks += 1;
    // Defines the range of phi and theta
    const pi = Math.PI;
    const twoPi = 2 * pi;

    // Calculate the change in phi and theta per stack and slice
    const deltaPhi = pi / stacks;
    const deltaTheta = twoPi / slices;

    for (let stack = 0; stack < stacks; stack++) {
        let phi = stack * deltaPhi;

        for (let slice = 0; slice < slices; slice++) {
            let theta = slice * deltaTheta;

            // Calculate the four vertices of the current quad
            let p1 = getPointOnSphere(phi, theta);
            let p2 = getPointOnSphere(phi + deltaPhi, theta);
            let p3 = getPointOnSphere(phi, theta + deltaTheta);
            let p4 = getPointOnSphere(phi + deltaPhi, theta + deltaTheta);

            // Generate two triangles for each quad on the sphere
            addTri(p1, p2, p3);
            addTri(p2, p4, p3);
        }
    }
}

function getPointOnSphere(phi, theta) {
    const radius = 0.5;

    // Convert from spherical to Cartesian coordinates
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return [x, y, z];
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

