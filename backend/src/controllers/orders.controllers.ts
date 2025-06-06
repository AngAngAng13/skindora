import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { ORDER_MESSAGES } from '~/constants/messages'
import { OrderParams, OrderReqBody, PrepareOrderPayload } from '~/models/requests/Orders.requests'
import ordersService from '~/services/orders.services'

const testUserId = new ObjectId("683ff8f7c748f46be21bc097")

export const prepareOrderController = async (req: Request<PrepareOrderPayload>, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    // const user = req.user
    const result = await ordersService.prepareOrder(testUserId, req.body)
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
    // const user = req.user
    const result = await ordersService.createOrder(req.body, testUserId)
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

export const getCurrentOrderController = async (req: Request, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    // const user = req.user
    const result = await ordersService.getCurrentOrder(testUserId)
    res.json({
      message: ORDER_MESSAGES.GET_CURRENT_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof Error ? 400 : 500
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_CURRENT_FAIL,
      error: errorMessage
    })
  }
}

export const getAllOrdersController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    // const user = req.user
    const result = await ordersService.getAllOrders()
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

export const getAllOrdersByUserIdController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    // const user = req.user
    const result = await ordersService.getAllOrdersByUserId(testUserId)
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

export const getOrderByIdController = async (req: Request<OrderParams>, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    // const user = req.user
    const {id} = req.params
    const result = await ordersService.getOrderById(id)
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

export const getOrderDetailByOrderIdController = async (req: Request<OrderParams, any, OrderReqBody>, res: Response) => {
  try {
    //Giả sử req.user tồn tại
    // const user = req.user
    const {id} = req.params
    const result = await ordersService.getOrderDetailByOrderId(id)
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

