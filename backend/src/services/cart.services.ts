import databaseService from './database.services'
import redisClient from './redis.services'
import { ObjectId } from 'mongodb'
import { AddToCartPayload, ProductInCart, UpdateCartPayload } from '~/models/requests/Cart.requests'

class CartService {
  async addToCart(payload: AddToCartPayload, userId: ObjectId) {
    const { ProductID, Quantity } = payload

    if (!ProductID || Quantity === undefined || Quantity === null) {
      throw new Error('ProductID and Quantity are required')
    }

    this.validateQuantity(Quantity)

    const product = await this.getProductById(ProductID)
    const cartKey = this.getCartKey(userId)
    const cart = (await this.getCart(cartKey)) || { Products: [] }
    const productIndex = this.findProductIndex(cart, ProductID)
    const existingQty = productIndex > -1 ? cart.Products[productIndex].Quantity : 0
    const totalRequested = existingQty + Quantity

    if (totalRequested > (product.quantity || 0)) {
      throw new Error(`Only ${product.quantity || 0} items available in stock`)
    }

    if (productIndex > -1) {
      cart.Products[productIndex].Quantity = totalRequested
    } else {
      cart.Products.push({ ProductID, Quantity })
    }

    await redisClient.set(cartKey, JSON.stringify(cart))
    await redisClient.expire(cartKey, 60 * 60 * 24)
  }

  async fetchCart(userId: ObjectId) {
    const cartKey = this.getCartKey(userId)
    const cart = await this.getCart(cartKey)
    //Config response sau
    return cart ? cart : { Products: [] }
  }

  async updateProductQuantityInCart(payload: UpdateCartPayload, productId: string, userId: ObjectId) {
    const { Quantity } = payload

    //Input validation
    if (!productId || Quantity === undefined || Quantity === null) {
      throw new Error('ProductID and Quantity are required')
    }

    this.validateQuantity(Quantity, true)

    const product = await this.getProductById(productId)
    const cartKey = this.getCartKey(userId)
    const cart = await this.getCart(cartKey)
    if (!cart) {
      throw new Error('Cart not found')
    }

    const productIndex = this.findProductIndex(cart, productId)
    if (productIndex < 0) {
      throw new Error('Product not found in cart')
    }

    //Quantity update logic
    if (Quantity === 0) {
      cart.Products.splice(productIndex, 1) //Remove product
    } else {
      if (Quantity > (product.quantity || 0)) {
        throw new Error(`Only ${product.quantity || 0} items available in stock`)
      }

      cart.Products[productIndex].Quantity = Quantity
    }

    await this.saveCart(cartKey, cart)
    return cart
  }

  async removeProductFromCart(productId: string, userId: ObjectId) {
    const cartKey = this.getCartKey(userId)
    let cart = await this.getCart(cartKey)
    if (!cart) {
      throw new Error('Cart not found')
    }

    const productIndex = cart.Products.findIndex((p: ProductInCart) => p.ProductID.toString() === productId.toString())
    if (productIndex < 0) {
      throw new Error('Product not found in cart')
    }
    cart.Products.splice(productIndex, 1)

    await this.saveCart(cartKey, cart)
    //Config response sau
    return cart
  }

  async getCart(cartKey: string) {
    const existingCart = await redisClient.get(cartKey)
    if (existingCart) {
      return JSON.parse(existingCart)
    }
  }

  async saveCart(cartKey: string, cartData: any) {
    await redisClient.set(cartKey, JSON.stringify(cartData))
    await redisClient.expire(cartKey, 60 * 60 * 24)
  }

  private getCartKey(userId: ObjectId | string) {
    return `${process.env.REDIS_CART}:${userId}`
  }

  private validateQuantity(quantity: any, allowZero = false) {
    const isValid = typeof quantity === 'number' && Number.isInteger(quantity)
    if (!isValid || (!allowZero && quantity <= 0) || (allowZero && quantity < 0)) {
      throw new Error(`Quantity must be a ${allowZero ? 'non-negative' : 'positive'} integer`)
    }
  }

  private async getProductById(id: string) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(id)
    })

    if (!product) {
      throw new Error(`Product not found with id ${id}`)
    }

    if (typeof product.quantity !== 'number' || product.quantity <= 0) {
      throw new Error('Product is out of stock')
    }

    return product
  }

  private findProductIndex(cart: any, productId: string) {
    return cart.Products.findIndex((p: ProductInCart) => p.ProductID === productId)
  }
}
const cartService = new CartService()
export default cartService
