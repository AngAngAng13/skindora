import { ObjectId } from "mongodb"
import { UserVerifyStatus } from "~/constants/enums"

interface UserType {
  _id?: ObjectId
  name: string 
  email: string
  password: string
  created_at?: Date
  updated_at?: Date 
  email_verify_token?: string 
  forgot_password_token?: string 
  verify?: UserVerifyStatus
  location?: string 
  username?: string 
  avatar?: string 
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  location: string
  username: string
  avatar: string

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id || new ObjectId() 
    this.name = user.name || '' 
    this.email = user.email
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.location = user.location || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
  }
}
