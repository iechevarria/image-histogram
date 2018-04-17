#!/usr/bin/env node

let argv = require('optimist')
    .usage('Usage: image-histogram OPTIONS { file or uri }')
    .demand(1)
    .describe('cols', 'number of columns to use for output')
    .argv
;
let hist = require('../')(argv);
let request = require('request');
let fs = require('fs');

let file = argv._[0];

if (/^https?:/.test(file)) request(file).pipe(hist);
else if (file === '-') process.stdin.pipe(hist);
else fs.createReadStream(file).pipe(hist);

hist.pipe(process.stdout);
