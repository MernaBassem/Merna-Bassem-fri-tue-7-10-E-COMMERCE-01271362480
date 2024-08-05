
import Joi from "joi";
import { extensions ,objectIdValidation } from "../../utils/index.js";

// create Subcategory schema 

export const createSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).required().messages({
            "string.min": "SubCategory Name should have a minimum length of 3 characters",
            "any.required": "SubCategory Name is required",
            "string.base": "SubCategory Name must be a string",
        }), 
    }),
    query: Joi.object({
        categoryId: Joi.string().required().messages({
            "any.required": "SubCategory Id is required",
            "string.base": "SubCategory Id must be a string",
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
      "string.base": "SubCategory Name must be a string"
    }),
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "SubCategory ID must be a string",
        "string.pattern": "SubCategory ID must be a valid ObjectId",
      }),
    slug: Joi.string().messages({
      "string.base": "SubCategory Slug must be a string"
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
        "any.required": "SubCategory ID is required",
        "string.base": "SubCategory ID must be a string",
        "string.pattern": "SubCategory ID must be a valid ObjectId",
      }),
  }),
  body: Joi.object({
    public_id_new: Joi.string().messages({
      "string.base": "SubCategory Image must be a string",
    }),
     name: Joi.string().min(3).messages({
      "string.min": "SubCategory Name should have a minimum length of 3 characters",
    })
  }).min(1)
    .messages({
      "object.min": "At least one field is required in body such as name or image(send image and public_id_new)",
    }),
}
// delete subCategory schema
export const deleteSubCategorySchema = {
  params: Joi.object({
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation").required()
      .messages({
        "any.required": "SubCategory ID is required",
        "string.base": "SubCategory ID must be a string",
        "string.pattern": "SubCategory ID must be a valid ObjectId",
      }),
  }),
}