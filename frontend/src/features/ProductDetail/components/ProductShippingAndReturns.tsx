import { Package, Truck } from "lucide-react";

export function ProductShippingAndReturns() {
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <Truck className="h-5 w-5 text-gray-600" />
        <div>
          <p className="font-medium">Free Shipping</p>
          <p className="text-sm text-gray-600">For orders over 500,000₫</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Package className="h-5 w-5 text-gray-600" />
        <div>
          <p className="font-medium">Returns</p>
          <p className="text-sm text-gray-600">30-day return policy</p>
        </div>
      </div>
    </div>
  );
}