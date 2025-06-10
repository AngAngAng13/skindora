import { Request, Response, NextFunction } from 'express'
import { Collection, Document, Filter } from 'mongodb'

// Định nghĩa cấu trúc response chuẩn mà bạn muốn
export interface IResponseSearch<T> {
  data: T[]
  pagination: {
    limit: number
    currentPage: number
    totalPages: number
    totalRecords: number
  }
}

/**
 * Hàm generic thực hiện truy vấn phân trang và tự động gửi response theo format IResponseSearch.
 * Hoạt động độc lập và không sửa đổi `res` của Express.
 * @param res Đối tượng Response của Express.
 * @param next Đối tượng NextFunction để chuyển lỗi.
 * @param collection Collection từ native MongoDB driver.
 * @param query Query từ request, chứa page và limit.
 * @param filter Các điều kiện lọc của MongoDB (tùy chọn).
 */
export const sendPaginatedResponse = async <T extends Document>(
  res: Response,
  next: NextFunction,
  collection: Collection<T>,
  query: Request['query'],
  filter: Filter<T> = {}
) => {
  try {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const skip = (page - 1) * limit

    // Thực hiện 2 truy vấn song song để lấy dữ liệu và tổng số bản ghi
    const [totalRecords, data] = await Promise.all([
      collection.countDocuments(filter),
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()
    ])

    const totalPages = Math.ceil(totalRecords / limit)

    // Xây dựng response body theo đúng chuẩn IResponseSearch
    const responseBody: IResponseSearch<any> = {
      data,
      pagination: {
        limit,
        currentPage: page,
        totalPages,
        totalRecords
      }
    }

    // Dùng res.json() gốc của Express để gửi response đi
    return res.status(200).json(responseBody)
  } catch (error) {
    // Nếu có lỗi, chuyển cho error handler chung để xử lý
    next(error)
  }
}
