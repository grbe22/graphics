class cgIShape {
    constructor () {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }
    
	// IMO all functions should accept a three-vector input, not x, y, z, x, y, z, x, y, z.
	addTri(p1, p2, p3) {
		this.addTriangle(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
	}
	
    addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        var nverts = this.points.length / 4;
        
        // push first vertex
        this.points.push(x0);  this.bary.push (1.0);
        this.points.push(y0);  this.bary.push (0.0);
        this.points.push(z0);  this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
        
        // push second vertex
        this.points.push(x1); this.bary.push (0.0);
        this.points.push(y1); this.bary.push (1.0);
        this.points.push(z1); this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++
        
        // push third vertex
        this.points.push(x2); this.bary.push (0.0);
        this.points.push(y2); this.bary.push (0.0);
        this.points.push(z2); this.bary.push (1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {
    
    constructor (subdivisions) {
        super();
        this.makeCube (subdivisions);
    }
    
    makeCube (subdivisions)  {
        var w = 0.5;
		// quality control
		if (subdivisions < 1) {
			subdivisions = 1;
		}
		this.genFace(w, 0, 0, subdivisions);
		this.genFace(w, Math.PI / 2, 0, subdivisions);
		this.genFace(w, Math.PI, 0, subdivisions);
		this.genFace(w, 3 * (Math.PI / 2), 0, subdivisions);
		this.genFace(w, 0, Math.PI / 2, subdivisions);
		this.genFace(w, 0, 3 * (Math.PI / 2), subdivisions);
	}



	genFace(w, xRot, zRot, subdivisions) {
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
		points = this.multiplyMatrices(points, rx);
		points = this.multiplyMatrices(points, rz);
		this.drawFace(points, subdivisions, w);
	}

	// simple matrix multiplication algorithm. Stolen off stackoverflow.
	multiplyMatrices(a, b) {
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

	drawFace(points, subdivisions) {
		if (subdivisions == 1) {
			super.addTri(points[0], points[1], points[2]);
			super.addTri(points[2], points[3], points[0]);
		} else {
			for (let i = 0; i < 4; i ++) {
				let pts = [];
				for (let j = 0; j < 4; j ++) {
					pts.push(this.vec3Avg(points[i], points[j]));
				}
				this.drawFace(pts, subdivisions - 1);
			}
		}
	}

	vec3Avg(father, p) {
		var point = [];
		point.push((father[0] + p[0]) / 2);
		point.push((father[1] + p[1]) / 2);
		point.push((father[2] + p[2]) / 2);
		return point;
	}
}


class Cylinder extends cgIShape {

    constructor (radialdivision,heightdivision) {
        super();
        this.makeCylinder (radialdivision,heightdivision);
    }
    
    makeCylinder (radialdivision,heightdivision){
        // fill in your cylinder code here
    }
}

class Cone extends cgIShape {

    constructor (radialdivision, heightdivision) {
        super();
        this.makeCone (radialdivision, heightdivision);
    }
    
    
    makeCone (radialdivision, heightdivision) {
    
        // Fill in your cone code here.
    }
}
    
class Sphere extends cgIShape {

    constructor (slices, stacks) {
        super();
        this.makeSphere (slices, stacks);
    }
    
    makeSphere (slices, stacks) {
        // fill in your sphere code here
    }

}


function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

