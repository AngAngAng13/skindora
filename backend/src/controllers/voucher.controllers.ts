import { Request, Response, NextFunction } from 'express'
import { sendPaginatedResponse, sendPaginatedResponseFromRedis } from '~/utils/pagination.helper'
import voucherService from '~/services/voucher.services'
import { ErrorWithStatus } from '~/models/Errors'
import { ADMIN_MESSAGES } from '~/constants/messages'
import util from 'util'
import { Filter } from 'mongodb'
import Voucher from '~/models/schemas/Voucher.schema'
import redisClient from '~/services/redis.services'
import dotenv from 'dotenv'
import databaseService from '~/services/database.services'

dotenv.config()

// Get All voucher for Users filter active Status
export const getAllVoucherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Filter<Voucher> = {}

    if (req.query.code) {
      filter.code = {
        $regex: req.query.code as string,
        $options: 'i'
      }
    }

    filter.isActive = true

    const key = process.env.VOUCHER_KEY ?? ''
    const voucherList = await redisClient.get(key)

    if (voucherList) {
      let vouchers: Voucher[] = JSON.parse(voucherList)

      vouchers = vouchers.filter((voucher) => voucher.isActive)

      if (req.query.code) {
        const regex = new RegExp(req.query.code as string, 'i')
        vouchers = vouchers.filter((voucher) => regex.test(voucher.code))
      }

      sendPaginatedResponseFromRedis(res, next, vouchers, req.query)
      return
    }

    await sendPaginatedResponse(res, next, databaseService.vouchers, req.query, filter)
  } catch (err) {
    next(err)
  }
}

// Get all voucher for admin not filter isActive Status
export const getAllVoucherForAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Filter<Voucher> = {}

    if (req.query.code) {
      filter.code = {
        $regex: req.query.code as string,
        $options: 'i'
      }
    }

    const key = process.env.VOUCHER_KEY ?? ''
    const voucherList = await redisClient.get(key)

    if (voucherList) {
      let vouchers: Voucher[] = JSON.parse(voucherList)

      if (req.query.code) {
        const regex = new RegExp(req.query.code as string, 'i')
        vouchers = vouchers.filter((voucher) => regex.test(voucher.code))
      }

      sendPaginatedResponseFromRedis(res, next, vouchers, req.query)
      return
    }

    await sendPaginatedResponse(res, next, databaseService.vouchers, req.query, filter)
  } catch (err) {
    next(err)
  }
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
