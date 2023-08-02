// const jwt = require('../utils/jwt')
const createError = require('http-errors')
const jwt = require('../utils/jwt')

const authorize = (roles) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) 
    return next(createError.Unauthorized('Authorization token not found'))
  
    try {
    const {payload} = await jwt.verifyAccessToken(token)
    const { id, roleName, emailVerified } = payload

    if (!roles.includes(roleName))
      return next(createError.Unauthorized('Unauthorized access'))
    
    if (!emailVerified) 
      return next(createError.Unauthorized('Email not verified'))
    
    req.user = { id, roleName };
    next()
  } catch (error) {
    next(createError(error))
  }
}

module.exports = authorize