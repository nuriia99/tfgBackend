import jwt from 'jsonwebtoken'
import Worker from '../models/Trabajador.js'
import { handleError } from './errors.js'

export const verifyUser = async (req, res, next) => {
  // verify authetication
  const { authoritation } = req.headers
  if (!authoritation) {
    return next(handleError(401, 'You are not authorized!'))
  }

  const token = authoritation.split(' ')[1]
  try {
    const validation = jwt.verify(token, process.env.JWT_SECRET)
    try {
      req.user = await Worker.findOne({ _id: validation.id })
      res.status(200)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    next(handleError(403, 'You are not authorized!'))
  }
}
