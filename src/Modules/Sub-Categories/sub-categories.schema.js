
import Joi from "joi";
import { extensions ,objectIdValidation } from "../../utils/index.js";

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
// get subcategory by id or name or slug

export const getSubCategorySchema = {
  query: Joi.object({
    name: Joi.string().messages({
      "string.base": "Category Name must be a string"
    }),
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
    slug: Joi.string().messages({
      "string.base": "Category Slug must be a string"
    }),
  }).min(1)
    .messages({
      "object.min": "At least one field is required in query parameters such as name, id, or slug",
    }),
}
// update subCategory schema

export const updateSubCategorySchema = {
  params: Joi.object({
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation").required()
      .messages({
        "any.required": "Category ID is required",
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
  }),
  body: Joi.object({
    public_id_new: Joi.string().messages({
      "string.base": "Category Image must be a string",
    }),
     name: Joi.string().min(3).messages({
      "string.min": "Category Name should have a minimum length of 3 characters",
    })
  }).min(1)
    .messages({
      "object.min": "At least one field is required in body such as name or image(send image and public_id_new)",
    }),
}
