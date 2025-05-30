import { Home, SearchX } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFoundPage(): React.JSX.Element {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <SearchX className="text-primary h-32 w-32 animate-bounce" strokeWidth={1.5} />
      </div>
      <h1 className="text-primary mb-2 text-7xl font-extrabold tracking-tight">404</h1>
      <h2 className="text-foreground mb-4 text-3xl font-semibold">Không tìm thấy trang</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Oops! Có vẻ như trang bạn đang cố truy cập không tồn tại, đã được di chuyển hoặc tạm thời không khả dụng.
      </p>
      <Link to="/">
        <Button
          variant="default"
          size="lg"
          className="transition-transform duration-300 hover:-translate-y-1 hover:scale-115 active:scale-95"
        >
          <Home className="mr-2 h-5 w-5" />
          Về trang chủ
        </Button>
      </Link>
      <p className="text-muted-foreground mt-12 text-sm">
        Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ bộ phận hỗ trợ.
      </p>
    </div>
  );
}

export default NotFoundPage;
