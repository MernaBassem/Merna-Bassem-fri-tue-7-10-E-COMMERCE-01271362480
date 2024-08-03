// routes sub category

import { Router } from "express";
// controllers
import * as controller from "./sub-categories.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
// models
import { SubCategory } from "../../../DB/Models/index.js";
import { createSubCategorySchema } from "./sub-categories.schema.js";


// get the required middlewares
const { errorHandler, getDocumentByName, multerHost, validationMiddleware } =
  middlewares;


const SubCategoryRouter = Router();

// routes
// create subCategory
SubCategoryRouter.post(
  "/createSubCategory",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(createSubCategorySchema),
  getDocumentByName(SubCategory),
  errorHandler(controller.createSubCategory)
);


export { SubCategoryRouter };


