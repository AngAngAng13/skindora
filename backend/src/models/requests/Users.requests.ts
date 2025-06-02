import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { JwtPayload } from 'jsonwebtoken'

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface RegisterReqBody {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface resetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}