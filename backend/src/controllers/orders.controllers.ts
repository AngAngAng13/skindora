import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CART_MESSAGES, ORDER_MESSAGES } from '~/constants/messages'
import { OrderReqBody } from '~/models/requests/Orders.requests'
import ordersService from '~/services/orders.services'

export const prepareOrderController = async (req: Request, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    const user = req.user
    const result = await ordersService.prepareOrder(user)
    res.json({
      message: ORDER_MESSAGES.PREPARED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof Error ? 400 : 500
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.PREPARED_FAILED,
      error: errorMessage
    })
  }
}

export const createOrderController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    const user = req.user
    const result = await ordersService.createOrder(req.body, user)
    res.json({
      message: ORDER_MESSAGES.CREATED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof Error ? 400 : 500
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CREATED_FAILED,
      error: errorMessage
    })
  }
}
