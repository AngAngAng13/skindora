import { ObjectId } from 'mongodb'

interface FilterHskIngredientType {
  _id?: ObjectId
  name?: string
  description?: string
}

export default class FilterHskIngredient {
  _id?: ObjectId
  name?: string
  description?: string

  constructor(filterHskIngredient: FilterHskIngredientType) {
    this._id = filterHskIngredient._id || new ObjectId()
    this.name = filterHskIngredient.name || ''
    this.description = filterHskIngredient.description || ''
  }
}
