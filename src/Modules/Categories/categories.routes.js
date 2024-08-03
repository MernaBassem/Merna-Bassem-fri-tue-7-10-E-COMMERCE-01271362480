import { Router } from "express";
// controllers
import * as controller from "./categories.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
// models
import { Category } from "../../../DB/Models/index.js";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "./categories.schema.js";

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
categoryRouter.get("/getAllCategory", errorHandler(controller.getAllCategory));
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
  errorHandler(controller.updateCategory)
);
export { categoryRouter };
