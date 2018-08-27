'use strict';

const response = require('./response');
const request = require('http').Server;

const micro = fn => request((req, res) => response(req, res, fn));

module.exports = micro;
