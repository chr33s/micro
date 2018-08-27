'use strict';

const response = (req, res, fn) =>
  Promise.resolve(fn(req, res))
    .catch(err => {
      res.statusCode = err.statusCode || 500;

      return err.statusMessage;
    })
    .then(body => {
      let contentLength = res.getHeader('Content-Length');
      let contentType = res.getHeader('Content-Type');

      if (body === null) {
        res.statusCode = 204;
        body = undefined;
      } else if (body !== undefined) {
        res.statusCode = res.statusCode || 200;
      }

      if (Buffer.isBuffer(body)) {
        if (!contentType) {
          contentType = 'application/octet-stream';
        }

        contentLength = body.length;
      } else if (body !== undefined) {
        if (!contentType) {
          if (typeof body === 'object' || typeof body === 'number') {
            contentType = 'application/json; charset=utf-8';
          } else {
            contentType = 'text/plain';
          }
        }

        if (contentType.startsWith('application/json')) {
          body = JSON.stringify(body);
        }

        contentLength = Buffer.byteLength(body);
      }

      res.setHeader('Content-Type', contentType || 'text/plain');
      res.setHeader('Content-Length', contentLength || 0);

      res.end(body);
    });

module.exports = response;
