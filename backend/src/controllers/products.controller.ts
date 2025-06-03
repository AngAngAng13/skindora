import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { PRODUCTS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import productService from '~/services/Products/product.services'

export const addToWishListController = async (req: Request, res: Response) => {
  const { productId, userID } = req.body

  const user = databaseService.users.findOne({ _id: new ObjectId(userID) })

  if (!user) {
    res.status(404).json({ status: 404, message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }

  if (!productId || !Array.isArray(productId) || productId.length === 0) {
    res.status(400).json({ status: 400, message: PRODUCTS_MESSAGES.EMPTY_PRODUCT_LIST })
    return
  }

  try {
    await productService.addToWishList(userID, productId)
    res.status(200).json({ status: 200, message: PRODUCTS_MESSAGES.PRODUCT_ADDED_TO_WISHLIST })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const getWishListController = async (req: Request, res: Response) => {
  const userID = req.params.userID

  try {
    const wistList = await productService.getWishList(userID)
    res.status(200).json({ status: 200, data: wistList })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const removeFromWishListController = async (req: Request, res: Response) => {
  const userID = req.params.userID
  const productID = req.body.productId

  try {
    const wistList = await productService.removeFromWishList(userID, productID)
    res.status(200).json({ status: 200, data: wistList })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}
