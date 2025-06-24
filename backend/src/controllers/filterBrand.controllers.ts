import databaseService from '~/services/database.services'
import { Request, Response, NextFunction } from 'express'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import { ParamsDictionary } from 'express-serve-static-core'
import { updateFilterBrandReqBody } from '~/models/requests/Admin.requests'
import filterBrandService from '~/services/filterBrand.services'
import { ADMIN_MESSAGES } from '~/constants/messages'

export const getAllFilterBrandsController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterBrand, req.query)
}

export const updateFilterBrandController = async (
  req: Request<ParamsDictionary, any, updateFilterBrandReqBody>,
  res: Response
) => {
  try {
    const { _id } = req.params
    const result = await filterBrandService.updateFilterBrand(_id, req.body)
    if (!result) {
      res.status(404).json({
        message: ADMIN_MESSAGES.FILTER_BRAND_NOT_FOUND
      })
    }
    res.json({
      message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_SUCCESS,
      result
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_FAILED,
        error: error.message
      })
    } else {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_FAILED,
        error: 'An unexpected error occurred'
      })
    }
  }
}
