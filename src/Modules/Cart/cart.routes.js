import { Router } from "express";
// controllers
import * as controller from "./cart.controller.js";
//middlewares
import * as middlewares from "../../Middlewares/index.js";
import { AddCartSchema, RemoveFromCartSchema } from "./cart.schema.js";

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
  validationMiddleware(RemoveFromCartSchema),
  errorHandler(controller.removeFromCart)

);
// update cart 
CartRouter.put(
  "/updateCart/:productId",
  authenticate(),
  errorHandler(controller.updateCart)
)
export { CartRouter }