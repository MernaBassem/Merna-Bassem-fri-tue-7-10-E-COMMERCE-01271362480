
import { Router } from "express";
// controllers
import * as controller from "./categories.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
// models
import { Category } from "../../../DB/Models/index.js";
import { createCategorySchema } from "./categories.schema.js";

// get the required middlewares
const { errorHandler, getDocumentByName, multerHost ,validationMiddleware} = middlewares;


const categoryRouter = Router();

// routes
categoryRouter.post(
  "/createCategory",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(createCategorySchema),
  getDocumentByName(Category),
  errorHandler(controller.createCategory)
);

export { categoryRouter };
