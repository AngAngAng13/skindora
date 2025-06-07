import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { FEEDBACK_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import _ from 'lodash'
import { AddNewFeedBackReqBody, UpdateFeedBackReqBody } from '~/models/requests/FeedBacks.request'
import HTTP_STATUS from '~/constants/httpStatus'
import { OrderStatus } from '~/constants/enums'
import FeedBack from '~/models/schemas/Feedback.schema'

class FeedBackService {
  async addFeedBack(userID: string, orderID: string, productId: string, reqBody: AddNewFeedBackReqBody) {
    return await databaseService.feedBacks.insertOne(
      new FeedBack({
        _id: new ObjectId(),
        userID: new ObjectId(userID),
        productID: new ObjectId(productId),
        orderID: new ObjectId(orderID.toString()),
        rating: reqBody.rating,
        comment: reqBody.comment,
        images: reqBody.images || [],
        videos: reqBody.videos || []
      })
    )
  }

  async updateFeedBack(userID: string, orderID: string, productId: string, reqBody: UpdateFeedBackReqBody) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    return await databaseService.feedBacks.findOneAndUpdate(
      {
        orderID: new ObjectId(orderID),
        productID: new ObjectId(productId),
        userID: new ObjectId(userID)
      },
      {
        $set: {
          ...reqBody,
          modifiedAt: localTime
        }
      },
      { returnDocument: 'after' }
    )
  }

  async removeFeedBack(userID: string, orderID: string, productId: string) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    return await databaseService.feedBacks.findOneAndUpdate(
      {
        userID: new ObjectId(userID.toString()),
        productID: new ObjectId(productId.toString()),
        orderID: new ObjectId(orderID.toString())
      },
      {
        $set: {
          isDeleted: true,
          modifiedAt: localTime
        }
      },
      { returnDocument: 'after' }
    )
  }

  async getFeedback(productId: string, currentPage = 1, limit = 10) {
    const skip = (currentPage - 1) * limit

    const result = await databaseService.feedBacks
      .aggregate([
        { $match: { productID: new ObjectId(productId) } },
        {
          $facet: {
            data: [{ $sort: { rating: 1 } }, { $skip: skip }, { $limit: limit }],
            totalRecords: [{ $count: 'count' }]
          }
        }
      ])
      .toArray()

    const data = result[0]?.data || []
    const totalRecords = result[0]?.totalRecords[0]?.count || 0
    const totalPages = Math.ceil(totalRecords / limit)

    return {
      data,
      limit,
      currentPage,
      totalPages,
      totalRecords
    }
  }
}

const feedBackService = new FeedBackService()
export default feedBackService
