import { Router } from 'express'
import { wrapAsync } from '~/utils/handler'
import createOrder from '~/services/Payments/zalopay.service'
import { createPaymentUrlController } from '~/controllers/payments.controller'

const paymentsRouter = Router()

paymentsRouter.post('/zalopay', wrapAsync(createOrder))
paymentsRouter.post('/vnpay', wrapAsync(createPaymentUrlController))

export default paymentsRouter
