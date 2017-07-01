var World = Class.extend({

	init: function() {
		this.particles = [];
		this.sway = .2;
		this.range = .1;

		for (var i = 0; i < 25; i++) {
			var p = new Vector();
			p.x = (Math.random() - .5) * 900;
			p.y = (Math.random() - .5) * 600;
			p.radius = 10 * Math.pow(Math.random(), 2);
			this.particles.push(p);
		}


		this.voronoi = new Voronoi();
		this.bbox = {
			xl: -screenSize.x * .6,
			xr: screenSize.x * .6,
			yt: -screenSize.y * .6,
			yb: screenSize.y * .6,
		};


	},

	update: function(t) {
		for (var i = 0; i < this.particles.length; i++) {
			var p = this.particles[i];
			p.addPolar(1, utilities.noise(.2 * t.current + .1 * i));

			var rx = screenSize.x / 2 + 150;

			var ry = screenSize.y / 2 + 150;
			if (p.x > rx) {
				p.x -= rx * 2
			}
			if (p.x < -rx) {
				p.x += rx * 2
			}
			if (p.y > ry) {
				p.y -= ry * 2
			}
			if (p.y < -ry) {
				p.y += ry * 2
			}
		}
	},

	draw: function(g, t) {
		this.diagram = this.voronoi.compute(voronoiSites, this.bbox);

		if (t.frames < frameMax) {
			g.background(1);

			for (var i = 0; i < this.particles.length; i++) {
				g.fill(0);

				var p = this.particles[i];
				p.drawCircle(g, p.radius);
			}

			for (var i = 0; i < this.diagram.vertices.length; i++) {
				g.fill(.8, 1, 1);


				var p = this.diagram.vertices[i];
				g.ellipse(p.x, p.y, 4, 4);
			}


			var mid = new Vector();

			for (var i = 0; i < this.diagram.cells.length; i++) {
				var cell = this.diagram.cells[i];

				var p = cell.site;

				var thetaOffset = .30 * utilities.noise(p.x * .001, p.y * .001 + .03 * t.current + 400);

				//var thetaOffset =  i;

				var hue = utilities.noise(p.x * .003, p.y * .003 + .3 * t.current)*.5 + .5;
				//console.log(hue);
				 hue = (utilities.sCurve(hue, 2)*.4) + t.current*.1;

				var count = cell.halfedges.length;
				if (count > 0) {

					for (var j = 0; j < count; j++) {
						var e = cell.halfedges[j].edge;
						mid.setToLerp(e.va, e.vb, .5);

						var theta0 = p.getAngleTo(mid) + thetaOffset;


						var pastel = .5 + Math.sin(4 + theta0) * .4 + .5 * utilities.noise(p.x * .002, p.y * .002 + .2 * t.current);
						pastel = Math.min(Math.max(0, pastel), 1);

						g.fill((hue + pastel * .4) % 1, 1.2 * pastel + .1, 1.1 - pastel);
						g.beginShape();

						g.vertex(e.va.x, e.va.y);
						g.vertex(e.vb.x, e.vb.y);
						g.vertex(p.x, p.y);
						g.endShape(true);
					}



				}

			}


			for (var i = 0; i < this.diagram.edges.length; i++) {
				var e = this.diagram.edges[i];
				//g.line(e.va.x, e.va.y, e.vb.x, e.vb.y);
				var h = utilities.noise(.01 * e.va.x, .01 * e.va.y, t.current * .7) * .5 + .5;
				for (var j = 0; j < 1; j++) {


					g.stroke(h * .8 + .01 * j, 1 - j * .02, 0 + j * .06, .02 * j + .2);

					// noise scale
					var m = .01;
					var dx = e.vb.x - e.va.x;
					var dy = e.vb.y - e.va.y;

					var d = Math.sqrt(dx * dx + dy * dy);
					var m2 = this.sway * Math.pow(d, .3);
					var r0 = d * this.range * m2;
					var r1 = d * this.range * m2;
					var theta = Math.atan2(dy, dx);
					//	theta = 0;

					//console.log(theta);

					var dTheta0 = m2 * utilities.noise(m * e.va.x, m * e.va.y, t.current * .2 + j * .03);
					var dTheta1 = m2 * utilities.noise(m * e.vb.x, m * e.vb.y, t.current * .2 + j * .03);
					var theta0 = theta + dTheta0;
					var theta1 = theta + Math.PI + dTheta1;

					g.noFill();
					g.bezier(e.va.x, e.va.y,
						e.va.x + r0 * Math.cos(theta0), e.va.y + r0 * Math.sin(theta0),
						e.vb.x + r1 * Math.cos(theta1), e.vb.y + r1 * Math.sin(theta1),
						e.vb.x, e.vb.y);

				}
			}

		}
	},


});