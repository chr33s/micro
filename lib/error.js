import http from 'http'

class MicroError extends Error {
  constructor (args) {
    let { statusMessage, statusCode = 500, expose = false } = args

    if (!expose) {
      statusMessage = http.STATUS_CODES[statusCode]
    }

    super(statusMessage)

    Error.captureStackTrace(this, this.constructor)

    this.statusCode = statusCode

    Object.keys(args).map(k => (this[k] = args[k]))

    if (process.env.NODE_ENV !== 'test') {
      console.error(this)
    }
  }
}

export default args => new MicroError(args)
