import { ObjectId } from 'mongodb'

interface FilterHskSizeType {
  _id?: ObjectId
  name?: string
}

export default class FilterHskSize {
  _id?: ObjectId
  name?: string

  constructor(filterHskSize: FilterHskSizeType) {
    this._id = filterHskSize._id || new ObjectId()
    this.name = filterHskSize.name || ''
  }
}
