
// product schema validation by joi 
import Joi from "joi";
// utils
import { DiscountType, objectIdValidation } from "../../utils/index.js";

/**
 * add product validation by joi
 * check body title, overview, specs, price, discountAmount, discountType, stock 
 * check query brandId, categoryId, subCategoryId
 */

export const addProductSchema = {
  body: Joi.object({
    title: Joi.string().min(3).required().messages({
      "string.min": "Title should have a minimum length of 3 characters",
      "any.required": "Title is required",
      "string.base": "Title must be a string",
    }),
    overview: Joi.string().min(3).messages({
      "string.min": "Overview should have a minimum length of 3 characters",
      "string.base": "Overview must be a string",
    }),
    specs: Joi.string().min(3).messages({
      "string.min": "Specs should have a minimum length of 3 characters",
      "string.base": "Specs must be a string",
    }),
    price: Joi.number().required().messages({
      "any.required": "Price is required",
      "number.base": "Price must be a number",
    }),
    discountAmount: Joi.number().messages({
      "number.base": "Discount Amount must be a number",
    }),
    discountType: Joi.string().valid(DiscountType.PERCENTAGE, DiscountType.FIXED).messages({
      "string.base": "Discount Type must be a string",
      "any.only": "Invalid discount type",
    }),
    stock: Joi.number().required().messages({
      "any.required": "Stock is required",
      "number.base": "Stock must be a number",
    }),
  }),
  query: Joi.object({
    brandId:Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
    categoryId:Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
    subCategoryId:Joi.string()
      .custom(objectIdValidation, "Object ID Validation")
      .messages({
        "string.base": "Category ID must be a string",
        "string.pattern": "Category ID must be a valid ObjectId",
      }),
  })

};

//---------
// delete product schema validation

export const deleteProductSchema = {
  params: Joi.object({
    productId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation").required()
      .messages({
        "any.required": "Product ID is required",
        "string.base": "Product ID must be a string",
        "string.pattern": "Product ID must be a valid ObjectId",
      }),
  }),
}
//---------
// update product schema validation

export const updateProductSchema = {
  params: Joi.object({
    productId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation").required()
      .messages({
        "any.required": "Product ID is required",
        "string.base": "Product ID must be a string",
        "string.pattern": "Product ID must be a valid ObjectId",
      }),
  }),
  body: Joi.object({
    title: Joi.string().min(3).messages({
      "string.min": "Title should have a minimum length of 3 characters",
      "string.base": "Title must be a string",
    }),
    public_id_new: Joi.string().min(3).messages({
      "string.min": "public_id_new should have a minimum length of 3 characters",
      "string.base": "public_id_new must be a string",
    }),
    overview: Joi.string().min(3).messages({
      "string.min": "Overview should have a minimum length of 3 characters",
      "string.base": "Overview must be a string",
    }),
    specsAdd: Joi.string().min(3).messages({
      "string.min": "specsAdd should have a minimum length of 3 characters",
      "string.base": "specsAdd must be a string",
    }),
    specsRemove: Joi.string().min(3).messages({
      "string.min": "specsRemove should have a minimum length of 3 characters",
      "string.base": "specsRemove must be a string",
    })
    ,badge: Joi.string().min(3).messages({
      "string.min": "Badge should have a minimum length of 3 characters",
      "string.base": "Badge must be a string",
    }),
    price: Joi.number().messages({
      "number.base": "Price must be a number",
    }),
    discountAmount: Joi.number().messages({
      "number.base": "Discount Amount must be a number",
    }),
    discountType: Joi.string().valid(DiscountType.PERCENTAGE, DiscountType.FIXED).messages({
      "string.base": "Discount Type must be a string",
      "any.only": "Invalid discount type",
    }),
    stock: Joi.number().messages({
      "number.base": "Stock must be a number",
    }),
  }),
}
//---------
// get product schema validation
export const getProductSchema = {
  params: Joi.object({
    productId: Joi.string()
      .custom(objectIdValidation, "Object ID Validation").required()
      .messages({
        "any.required": "Product ID is required",
        "string.base": "Product ID must be a string",
        "string.pattern": "Product ID must be a valid ObjectId",
      }),
  }),
}