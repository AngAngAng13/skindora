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

    if (typeof Quantity !== 'number' || !Number.isInteger(Quantity) || Quantity <= 0) {
      throw new Error('Quantity must be a positive integer')
    }

    const productId = new ObjectId(ProductID)
    const product = await databaseService.products.findOne({ _id: productId })

    if (!product) {
      throw new Error(`Product not found with id ${ProductID}`)
    }

    if (!product.quantity || typeof product.quantity !== 'number' || product.quantity <= 0) {
      throw new Error('Product is out of stock')
    }

    const cartKey = `${process.env.REDIS_CART}:${userId.toString()}`
    let cart = (await this.getCartByUserID(userId.toString())) || { Products: [] }

    const productIndex = cart.Products.findIndex((p: ProductInCart) => p.ProductID === ProductID)
    const existingQty = productIndex > -1 ? cart.Products[productIndex].Quantity : 0
    const totalRequested = existingQty + Quantity

    if (totalRequested > product.quantity) {
      throw new Error(`Only ${product.quantity} items available in stock`)
    }

    if (productIndex > -1) {
      cart.Products[productIndex].Quantity = totalRequested
    } else {
      cart.Products.push({ ProductID, Quantity })
    }

    await redisClient.set(cartKey, JSON.stringify(cart))
    await redisClient.expire(cartKey, 60 * 60 * 24)
  }

  async getCart(userId: ObjectId) {
    let cart = await this.getCartByUserID(userId.toString())
    //Config response sau
    return cart ? cart : { Products: [] }
  }

  async updateProductQuantityInCart(
  payload: UpdateCartPayload,
  productId: string,
  userId: ObjectId
) {
  const cartKey = `${process.env.REDIS_CART}:${userId.toString()}`;
  const { Quantity } = payload;

  //Input validation
  if (!productId || Quantity === undefined || Quantity === null) {
    throw new Error('ProductID and Quantity are required');
  }

  if (typeof Quantity !== 'number' || !Number.isInteger(Quantity) || Quantity < 0) {
    throw new Error('Quantity must be a non-negative integer');
  }

  const product = await databaseService.products.findOne({
    _id: new ObjectId(productId),
  });

  if (!product) {
    throw new Error(`Product not found with id ${productId}`);
  }

  if (typeof product.quantity !== 'number' || product.quantity <= 0) {
    throw new Error('Product is out of stock');
  }

  const cart = await this.getCartByUserID(userId.toString());
  if (!cart) {
    throw new Error('Cart not found');
  }

  const productIndex = cart.Products.findIndex(
    (p: ProductInCart) => p.ProductID.toString() === productId
  );

  if (productIndex < 0) {
    throw new Error('Product not found in cart');
  }

  //Quantity update logic
  if (Quantity === 0) {
    cart.Products.splice(productIndex, 1); //Remove product
  } else {
    if (Quantity > product.quantity) {
      throw new Error(`Only ${product.quantity} items available in stock`);
    }

    cart.Products[productIndex].Quantity = Quantity;
  }

  await this.saveCart(cartKey, cart);
  return cart;
}


  async removeProductFromCart(productId: string, userId: ObjectId) {
    const cartKey = `${process.env.REDIS_CART}:${userId.toString()}`

    let cart = await this.getCartByUserID(userId.toString())
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

  async getCartByUserID(userID: string) {
    const cartKey = `${process.env.REDIS_CART}:${userID}`
    const existingCart = await redisClient.get(cartKey)
    if (existingCart) {
      return JSON.parse(existingCart)
    }
  }

  async saveCart(cartKey: string, cartData: any) {
    await redisClient.set(cartKey, JSON.stringify(cartData))
    await redisClient.expire(cartKey, 60 * 60 * 24)
  }
}
const cartService = new CartService()
export default cartService
