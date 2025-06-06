import cartService from './cart.services'
import redisClient from './redis.services'
import databaseService from './database.services'
import { OrderStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { OrderReqBody, PrepareOrderPayload, ProductInOrder, TempOrder } from '~/models/requests/Orders.requests'
import { ProductInCart } from '~/models/requests/Cart.requests'
import Product from '~/models/schemas/Products/Product.schema'

class OrdersService {
  async prepareOrder(userId: ObjectId, payload: PrepareOrderPayload) {
    const cartKey = cartService.getCartKey(userId)
    const cart = await cartService.getCart(cartKey)
    console.log("cart: ", cart)
    if (!cart || !cart.Products || cart.Products?.length <= 0) {
      throw new Error('Cart is empty or expired')
    }

    const selectedProducts = cart.Products.filter((p: ProductInCart) =>
      payload.selectedProductIDs.includes(p.ProductID)
    )
    if (!selectedProducts || selectedProducts.length === 0) {
      throw new Error('No valid products selected')
    }

    const productIds = selectedProducts.map((p: ProductInCart) => new ObjectId(p.ProductID))
    const products = await databaseService.products.find({ _id: { $in: productIds } }).toArray()
    const productMap = new Map(products.map((p: Product) => [p._id?.toString(), p]))
    let finalPrice = 0

    const tempOrder: TempOrder = {
      UserID: userId.toString(),
      Products: selectedProducts.map((p: ProductInCart) => {
        const product = productMap.get(p.ProductID)
        if (!product) {
          throw new Error(`Product not found with id ${p.ProductID}`)
        }
        if (!product.quantity || product.quantity < p.Quantity) {
          throw new Error(`Only ${product.quantity} available in stock`)
        }

        const pricePerUnit = Number.parseInt(product.price_on_list ?? '0')
        const totalPrice = p.Quantity * pricePerUnit

        finalPrice += totalPrice
        return {
          ProductID: p.ProductID,
          Quantity: p.Quantity,
          PricePerUnit: pricePerUnit,
          TotalPrice: totalPrice
        }
      }),
      TotalPrice: finalPrice,
      CreatedAt: new Date()
    }

    const tempOrderKey = this.getTempOrderKey(userId)
    //Nếu order cũ vẫn chưa expired thì ghi đè lên
    await redisClient.set(tempOrderKey, JSON.stringify(tempOrder))
    await redisClient.expire(tempOrderKey, 60 * 30)

    //Trả thông tin tạm thời về đơn hàng(thông tin products, discount, total price,...)
    return tempOrder
  }

  async createOrder(payload: OrderReqBody, userId: ObjectId) {
    //Kiểm tra thông tin đơn hàng(thêm sau)
    if (!payload.ShipAddress || !payload.RequireDate) {
      throw new Error('ShipAddress and RequireDate are required')
    }

    const tempOrderKey = this.getTempOrderKey(userId)
    const tempOrder: TempOrder = await this.getTempOrder(tempOrderKey)

    if (!tempOrder) {
      throw new Error('No order found or it has expired')
    }

    //insert order into db
    const order = await databaseService.orders.insertOne({
      UserID: userId,
      ShipAddress: payload.ShipAddress,
      Description: payload.Description ?? '',
      RequireDate: payload.RequireDate || new Date().toISOString(),
      // ShippedDate?: string
      Status: OrderStatus.PENDING
    })
    const orderId = order.insertedId

    //insert order details into db
    const orderDetail = tempOrder.Products.map((p: ProductInOrder) => {
      //cal total price for each product
      return {
        ProductID: new ObjectId(p.ProductID),
        OrderID: orderId,
        Quantity: p.Quantity.toString(),
        OrderDate: tempOrder.CreatedAt || new Date(),
        TotalPrice: p.TotalPrice.toString()
      }
    })

    await databaseService.orderDetails.insertMany(orderDetail)

    //Xoá những product đã order trong cart, tempOrder khỏi redis
    const cartKey = cartService.getCartKey(userId)
    const cart = await cartService.getCart(cartKey)
    const remainingProducts = cart.Products.filter((p: ProductInCart) => {
      const orderedProductIds = tempOrder.Products.map((p: ProductInOrder) => p.ProductID)
      return !orderedProductIds.includes(p.ProductID)
    })

    if (remainingProducts.length <= 0) {
      await redisClient.del(cartKey)
    } else {
      await redisClient.set(cartKey, JSON.stringify({Products: remainingProducts}), { EX: 24 * 60 * 60 })
    }
    await redisClient.del(tempOrderKey)

    //Trả thông tin đơn hàng đã tạo
    return {
      orderId: orderId.toString(),
      orderDetails: orderDetail
    }
  }

  async getCurrentOrder(userId: ObjectId) {
    const orderKey = this.getTempOrderKey(userId)
    const order = await this.getTempOrder(orderKey)
    if (!order || order.Products.length <= 0) {
      throw new Error('No order found or it has expired')
    }
    console.log('order: ', order)
    return order
  }

  getTempOrderKey(userId: ObjectId | string) {
    return `${process.env.REDIS_TEMP_ORDER}:${userId}`
  }

  async getTempOrder(tempOrderKey: string) {
    const tempOrder = await redisClient.get(tempOrderKey)
    if (tempOrder) {
      return JSON.parse(tempOrder)
    }
  }

  async getAllOrders() {}

  async getAllOrdersByUserId(userId: ObjectId) {}

  async getOrderById(id: string) {
    if (!id) {
      throw new Error('Id is required')
    }
  }

  async getOrderDetailByOrderId(id: string) {
    if (!id) {
      throw new Error('Id is required')
    }
  }
}

const ordersService = new OrdersService()
export default ordersService
