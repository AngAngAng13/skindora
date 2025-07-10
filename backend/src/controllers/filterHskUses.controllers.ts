import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import databaseService from '~/services/database.services'
import {
  createNewFilterHskUsesReqBody,
  disableFilterHskUsesReqBody,
  updateFilterHskUsesReqBody
} from '~/models/requests/Admin.requests'
import filterHskUsesService from '~/services/filterHskUses.services'
import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'
import { Filter } from 'mongodb'
import FilterHskUses from '~/models/schemas/FilterHskUses.schema'
import { ADMIN_MESSAGES } from '~/constants/messages'

export const getAllFilterHskUsesController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterHskUses, req.query)
}

export const createNewFilterHskUsesController = async (
  req: Request<ParamsDictionary, any, createNewFilterHskUsesReqBody>,
  res: Response
) => {
  const result = await filterHskUsesService.createNewFilterUses(req.body)
  res.json({ message: ADMIN_MESSAGES.CREATE_NEW_FILTER_USES_SUCCESS, result })
}

export const getFilterHskUsesByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params
  const result = await databaseService.filterHskUses.findOne({ _id: new ObjectId(_id) })
  res.json({ data: result })
}

export const updateFilterHskUsesController = async (
  req: Request<{ _id: string }, any, updateFilterHskUsesReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const result = await filterHskUsesService.updateFilterUses(_id, req.body)
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_USES_SUCCESS, result })
}

export const disableFilterHskUsesController = async (
  req: Request<{ _id: string }, any, disableFilterHskUsesReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body
  const currentDate = new Date()
  const vietnamTimezoneOffset = 7 * 60
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

  const result = await databaseService.filterHskUses.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: { state, updated_at: localTime } },
    { returnDocument: 'after' }
  )
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_USES_STATE_SUCCESS, data: result })
}

export const searchFilterHskUsesController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterHskUses> = {}
  if (keyword) {
    filter.option_name = { $regex: keyword as string, $options: 'i' }
  }
  await sendPaginatedResponse(res, next, databaseService.filterHskUses, req.query, filter)
}
