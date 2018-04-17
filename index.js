let PNG = require('png-js');
let charm = require('charm');
let x256 = require('x256');
let buffers = require('buffers');
let es = require('event-stream');

let Stream = require('stream').Stream;

module.exports = (opts) => {
    if (!opts) opts = {};
    if (!opts.cols) opts.cols = 80;
    
    let c = charm();
    let bufs = buffers();
    
    let ws = es.writeArray(function (err, bufs) {
        let data = buffers(bufs).slice();
        let png = new PNG(data);
        
        // png.decode(function (pixels) {
        //     let dx = png.width / opts.cols;
        //     let dy = 2 * dx;
            
        //     for (let y = 0; y < png.height; y += dy) {
        //         for (let x = 0; x < png.width; x += dx) {
        //             let i = (Math.floor(y) * png.width + Math.floor(x)) * 4;
                    
        //             let ix = x256([ pixels[i], pixels[i+1], pixels[i+2] ]);
        //             if (pixels[i+3] > 0) {
        //                 c.background(ix).write(' ');
        //             }
        //             else {
        //                 c.display('reset').write(' ');
        //             }
        //         }
        //         c.display('reset').write('\r\n');
        //     }
            
        //     c.display('reset').end();
        // });
        png.decode(function (pixels) {
            let r = new Array(256).fill(0);
            let g = new Array(256).fill(0);
            let b = new Array(256).fill(0);

            for (let y = 0; y < png.height; y++) {
                for (let x = 0; x < png.width; x++) {
                    let i = (y * png.width + x) * 4;
                    r[pixels[i]] += 1;
                    g[pixels[i + 1]] += 1;
                    b[pixels[i + 2]] += 1; 
                }
            }

            let m = Math.max(Math.max.apply(null, r), Math.max.apply(null, g), Math.max.apply(null, b));
            console.log(m);
        });

        
    });
    
    return es.duplex(ws, c);
};
