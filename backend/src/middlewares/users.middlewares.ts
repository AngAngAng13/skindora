import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

const firstNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.FIRST_NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.FIRST_NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 30
    },
    errorMessage: USERS_MESSAGES.FIRST_NAME_LENGTH_MUST_BE_FROM_1_TO_30
  }
}

const lastNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.LAST_NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.LAST_NAME_MUST_BE_A_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 30
    },
    errorMessage: USERS_MESSAGES.LAST_NAME_LENGTH_MUST_BE_FROM_1_TO_30
  }
}

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 30
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_30
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 30
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_30
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({
      error: 'Missing email or password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema(
    {
      first_name: firstNameSchema,
      last_name: lastNameSchema,
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isExist = await usersService.checkEmailExist(value)
            if (isExist) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)
