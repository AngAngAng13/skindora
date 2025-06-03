import moment from 'moment'
import qs from 'qs'
import crypto from 'crypto'

interface PaymentData {
  amount: number
  bankCode?: string
  language?: string
}

interface VnpParams {
  [key: string]: string | number
}

const sortObject = (obj: VnpParams): VnpParams => {
  const sorted: VnpParams = {}
  const keys = Object.keys(obj).sort()
  for (const key of keys) {
    sorted[key] = obj[key]
  }
  return sorted
}

export const createPaymentUrl = (data: PaymentData, clientIp: string): string => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  const date = new Date()
  const createDate = moment(date).format('YYYYMMDDHHmmss')
  const orderId = moment(date).format('DDHHmmss')

  const tmnCode = process.env.VNPAY_TMN_CODE || ''
  const secretKey = process.env.VNPAY_HASHSECRET || ''
  const vnpUrl = process.env.VNP_URL || ''
  const returnUrl = process.env.VNP_RETURNURL || ''

  const locale = data.language || 'vn'
  const { bankCode, amount } = data

  const vnp_Params: VnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: Math.round(amount * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: clientIp,
    vnp_CreateDate: createDate
  }

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode
  }

  // Bước ký: phải sort và loại bỏ vnp_SecureHash nếu có
  const sortedParams = sortObject(vnp_Params)
  const signData = qs.stringify(sortedParams, { encode: false })

  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  // Gắn hash vào cuối
  sortedParams['vnp_SecureHash'] = signed

  // Trả về URL để redirect
  return `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`
}
