import querystring from "querystring";

import text from "./text.js";

const form = body => querystring.parse(body);

export default (req, opts) => text(req, opts).then(body => form(body));
