// category validation api
import Joi from "joi";
// utils 
import { extensions } from "../../utils/index.js";
// add job

export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.min": "Category Name should have a minimum length of 3 characters",
      "any.required": "Category Name is required",
      "string.base": "Category Name must be a string",
    }),
    // image file validation export file extention image extention
   image: Joi.string().valid(...extensions.Images).required().messages({
    "any.required": "Image is required",
    "any.only": "Invalid image type",
  })

  }),
};