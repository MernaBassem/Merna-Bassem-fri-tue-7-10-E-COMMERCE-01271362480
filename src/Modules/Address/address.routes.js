import { Router } from "express";

import * as addressController from "./address.controller.js";
import * as middlewares from "../../Middlewares/index.js";
import { addAddressSchema, updateAddressSchema } from "./address.schema.js";

// get the required middlewares
const { errorHandler, validationMiddleware, authenticate } = middlewares;

const AddressRouter = Router();

// add address
AddressRouter.post(
  "/addAddress",
  errorHandler(authenticate()),
  validationMiddleware(addAddressSchema),
  errorHandler(addressController.addAddress)
);
//get address
AddressRouter.get(
  "/getAllAddress",
  errorHandler(authenticate()),
  errorHandler(addressController.getAllAddress)
);
// delete address
AddressRouter.delete(
  "/deleteAddress/:id",
  errorHandler(authenticate()),
  errorHandler(addressController.deleteAddress)
);
// update address
AddressRouter.put(
  "/updateAddress/:id",
  errorHandler(authenticate()),
  validationMiddleware(updateAddressSchema),
  errorHandler(addressController.updateAddress)
);
export { AddressRouter };
