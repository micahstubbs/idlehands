/**
 * @author Kate
 * Utilities for three.js
 */

/*
 * Create an arc given two points and a radius
 */
function createArcByPoints(p0, p1, r) {
	var d = p0.getDistanceTo(p1);
	var offset = p0.getOffsetTo(p1);
	var theta = Math.acos(d / r);
	var center = new Vector(p);
	center.addPolar(r, theta + offset.getAngle());
}

// Add a vertex to geometry
function addToVerts(geo, v) {
	v.vIndex = geo.vertices.length;
	geo.vertices.push(v);
}

function createFace(geo, v0, v1, v2, useColor, uvs) {
	var f0 = new THREE.Face3(v0.vIndex, v1.vIndex, v2.vIndex);
	if (useColor)
		f0.vertexColors = [v0.color, v1.color, v2.color];
	geo.faces.push(f0);
	if (uvs)
		geo.faceVertexUvs[0].push(uvs);

}

function createAxes(size) {
	var size = size*4;
	var w = size * .26;
	var w2 = size * .15;
	var base = new THREE.Mesh(new THREE.CubeGeometry(w, w, w), new THREE.MeshLambertMaterial({
		color : 0x777777
	}));
	var x = new THREE.Mesh(new THREE.CylinderGeometry(w2, 0, size, 4, 1), new THREE.MeshLambertMaterial({
		color : 0xFF0000
	}));
	var y = new THREE.Mesh(new THREE.CylinderGeometry(w2, 0, size, 4, 1), new THREE.MeshLambertMaterial({
		color : 0x00FF00
	}));
	var z = new THREE.Mesh(new THREE.CylinderGeometry(w2, 0, size, 4, 1), new THREE.MeshLambertMaterial({
		color : 0x0055FF
	}));

	x.rotateZ(Math.PI / 2);
	x.position.x += size / 2 + w / 2;
	x.rotateY(Math.PI / 4);

	z.rotateX(-Math.PI / 2);
	z.position.z += size / 2 + w / 2;
	z.rotateY(Math.PI / 4);

	y.rotateZ(Math.PI);
	y.position.y += size / 2 + w / 2;
	y.rotateY(Math.PI / 4);
	//z.rotate
	base.add(x);
	base.add(y);
	base.add(z);
	return base;

}

/*
 * create a line between two points
 */
function createLine(mesh, v0, v1, mat) {

	var geometry = new THREE.Geometry();
	geometry.vertices.push(v0, v1);

	var line = new THREE.Line(geometry, mat);
	mesh.add(line);
};

/*
 * create a tube geometry and return the rings
 * getColor(ringIndex, lengthPct, detailIndex, theta)
 */
function createTubeGeo(geo, settings) {
	var detail = settings.detail ? settings.detail : 10;
	var ringCount = settings.ringCount ? settings.ringCount : 10;

	var useColor = false;
	if (settings.getColor) {
		useColor = true;
		geo.vertexColors = [];
	}

	var rings = [];
	for (var i = 0; i < ringCount; i++) {
		rings[i] = [];
		var y = 300*i/ringCount;
		for (var j = 0; j < detail; j++) {

			var r = 100;
			var theta = j * Math.PI * 2 / detail;

			var v = new Vector(r*Math.cos(theta), r*Math.sin(theta), y);

			// Create the ring color
			if (settings.getColor) {
				v.color = settings.getColor(i, i / (ringCount - 1), j, theta);
			}

			addToVerts(geo, v);
			v.uv = new THREE.Vector2(j / detail, i / ringCount);
			rings[i][j] = v;
		}
	}

	// Create faces
	for (var i = 0; i < rings.length - 1; i++) {
		var pctY0 = Math.min(i / (rings.length - 1) * 1.4 + .16, 1);
		var pctY1 = Math.min((i + 1) / (rings.length - 1) * 1.4 + .16, 1);

		for (var j = 0; j < detail; j++) {
			var pctX0 = j / detail;
			var pctX1 = (j + 1) / detail;

			var v0 = rings[i][j];
			var v1 = rings[i + 1][j];
			var v2 = rings[i + 1][(j + 1) % detail];
			var v3 = rings[i][(j + 1) % detail];
			var uv0 = new THREE.Vector3(pctX0, pctY0);
			var uv1 = new THREE.Vector3(pctX0, pctY1);
			var uv2 = new THREE.Vector3(pctX1, pctY1);
			var uv3 = new THREE.Vector3(pctX1, pctY0);

			var uvx0 = (j) / detail;
			var uvx1 = (j + 1) / detail;

			var uvy0 = (i) / rings.length;
			var uvy1 = (i + 1) / rings.length;

			var uvs0 = [uv0, uv1, uv2];
			createFace(geo, v0, v1, v2, useColor, uvs0);

			var uvs1 = [uv2, uv3, uv0];
			createFace(geo, v2, v3, v0, useColor, uvs1);

		}
	}

	return rings;
}
