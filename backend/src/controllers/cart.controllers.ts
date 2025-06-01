import { Request, Response } from 'express'
import { CART_MESSAGES } from '~/constants/messages'
import cartService from '~/services/cart.services'

export const addToCartController = async (req: Request, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    const user = req.user
    const result = await cartService.addToCart(req.body, user)
    res.json({
      message: CART_MESSAGES.ADDED_SUCCESS,
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

export const getCartController = async (req: Request, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    const user = req.user
    const result = await cartService.getCart(user)
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

export const updateCartController = async (req: Request, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    const user = req.user
    const result = await cartService.updateProductQuantityInCart(req.body, user)
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
export const removeFromCartController = async (req: Request, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    const user = req.user
    const result = await cartService.removeProductFromCart(req.body, user)
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
