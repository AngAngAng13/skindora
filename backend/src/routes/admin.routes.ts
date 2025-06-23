import { Router } from 'express'
import {
  createNewFilterBrandController,
  getAllUserController,
  getUserDetailController
} from '~/controllers/admin.controllers'
import {
  createNewProductController,
  getAllProductController,
  getProductDetailController
} from '~/controllers/products.controllers'
import {
  createNewFilterBrandValidator,
  createNewProductValidator,
  isAdminValidator,
  isValidToActiveValidator
} from '~/middlewares/admin.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
import {
  createVoucherController,
  updateVoucherController,
  inactiveVoucherController,
  getAllVoucherForAdminController
} from '~/controllers/voucher.controllers'
import { filterMiddleware, parseDateFieldsMiddleware } from '~/middlewares/common.middlewares'
import { createVoucherValidator, updateVoucherValidator, voucherIdValidator } from '~/middlewares/voucher.middlewares'
import { CreateNewVoucherReqBody, UpdateVoucherReqBody } from '~/models/requests/Vouchers.request'

const adminRouter = Router()
//user management
adminRouter.get('/manage-users/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllUserController))
adminRouter.get('/manage-users/:_id', accessTokenValidator, isAdminValidator, wrapAsync(getUserDetailController))
adminRouter.get(
  '/manage-vouchers/get-all',
  accessTokenValidator,
  isAdminValidator,
  wrapAsync(getAllVoucherForAdminController)
)
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
  parseDateFieldsMiddleware(['startDate', 'endDate']),
  createVoucherValidator,
  wrapAsync(createVoucherController)
)
adminRouter.put(
  '/manage-vouchers/:voucherId',
  accessTokenValidator,
  isAdminValidator,
  voucherIdValidator,
  parseDateFieldsMiddleware(['endDate']),
  filterMiddleware<UpdateVoucherReqBody>([
    'description',
    'discountType',
    'discountValue',
    'endDate',
    'maxDiscountAmount',
    'minOrderValue',
    'usageLimit',
    'userUsageLimit'
  ]),
  updateVoucherValidator,
  wrapAsync(updateVoucherController)
)
adminRouter.put(
  '/manage-vouchers/:voucherId/status',
  accessTokenValidator,
  isAdminValidator,
  voucherIdValidator,
  isValidToActiveValidator,
  wrapAsync(inactiveVoucherController)
)

//product management
adminRouter.get('/manage-products/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllProductController))
adminRouter.post(
  '/manage-products/create-new-product',
  accessTokenValidator,
  isAdminValidator,
  createNewProductValidator,
  wrapAsync(createNewProductController)
)
adminRouter.get('/manage-products/:_id', accessTokenValidator, isAdminValidator, wrapAsync(getProductDetailController))

//manage filter
//filter-brand
adminRouter.post(
  '/manage-filters/create-new-filter-brand',
  accessTokenValidator,
  isAdminValidator,
  createNewFilterBrandValidator,
  wrapAsync(createNewFilterBrandController)
)
export default adminRouter
