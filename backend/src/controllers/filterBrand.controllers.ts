import databaseService from "~/services/database.services"
import { Request, Response, NextFunction } from 'express'
import { sendPaginatedResponse } from "~/utils/pagination.helper"

export const getAllFilterBrandsController = async (req: Request, res: Response, next: NextFunction) => {
  const projection = {
    option_name: 1,
    category_name: 1,
    category_param: 1,
    _id: 0
  }
  const filter = {}
  await sendPaginatedResponse(res, next, databaseService.filterBrand, req.query, filter, projection)
}
