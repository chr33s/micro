import buffer from "./buffer.js";

export default (req, opts = {}) =>
  buffer(req, opts).then(body => body.toString(opts.encoding));
