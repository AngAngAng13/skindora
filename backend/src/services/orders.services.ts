import cartService from './cart.services'
import redisClient from './redis.services'
import databaseService from './database.services'
import {
  CancelRequestStatus,
  DiscountType,
  OrderStatus,
  OrderType,
  PaymentStatus,
  RefundStatus
} from '~/constants/enums'
import { ObjectId } from 'mongodb'
import {
  BuyNowReqBody,
  OrderReqBody,
  PrepareOrderPayload,
  ProductInOrder,
  RevenueFilterOptions,
  TempOrder
} from '~/models/requests/Orders.requests'
import { ProductInCart } from '~/models/requests/Cart.requests'
import { ErrorWithStatus } from '~/models/Errors'
import { CART_MESSAGES, ORDER_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import OrderDetail from '~/models/schemas/Orders/OrderDetail.schema'
import Order, { CancelRequest } from '~/models/schemas/Orders/Order.schema'
import { VoucherType } from '~/models/schemas/Voucher.schema'
import c from 'config'

class OrdersService {
  private async buildTempOrder(userId: string, selectedProducts: ProductInCart[]): Promise<TempOrder> {
    const productIds = selectedProducts.map((p) => new ObjectId(p.ProductID))
    const products = await databaseService.products.find({ _id: { $in: productIds } }).toArray()
    const productMap = new Map(products.map((p) => [p._id.toString(), p]))
    let finalPrice = 0

    const tempOrder: TempOrder = {
      UserID: userId,
      Products: selectedProducts.map((p) => {
        const product = productMap.get(p.ProductID)
        if (!product)
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', p.ProductID),
            status: 404
          })

        if (!product.quantity || product.quantity < p.Quantity) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace('%s', `${product.quantity} items`),
            status: HTTP_STATUS.BAD_REQUEST
          })
        }

        const unitPrice = parseInt(product.price_on_list ?? '0')
        const totalPrice = unitPrice * p.Quantity
        finalPrice += totalPrice

        return {
          ProductID: p.ProductID,
          Quantity: p.Quantity,
          PricePerUnit: unitPrice,
          TotalPrice: totalPrice
        }
      }),
      TotalPrice: finalPrice,
      CreatedAt: new Date()
    }

    return tempOrder
  }

  async prepareOrder(userId: string, payload: PrepareOrderPayload): Promise<TempOrder> {
    const cartKey = cartService.getCartKey(userId)
    const cart = await cartService.getCart(cartKey)
    if (!cart || !cart.Products || cart.Products.length <= 0) {
      throw new ErrorWithStatus({ message: CART_MESSAGES.EMPTY_OR_EXPIRED, status: HTTP_STATUS.NOT_FOUND })
    }

    const selectedProducts = cart.Products.filter((p: ProductInCart) =>
      payload.selectedProductIDs.includes(p.ProductID)
    )
    if (selectedProducts.length === 0) {
      throw new ErrorWithStatus({ message: CART_MESSAGES.NOT_SELECTED, status: HTTP_STATUS.BAD_REQUEST })
    }

    const tempOrder = await this.buildTempOrder(userId, selectedProducts)
    const tempOrderKey = this.getTempOrderKey(userId)
    await this.saveOrderToRedis(tempOrderKey, tempOrder)

    return tempOrder
  }

  async buyNow(userId: string, payload: BuyNowReqBody): Promise<TempOrder> {
    const { productId, quantity } = payload
    const product = await databaseService.products.findOne({ _id: new ObjectId(productId) })
    if (!product) {
      throw new ErrorWithStatus({ message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const selectedProducts: ProductInCart[] = [
      {
        ProductID: productId,
        Quantity: quantity
      }
    ]

    const tempOrder = await this.buildTempOrder(userId, selectedProducts)
    const tempOrderKey = this.getTempOrderKey(userId)
    await this.saveOrderToRedis(tempOrderKey, tempOrder)

    return tempOrder
  }

  async checkOut(payload: OrderReqBody, userId: string, voucher: VoucherType | undefined) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const tempOrderKey = this.getTempOrderKey(userId)
    const tempOrder: TempOrder = await this.getTempOrder(tempOrderKey)

    if (!tempOrder || tempOrder.Products.length <= 0) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.EMPTY_OR_EXPIRED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await Promise.all(
      tempOrder.Products.map(async (p) => {
        const product = await databaseService.products.findOne({
          _id: new ObjectId(p.ProductID)
        })

        if (!product) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', p.ProductID),
            status: 404
          })
        }

        if ((product.quantity || 0) < p.Quantity) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace('%s', `${product.quantity} items with id ${p.ProductID}`),
            status: HTTP_STATUS.BAD_REQUEST
          })
        }
      })
    )

    const status = OrderStatus.PENDING
    const paymentStatus = payload.PaymentStatus ?? PaymentStatus.UNPAID

    const order: Partial<Order> = {
      UserID: new ObjectId(userId),
      ShipAddress: payload.ShipAddress,
      Description: payload.Description || '',
      RequireDate: payload.RequireDate,
      PaymentMethod: payload.PaymentMethod,
      PaymentStatus: paymentStatus,
      Status: status
    }

    let discount = 0
    const priceBeforeDiscount = tempOrder.TotalPrice
    if (voucher) {
      const maxDiscountAmount = isNaN(Number(voucher.maxDiscountAmount)) ? 0 : Number(voucher.maxDiscountAmount)
      let percentDiscountValue = (voucher.discountValue / 100) * tempOrder.TotalPrice
      percentDiscountValue =
        voucher.maxDiscountAmount && percentDiscountValue > maxDiscountAmount ? percentDiscountValue : maxDiscountAmount
      discount = voucher.discountType === DiscountType.Percentage ? percentDiscountValue : voucher.discountValue

      order.DiscountValue = discount.toString()
      order.VoucherSnapshot = {
        code: voucher.code,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount
      }
    }

    const totalPrice = tempOrder.TotalPrice - discount
    order.TotalPrice = totalPrice.toString()

    const session = databaseService.getClient().startSession()

    let orderDetails: any[] = []
    try {
      await session.withTransaction(async () => {
        const insertedOrder = await databaseService.orders.insertOne(
          {
            ...order,
            created_at: localTime,
            updated_at: localTime
          },
          { session }
        )
        const orderId = insertedOrder.insertedId

        orderDetails = tempOrder.Products.map((p: ProductInOrder) => {
          return {
            ProductID: new ObjectId(p.ProductID),
            OrderID: orderId,
            Quantity: p.Quantity.toString(),
            OrderDate: tempOrder.CreatedAt || new Date(),
            UnitPrice: p.PricePerUnit.toString()
          }
        })

        await databaseService.orderDetails.insertMany(orderDetails, { session })

        const bulkOps = tempOrder.Products.map((p) => ({
          updateOne: {
            filter: { _id: new ObjectId(p.ProductID) },
            update: { $inc: { quantity: -p.Quantity } }
          }
        }))

        await databaseService.products.bulkWrite(bulkOps, { session })

        if (voucher?._id) {
          await databaseService.vouchers.updateOne(
            { _id: new ObjectId(voucher._id) },
            { $inc: { usedCount: 1 } },
            { session }
          )
        }
      })

      if (payload.type === OrderType.CART) {
        const cartKey = cartService.getCartKey(userId)
        const cart = await cartService.getCart(cartKey)
        const remainingProducts = cart.Products.filter((p: ProductInCart) => {
          const orderedProductIds = tempOrder.Products.map((p: ProductInOrder) => p.ProductID)
          return !orderedProductIds.includes(p.ProductID)
        })

        if (remainingProducts.length <= 0) {
          await redisClient.del(cartKey)
        } else {
          await cartService.saveCart(cartKey, { Products: remainingProducts })
        }
      }

      await redisClient.del(tempOrderKey)

      return {
        ...order,
        ...(discount > 0 && { PriceBeforeDiscount: priceBeforeDiscount.toString() }),
        orderDetails: orderDetails.map(({ OrderID, ...rest }) => rest)
      }
    } finally {
      await session.endSession()
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

  async getAllOrdersByUserId(userId: string) {
    const orders = await databaseService.orders.find({ UserID: new ObjectId(userId) }).toArray()
    if (orders.length === 0) return []

    const orderIds = orders.map((order) => order._id)
    const orderDetails = await databaseService.orderDetails.find({ OrderID: { $in: orderIds } }).toArray()

    const enrichedDetails = await this.enrichOrderDetailsWithProducts(orderDetails)

    const detailMap = new Map<string, any[]>()

    enrichedDetails.forEach((detail) => {
      const orderId = detail.OrderID?.toString() || ''

      const { ProductID, OrderID, ...restDetail } = detail

      if (!detailMap.has(orderId)) detailMap.set(orderId, [])

      detailMap.get(orderId)?.push(restDetail)
    })

    return orders.map((order) => ({
      orderId: order._id,
      orderDetail: detailMap.get(order._id.toString()) || []
    }))
  }

  async getOrderById(order: Order) {
    const orderDetails = await this.getOrderDetailByOrderId(order._id!.toString())
    const enrichedDetails = await this.enrichOrderDetailsWithProducts(orderDetails)

    return {
      ...order,
      orderDetail: enrichedDetails.map(({ ProductID, OrderID, ...rest }) => ({
        ...rest
      }))
    }
  }

  private async enrichOrderDetailsWithProducts(orderDetails: OrderDetail[]) {
    const productIds = [...new Set(orderDetails.map((od) => od.ProductID?.toString()))].map((id) => new ObjectId(id))
    const products = await databaseService.products
      .find({ _id: { $in: productIds } })
      .project({ _id: 1, name_on_list: 1, image_on_list: 1, price_on_list: 1 })
      .toArray()

    const productInfoMap = new Map(
      products.map((product) => [
        product._id.toString(),
        {
          productId: product._id,
          name: product.name_on_list,
          image: product.image_on_list,
          price: product.price_on_list
        }
      ])
    )

    return orderDetails.map((detail) => ({
      ...detail,
      Products: productInfoMap.get(detail.ProductID?.toString())
    }))
  }

  async approveCancelRequest(
    payload: { staffNote?: string },
    userId: string,
    order: Order,
    options: { status: CancelRequestStatus }
  ) {
    const isPaid = order.PaymentStatus === PaymentStatus.PAID

    const updateSet: Record<string, any> = {
      Status: OrderStatus.CANCELLED,
      'CancelRequest.status': options.status,
      'CancelRequest.approvedAt': new Date(),
      'CancelRequest.staffId': new ObjectId(userId),
      'CancelRequest.staffNote': payload?.staffNote ?? '',
      updated_at: new Date()
    }

    if (isPaid) {
      updateSet.RefundStatus = RefundStatus.REQUESTED
    }
    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: order._id },
      {
        $set: updateSet
      },
      { returnDocument: 'after' }
    )

    return updatedOrder
  }

  async rejectCancelRequest(
    payload: { staffNote?: string },
    userId: string,
    order: Order,
    options: { status: CancelRequestStatus }
  ) {
    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: order._id },
      {
        $set: {
          'CancelRequest.status': options.status,
          'CancelRequest.rejectedAt': new Date(),
          'CancelRequest.staffId': new ObjectId(userId),
          'CancelRequest.staffNote': payload?.staffNote ?? '',
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return updatedOrder
  }

  async requestCancelOrder(payload: { reason: string }, order: Order) {
    const cancelRequest: CancelRequest = {
      status: CancelRequestStatus.REQUESTED,
      reason: payload.reason,
      requestedAt: new Date(),
      staffId: null as any
    }

    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: order._id },
      {
        $set: {
          CancelRequest: cancelRequest,
          updated_at: new Date()
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return updatedOrder
  }

  async getOrderRevenue(options: RevenueFilterOptions) {
    const {
      specificDate,
      fromDate,
      toDate,
      filterBrand,
      filterDacTinh,
      filterHskIngredients,
      filterHskProductType,
      filterHskSize,
      filterHskSkinType,
      filterHskUses,
      filterOrigin
    } = options

    const match: any = {
      PaymentStatus: PaymentStatus.PAID
    }

    if (specificDate) {
      const date = new Date(specificDate)
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      match.created_at = {
        $gte: date,
        $lt: nextDate
      }
    } else if (fromDate && toDate) {
      const startDate = new Date(fromDate)
      const endDate = new Date(toDate)
      endDate.setDate(endDate.getDate() + 1)
      match.created_at = {
        $gte: startDate,
        $lt: endDate
      }
    }

    const filters: any = {}

    filterBrand && (filters.filter_brand = filterBrand)
    filterDacTinh && (filters.filter_dac_tinh = filterDacTinh)
    filterHskIngredients && (filters.filter_hsk_ingredients = filterHskIngredients)
    filterHskProductType && (filters.filter_hsk_product_type = filterHskProductType)
    filterHskSize && (filters.filter_hsk_size = filterHskSize)
    filterHskSkinType && (filters.filter_hsk_skin_type = filterHskSkinType)
    filterHskUses && (filters.filter_hsk_uses = filterHskUses)
    filterOrigin && (filters.filter_origin = filterOrigin)

    const totalOrder = await databaseService.orders.find(match).toArray()
    const orderIds = totalOrder.map((o) => o._id)
    const orderDetails = await databaseService.orderDetails.find({ OrderID: { $in: orderIds } }).toArray()

    const productIds = orderDetails.map((detail) => new ObjectId(detail.ProductID))

    const products = await databaseService.products.find({ _id: { $in: productIds }, ...filters }).toArray()

    const matchedProductIds = new Set(products.map((p) => p._id.toString()))

    const matchedOrderDetails = orderDetails.filter(
      (detail) => detail.ProductID && matchedProductIds.has(detail.ProductID.toString())
    )

    const matchedOrderIds = [...new Set(matchedOrderDetails.map((detail) => detail.OrderID?.toString()))]
    const filteredOrder = totalOrder.filter((order) => matchedOrderIds.includes(order._id.toString()))

    const ordersByDate: { [key: string]: any[] } = {}

    filteredOrder.forEach((order) => {
      const date = order.created_at?.toISOString().split('T')[0]!
      if(!ordersByDate[date]){
        ordersByDate[date] = []
      }
      ordersByDate[date].push(order)
    })

    const dailyResult = Object.keys(ordersByDate).map(date => {
      const orders = ordersByDate[date]
      const totalRevenue = orders.reduce((total, order) => total + Number(order.TotalPrice), 0)

      return {
        date,
        totalOrder: orders.length,
        totalRevenue
      }
    })

    return dailyResult
  }

  async getOrderDetailByOrderId(id: string): Promise<Array<OrderDetail>> {
    const orderDetails = await databaseService.orderDetails.find({ OrderID: new ObjectId(id) }).toArray()
    return orderDetails
  }

  private async saveOrderToRedis(orderKey: string, orderData: TempOrder) {
    await redisClient.set(orderKey, JSON.stringify(orderData), { EX: 30 * 60 })
  }
}

const ordersService = new OrdersService()
export default ordersService
