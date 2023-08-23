const { execSync } = require('child_process');

try {
  cmd('docker-compose up -d')
  process.on('exit', onProcessEnd)
  process.on('SIGTERM', onProcessEnd)
  process.on('SIGINT', onProcessEnd)
  cmd('npx next dev')
} catch (err) {
  console.error(err)
}

function cmd(cmd) {
  execSync(cmd, { stdio: 'inherit'});
}

function onProcessEnd(code) {
    cmd('docker-compose down')
}