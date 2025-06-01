export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  FIRST_NAME_IS_REQUIRED: 'First name is required',
  FIRST_NAME_MUST_BE_A_STRING: 'First name must be a string',
  FIRST_NAME_LENGTH_MUST_BE_FROM_1_TO_30: 'First name length must be from 1 to 30 characters',
  LAST_NAME_IS_REQUIRED: 'Last name is required',
  LAST_NAME_MUST_BE_A_STRING: 'Last name must be a string',
  LAST_NAME_LENGTH_MUST_BE_FROM_1_TO_30: 'Last name length must be from 1 to 30 characters',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_30: 'Password length must be from 8 to 30 characters',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_30: 'Confirm password length must be from 8 to 30 characters',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  REGISTER_SUCCESS: 'Register successful'
} as const

export const CART_MESSAGES = {
  ADDED_SUCCESS: 'Product added to cart successfully'
} as const

export const ORDER_MESSAGES = {
  CREATED_SUCCESS: 'Order created successfully',
} as const

export const ORDER_DETAIL_MESSAGES = {} as const
