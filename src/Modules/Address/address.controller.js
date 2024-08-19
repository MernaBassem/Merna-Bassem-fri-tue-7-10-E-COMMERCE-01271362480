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
      return next(
        new ErrorClass("Country not found", 404, "Country not found")
      );
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
    if (
      countryResponse.data[0].cca2 !== cityResponse.data[0].country ) {
      return next(
        new ErrorClass("Country and city mismatch", 400, "Country and city mismatch")
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
