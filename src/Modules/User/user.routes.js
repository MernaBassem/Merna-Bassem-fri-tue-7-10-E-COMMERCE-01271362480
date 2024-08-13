import { Router } from "express";

import * as userController from "./user.controller.js";
import * as middlewares from "../../Middlewares/index.js";
import {SignInSchema, SignUpSchema,} from "./user.schema.js";

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
// signIn api
UserRouter.post(
  "/signIn",
  errorHandler(validationMiddleware(SignInSchema)),
  errorHandler(userController.signIn)
);


export { UserRouter };
