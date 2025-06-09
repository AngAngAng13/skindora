import { ObjectId } from 'mongodb'

interface FilterHskSkinTypeType {
  _id?: ObjectId
  name?: string
  description?: string
}

export default class FilterHskSkinType {
  _id?: ObjectId
  name?: string
  description?: string

  constructor(filterHskSkinType: FilterHskSkinTypeType) {
    this._id = filterHskSkinType._id || new ObjectId()
    this.name = filterHskSkinType.name || ''
    this.description = filterHskSkinType.description || ''
  }
}
