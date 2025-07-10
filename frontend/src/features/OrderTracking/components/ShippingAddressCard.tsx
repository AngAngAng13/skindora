import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShippingAddressCardProps {
  address: string;
}

export const ShippingAddressCard = ({ address }: ShippingAddressCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MapPin className="h-5 w-5" /> Shipping Address
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{address}</p>
    </CardContent>
  </Card>
);
