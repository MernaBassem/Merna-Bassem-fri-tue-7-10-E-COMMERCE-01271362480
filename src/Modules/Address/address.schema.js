// add address schema joi
import Joi from "joi";
import { objectIdValidation } from "../../utils/index.js";

export const addAddressSchema = {
    body: Joi.object({
        country: Joi.string().required().messages({
            "string.base": "Country must be a string",
            "any.required": "Country is required",
        }),
        city: Joi.string().required().messages({
            "string.base": "City must be a string",
            "any.required": "City is required",
        }),
        postalCode: Joi.string().required().messages({
            "string.base": "Postal Code must be a string",
            "any.required": "Postal Code is required",
        }),
        buildingNumber: Joi.number().required().messages({
            "number.base": "Building Number must be a number",
            "any.required": "Building Number is required",
        }),
        floorNumber: Joi.number().required().messages({
            "number.base": "Floor Number must be a number",
            "any.required": "Floor Number is required",
        }),
        addressLabel: Joi.string().required().messages({
            "string.base": "Address Label must be a string",
            "any.required": "Address Label is required",
        }),
    }),

}
// deleted schecma 

export const deleteAddressSchema = {
  params: Joi.object({
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .required()
      .messages({
        "any.required": "Address ID is required",
        "string.base": "Address ID must be a string",
        "string.pattern": "Address ID must be a valid ObjectId",
      }),
  }),
};