import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name_on_list?: string
  engName_on_list?: string
  brand_on_list?: string
  price_on_list?: string
  image_on_list?: string
  hover_image_on_list?: string
  productName_detail?: string
  engName_detail?: string
  description_detail?: string
  ingredients_detail?: string
  guide_detail?: string
  specification_detail?: string
  main_images_detail?: string[]
  sub_images_detail?: string[]
  filter_brand?: ObjectId[]
  filter_dac_tinh?: ObjectId[]
  filter_ingredients?: ObjectId[]
  filter_product_type?: ObjectId[]
  filter_size?: ObjectId[]
  filter_skin_type?: ObjectId[]
  filter_uses?: ObjectId[]
  origin?: string
  quantity?: number
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId
}

export default class Product {
  _id?: ObjectId
  name_on_list?: string
  engName_on_list?: string
  brand_on_list?: string
  price_on_list?: string
  image_on_list?: string
  hover_image_on_list?: string
  productName_detail?: string
  engName_detail?: string
  description_detail?: string
  ingredients_detail?: string
  guide_detail?: string
  specification_detail?: string
  main_images_detail?: string[]
  sub_images_detail?: string[]
  filter_brand?: ObjectId[]
  filter_dac_tinh?: ObjectId[]
  filter_ingredients?: ObjectId[]
  filter_product_type?: ObjectId[]
  filter_size?: ObjectId[]
  filter_skin_type?: ObjectId[]
  filter_uses?: ObjectId[]
  origin?: string
  quantity?: number
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId

  constructor(product: ProductType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = product._id || new ObjectId()
    this.name_on_list = product.name_on_list || ''
    this.engName_on_list = product.engName_on_list || ''
    this.brand_on_list = product.brand_on_list || ''
    this.price_on_list = product.price_on_list || ''
    this.image_on_list = product.image_on_list || ''
    this.hover_image_on_list = product.hover_image_on_list || ''
    this.productName_detail = product.productName_detail || ''
    this.engName_detail = product.engName_detail || ''
    this.description_detail = product.description_detail || ''
    this.ingredients_detail = product.ingredients_detail || ''
    this.guide_detail = product.guide_detail || ''
    this.specification_detail = product.specification_detail || ''
    this.main_images_detail = product.main_images_detail || []
    this.sub_images_detail = product.sub_images_detail || []
    this.filter_brand = product.filter_brand || []
    this.filter_dac_tinh = product.filter_dac_tinh || []
    this.filter_ingredients = product.filter_ingredients || []
    this.filter_product_type = product.filter_product_type || []
    this.filter_size = product.filter_size || []
    this.filter_skin_type = product.filter_skin_type || []
    this.filter_uses = product.filter_uses || []
    this.origin = product.origin || ''
    this.quantity = product.quantity || 0
    this.is_active = product.is_active !== undefined ? product.is_active : true
    this.created_at = localTime || product.created_at
    this.updated_at = localTime || product.updated_at
    this.modified_by = product.modified_by
  }
}
