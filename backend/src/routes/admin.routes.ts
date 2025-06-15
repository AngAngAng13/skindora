import { Router } from 'express'
import { getAllUserController } from '~/controllers/admin.controllers'
import {
  getAllVoucherController,
  createVoucherController,
  updateVoucherController,
  inactiveVoucherController
} from '~/controllers/voucher.controllers'
import { isAdminValidator } from '~/middlewares/admin.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { CreateNewVoucherReqBody } from '~/models/requests/Vouchers.request'
import { wrapAsync } from '~/utils/handler'

const adminRouter = Router()

adminRouter.get('/manage-users/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllUserController))
adminRouter.get('/manage-vouchers/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllVoucherController))
adminRouter.post(
  '/manage-vouchers',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<CreateNewVoucherReqBody>([
    'code',
    'description',
    'discountType',
    'discountValue',
    'startDate',
    'endDate',
    'maxDiscountAmount',
    'minOrderValue',
    'usageLimit',
    'userUsageLimit'
  ]),
  wrapAsync(createVoucherController)
)
adminRouter.put(
  '/manage-vouchers/:voucherId',
  accessTokenValidator,
  isAdminValidator,
  filterMiddleware<CreateNewVoucherReqBody>([
    'code',
    'description',
    'discountType',
    'discountValue',
    'startDate',
    'endDate',
    'maxDiscountAmount',
    'minOrderValue',
    'usageLimit',
    'userUsageLimit'
  ]),
  wrapAsync(updateVoucherController)
)
adminRouter.put(
  '/manage-vouchers/:voucherId/inactive',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(inactiveVoucherController)
)

export default adminRouter
