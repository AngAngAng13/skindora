import { ObjectId } from 'mongodb'
import {
  CancelRequestStatus,
  DiscountType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  RefundStatus
} from '~/constants/enums'

export interface CancelRequest {
  status: CancelRequestStatus
  reason: string
  requestedAt: Date
  approvedAt?: Date
  rejectedAt?: Date
  staffId: ObjectId
  staffNote?: string
}

interface VoucherSnapshot {
  code: string
  discountType: DiscountType
  discountValue: number
  maxDiscountAmount?: number
}

interface OrderType {
  _id?: ObjectId
  UserID?: ObjectId
  ShipAddress?: string
  Description?: string
  RequireDate?: string
  ShippedDate?: string
  Status?: OrderStatus
  PaymentMethod?: PaymentMethod
  PaymentStatus?: PaymentStatus
  CancelRequest?: CancelRequest
  RefundStatus?: RefundStatus
  DiscountValue?: string
  VoucherSnapshot?: VoucherSnapshot
  TotalPrice?: string
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId
}

export default class Order {
  _id?: ObjectId
  UserID?: ObjectId
  ShipAddress?: string
  Description?: string
  RequireDate?: string
  ShippedDate?: string
  Status?: OrderStatus
  PaymentMethod?: PaymentMethod
  PaymentStatus?: PaymentStatus
  CancelRequest?: CancelRequest
  RefundStatus?: RefundStatus
  DiscountValue?: string
  VoucherSnapshot?: VoucherSnapshot
  TotalPrice?: string
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId

  constructor(order: OrderType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = order._id || new ObjectId()
    this.UserID = order.UserID
    this.ShipAddress = order.ShipAddress || ''
    this.Description = order.Description || ''
    this.RequireDate = order.RequireDate || ''
    this.ShippedDate = order.ShippedDate || ''
    this.Status = order.Status || OrderStatus.PENDING
    this.PaymentMethod = order.PaymentMethod || PaymentMethod.COD
    this.PaymentStatus = order.PaymentStatus || PaymentStatus.UNPAID
    this.CancelRequest = order.CancelRequest
    this.RefundStatus = order.RefundStatus || RefundStatus.NONE
    this.DiscountValue = order.DiscountValue || ''
    this.VoucherSnapshot = order.VoucherSnapshot
    this.TotalPrice = order.TotalPrice || ''
    this.created_at = order.created_at || localTime
    this.updated_at = order.updated_at || localTime
    this.modified_by = order.modified_by
  }
}
