// routes sub category

import { Router } from "express";
// controllers
import * as controller from "./product.controller.js";
// utils
import { extensions } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
import { addProductSchema } from "./product.schema.js";

// get the required middlewares
const { errorHandler, getDocumentByName, multerHost, validationMiddleware } =
  middlewares;


const ProductRouter = Router();

// routes
// create subCategory
ProductRouter.post(
  "/addProduct",
  multerHost({ allowedExtensions: extensions.Images }).array("image", 5),
  validationMiddleware(addProductSchema),
  errorHandler(controller.addProduct)
);


export { ProductRouter };


