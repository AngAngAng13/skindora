import { PaymentStatus } from './../../constants/enums';
import { ObjectId } from 'mongodb'
import { CancelRequestStatus, OrderType, PaymentMethod } from '~/constants/enums'

export interface OrderReqBody {
  ShipAddress: string
  Description?: string
  RequireDate: string
  ShippedDate?: string
  PaymentMethod: PaymentMethod
  PaymentStatus?: PaymentStatus,
  voucherCode?: string,
  type?: OrderType
}

export interface OrderParams {
  orderId: string
}

export interface BuyNowReqBody {
  productId: string
  quantity: number
}

export interface ProductInOrder {
  ProductID: string
  Quantity: number
  PricePerUnit: number
  TotalPrice: number
}
export interface TempOrder {
  UserID: ObjectId | string
  Products: Array<ProductInOrder>
  TotalPrice: number
  CreatedAt: Date
}

export interface PrepareOrderPayload {
  selectedProductIDs: Array<string>
}

export interface ApproveCancelRequest {
  status: CancelRequestStatus
  approvedAt: Date
  staffId: ObjectId
  staffNote?: string
}

export interface RejectCancelRequest {
  status: CancelRequestStatus
  rejectedAt: Date
  staffId: ObjectId
  staffNote?: string
}

export interface RevenueFilterOptions {
  specificDate?: string
  fromDate?: string
  toDate?: string
  filterBrand?: ObjectId
  filterDacTinh?: ObjectId
  filterHskIngredients?: ObjectId
  filterHskProductType?: ObjectId
  filterHskSize?: ObjectId
  filterHskSkinType?: ObjectId
  filterHskUses?: ObjectId
  filterOrigin?: ObjectId
}
