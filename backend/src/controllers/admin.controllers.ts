import { Request, Response, NextFunction } from 'express'
import { ADMIN_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
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
