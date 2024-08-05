import { Router } from "express";
// controllers
import * as controller from "./brand.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";
// utils
import { extensions } from "../../utils/index.js";
import { createBrandSchema, filterBrandSchema, getAllBrandSchema } from "./brand.schema.js";

const brandRouter = Router();
const { errorHandler, multerHost,validationMiddleware } = Middlewares;
// create brand
brandRouter.post(
  "/createBrand",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(createBrandSchema),
  errorHandler(controller.createBrand)
);
// get all brand
brandRouter.get(
  "/getAllBrand",
  validationMiddleware(getAllBrandSchema),
  errorHandler(controller.getAllBrand)
)
// get filter brands
brandRouter.get(
  "/filterBrand",
  validationMiddleware(filterBrandSchema),
  errorHandler(controller.filterBrand)
)

export { brandRouter };
