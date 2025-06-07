import { ObjectId } from 'mongodb'

interface FeedBackType {
  _id?: ObjectId
  userID: ObjectId
  productID: ObjectId
  orderID: ObjectId
  rating: number
  comment: string
  images: string[]
  videos: string[]
  createdAt?: Date
  modifiedAt?: Date
  isDeleted?: boolean
}

export default class FeedBack {
  _id: ObjectId
  userID: ObjectId
  productID: ObjectId
  orderID: ObjectId
  rating: number
  comment: string
  images: string[]
  videos: string[]
  createdAt: Date
  modifiedAt: Date
  isDeleted: boolean

  constructor(feedBack: FeedBackType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = feedBack._id || new ObjectId()
    this.userID = feedBack.userID
    this.productID = feedBack.productID
    this.orderID = feedBack.orderID
    this.rating = feedBack.rating
    this.comment = feedBack.comment
    this.images = feedBack.images || []
    this.videos = feedBack.videos || []
    this.createdAt = localTime || feedBack.createdAt
    this.modifiedAt = localTime || feedBack.modifiedAt
    this.isDeleted = feedBack.isDeleted || false
  }
}
