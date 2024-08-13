import { Router } from "express";

import * as userController from "./user.controller.js";
import * as middlewares from "../../Middlewares/index.js";
import {SignUpSchema,} from "./user.schema.js";

// get the required middlewares
const { errorHandler, validationMiddleware } = middlewares;

const UserRouter = Router();
// signUp api
UserRouter.post(
  "/signUp",
  errorHandler(validationMiddleware(SignUpSchema)),
  errorHandler(userController.signUp)
);
// confirm email api
UserRouter.get(
  "/confirm-email/:token",
   errorHandler(userController.confirmEmail)
  );

export { UserRouter };
