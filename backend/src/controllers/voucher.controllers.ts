import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import voucherService from '~/services/voucher.services'
import { ErrorWithStatus } from '~/models/Errors'

export const getAllVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.vouchers, req.query)
}

export const createVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await voucherService.createNewVoucher(req.body)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
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
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}

export const inactiveVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { voucherId } = req.params ?? ''
    const response = await voucherService.inactiveVoucher(voucherId)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}
