import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { handleError } from '../utils/errors.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    })
    await newUser.save()
    res.status(200).json(newUser)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const loginUser = await User.findOne({ username: req.body.username })
    if (!loginUser) return next(handleError(404, 'That user does not exists!'))
    const passwordCorrect = await bcrypt.compare(req.body.password, loginUser.password)
    if (!passwordCorrect) return next(handleError(400, 'The password or the username is incorrect!'))

    const token = jwt.sign({ id: loginUser._doc._id, isAdmin: loginUser._doc.isAdmin }, process.env.JWT)

    const { password, isAdmin, ...otherDetails } = loginUser._doc
    res.cookie('access_token', token, {
      httpOnly: true
    }).status(200).json(otherDetails)
  } catch (error) {
    next(error)
  }
}
