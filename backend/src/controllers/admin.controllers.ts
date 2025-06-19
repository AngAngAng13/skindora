import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { createNewFilterBrandReqBody } from '~/models/requests/Admin.requests'
import databaseService from '~/services/database.services'
import filterBrandService from '~/services/filterBrand.services'
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
      message: ADMIN_MESSAGES.CREATE_NEW_PRODUCT_SUCCESS,
      result
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : HTTP_STATUS.INTERNAL_SERVER_ERROR
    res.status(500).json({ error: errorMessage })
  }
}

