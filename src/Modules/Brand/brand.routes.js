import { Router } from "express";
// controllers
import * as controller from "./brand.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";
// utils
import { extensions, systemRoles } from "../../utils/index.js";
import { createBrandSchema, deleteBrandSchema, filterBrandSchema, getAllBrandSchema, updateBrandSchema } from "./brand.schema.js";

const brandRouter = Router();
const { errorHandler, multerHost,validationMiddleware,authenticate,authorizationMiddleware } = Middlewares;
// create brand
brandRouter.post(
  "/createBrand",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
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
// delete Brand by id
brandRouter.delete(
  "/deleteBrand/:id",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  validationMiddleware(deleteBrandSchema),
  errorHandler(controller.deleteBrand)
)
// update brand
brandRouter.put(
  "/updateBrand/:id",
  authenticate(),
  authorizationMiddleware(systemRoles.ADMIN),
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  validationMiddleware(updateBrandSchema),
  errorHandler(controller.updateBrand)
)



export { brandRouter };
