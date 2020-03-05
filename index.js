"use strict";

const micro = require("./lib/micro");

module.exports = micro;

exports = micro;
exports.micro = micro;
exports.default = micro;
exports.error = require("./lib/error");
exports.form = require("./lib/parse/form");
exports.json = require("./lib/parse/json");
exports.text = require("./lib/parse/text");
exports.buffer = require("./lib/parse/buffer");
