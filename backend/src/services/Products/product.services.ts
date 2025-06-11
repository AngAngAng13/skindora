import { ObjectId } from 'mongodb'
import redisClient from '../redis.services'
import databaseService from '../database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ProductInCache } from '~/models/requests/Cart.requests'

class ProductsService {
  async addToWishList(userID: string, productIds: string[]) {
    const key = process.env.WISHLIST_KEY + userID.toString()

    for (const id of productIds) {
      const product = await databaseService.products.findOne({
        _id: new ObjectId(id)
      })

      if (!product) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      await redisClient.sAdd(key, id.toString())
    }
  }

  async removeFromWishList(userID: string, productIds: string[]) {
    const key = process.env.WISHLIST_KEY + userID

    console.log(key)

    for (const id of productIds) {
      const product = await databaseService.products.findOne({ _id: new ObjectId(id) })

      if (!product) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      const isMember = await redisClient.sIsMember(key, id.toString())
      if (!isMember) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.PRODUCT_NOT_IN_WISH_LIST,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      await redisClient.sRem(key, id.toString())
    }
  }

  async getWishList(userID: string) {
    const key = process.env.WISHLIST_KEY + userID.toString()
    const productIds = await redisClient.sMembers(key)
    if (!productIds || productIds.length === 0) {
      return []
    }
    return productIds
  }

  async cacheProductInfo(product: ProductInCache) {
    const key = this.getProductInfoKey(product._id)
    await redisClient.hSet(key, {
      price: product.price.toString(),
      name: product.name,
      image: product.image
    })
    await redisClient.expire(key, 60 * 60 * 24)
  }

  getProductInfoKey(productId: string){
    return `${process.env.PRODUCT_INFO_KEY}${productId}`
  }
}

const productService = new ProductsService()
export default productService
