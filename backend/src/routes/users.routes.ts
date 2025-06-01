import { Router } from 'express'
import { forgotPasswordController, loginController, registerController, verifyForgotPasswordTokenController } from '~/controllers/users.controllers'
import { forgotPasswordValidator, loginValidator, registerValidator, verifyForgotPasswordTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const usersRouter = Router()
usersRouter.route('/').get(loginController)

usersRouter.post('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

export default usersRouter
