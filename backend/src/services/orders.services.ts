import { ProductInCart } from '~/types/cartTypes'
import cartService from './cart.services'
import redisClient from './redis.services'
import databaseService from './database.services'
import { OrderStatus } from '~/constants/enums'

class OrdersService {
  async prepareOrder(user) {
    const cart = await cartService.getCartByUserID(user._id.toString())
    if (!cart) {
      throw new Error('Cart is empty or expired')
    }

    const tempOrder = {
      UserID: user._id.toString(),
      ProductID: cart.Products.map((product: ProductInCart) => product.ProductID.toString()),
      CreatedAt: new Date()
    }

    const tempOrderKey = `temp_order:${user._id.toString()}`
    await redisClient.set(tempOrderKey, JSON.stringify(tempOrder))
    await redisClient.expire(tempOrderKey, 60 * 10)

    //Trả thông tin tạm thời về đơn hàng(thông tin products, discount, total price,...)
    return tempOrder
  }

  async createOrder(payload, user) {
    //Kiểm tra thông tin đơn hàng(thêm sau)
    if(!payload.ShipAddress || !payload.RequireDate){
      throw new Error('ShipAddress and RequireDate are required')
    }

    const cartKey = `cart:${user._id.toString()}`
    const tempOrderKey = `temp_order:${user._id.toString()}`

    const tempOrder = await redisClient.get(tempOrderKey)

    if (!tempOrder) {
      throw new Error('No temporary order found or it has expired')
    }

    const parsedTempOrder = JSON.parse(tempOrder)

    //insert order into db
    const order = await databaseService.orders.insertOne({
      UserID: user._id,
      ShipAddress: payload.ShipAddress,
      Description: payload.Description ?? '',
      RequireDate: payload.RequireDate || new Date(),
      // ShippedDate?: string
      Status: OrderStatus.CONFIRMED,
      modified_by: user._id
    })
    const orderId = order.insertedId

    //insert order details into db
    const orderDetail = parsedTempOrder.map((p: ProductInCart) => {
      //cal total price for each product
      let totalPrice = ''
      return{
        ProductID: p.ProductID,
        OrderID: orderId,
        Quantity: p.Quantity,
        OrderDate: payload.RequireDate || new Date(),
        TotalPrice: totalPrice
      }
    })

    await databaseService.orderDetails.insertMany(orderDetail)

    //Xoá cart, tempOrder khỏi redis
    await redisClient.del(cartKey)
    await redisClient.del(tempOrderKey)

    //Trả thông tin đơn hàng đã tạo
    return {
      orderId: orderId.toString(),
      orderDetails: orderDetail
    }
  }
}

const ordersService = new OrdersService()
export default ordersService
