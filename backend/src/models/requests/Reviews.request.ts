export interface BaseReviewReqBody {
  rating: number
  comment: string
  images?: string[]
  videos?: string[]
}

export type AddNewReviewReqBody = BaseReviewReqBody

export type UpdateReviewReqBody = BaseReviewReqBody
