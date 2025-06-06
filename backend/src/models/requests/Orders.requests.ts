import { ObjectId } from "mongodb";
import { OrderStatus } from "~/constants/enums";

export interface OrderReqBody {
  UserID: string
  ProductID: Array<string>
  ShipAddress: string
  Description?: string
  RequireDate: string
  ShippedDate: string
  Status: OrderStatus
}

export interface OrderParams{
  id: string
}

export interface ProductInOrder{
    ProductID: string,
    Quantity: number,
    PricePerUnit: number,
    TotalPrice: number
}
export interface TempOrder{
  UserID: ObjectId | string,
  Products: Array<ProductInOrder>,
  Discount?: number,
  TotalPrice: number,
  CreatedAt: Date
}

export interface PrepareOrderPayload{
  selectedProductIDs: Array<string>
}

