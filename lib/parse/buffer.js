'use strict';

const error = require('../error');

const weakMap = new WeakMap();

const defaults = {
  limit: '1MB'
};

const size = str => {
  const units = {
    BYTES: 1,
    KB: 3,
    MB: 6,
    GB: 9,
    TB: 12
  };

  const regexp = new RegExp(`(${Object.keys(units).join('|')})$`);
  const u = str.toUpperCase().match(regexp)[0];
  const s = parseInt(str) || 1;

  return s * Math.pow(10, units[u]);
};

const buffer = (req, opts) =>
  new Promise((resolve, reject) => {
    opts = Object.assign(defaults, opts);

    const length = parseInt(req.headers['content-length']);
    const limit = size(opts.limit);
    const body = weakMap.get(req);
    let buf = [];
    let len = 0;

    if (body) return resolve(body);

    req
      .on('data', data => {
        len += data.length;
        if (len > limit) {
          reject(
            error({
              statusMessage: 'request entity too large',
              statusCode: 413
            })
          );

          return;
        }

        buf.push(data);
      })
      .on('error', err => {
        err.statusMessage = 'Invalid body';
        err.statusCode = 400;

        reject(error(err));
      })
      .on('end', () => {
        if (len !== length) {
          reject(
            error({
              statusMessage: 'request size did not match content length',
              statusCode: 400
            })
          );

          return;
        }

        buf = Buffer.concat(buf);

        weakMap.set(req, buf);

        resolve(buf);
      });
  });

module.exports = (req, opts = defaults) => buffer(req, opts);
