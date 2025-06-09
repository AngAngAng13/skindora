import { ObjectId } from 'mongodb'

interface FilterBrandType {
  _id?: ObjectId
  name?: string
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class FilterBrand {
  _id?: ObjectId
  name?: string
  is_active?: boolean
  created_at?: Date
  updated_at?: Date

  constructor(filterBrand: FilterBrandType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterBrand._id || new ObjectId()
    this.name = filterBrand.name
    this.is_active = filterBrand.is_active !== undefined ? filterBrand.is_active : true
    this.created_at = localTime || filterBrand.created_at
    this.updated_at = localTime || filterBrand.updated_at
  }
}
