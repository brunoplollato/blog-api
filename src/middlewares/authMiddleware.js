// const jwt = require('../utils/jwt')
const createError = require('http-errors')
const jwt = require('../utils/jwt')

const authorize = (roles) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({status: 'error', message: 'Authorization token not found'})
  }
  
  try {
    const {payload} = await jwt.verifyAccessToken(token)
    const { id, roleName, emailVerified } = payload

    if (!roles.includes(roleName))
      return next(res.status(401).json({status: 'error', message: 'Unauthorized access, need the right role'}))
    
    if (!emailVerified) 
      return next(res.status(401).json({status: 'error', message: 'Email not verified'}))
    
    req.user = { id, roleName };
    next()
  } catch (error) {
    return next(createError(error))
  }
}

module.exports = authorize