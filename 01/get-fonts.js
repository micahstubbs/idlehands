const sys = require('sys')
const exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

const files = [
  "css/fonts/Alissya.ttf",
  "css/fonts/Lato-Light.ttf"
]

files.forEach(file => {
  const command = `curl -O http://www.galaxykate.com/apps/idlehands/${file}`;
  exec(command, puts);
})

