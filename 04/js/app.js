$(document).keyup(function(e) {
	console.log(e.keyCode)


});

$(document).keydown(function(e) {
	console.log(e.keyCode)

});

var screenSize = new Vector();
var world, hands, voronoiSites, handSites, grammar;
var leapController;

var frameMax = 12000000;

$(document).ready(function() {

	console.log("start");


	utilities.createProcessing($("#world"), function(time) {
			world.update(time);

		}, function(g, t) {
			world.draw(g, t);

			for (var i = 0; i < handSites.length; i++) {

				var p = handSites[i]

				g.fill(i * .013, 0.5, 1);
				g.noStroke();
				//g.ellipse(p.x, p.y, 15, 15);

			}
		},
		function(g) {
			screenSize.x = g.width;
			screenSize.y = g.height;
			world = new World();

		});



	utilities.createThree($("#three"), function(scene) {



		var ambLight = new THREE.AmbientLight(0x404040);
		scene.add(ambLight);

		var ptLight = new THREE.PointLight(0xffffff, 3, 300);
		ptLight.position.set(80, 5, 60);
		scene.add(ptLight);
		scene.add(new THREE.PointLightHelper(ptLight, 3));

		//	scene.add(createAxes(6));

		var worldHandHolder = new THREE.Object3D();
		worldHandHolder.scale.set(.8, .8, .8);
		scene.add(worldHandHolder);


		var handHolder = new THREE.Object3D();
		var scale = .25;
		handHolder.scale.set(scale, scale, scale);
		scene.add(handHolder);
		handHolder.rotateZ(Math.PI);
		handHolder.rotateX(Math.PI * .7);
		handHolder.position.z -= 40;

		// Create hands
		hands = [new Hand(handHolder, worldHandHolder, -1), new Hand(handHolder, worldHandHolder, 1)];

		// get all the voronoi sites
		handSites = hands[0].getFingerPoints().concat(hands[1].getFingerPoints());



	}, function(time, scene, camera) {

		hands[0].update(time, scene, camera);
		hands[1].update(time, scene, camera);
	});

	voronoiSites = world.particles.concat(handSites);
	initLeap();

	
	//createPoem();
});

function createPoem() {
	grammar = tracery.createGrammar(createLanguageGrammar(), true);
	//$("#poems").html("");
poemCount = 3000 * (2 + Math.random());

	function createOnePoem(count) {
		setTimeout(function() {
			var x = (Math.random() * 60);
	var y = (Math.random() * 60);

			var div = $("<div>", {
				class: "poem",
				html: grammar.flatten("#sentence#")
			}).css({
				left: x + "%",
				top: y + "%",
opacity: count*.2 + .1
			});

			$("#poems").append(div);


			div.animate({
				left: (x + 20) + "%",
				top: (y + Math.random()*40- 20) + "%",
				opacity: 0,
			}, poemCount * 1.2)

			div.fadeIn();

			setTimeout(function() {
				div.remove();
			}, poemCount * .8);
		}, 600*count);


	}
	
	for (var i = 0; i < 5; i++) {
		createOnePoem(i + Math.random()*.2);
	}


	setTimeout(function() {
		createPoem();
	}, poemCount*1);
}



function initLeap() {
	var leapCount = 0;
	var controller = new Leap.Controller();
	controller.connect();

	Leap.loop(function(frame) {
		leapCount++;
		// console.log(leapCount);
		frame.hands.forEach(function(hand, index) {
			hands[index].setToLeap(hand);
			if (leapCount % 100 === index) {
				//  console.log(hand);
			}
		});

	});


}