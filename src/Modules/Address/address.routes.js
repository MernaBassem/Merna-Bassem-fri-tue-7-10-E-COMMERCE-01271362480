import { Router } from "express";

import * as addressController from "./address.controller.js";
import * as middlewares from "../../Middlewares/index.js";
import { addAddressSchema } from "./address.schema.js";


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

export { AddressRouter };
