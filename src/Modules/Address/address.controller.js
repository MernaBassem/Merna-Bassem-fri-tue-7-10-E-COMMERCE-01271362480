import axios from "axios";
import { Address } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../utils/index.js";

/**
 * @api {post} /address/addAddress  Add Address
 * @query  userId from token authentication req.authUser._id
 * @body country, city, postalCode, buildingNumber, floorNumber, addressLabel from body
 * @returns add address
 */

export const addAddress = async (req, res, next) => {
  // Check user online
  if (!req.authUser) {
    return next(new ErrorClass("User not found", 404, "User not found"));
  }
  if (req.authUser.status !== "online") {
    return next(
      new ErrorClass("User must be online", 400, "User must be online")
    );
  }

  // Destructure request body
  const {
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
  } = req.body;

  // Check country name using the REST Countries API
  const countryResponse = await axios.get(
    `https://restcountries.com/v3.1/name/${country}`
  );

  if (!countryResponse.data || countryResponse.data.length === 0) {
    return next(new ErrorClass("Country not found", 404, "Country not found"));
  }

  // Check city using the API Ninjas City API
  const cityResponse = await axios.get(
    `https://api.api-ninjas.com/v1/city?name=${city}`,
    {
      headers: {
        "X-Api-Key": "pbLFVjQP5FHrZee5pCjQSA==xg08yg3DNymm7oqY",
      },
    }
  );

  if (!cityResponse.data || cityResponse.data.length === 0) {
    return next(new ErrorClass("City not found", 404, "City not found"));
  }

  // check countryResponse.data[0].cca2 === cityResponse.data[0].country
  if (countryResponse.data[0].cca2 !== cityResponse.data[0].country) {
    return next(
      new ErrorClass(
        "Country and city mismatch",
        400,
        "Country and city mismatch"
      )
    );
  }

  // Create address
  const address = await Address.create({
    userId: req.authUser._id,
    country,
    city,
    postalCode,
    buildingNumber,
    floorNumber,
    addressLabel,
  });

  // Return response
  res.status(200).json({
    message: "Address created",
    data: address,
  });
};
//--------------------------------------------------
/**
 * @api {get} /address/getAllAddress Get address
 * @returns get address
 */

export const getAllAddress = async (req, res, next) => {
  // check user online
  if (!req.authUser) {
    return next(new ErrorClass("User not found", 404, "User not found"));
  }
  if (req.authUser.status !== "online") {
    return next(
      new ErrorClass("User must be online", 400, "User must be online")
    );
  }
  const address = await Address.find({ userId: req.authUser._id });
  return res.status(200).json({ address });
};
//----------------------------------------------
/**
 * @api {delete} /address/deleteAddress/:id Delete address
 * @returns delete address
 */
export const deleteAddress = async (req, res, next) => {
  // check user online
  if (!req.authUser) {
    return next(new ErrorClass("User not found", 404, "User not found"));
  }
  if (req.authUser.status !== "online") {
    return next(
      new ErrorClass("User must be online", 400, "User must be online")
    );
  }
  const { id } = req.params;
  // check userId is user is login

  const address = await Address.findById(id);
  if (!address) {
    return next(new ErrorClass("Address not found", 404, "Address not found"));
  }
  if (address.userId.toString() !== req.authUser._id.toString()) {
    return next(
      new ErrorClass(
        "No one other than the owner of the address is allowed to delete it.",
        404,
        "No one other than the owner of the address is allowed to delete it.",
        "delete Address"
      )
    );
  }
  // delete address
  const addressDeleted = await Address.findByIdAndDelete(id);
  // return response
  return res.status(200).json({ message: "Address deleted" , addressDeleted});
};
