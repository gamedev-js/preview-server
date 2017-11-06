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
  const fs = require('fs');
  const ip = require('ip');
  const qrcode = require('qrcode-terminal');
  const { spawn } = require('child_process');

  function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
  }

  let addr = ip.address();
  let url = `http://${addr}:${option.port}/${option.entry}`;

  console.log(blue(url));
  qrcode.generate(url, code => {
    console.log(code);

    let cmd = 'http-server';
    let args = [
      path.join(cwd,option.file), '-a', 'localhost', '-p', option.port, '-c-1'
    ];

    if (process.platform === 'win32') {
      cmd = 'cmd';
      args = [
        '/s', '/c', 'http-server',
        path.join(cwd, option.file), '-a', 'localhost', '-p', option.port, '-c-1'
      ];
    }

    spawn(cmd, args, { stdio: 'inherit' });
  });
})();