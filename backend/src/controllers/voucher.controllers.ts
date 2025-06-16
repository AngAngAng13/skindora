import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import voucherService from '~/services/voucher.services'
import { ErrorWithStatus } from '~/models/Errors'
import { ADMIN_MESSAGES } from '~/constants/messages'
import util from 'util'
import { Filter } from 'mongodb'
import Voucher from '~/models/schemas/Voucher.schema'

export const getAllVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<Voucher> = {}
  if (req.query.code) {
    filter.code = {
      $regex: req.query.code as string,
      $options: 'i'
    }
  }

  filter.isActive = true
  await sendPaginatedResponse(res, next, databaseService.vouchers, req.query, filter)
}

export const createVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await voucherService.createNewVoucher(req.body)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.code) {
      const message = util.format(ADMIN_MESSAGES.CODE_IS_DUPLICATED, error.keyValue.code)
      res.status(400).json({ message })
      return
    }
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error?.message ?? 'Internal Server Error' })
  }
}

export const updateVoucherController = async (req: Request, res: Response) => {
  try {
    const { voucherId } = req.params ?? ''
    const response = await voucherService.updateVoucher(voucherId, req.body)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.code) {
      const message = util.format(ADMIN_MESSAGES.CODE_IS_DUPLICATED, error.keyValue.code)
      res.status(400).json({ message })
      return
    }
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}

export const inactiveVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { voucherId } = req.params ?? ''
    const response = await voucherService.inactiveVoucher(voucherId, req.voucher)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}
