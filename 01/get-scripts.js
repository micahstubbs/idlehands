const sys = require('sys')
const exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

const scripts = [
  "js/vendor/processing.js ",
  "js/vendor/jquery-2.1.4.min.js",
  "js/vendor/jquery-ui.min.js",
  "js/vendor/rhill-voronoi-core.js",
  "js/vendor/three.js",
  "js/vendor/stats.min.js",
  "js/vendor/seedrandom.js",
  "js/vendor/leap-0.6.4.min.js",
  "js/vendor/inheritance.js",
  "js/vendor/tracery.js",
  "js/vendor/simplex_noise.js",
  "js/utilities.js",
  "js/utilities-three.js",
  "js/utilities-ui.js",
  "js/language.js",
  "js/hand.js",
  "js/world.js",
  "js/app.js"
]

scripts.forEach(script => {
  const command = `curl -O http://www.galaxykate.com/apps/idlehands/${script}`;
  exec(command, puts);
})

