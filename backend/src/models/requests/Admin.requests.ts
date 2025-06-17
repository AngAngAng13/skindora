import { FilterBrandState } from '~/constants/enums'
export interface createNewFilterBrandReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: FilterBrandState
}
