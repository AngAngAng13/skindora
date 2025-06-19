import { Router } from 'express'
import { staffGetAllProductController } from '~/controllers/staffs.controllers'
import { isStaffValidator } from '~/middlewares/staff.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const staffRouter = Router()
staffRouter.get('/manage-products/get-all', accessTokenValidator, isStaffValidator, wrapAsync(staffGetAllProductController))
export default staffRouter
