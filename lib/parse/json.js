import buffer from "./buffer.js";
import error from "../error.js";

const json = body => {
  try {
    return JSON.parse(body);
  } catch (err) {
    err.statusCode = 400;
    err.statusMessage = "Invalid JSON";

    throw error(err);
  }
};

export default (req, opts = {}) =>
  buffer(req, opts).then(body => json(body, opts));
