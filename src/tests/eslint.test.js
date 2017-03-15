const lint = require('mocha-eslint');

const paths = [
  'src/*.js',
  '!*test.js',
];

lint(paths, { compact: true });
