const mat = new THREE.MeshNormalMaterial({
	overdraw: 0.5
});

var Hand = Class.extend({
	init: function(scene, rootScene, xMult) {
		this.fingers = [];

		this.timeSinceLeap = 10;
		this.xMult = xMult;

		this.v = new Vector();
		this.center = new Vector(xMult * 40, 0, -20);
		this.pos = new Vector(this.center);

		this.root = new THREE.Object3D();
		this.leapRoot = new THREE.Object3D();

		rootScene.add(this.root);
		scene.add(this.leapRoot);

		this.root.scale.x = xMult;
		this.root.add(new THREE.Mesh(new THREE.BoxGeometry(2, 6, 17), mat));

		for (var i = 0; i < 5; i++) {
			this.fingers[i] = new Finger(this, i);
		}
	},

	update: function(time, scene, camera) {
		if (this.isLeapControlled) {
			if (this.timeSinceLeap > 10) {
				this.isLeapControlled = false;
				this.leapRoot.position.x = 100000;
				this.root.position.x = 0;

				console.log('Resume autocontrol');
			} else this.timeSinceLeap++;
		} else {
		}

		if (!this.isLeapControlled) {
			this.v.addSpherical(
				3,
				14 * utilities.noise(time.current * 0.60 + 10 * this.xMult),
				4 * utilities.noise(time.current * 0.70 + 10 * this.xMult)
			);

			this.pos.addMultiple(this.v, time.elapsed);
			var offset = this.pos.getOffsetTo(this.center);
			var d = offset.magnitude();
			this.v.addMultiple(offset, 0.002 * d);
			this.v.mult(0.98);
			this.v.z *= 0.85;

			this.root.up = new THREE.Vector3(0, 1, 0);
			this.root.position.set(this.pos.x, this.pos.y, this.pos.z);
			this.root.lookAt(new THREE.Vector3(0, 10, 20));
			this.root.rotateY(Math.PI / 2 * this.xMult);
			this.root.rotateX(Math.PI * 0.8);

			for (var i = 0; i < 5; i++) {
				this.fingers[i].update(time, scene, camera);
			}
		}

		for (var i = 0; i < 5; i++) {
			this.fingers[i].updateCameraPos(time, scene, camera);
		}
	},

	setToLeap: function(data) {
		this.timeSinceLeap = 0;
		this.isLeapControlled = true;

		this.leapRoot.position.x = 0;
		this.root.position.x = 1000;

		this.handData = data;

		for (var i = 0; i < 5; i++) {
			//console.log(i, data.fingers[i].positions.length);
			this.fingers[i].updateFromLeap(data.fingers[i]);
		}
	},

	getFingerPoints: function() {
		return [].concat.apply([], this.fingers.map(f => f.screenPos));
	}
});

function threeToPos(object, camera) {
	var vector = new THREE.Vector3();
	vector.setFromMatrixPosition(object.matrixWorld);

	var widthHalf = screenSize.x / 2, heightHalf = screenSize.y / 2;

	vector.project(camera);

	vector.x = vector.x * widthHalf;
	vector.y = -(vector.y * heightHalf);

	return vector;
}

var Finger = Class.extend({
	init: function(hand, index) {
		this.hand = hand;
		this.index = index;

		this.screenPos = [];

		this.leapJoints = [];

		var lengthScale = 0.8 * Math.sin(index * 0.6 + 0.45) + 0.5;

		this.root = new THREE.Object3D();

		//this.root.rotateZ(.5);
		this.root.position.z = -4 * (index - 2);
		if (index === 0) {
			this.root.position.x += -3;
			this.root.rotateY(-Math.PI * 0.3);
			this.root.rotateX(Math.PI * 0.45);
			this.root.rotateY(-0.8);
		} else {
			this.root.rotateX(-0.2 * (index - 1));
		}

		this.hand.root.add(this.root);

		this.joints = [];
		var last = new THREE.Object3D();
		this.root.add(last);
		this.joints.push(last);

		var end;
		var jointCount = 4;

		if (index === 0) jointCount--;

		for (var i = 0; i < jointCount; i++) {
			var r = 3 - i * 0.5;
			var length = 10 * (1 - 0.1 * i) * lengthScale;
			var box = new THREE.Mesh(new THREE.BoxGeometry(r, length, r), mat);
			box.position.y += length * 0.5;
			last.add(box);

			var end = new THREE.Object3D();
			end.position.y = length;
			end.rotation.z = 0.2;
			var endBox = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), mat);
			//end.add(endBox);

			last.add(end);

			last = end;
			this.joints.push(end);
			this.screenPos[i] = new Vector();

			var leapJoint = new THREE.Object3D();
			var r2 = r * 3;
			leapJoint.geo = new THREE.Mesh(new THREE.BoxGeometry(r2, r2, 2), mat);
			leapJoint.add(leapJoint.geo);
			//leapJoint.add(createAxes(5 - i * .7));
			this.hand.leapRoot.add(leapJoint);
			this.leapJoints.push(leapJoint);
		}
		//end.add(createAxes(2));
		//	console.log(this.screenPos);
	},

	updateFromLeap: function(data) {
		var root = data.positions[0];

		for (var i = 0; i < this.leapJoints.length; i++) {
			var p = new Vector(data.positions[i + 1]);
			var p0 = new Vector(data.positions[i]);
			this.leapJoints[i].position.set(p.x, p.y, p.z);

			var d = p.getDistanceTo(p0);
			this.leapJoints[i].lookAt(p0);

			this.leapJoints[i].geo.scale.z = d / 2;
			this.leapJoints[i].geo.position.z = d / 2;
		}
	},

	updateCameraPos: function(time, scene, camera) {
		for (var i = 0; i < this.joints.length; i++) {
			if (i > 0) {
				var p = threeToPos(this.joints[i], camera);

				if (this.hand.isLeapControlled) {
					p = threeToPos(this.leapJoints[i - 1], camera);
				}

				if (!Number.isNaN(p.x) && this.screenPos[i - 1]) {
					this.screenPos[i - 1].setTo(p);
				}
			}
		}
	},

	update: function(time, scene, camera) {
		for (var i = 0; i < this.joints.length; i++) {
			var curl =
				utilities.noise(
					time.current + this.index * 0.1 + 10 * this.hand.xMult
				) *
					0.5 +
				0.5;

			//curl = Math.pow(curl, 3);
			curl = utilities.sCurve(curl, 2);

			this.joints[i].rotation.z = 0.6 * (curl * Math.pow(i + 0.3, 0.5));
		}
	}
});
