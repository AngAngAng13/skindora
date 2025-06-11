import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ORDER_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { OrderParams, OrderReqBody } from '~/models/requests/Orders.requests'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import ordersService from '~/services/orders.services'

export const prepareOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await ordersService.prepareOrder(user_id, req.body)
    res.json({
      message: ORDER_MESSAGES.PREPARED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.PREPARED_FAILED,
      error: errorMessage
    })
  }
}

export const createOrderController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await ordersService.createOrder(req.body, user_id)
    res.json({
      message: ORDER_MESSAGES.CREATED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CREATED_FAILED,
      error: errorMessage
    })
  }
}

export const getCurrentOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await ordersService.getCurrentOrder(user_id)
    res.json({
      message: ORDER_MESSAGES.GET_CURRENT_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_CURRENT_FAIL,
      error: errorMessage
    })
  }
}

export const getAllOrdersController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  try {
    const result = await ordersService.getAllOrders()
    res.json({
      message: ORDER_MESSAGES.GET_ALL_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_ALL_FAIL,
      error: errorMessage
    })
  }
}

export const getAllOrdersByAuthUserController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await ordersService.getAllOrdersByAuthUser(user_id)
    res.json({
      message: ORDER_MESSAGES.GET_ORDER_BY_USER_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_ORDER_BY_USER_FAIL,
      error: errorMessage
    })
  }
}

export const getOrderByIdController = async (req: Request<OrderParams>, res: Response) => {
  try {
    const { id } = req.params
    const result = await ordersService.getOrderById(id)
    res.json({
      message: ORDER_MESSAGES.GET_ORDER_BY_ID_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_ORDER_BY_ID_FAIL,
      error: errorMessage
    })
  }
}

