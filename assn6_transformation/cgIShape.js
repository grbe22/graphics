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
    
	makeCube(subdivisions) {
        // Define vertices for a unit cube
        const vertices = [
            [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], // front face
            [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], // back face
        ];

        // Define faces and their indices 
        const faces = [
            [0, 1, 2, 3], // front face
            [4, 5, 6, 7], // back face
            [3, 2, 6, 5], // top face
            [0, 4, 7, 1], // bottom face
            [2, 1, 7, 6], // left face
            [0, 3, 5, 4], // right face
        ];
        
        for (let i = 0; i < faces.length; i++) {
			const p1 = vertices[faces[i][0]];
			const p2 = vertices[faces[i][1]];
			const p3 = vertices[faces[i][2]];
			const p4 = vertices[faces[i][3]];
			
			super.addTri(p1, p2, p3); // first triangle of the face
			super.addTri(p4, p1, p3); // second triangle of the face
        }
    }
}


class Cylinder extends cgIShape {

    constructor (radialdivision,heightdivision) {
        super();
        this.makeCylinder (radialdivision,heightdivision);
    }
    
    makeCylinder (radialdivision,heightdivision){
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
				super.addTri(p1, p3, p2);
				super.addTri(p3, p4, p2);
			}
		}
    }
}

class Cone extends cgIShape {

    constructor (radialdivision, heightdivision) {
        super();
        this.makeCone (radialdivision, heightdivision);
    }
    
    
    makeCone (radialdivision, heightdivision) {
		const radius = 0.5;
		const height = 1;
		const tip = { x: 0, y: height, z: 0 }; // The tip of the cone
		const baseCenter = { x: 0, y: 0, z: 0 }; // Center point of the base

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
				super.addTri(lower2, lower1, upper1);
				super.addTri(lower2, upper1, upper2);
			}
		}
    }
}
    
class Sphere extends cgIShape {

    constructor (slices, stacks) {
        super();
        this.makeSphere (slices, stacks);
    }
    
    makeSphere (slices, stacks) {
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
				let p1 = this.getPointOnSphere(phi, theta);
				let p2 = this.getPointOnSphere(phi + deltaPhi, theta);
				let p3 = this.getPointOnSphere(phi, theta + deltaTheta);
				let p4 = this.getPointOnSphere(phi + deltaPhi, theta + deltaTheta);

				// Generate two triangles for each quad on the sphere
				super.addTri(p1, p2, p3);
				super.addTri(p2, p4, p3);
			}
		}
	}
	getPointOnSphere(phi, theta) {
		const radius = 0.5;

		// Convert from spherical to Cartesian coordinates
		const x = radius * Math.sin(phi) * Math.cos(theta);
		const y = radius * Math.sin(phi) * Math.sin(theta);
		const z = radius * Math.cos(phi);
		return [x, y, z];
	}

}


function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

