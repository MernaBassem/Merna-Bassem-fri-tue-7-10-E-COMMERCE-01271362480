
import Joi from "joi";

// create Subcategory schema 

export const createSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).required().messages({
            "string.min": "Category Name should have a minimum length of 3 characters",
            "any.required": "Category Name is required",
            "string.base": "Category Name must be a string",
        }), 
    }),
    query: Joi.object({
        categoryId: Joi.string().required().messages({
            "any.required": "Category Id is required",
            "string.base": "Category Id must be a string",
        }),
    }),
}
// get all subcategory schema

export const getAllSubCategorySchema = {
   // check page and limit number
    query: Joi.object({
        page: Joi.number().messages({
            "number.base": "Page must be a number",
        }),
        limit: Joi.number().messages({
            "number.base": "Limit must be a number",
        }),
    }),
}

