import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  orderId: string;
  orderDate: string;
}

export const PageHeader = ({ orderId, orderDate }: PageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-center">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold">Order #{orderId.slice(-8).toUpperCase()}</h1>
        <p className="text-gray-500">Placed on {format(new Date(orderDate), "PPP")}</p>
      </div>
    </div>
  );
};