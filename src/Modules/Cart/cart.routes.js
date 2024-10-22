import { Router } from "express";
// controllers
import * as controller from "./cart.controller.js";
//middlewares
import * as middlewares from "../../Middlewares/index.js";
import { AddCartSchema } from "./cart.schema.js";

const CartRouter = Router()
const { errorHandler, validationMiddleware, authenticate } = middlewares;

// routes

// add cart
CartRouter.post(
  "/addToCart/:productId",
  authenticate(),
  validationMiddleware(AddCartSchema),
  errorHandler(controller.addToCart)
);
// remove from cart
CartRouter.put(
  "/removeFromCart/:productId",
  authenticate(),
  errorHandler(controller.removeFromCart)

);

export { CartRouter }