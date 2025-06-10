import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { CART_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const addToCartValidator = validate(
  checkSchema(
    {
      ProductID: {
        notEmpty: {
          errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            //Kiem tra ObjectId valid
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.INVALID_PRODUCT_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })
            if (!product) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', value),
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            if (!product.quantity || product.quantity <= 0) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.OUT_OF_STOCK,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            req.product = product
            return true
          }
        }
      },
      Quantity: {
        notEmpty: {
          errorMessage: CART_MESSAGES.QUANTITY_IS_REQUIRED
        },
        isInt: {
          options: { gt: 0 },
          errorMessage: CART_MESSAGES.POSITIVE_INTEGER_QUANTITY
        }
      }
    },
    ['body']
  )
)

export const updateCartValidator = validate(
  checkSchema({
    productId: {
      in: ['params'],
      notEmpty: {
        errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
      },
      custom:{
        options: async(value, {req}) => {
          const product = await databaseService.products.findOne({_id: new ObjectId(value)})
          if(!product){
            throw new ErrorWithStatus({
              message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', value),
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          req.product = product
        }
      }
    },
    Quantity: {
      in: ['body'],
      isInt: {
        options: {min: 0},
        errorMessage: CART_MESSAGES.NON_NEGATIVE_INTEGER_QUANTITY
      }
    }
  })
)

export const removeProductFromCartValidator = validate(
  checkSchema(
    {
      productId: {
        notEmpty: {
          errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: CART_MESSAGES.INVALID_PRODUCT_ID
        },
        custom: {
          options: async (value, { req }) => {
            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })
            if (!product) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.PRODUCT_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params'] 
  )
)











