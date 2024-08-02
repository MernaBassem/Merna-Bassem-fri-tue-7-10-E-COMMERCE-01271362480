// category validation api
import Joi from "joi";
// utils 
import { extensions ,objectIdValidation } from "../../utils/index.js";
// add job

export const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.min": "Category Name should have a minimum length of 3 characters",
      "any.required": "Category Name is required",
      "string.base": "Category Name must be a string",
    }),
    // image file validation export file extention image extention
  //  image: Joi.file().valid(...extensions.Images).required().messages({
  //   "any.required": "Image is required",
  //   "any.only": "Invalid image type",
  // })

  }),
};

// get category name or slug or id 

export const getCategorySchema = {
  query: Joi.object({
    name:Joi.string().messages({
      "string.base":"Category Name must be a string"
    }),
    id: Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .required()
      .messages({
        "any.required": "Category ID is required",
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
      slug:Joi.string().messages({
      "string.base":"Category Name must be a string"
    }),
  }).min(1)
    .messages({
      "object.min":
        "At least one field is required send in query parameters sush as workingTime,jobLocation,seniorityLevel,jobTitle,technicalSkills,softSkills",
    }),
}