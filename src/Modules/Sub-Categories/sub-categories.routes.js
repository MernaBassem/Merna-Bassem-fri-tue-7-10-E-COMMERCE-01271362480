// routes sub category

import { Router } from "express";
// controllers
import * as controller from "./sub-categories.controller.js";
// utils
import { extensions, systemRoles } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
// models
import { SubCategory } from "../../../DB/Models/index.js";
import { createSubCategorySchema, deleteSubCategorySchema, getAllSubCategorySchema, getSubCategorySchema, updateSubCategorySchema } from "./sub-categories.schema.js";


// get the required middlewares
const { errorHandler, getDocumentByName, multerHost, validationMiddleware ,authenticate,authorizationMiddleware} =
  middlewares;


const SubCategoryRouter = Router();

// routes
// create subCategory
SubCategoryRouter.post(
  "/createSubCategory",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(createSubCategorySchema),
  getDocumentByName(SubCategory),
  errorHandler(controller.createSubCategory)
);
// get All subCategory
SubCategoryRouter.get("/getAllSubCategory",
  validationMiddleware(getAllSubCategorySchema)
  , errorHandler(controller.getAllSubCategory));

// get subCategory by id or name or slug
SubCategoryRouter.get(
  "/getSubCategory",
  validationMiddleware(getSubCategorySchema),
  errorHandler(controller.getSubCategory)
)
// update subCategory
SubCategoryRouter.put(
  "/updateSubCategory/:id",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(updateSubCategorySchema),
  getDocumentByName(SubCategory),
  errorHandler(controller.updateSubCategory)
)
// delete subCategory
SubCategoryRouter.delete(
  "/deleteSubCategory/:id",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  validationMiddleware(deleteSubCategorySchema),
  errorHandler(controller.deleteSubCategory)
)
export { SubCategoryRouter };


