#!/usr/bin/env node

'ues strict';

const help = `
  Usage: preview [options] [path]

  Options:
    -h, --help      Print this usage message.
    -p, --port      Specify the port.
    -e, --entry     Specify the entry dir.
`;
const cwd = process.cwd();

(() => {
  const argv = process.argv.slice(2);
  const option = {
    port: 8001,
    entry: '',
    help: false,
    file: './',
  };

  for (let i = 0; i < argv.length; ++i) {
    if (argv[i] === '--port' || argv[i] === '-p') {
      option.port = argv[++i];
    } else if (argv[i] === '--entry' || argv[i] === '-e') {
      option.entry = argv[++i];
    } else if (argv[i] === '--help' || argv[i] === '-h') {
      option.help = true;
      break;
    } else {
      option.file = argv[i];
    }
  }

  // print help message
  if (option.help) {
    console.log(help);
    return;
  }

  //
  const path = require('path');
  const ip = require('ip');
  const qrcode = require('qrcode-terminal');
  const crossSpawn = require('cross-spawn');

  function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
  }

  let addr = ip.address();
  let url = `http://${addr}:${option.port}/${option.entry}`;

  console.log(blue(url));
  qrcode.generate(url, code => {
    console.log(code);

    // METHOD 1
    // DISABLE: we use cross-spawn to solve this problem {
    // let cmd = './node_modules/.bin/http-server';
    // let args = [
    //   path.join(cwd,option.file), '-a', addr, '-p', option.port, '-c-1'
    // ];

    // if (process.platform === 'win32') {
    //   cmd = 'cmd';
    //   args = [
    //     '/s', '/c', '.\\node_modules\\.bin\\http-server',
    //     path.join(cwd, option.file), '-a', addr, '-p', option.port, '-c-1'
    //   ];
    // }
    // } DISABLE

    // METHOD 2: without crossSpawn
    // const httpServer = require('http-server');
    // const server = httpServer.createServer({
    //   root: path.join(cwd, option.file),
    //   cache: -1,
    // });
    // server.listen(option.port, addr);

    let cmd = './node_modules/.bin/http-server';
    let args = [
      path.join(cwd,option.file), '-a', addr, '-p', option.port, '-c-1'
    ];

    crossSpawn(cmd, args, { stdio: 'inherit' });
  });
})();