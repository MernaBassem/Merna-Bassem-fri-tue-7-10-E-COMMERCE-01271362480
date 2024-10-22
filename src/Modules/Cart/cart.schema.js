import Joi from "joi";
import { objectIdValidation } from "../../utils/index.js";
import { generalRules } from "../../utils/general-rules.utils.js";


/**
 * schema productId in params
 * token in headers
 * quantity in body
 */

export const AddCartSchema = {
  body: Joi.object({
    quantity: Joi.number().required().messages({
      "any.required": "Quantity is required",
      "number.base": "Quantity must be a number",
    }),
  }),
  params: Joi.object({
    productId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .required()
      .messages({
        "any.required": "Product ID is required",
        "string.base": "Product ID must be a string",
        "string.pattHern": "Product ID must be a valid ObjectId",
      }),
  }),
  headers: Joi.object({
    token: Joi.string().required().messages({
      "string.base": "Token must be a string",
      "any.required": "Token is required",
    }),
    ...generalRules.headers,
  }),
};



//-----
/**
 * schema productId in params
 * token in headers
 * quantity in body
 */

export const RemoveFromCartSchema = {

  params: Joi.object({
    productId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .required()
      .messages({
        "any.required": "Product ID is required",
        "string.base": "Product ID must be a string",
        "string.pattHern": "Product ID must be a valid ObjectId",
      }),
  }),
  headers: Joi.object({
    token: Joi.string().required().messages({
      "string.base": "Token must be a string",
      "any.required": "Token is required",
    }),
    ...generalRules.headers,
  }),
};