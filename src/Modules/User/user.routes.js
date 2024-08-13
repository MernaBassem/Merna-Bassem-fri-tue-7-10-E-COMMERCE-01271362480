import { Router } from "express";

import * as userController from "./user.controller.js";
import * as middlewares from "../../Middlewares/index.js";
import {generalSchemaCheckOnlyToken, SignInSchema, SignUpSchema, updatePasswordSchema, updateUserSchema,} from "./user.schema.js";

// get the required middlewares
const { errorHandler, validationMiddleware,authenticate } = middlewares;

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
// logout api
UserRouter.post(
  "/logOut",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(generalSchemaCheckOnlyToken)),
  errorHandler(userController.logOut)
);

// update user api
UserRouter.put(
  "/updateAccount",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(updateUserSchema)),
  errorHandler(userController.updateAccount)
);
// delete user api
UserRouter.delete(
  "/deleteAccount",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(generalSchemaCheckOnlyToken)),
  errorHandler(userController.deleteUser)
);
// api update user password
UserRouter.patch(
  "/updatePassword",
  errorHandler(authenticate()),
  errorHandler(validationMiddleware(updatePasswordSchema)),
  errorHandler(userController.updatePassword)
);
export { UserRouter };
