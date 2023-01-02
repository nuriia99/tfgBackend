import jwt from 'jsonwebtoken'
import Worker from '../models/Trabajador.js'
import { handleError } from './handleErrors.js'
import CryptoJS from 'crypto-js'

export const verifyUser = async (req, res, next) => {
  // verify authetication
  const { authorization } = req.headers
  if (!authorization) {
    return next(handleError(401, 'You are not autheticated!'))
  }
  const token = authorization.split(' ')[1]
  try {
    const validation = jwt.verify(token, process.env.JWT_SECRET)
    try {
      req.user = await Worker.findOne({ _id: validation.id })
      next()
    } catch (error) {
      next(handleError(404))
      console.log(error)
    }
  } catch (error) {
    next(handleError(403, 'You are not authorized!'))
  }
}

export const encrypt = (word) => {
  return CryptoJS.AES.encrypt(word, process.env.CRYPT_WORD).toString()
}

export const decrypt = (word) => {
  return CryptoJS.AES.decrypt(word, process.env.CRYPT_WORD).toString(CryptoJS.enc.Utf8)
}
