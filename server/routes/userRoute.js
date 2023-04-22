import express from 'express'
import { signup } from '../controllers/authController.js'


const userRoute = express.Router()



userRoute.route('/signup').post(signup)













export default userRoute