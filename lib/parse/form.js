'use strict';

const querystring = require('querystring');
const text = require('./text');

const form = body => querystring.parse(body);

module.exports = (req, opts) => text(req, opts).then(body => form(body));
