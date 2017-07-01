const sys = require('sys')
const exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

const files = [
  "css/page.css?v=1.0",
  "css/jquery-ui.min.css?v=1.0",
  "css/jquery-ui.structure.min.css?v=1.0"
]

files.forEach(file => {
  const command = `curl -O http://www.galaxykate.com/apps/idlehands/${file}`;
  exec(command, puts);
})

