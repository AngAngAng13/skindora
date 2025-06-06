import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { CART_MESSAGES } from '~/constants/messages'
import { AddToCartPayload, CartParams, UpdateCartPayload } from '~/models/requests/Cart.requests'
import cartService from '~/services/cart.services'

const testUserId = new ObjectId("683ff8f7c748f46be21bc097")

export const addToCartController = async (req: Request<AddToCartPayload>, res: Response) => {
  try {

    const result = await cartService.addToCart(req.body, testUserId)
    res.json({
      message: CART_MESSAGES.ADDED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof Error ? 400 : 500
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.ADDED_FAILED,
      error: errorMessage
    })
  }
}

export const getCartController = async (req: Request, res: Response) => {
  try {

    const result = await cartService.getCart(testUserId)
    res.json({
      message: CART_MESSAGES.FETCHED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof Error ? 400 : 500
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.FETCHED_FAILED,
      error: errorMessage
    })
  }
}

export const updateCartController = async (req: Request<CartParams, UpdateCartPayload>, res: Response) => {
  try {

    const productId = req.params.productId
    const result = await cartService.updateProductQuantityInCart(req.body, productId, testUserId)
    res.json({
      message: CART_MESSAGES.UPDATED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof Error ? 400 : 500
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.UPDATED_FAILED,
      error: errorMessage
    })
  }
}
export const removeFromCartController = async (req: Request<CartParams>, res: Response) => {
  try {

    const productId = req.params.productId
    const result = await cartService.removeProductFromCart(productId, testUserId)
    res.json({
      message: CART_MESSAGES.REMOVED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof Error ? 400 : 500
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.REMOVED_FAILED,
      error: errorMessage
    })
  }
}
