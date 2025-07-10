import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { createNewFilterBrandReqBody, UpdateUserStateReqBody } from '~/models/requests/Admin.requests'
import { updateProductReqBody, UpdateProductStateReqBody } from '~/models/requests/Product.requests'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import databaseService from '~/services/database.services'
import filterBrandService from '~/services/filterBrand.services'
import productService from '~/services/product.services'
import usersService from '~/services/users.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'

export const getAllUserController = async (req: Request, res: Response, next: NextFunction) => {
  sendPaginatedResponse(res, next, databaseService.users, req.query)
}

export const getUserDetailController = async (req: Request, res: Response) => {
  const { _id } = req.params
  const user = await usersService.getUserDetail(_id)
  res.json({
    message: ADMIN_MESSAGES.GET_USER_DETAIL_SUCCESS,
    result: user
  })
}

export const createNewFilterBrandController = async (
  req: Request<ParamsDictionary, any, createNewFilterBrandReqBody>,
  res: Response
) => {
  try {
    const result = await filterBrandService.createNewFilterBrand(req.body)
    res.json({
      message: ADMIN_MESSAGES.CREATE_NEW_FILTER_BRAND_SUCCESS,
      result
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : HTTP_STATUS.INTERNAL_SERVER_ERROR
    res.status(500).json({ error: errorMessage })
  }
}

export const updateProductController = async (
  req: Request<ParamsDictionary, any, updateProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params
    const result = await productService.updateProduct(_id, req.body)
    if (!result) {
      res.status(404).json({
        message: ADMIN_MESSAGES.PRODUCT_NOT_FOUND
      })
    }
    res.json({
      message: ADMIN_MESSAGES.UPDATE_PRODUCT_SUCCESS,
      result
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_PRODUCT_FAILED,
        error: error.message
      })
    } else {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_PRODUCT_FAILED,
        error: 'An unexpected error occurred'
      })
    }
  }
}

export const updateUserStateController = async (
  req: Request<ParamsDictionary, any, UpdateUserStateReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { verify } = req.body
    const { user_id } = req.decoded_authorization as TokenPayLoad

    const result = await usersService.updateUserState(id, verify, user_id)

    res.json({
      message: ADMIN_MESSAGES.UPDATE_USER_STATE_SUCCESS,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateProductStateController = async (
  req: Request<ParamsDictionary, any, UpdateProductStateReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params
    const { state } = req.body
    const { user_id } = req.decoded_authorization as TokenPayLoad

    const result = await productService.updateProductState(_id, state, user_id)

    res.json({
      message: ADMIN_MESSAGES.UPDATE_PRODUCT_STATE_SUCCESS,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
