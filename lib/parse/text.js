"use strict";

const buffer = require("./buffer");

module.exports = (req, opts = {}) =>
  buffer(req, opts).then(body => body.toString(opts.encoding));
