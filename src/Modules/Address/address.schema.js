// add address schema joi
import Joi from "joi";

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