// Brand validation api
import Joi from "joi";
// utils
import { extensions, objectIdValidation } from "../../utils/index.js";
// create brand schema joi
export const createBrandSchema = {
  body: Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.min": "Brand Name should have a minimum length of 3 characters",
      "any.required": "Brand Name is required",
      "string.base": "Brand Name must be a string",
    }),
  }),
  query: Joi.object({
    categoryId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .required()
      .messages({
        "any.required": "Category ID is required",
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
    subCategoryId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .required()
      .messages({
        "any.required": "SubCategory ID is required",
        "string.base": "SubCategory ID must be a string",
        "string.pattern": "SubCategory ID must be a valid ObjectId",
      }),
  }),
};

// get all brand schema
export const getAllBrandSchema = {
  // check page and limit number
  query: Joi.object({
    page: Joi.number().messages({
      "number.base": "Page must be a number",
    }),
    limit: Joi.number().messages({
      "number.base": "Limit must be a number",
    }),
  }),
};

// get brand by id or name or slug or categoryId , subCategoryId

export const filterBrandSchema = {
  query: Joi.object({
    name: Joi.string().messages({
      "string.base": "Brand Name must be a string",
    }),
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "Brand ID must be a string",
        "string.pattern": "Brand ID must be a valid ObjectId",
      }),
    categoryId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
    subCategoryId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "SubCategory ID must be a string",
        "string.pattern": "SubCatgeory ID must be a valid ObjectId",
      }),
    slug: Joi.string().messages({
      "string.base": "Brand Slug must be a string",
    }),
  })
    .min(1)
    .messages({
      "object.min":
        "At least one field is required in query parameters such as name, id, or slug or subCategoryId or categoryId",
    }),
};


// delete Brand schema
export const deleteBrandSchema = {
  params: Joi.object({
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation").required()
      .messages({
        "any.required": "Brand ID is required",
        "string.base": "Brand ID must be a string",
        "string.pattern": "Brand ID must be a valid ObjectId",
      }),
  }),
}
// update brand schema


export const updateBrandSchema = {
  params: Joi.object({
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation").required()
      .messages({
        "any.required": "Brand ID is required",
        "string.base": "Brand ID must be a string",
        "string.pattern": "Brand ID must be a valid ObjectId",
      }),
  }),
  body: Joi.object({
    public_id_new: Joi.string().messages({
      "string.base": "Brand Image must be a string",
    }),
     name: Joi.string().min(3).messages({
      "string.min": "Brand Name should have a minimum length of 3 characters",
    })
  }).min(1)
    .messages({
      "object.min": "At least one field is required in body such as name or image(send image and public_id_new)",
    }),
}