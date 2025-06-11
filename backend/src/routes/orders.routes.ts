import { wrapAsync } from '~/utils/handler';
import { accessTokenValidator } from '~/middlewares/users.middlewares';
import { Router } from 'express'
import { createOrderController, getAllOrdersController, getCurrentOrderController, getOrderByIdController, prepareOrderController } from '~/controllers/orders.controllers'

const ordersRouter = Router()

ordersRouter.route('/')
.get(accessTokenValidator, wrapAsync(getAllOrdersController))
.post(accessTokenValidator, wrapAsync(createOrderController))

ordersRouter.route('/prepare')
.post(accessTokenValidator, wrapAsync(prepareOrderController))
.get(accessTokenValidator, wrapAsync(getCurrentOrderController))

ordersRouter.route('/:id')
.get(accessTokenValidator, wrapAsync(getOrderByIdController))


export default ordersRouter
