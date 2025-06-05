export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}

export enum Role {
  User,
  Staff,
  Admin
}

export enum OrderStatus {
  PENDING = 'PENDING', // Đơn hàng vừa được tạo, chờ xác nhận
  CONFIRMED = 'CONFIRMED', // Đã xác nhận đơn hàng
  PROCESSING = 'PROCESSING', // Đang xử lý/kho đang chuẩn bị hàng
  SHIPPING = 'SHIPPING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao thành công
  CANCELLED = 'CANCELLED', // Bị hủy bởi người dùng/hệ thống
  RETURNED = 'RETURNED', // Đã hoàn trả hàng
  FAILED = 'FAILED' // Giao hàng thất bại (shipper không giao được)
}
