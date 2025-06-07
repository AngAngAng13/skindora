export interface BaseFeedBackReqBody {
  rating: number
  comment: string
  images?: string[]
  videos?: string[]
}

export type AddNewFeedBackReqBody = BaseFeedBackReqBody

export type UpdateFeedBackReqBody = BaseFeedBackReqBody
