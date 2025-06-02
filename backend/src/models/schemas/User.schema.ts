import { ObjectId } from 'mongodb'
import { Role, UserVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  first_name: string
  last_name: string
  email: string
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  location?: string
  username?: string
  phone_number?: string
  avatar?: string
  roleid: Role
}

export default class User {
  _id?: ObjectId
  first_name: string
  last_name: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  location: string
  username: string
  phone_number: string
  avatar: string
  roleid: Role

  constructor(user: UserType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = user._id || new ObjectId()
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.email = user.email
    this.password = user.password
    this.created_at = localTime || user.created_at
    this.updated_at = localTime || user.updated_at
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.location = user.location || ''
    this.username = user.username || ''
    this.phone_number = user.phone_number || ''
    this.avatar = user.avatar || ''
    this.roleid = user.roleid || Role.User
  }
}
