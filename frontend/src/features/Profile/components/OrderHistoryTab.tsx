import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OrderHistoryTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Your order history will be displayed here soon.</p>
      </CardContent>
    </Card>
  );
};
