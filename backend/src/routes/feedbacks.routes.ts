import { Router } from 'express'
import { wrapAsync } from '~/utils/handler'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import {
  addNewFeedBackController,
  updateFeedBackController,
  removeFeedBackController,
  getFeedBackController
} from '~/controllers/products.controller'
import {
  addNewFeedBackValidator,
  updateFeedBackValidator,
  removeFeedBackValidator
} from '~/middlewares/feedbacks.middlewares'

const feedBacksRouter = Router()

feedBacksRouter.post(
  '/:orderId/products/:productId/review',
  accessTokenValidator,
  addNewFeedBackValidator,
  wrapAsync(addNewFeedBackController)
)
feedBacksRouter.put(
  '/:orderId/products/:productId/review',
  accessTokenValidator,
  updateFeedBackValidator,
  wrapAsync(updateFeedBackController)
)
feedBacksRouter.delete(
  '/:orderId/products/:productId/review',
  accessTokenValidator,
  removeFeedBackValidator,
  wrapAsync(removeFeedBackController)
)
feedBacksRouter.get('/:productId/review', wrapAsync(getFeedBackController))

export default feedBacksRouter
