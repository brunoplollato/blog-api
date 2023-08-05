const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, EMAIL_TOKEN_SECRET } = require('../environments')

module.exports = {
  signAccessToken(payload) {
    return new Promise((resolve, reject) => { 
      jwt.sign({payload}, ACCESS_TOKEN_SECRET, {expiresIn: '1h'}, (err, token) => { 
        if (err)
          reject(createError(err))
        
        resolve(token)
      })
    })
  },
  signRefreshToken(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign({payload}, REFRESH_TOKEN_SECRET, {expiresIn: '30d'}, (err, token) => { 
        if (err)
          reject(createError(err))
        
        resolve(token)
      })
    })
  },
  signEmailToken(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign({payload}, EMAIL_TOKEN_SECRET, {expiresIn: '15m'}, (err, token) => { 
        if (err)
          reject(createError(err))
        
        resolve(token)
      })
    })
  },
  verifyAccessToken(token) { 
    return new Promise((resolve, reject) => { 
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return reject(createError.Unauthorized(message))
        }

        resolve(decoded)
      })
    })
  },
  verifyRefreshToken(token) { 
    return new Promise((resolve, reject) => { 
      jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return reject(createError.Unauthorized(message))
        }

        resolve(decoded)
      })
    })
  },
  verifyEmailToken(token) { 
    return new Promise((resolve, reject) => { 
      jwt.verify(token, EMAIL_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return reject(createError.Unauthorized(message))
        }

        resolve(decoded)
      })
    })
  }
}