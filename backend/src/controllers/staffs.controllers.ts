import { sendPaginatedResponse } from '~/utils/pagination.helper'
import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'

export const staffGetAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  const projection = {
    _id: 0,
    created_at: 0,
    updated_at: 0,
  }
  const filter = {}
  await sendPaginatedResponse(res, next, databaseService.products, req.query, filter, projection)
}
