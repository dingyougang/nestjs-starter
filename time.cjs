/* eslint-disable @typescript-eslint/no-require-imports */
// 测试时间
const { spawn } = require('child_process');
const process = spawn('npm', ['run', 'test']);

const dateBegin = new Date();
process.stdout.on('data', (data) => {
  console.log('stdout=====》:', data.toString());
  if (data.toString().includes('Ran all test suites.')) {
    const dateEnd = new Date();
    console.log(`测试时间1：${dateEnd - dateBegin}ms`);
    process.kill();
  }
});
process.stderr.on('data', (data) => {
  console.error('error:', data.toString());
});
process.on('close', (code) => {
  const dateEnd = new Date();
  console.log(`测试时间2：${dateEnd - dateBegin}ms`);
  console.log(`child process exited with code ${code}`);
});
