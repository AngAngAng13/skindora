import { Router } from 'express'
import { addToCartController, getCartController, removeFromCartController, updateCartController } from '~/controllers/cart.controllers'

const cartRouter = Router()

cartRouter.route('/')
.get(getCartController)
.post(addToCartController)

cartRouter.route('/:productId')
.patch(updateCartController)
.delete(removeFromCartController)


export default cartRouter
