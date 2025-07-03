import { Router } from 'express'
import { getAllProductController, userGetAllProductController } from '~/controllers/products.controllers'
import { isAdminValidator } from '~/middlewares/admin.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
import { getProductDetailController } from '~/controllers/products.controllers'
const productRouter = Router()
productRouter.get('/get-all', wrapAsync(userGetAllProductController))
productRouter.get('/:_id', wrapAsync(getProductDetailController))
export default productRouter
