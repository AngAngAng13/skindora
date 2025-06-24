import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { ADMIN_MESSAGES } from '~/constants/messages'

export const updateFilterBrandValidator = validate(
  checkSchema({
    _id: {
      in: ['params'],
      isMongoId: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_ID_IS_INVALID
      }
    },
    option_name: {
      optional: true,
      isString: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_OPTION_NAME_MUST_BE_A_STRING
      },
      trim: true
    },
    category_name: {
      optional: true,
      isString: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_CATEGORY_NAME_MUST_BE_A_STRING
      },
      trim: true
    },
    category_param: {
      optional: true,
      isString: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_CATEGORY_PARAM_MUST_BE_A_STRING
      },
      trim: true
    }
  })
)
