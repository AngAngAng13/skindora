// Import icons từ lucide-react cho trực quan
import { ChevronLeft, FileText, Loader2, Truck, User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
// Import các component từ shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchOrderByID } from "@/hooks/Orders/useFetchOrderByID";
import { useUpdateStatus } from "@/hooks/Orders/useUpdateStatus";

// Định nghĩa kiểu cho trạng thái để Badge có màu sắc khác nhau
// type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  // Đổi tên hook cho nhất quán với việc fetch order
  const { loading, data: order, FetchProductByID } = useFetchOrderByID(String(orderId));
  const { updateStatus } = useUpdateStatus(String(orderId));
  const handleUpdateStatus = () => {
    updateStatus();
    window.location.reload();
  };
  useEffect(() => {
    FetchProductByID();
  }, []);

  if (loading || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }
  const variant =
    order.Status === "DELIVERED"
      ? "complete"
      : order.Status === "CANCELLED"
        ? "danger"
        : order.Status === "RETURNED"
          ? "default"
          : order.Status === "SHIPPING"
            ? "waiting"
            : "secondary";
  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {/* Header */}
          <div className="mx-auto grid w-full max-w-6xl flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate("/admin/orders")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
                Chi tiết đơn hàng
              </h1>

              <Badge variant={variant}>{order.Status}</Badge>
            </div>

            {/* Main Content */}
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                {/* Order Details Card */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Đơn hàng #{order._id.slice(-6).toUpperCase()}</CardTitle>
                    <CardDescription>
                      Ngày yêu cầu: {new Date(order.RequireDate).toLocaleDateString("vi-VN")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <FileText className="text-muted-foreground h-6 w-6" />
                      <div>
                        <p className="font-medium">Mô tả / Ghi chú</p>
                        <p className="text-muted-foreground text-sm">{order.Description || "Không có ghi chú."}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin giao hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <User className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Khách hàng</p>
                        <p className="text-muted-foreground text-sm">ID: {order.UserID}</p>
                        {/* Bạn có thể thêm link đến trang chi tiết user ở đây */}
                        <Button variant="link" className="h-auto p-0 text-sm">
                          Xem chi tiết khách hàng
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Truck className="text-muted-foreground h-6 w-6 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Địa chỉ giao hàng</p>
                        <p className="text-muted-foreground text-sm">{order.ShipAddress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Actions */}
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Hành động</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleUpdateStatus()}>
                        <span>Thay đổi trạng thái</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action buttons for mobile view */}
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm" className="w-full">
                Hủy
              </Button>
              <Button size="sm" className="w-full">
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetailPage;
