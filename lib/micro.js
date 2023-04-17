import { Server as request } from 'http'

import response from './response.js'

export default fn => request((req, res) => response(req, res, fn))
