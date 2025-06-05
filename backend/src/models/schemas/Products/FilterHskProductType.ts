import { ObjectId } from 'mongodb'

interface FilterHskProductTypeType {
  _id?: ObjectId
  name?: string
  description?: string
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class FilterHskProductType {
  _id?: ObjectId
  name?: string
  description?: string
  is_active?: boolean
  created_at?: Date
  updated_at?: Date

  constructor(filterHskProductType: FilterHskProductTypeType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterHskProductType._id || new ObjectId()
    this.name = filterHskProductType.name || ''
    this.description = filterHskProductType.description || ''
    this.is_active = filterHskProductType.is_active !== undefined ? filterHskProductType.is_active : true
    this.created_at = localTime || filterHskProductType.created_at
    this.updated_at = localTime || filterHskProductType.updated_at
  }
}
