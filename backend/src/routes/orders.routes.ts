import { Router } from 'express'
import { createOrderController, getAllOrdersController, getCurrentOrderController, getOrderByIdController, getOrderDetailByOrderIdController, prepareOrderController } from '~/controllers/orders.controllers'

const ordersRouter = Router()

ordersRouter.route('/')
.get(getAllOrdersController)
.post(createOrderController)

ordersRouter.route('/prepare')
.post(prepareOrderController)
.get(getCurrentOrderController)

ordersRouter.route('/:id')
.get(getOrderByIdController)

ordersRouter.route('/:id/detail')
.get(getOrderDetailByOrderIdController)


export default ordersRouter
