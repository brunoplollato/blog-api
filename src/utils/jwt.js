const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../environments')

module.exports = {
  signAccessToken(payload) {
    return new Promise((resolve, reject) => { 
      jwt.sign({payload}, ACCESS_TOKEN_SECRET, {expiresIn: '1h'}, (err, token) => { 
        if (err)
          reject(createError.InternalServerError(err))
        
        resolve(token)
      })
    })
  },
  signRefreshToken(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign({payload}, REFRESH_TOKEN_SECRET, {expiresIn: '30d'}, (err, token) => { 
        if (err)
          reject(createError.InternalServerError(err))
        
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
        console.log("🚀 ~ file: jwt.js:42 ~ jwt.verify ~ token:", token)
        if (err) {
          console.log("🚀 ~ file: jwt.js:43 ~ jwt.verify ~ err:", err)
          const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
          return reject(createError(message))
        }

        resolve(decoded)
      })
    })
  }
}