import databaseService from './database.services'
import redisClient from './redis.services'

class CartService {
  async addToCart(payload, user) {
    const { ProductID, Quantity } = payload
    if (!ProductID || !Quantity) {
      throw new Error('ProductID and Quantity are required')
    }
    const product = await databaseService.products.findOne({ _id: ProductID })
    if (!product || Quantity <= 0) {
      throw new Error('Product is not available')
    }

    const cartKey = `cart:${user._id.toString()}`
    let cart = await this.getCartByUserID(user._id.toString())
    if (!cart) {
      cart = { Products: [] }
    }

    const productIndex = cart.Products.findIndex((p) => p.ProductID.toString() === ProductID.toString())

    if (productIndex > -1) {
      cart.Products[productIndex].Quantity += Quantity
    } else {
      cart.Products.push({
        ProductID,
        Quantity
      })
    }

    await redisClient.set(cartKey, JSON.stringify(cart))
    await redisClient.expire(cartKey, 60 * 60 * 24)
  }

  async getCart(user) {
    let cart = await this.getCartByUserID(user._id.toString())
    //Config response sau
    return cart ? cart : { Products: [] }
  }

  async updateProductQuantityInCart(payload, user) {
    const { ProductID, Quantity } = payload
    const cartKey = `cart:${user._id.toString()}`
    if (!ProductID || !Quantity) {
      throw new Error('ProductID and Quantity are required')
    }
    let cart = await this.getCartByUserID(user._id.toString())
    if (!cart) {
      throw new Error('Cart not found')
    }
    const productIndex = cart.Products.findIndex((p) => p.ProductID.toString() === ProductID.toString())
    if (productIndex < 0) {
      throw new Error('Product not found in cart')
    }
    if (Quantity <= 0) {
      cart.Products.splice(productIndex, 1) //Remove product if quantity is 0 or less
    } else {
      cart.Products[productIndex].Quantity = Quantity //Update quantity
    }
    await this.saveCart(cartKey, cart)
    //Config response sau
    return cart
  }

  async removeProductFromCart(payload, user){
    const cartKey = `cart:${user._id.toString()}`
    let cart = await this.getCartByUserID(user._id.toString())
    if(!cart){
      throw new Error('Cart not found')
    }

    const productIndex = cart.Products.findIndex((p) => p.ProductID.toString() === payload.ProductID.toString())
    if(productIndex < 0){
      throw new Error('Product not found in cart')
    }
    cart.Products.splice(productIndex, 1)
    await this.saveCart(cartKey, cart)
    //Config response sau
    return cart
  }

  private async getCartByUserID(userID: string) {
    const cartKey = `cart:${userID}`
    const existingCart = await redisClient.get(cartKey)
    if (existingCart) {
      return JSON.parse(existingCart)
    }
  }

  private async saveCart(cartKey: string, cartData: any) {
  await redisClient.set(cartKey, JSON.stringify(cartData))
  await redisClient.expire(cartKey, 60 * 60 * 24)
}

}
const cartService = new CartService()
export default cartService
