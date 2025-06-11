import cartService from './cart.services'
import redisClient from './redis.services'
import databaseService from './database.services'
import { OrderStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { OrderReqBody, PrepareOrderPayload, ProductInOrder, TempOrder } from '~/models/requests/Orders.requests'
import { ProductInCart } from '~/models/requests/Cart.requests'
import { ErrorWithStatus } from '~/models/Errors'
import { CART_MESSAGES, ORDER_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import Product from '~/models/schemas/Product.schema'

class OrdersService {
  async prepareOrder(userId: string, payload: PrepareOrderPayload) {
    const cartKey = cartService.getCartKey(userId)
    const cart = await cartService.getCart(cartKey)
    if (!cart || !cart.Products || cart.Products?.length <= 0) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.EMPTY_OR_EXPIRED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const productIdsInCart = cart.Products.map((p: ProductInCart) => p.ProductID)
    const invalidIDs = payload.selectedProductIDs.filter((id) => !productIdsInCart.includes(id))

    if (invalidIDs.length > 0) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.NOT_IN_CART,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const selectedProducts = cart.Products.filter((p: ProductInCart) =>
      payload.selectedProductIDs.includes(p.ProductID)
    )
    if (!selectedProducts || selectedProducts.length === 0) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.NOT_SELECTED,
        status: HTTP_STATUS.NOT_FOUND
      })
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
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', p.ProductID),
            status: HTTP_STATUS.NOT_FOUND
          })
        }
        if (!product.quantity || product.quantity < p.Quantity) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace(
              '%s',
              `${product.quantity} item${Number(product.quantity) > 1 ? 's' : ''}`
            ),
            status: HTTP_STATUS.BAD_REQUEST
          })
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

  async createOrder(payload: OrderReqBody, userId: string) {
    //Kiểm tra thông tin đơn hàng(thêm sau)
    if (!payload.ShipAddress || !payload.RequireDate) {
      throw new Error('ShipAddress and RequireDate are required')
    }

    const tempOrderKey = this.getTempOrderKey(userId)
    const tempOrder: TempOrder = await this.getTempOrder(tempOrderKey)

    if (!tempOrder) {
      throw new Error('No order found or it has expired')
    }

    const status = OrderStatus.PENDING
    //insert order into db
    const order = await databaseService.orders.insertOne({
      UserID: new ObjectId(userId),
      ShipAddress: payload.ShipAddress,
      Description: payload.Description ?? '',
      RequireDate: payload.RequireDate || new Date().toISOString(),
      // ShippedDate?: string
      Status: status
    })
    const orderId = order.insertedId

    //insert order details into db
    let finalPrice = 0

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
      await redisClient.set(cartKey, JSON.stringify({ Products: remainingProducts }), { EX: 24 * 60 * 60 })
    }
    await redisClient.del(tempOrderKey)

    //Trả thông tin đơn hàng đã tạo
    return {
      orderId: orderId.toString(),
      orderDetails: orderDetail,
      status: status
    }
  }

  async getCurrentOrder(userId: string) {
    const orderKey = this.getTempOrderKey(userId)
    const order = await this.getTempOrder(orderKey)
    if (!order || order.Products.length <= 0) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.EMPTY_OR_EXPIRED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return order
  }

  getTempOrderKey(userId: ObjectId | string) {
    return `${process.env.TEMP_ORDER_KEY}${userId}`
  }

  async getTempOrder(tempOrderKey: string) {
    const tempOrder = await redisClient.get(tempOrderKey)
    if (tempOrder) {
      return JSON.parse(tempOrder)
    }
  }

  async getAllOrders() {
    //Nhúng orderDetail nếu cần
    return await databaseService.orders.find({}).toArray()
  }

  async getAllOrdersByAuthUser(userId: string) {
    const orders = await databaseService.orders.find({ UserID: new ObjectId(userId) }).toArray()
    if (orders.length === 0) return []

    const orderIds = orders.map((order) => order._id)
    const orderDetails = await databaseService.orderDetails.find({ OrderID: { $in: orderIds } }).toArray()

    const productIds = [...new Set(orderDetails.map(orderDetail => orderDetail.ProductID?.toString()))].map(id => new ObjectId(id))
    const products = await databaseService.products
    .find({_id: {$in: productIds}})
    .project({_id: 1, name_on_list: 1, image_on_list: 1, price_on_list: 1})
    .toArray()

    const productInfoMap = new Map(
      products.map((product) => [product._id.toString(), {
        productId: product._id,
        name: product.name_on_list,
        image: product.image_on_list,
        price: product.price_on_list
      }])
    )
    const orderDetailMapping = orderDetails.reduce((map, detail) => {
      const key = detail.OrderID?.toString() || ''
      const productInfo = productInfoMap.get(detail.ProductID?.toString())

      const {OrderID, ProductID, ...restDetail} = detail

      if (!map.has(key)) map.set(key, [])
      map.get(key)?.push({...restDetail, Products: productInfo})
      return map
    }, new Map<string, any[]>())

    const orderList = orders.map((order) => ({
      orderId: order._id,
      orderDetail: orderDetailMapping.get(order._id.toString())
    }))

    return orderList
  }

  async getOrderById(id: string) {
    const order = await databaseService.orders.findOne({ _id: new ObjectId(id) })
    if (!order) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.NOT_FOUND.replace('%s', id),
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const orderDetail = await this.getOrderDetailByOrderId(id)
    const details = orderDetail.map(o => {
      const {OrderID, ...detail} = o
      return detail
    })
    return {
      ...order,
      orderDetail: details
    }
  }

  async getOrderDetailByOrderId(id: string) {
    const orderDetails = await databaseService.orderDetails.find({ OrderID: new ObjectId(id) }).toArray()
    return orderDetails
  }
}

const ordersService = new OrdersService()
export default ordersService
