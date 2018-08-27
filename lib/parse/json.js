'use strict';

const buffer = require('./buffer');
const error = require('../error');

const json = body => {
  try {
    return JSON.parse(body);
  } catch (err) {
    err.statusCode = 400;
    err.statusMessage = 'Invalid JSON';

    throw error(err);
  }
};

module.exports = (req, opts = {}) =>
  buffer(req, opts).then(body => json(body, opts));
