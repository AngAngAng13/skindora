import { ObjectId } from 'mongodb'

interface ReviewType {
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

export default class Review {
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

  constructor(review: ReviewType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = review._id || new ObjectId()
    this.userID = review.userID
    this.productID = review.productID
    this.orderID = review.orderID
    this.rating = review.rating
    this.comment = review.comment
    this.images = review.images || []
    this.videos = review.videos || []
    this.createdAt = localTime || review.createdAt
    this.modifiedAt = localTime || review.modifiedAt
    this.isDeleted = review.isDeleted || false
  }
}
