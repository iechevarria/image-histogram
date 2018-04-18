let PNG = require('png-js');
let charm = require('charm');
let x256 = require('x256');
let buffers = require('buffers');
let es = require('event-stream');

let Stream = require('stream').Stream;

module.exports = (opts) => {
  if (!opts) opts = {};
  if (!opts.cols) opts.cols = 80;
  if (!opts.rows) opts.rows = 20;
  
  let c = charm();
  let bufs = buffers();
  
  let ws = es.writeArray(function (err, bufs) {
    let data = buffers(bufs).slice();
    let png = new PNG(data);

    png.decode(function (pixels) {
      let r = new Array(256).fill(0);
      let g = new Array(256).fill(0);
      let b = new Array(256).fill(0);

      for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
          let i = (y * png.width + x) * 4;
          if (pixels[i + 3] > 0) {
            r[pixels[i]]++;
            g[pixels[i + 1]]++;
            b[pixels[i + 2]]++; 
          }
        }
      }

      console.log(Math.max(Math.max.apply(null, r), Math.max.apply(null, g), Math.max.apply(null, b)));

      let rc = new Array(opts.cols).fill(0);
      let rg = new Array(opts.cols).fill(0);
      let rb = new Array(opts.cols).fill(0);
      let cts = new Array(opts.cols).fill(0);
      // if bucket has three, multiply by 4/3 to preserve continuity
      for (let k = 0; k < 256; k++) {
        
      }

      for (let i = 0; i < opts.rows; i++) {
        for (let j = 0; j < opts.cols; j++) {
          // console.log("r[" + i + "]: " +  "-".repeat(80 * r[i] / Math.max.apply(null, r)));
          c.background(x256([255, 0, 0])).write(' ');
        }
        c.display('reset').write('\r\n');
      }

      // let dy = Math.max(Math.max.apply(null, r), Math.max.apply(null, g), Math.max.apply(null, b)) / opts.rows;
      // let dx = png.width / opts.cols;

      c.display('reset').end();
    });  
  });
  
  return es.duplex(ws, c);
};
