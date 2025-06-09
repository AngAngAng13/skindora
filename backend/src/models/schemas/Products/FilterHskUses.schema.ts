import { ObjectId } from 'mongodb'

interface FilterHskUsesType {
  _id?: ObjectId
  name?: string
  description?: string
}

export default class FilterHskUses {
  _id?: ObjectId
  name?: string
  description?: string

  constructor(filterHskUses: FilterHskUsesType) {
    this._id = filterHskUses._id || new ObjectId()
    this.name = filterHskUses.name || ''
    this.description = filterHskUses.description || ''
  }
}
