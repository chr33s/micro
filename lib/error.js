'use strict'

const http = require('http')

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

    console.error(this)
  }
}

module.exports = args => new MicroError(args)
