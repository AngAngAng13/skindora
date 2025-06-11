import { wrapAsync } from '~/utils/handler';
import { accessTokenValidator } from '~/middlewares/users.middlewares';
import { Router } from 'express'
import { createOrderController, getAllOrdersController, getCurrentOrderController, getOrderByIdController, prepareOrderController } from '~/controllers/orders.controllers'
import { isAdminValidator } from '~/middlewares/admin.middlewares';

const ordersRouter = Router()

ordersRouter.route('/')
.get(accessTokenValidator, isAdminValidator, wrapAsync(getAllOrdersController))
.post(accessTokenValidator, wrapAsync(createOrderController))

ordersRouter.route('/prepare')
.post(accessTokenValidator, wrapAsync(prepareOrderController))
.get(accessTokenValidator, wrapAsync(getCurrentOrderController))

ordersRouter.route('/:id')
.get(accessTokenValidator, isAdminValidator, wrapAsync(getOrderByIdController))


export default ordersRouter
