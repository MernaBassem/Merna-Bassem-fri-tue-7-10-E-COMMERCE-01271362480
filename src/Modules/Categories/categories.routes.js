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
import { extensions, systemRoles } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
// models
import { Category } from "../../../DB/Models/index.js";

// get the required middlewares
const {
  errorHandler,
  getDocumentByName,
  multerHost,
  validationMiddleware,
  authenticate,
  authorizationMiddleware,
} = middlewares;

const categoryRouter = Router();

// routes
// create category
categoryRouter.post(
  "/createCategory",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
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
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(updateCategorySchema),
  getDocumentByName(Category),
  errorHandler(controller.updateCategory)
);
//delete category
categoryRouter.delete(
  "/deleteCategory/:id",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  validationMiddleware(deleteCategorySchema),
  errorHandler(controller.deleteCategory)
);
export { categoryRouter };
