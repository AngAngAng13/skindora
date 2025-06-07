import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { PRODUCTS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import databaseService from '~/services/database.services'
import productService from '~/services/Products/product.services'
import feedBackService from '~/services/feedback.services'
import { toInteger } from 'lodash'

export const addToWishListController = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.body
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(404).json({ status: 404, message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }

  if (!productId || !Array.isArray(productId) || productId.length === 0) {
    res.status(400).json({ status: 400, message: PRODUCTS_MESSAGES.EMPTY_PRODUCT_LIST })
    return
  }

  try {
    await productService.addToWishList(user_id, productId)
    res.status(200).json({ status: 200, message: PRODUCTS_MESSAGES.PRODUCT_ADDED_TO_WISHLIST })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const getWishListController = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  try {
    const wishList = await productService.getWishList(user_id)
    res.status(200).json({ status: 200, data: wishList })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const removeFromWishListController = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const productID = req.body.productId

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  try {
    const wishList = await productService.removeFromWishList(user_id, productID)
    res.status(200).json({ status: 200, data: wishList })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const addNewFeedBackController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  const { orderId, productId } = req.params
  try {
    const response = await feedBackService.addFeedBack(user_id, orderId, productId, req.body)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const updateFeedBackController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  const { orderId, productId } = req.params
  try {
    const response = await feedBackService.updateFeedBack(user_id, orderId, productId, req.body)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const removeFeedBackController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  const { orderId, productId } = req.params
  try {
    const response = await feedBackService.removeFeedBack(user_id, orderId, productId)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const getFeedBackController = async (req: Request, res: Response) => {
  const { productId } = req.params
  const limit = parseInt(req.query.limit as string) || 10
  const currentPage = parseInt(req.query.currentPage as string) || 1

  try {
    const response = await feedBackService.getFeedback(productId, currentPage, limit)
    const { data, ...info } = response
    res.status(200).json({ status: 200, data, ...info })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}
