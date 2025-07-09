import { FilterBrandState, GenericFilterState, Role, UserVerifyStatus } from '~/constants/enums'
export interface createNewFilterBrandReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: FilterBrandState
}
export interface UpdateUserStateReqBody {
  verify: UserVerifyStatus
}

export interface createNewFilterBrandReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: FilterBrandState
}

export interface updateFilterBrandReqBody {
  option_name: string
  category_name: string
  category_param: string
}

export interface disableFilterBrandReqBody {
  state: FilterBrandState
}

export interface createNewFilterDacTinhReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterDacTinhReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterDacTinhReqBody {
  state: GenericFilterState
}

export interface createNewFilterHskIngredientReqBody {
  option_name: string
  category_name: string
  category_param: string
  state?: GenericFilterState
}

export interface updateFilterHskIngredientReqBody {
  option_name?: string
  category_name?: string
  category_param?: string
}

export interface disableFilterHskIngredientReqBody {
  state: GenericFilterState
}