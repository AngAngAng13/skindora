import { Router } from 'express'
import {
  emailVerifyTokenController,
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  addToWishListValidator,
  getWishListValidator,
  removeFromWishListValidator
} from '~/middlewares/users.middlewares'
import {
  addToWishListController,
  getWishListController,
  removeFromWishListController
} from '~/controllers/products.controller'
import { wrapAsync } from '~/utils/handler'

const usersRouter = Router()
usersRouter.route('/').get(loginController)
usersRouter.route('/').get(loginController)

usersRouter.post('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))
usersRouter.post('/addToWishList', addToWishListValidator, wrapAsync(addToWishListController))
usersRouter.put('/:userID/removeFromWishList', removeFromWishListValidator, wrapAsync(removeFromWishListController))
usersRouter.get('/:userID/getWishList', getWishListValidator, wrapAsync(getWishListController))

export default usersRouter
