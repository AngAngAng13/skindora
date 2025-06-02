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
