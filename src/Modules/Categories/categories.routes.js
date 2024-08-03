import { Router } from "express";
// controllers
import * as controller from "./categories.controller.js";
// schema 
import {
  createCategorySchema,
  deleteCategorySchema,
  getAllCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "./categories.schema.js";

// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
// models
import { Category } from "../../../DB/Models/index.js";

// get the required middlewares
const { errorHandler, getDocumentByName, multerHost, validationMiddleware } =
  middlewares;

const categoryRouter = Router();

// routes
// create category
categoryRouter.post(
  "/createCategory",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(createCategorySchema),
  getDocumentByName(Category),
  errorHandler(controller.createCategory)
);
// get All category
categoryRouter.get("/getAllCategory",
  validationMiddleware(getAllCategorySchema),
  errorHandler(controller.getAllCategory));
// get category
categoryRouter.get(
  "/getCategory",
  validationMiddleware(getCategorySchema),
  errorHandler(controller.getCategory)
);
// update category
categoryRouter.put(
  "/updateCategory/:id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(updateCategorySchema),
  getDocumentByName(Category),
  errorHandler(controller.updateCategory)
);
//delete category
categoryRouter.delete(
  "/deleteCategory/:id",
  validationMiddleware(deleteCategorySchema),
  errorHandler(controller.deleteCategory)
);
export { categoryRouter };
