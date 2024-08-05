import { Router } from "express";
// controllers
import * as controller from "./brand.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";
// utils
import { extensions } from "../../utils/index.js";
import { createBrandSchema } from "./brand.schema.js";

const brandRouter = Router();
const { errorHandler, multerHost } = Middlewares;

brandRouter.post(
  "/createBrand",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  Middlewares.validationMiddleware(createBrandSchema),
  errorHandler(controller.createBrand)
);


export { brandRouter };
