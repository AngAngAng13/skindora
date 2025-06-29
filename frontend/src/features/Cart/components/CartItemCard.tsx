import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface CartProduct {
  ProductID: string;
  Quantity: number;
  name: string;
  image: string;
  unitPrice: number;
  totalPrice: number;
  stock: number; 
}

interface CartItemCardProps {
  item: CartProduct;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating: boolean;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemCardProps) {
  const handleIncrease = () => {
   
    if (item.Quantity < item.stock) {
      onUpdateQuantity(item.ProductID, item.Quantity + 1);
    }
  };

  const handleDecrease = () => {
    onUpdateQuantity(item.ProductID, item.Quantity - 1);
  };

  
  const isStockLimitReached = item.Quantity >= item.stock;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="line-clamp-2 font-medium text-gray-900">{item.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={() => onRemove(item.ProductID)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-3">
              <span className="font-bold text-gray-900">{item.unitPrice.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleDecrease}
                  disabled={item.Quantity <= 1 || isUpdating}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[60px] px-4 py-2 text-center font-medium">{item.Quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleIncrease}
                
                  disabled={isUpdating || isStockLimitReached}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{item.totalPrice.toLocaleString("vi-VN")}₫</p>
             
                {isStockLimitReached && <p className="text-xs text-red-600">Max stock reached</p>}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
