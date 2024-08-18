// routes sub category

import { Router } from "express";
// controllers
import * as controller from "./product.controller.js";
// utils
import { extensions, systemRoles } from "../../utils/index.js";
// middlewares
import * as middlewares from "../../Middlewares/index.js";
import { addProductSchema, getProductSchema, updateProductSchema } from "./product.schema.js";

// get the required middlewares
const { errorHandler, getDocumentByName, multerHost, validationMiddleware, authenticate,authorizationMiddleware } =
  middlewares;


const ProductRouter = Router();

// routes
// create product
ProductRouter.post(
  "/addProduct",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  multerHost({ allowedExtensions: extensions.Images }).array("image", 5),
  validationMiddleware(addProductSchema),
  errorHandler(controller.addProduct)
);
// delete product
ProductRouter.delete(

  "/deleteProduct/:productId",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  errorHandler(controller.deleteProduct)
)
// update product
ProductRouter.put(
    "/updateProduct/:productId",
    authenticate(),
    authorizationMiddleware(systemRoles.ADMIN),
    multerHost({ allowedExtensions: extensions.Images }).single("image"),
    validationMiddleware(updateProductSchema),
    errorHandler(controller.updateProduct)
)
// get product by id
ProductRouter.get(
  "/getProductById/:productId",
  validationMiddleware(getProductSchema),
  errorHandler(controller.getProduct)
)
// get products
ProductRouter.get("/getProducts", errorHandler(controller.getProducts));
export { ProductRouter };


