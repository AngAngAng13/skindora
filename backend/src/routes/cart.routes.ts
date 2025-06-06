import { Router } from 'express'
import { addToCartController, clearCartController, getCartController, removeFromCartController, updateCartController } from '~/controllers/cart.controllers'

const cartRouter = Router()

cartRouter.route('/')
.get(getCartController)
.post(addToCartController)
.delete(clearCartController)

cartRouter.route('/:productId')
.patch(updateCartController)
.delete(removeFromCartController)


export default cartRouter
