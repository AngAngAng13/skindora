import { ObjectId } from 'mongodb'

interface FilterDacTinhType {
  _id?: ObjectId
  name?: string
  description?: string
}

export default class FilterDacTinh {
  _id?: ObjectId
  name?: string
  description?: string

  constructor(filterDacTinh: FilterDacTinhType) {
    this._id = filterDacTinh._id || new ObjectId()
    this.name = filterDacTinh.name || ''
    this.description = filterDacTinh.description || ''
  }
}
