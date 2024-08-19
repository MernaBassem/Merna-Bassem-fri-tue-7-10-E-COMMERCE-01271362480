// schema model
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const addressSchema = new Schema({
  addressLabel: {
    type: String,
    required: true,
    trim: true,
  },
  buildingNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  floorNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },

  postalCode: {
    type: String,
    required: true,
    trim: true,
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
  isMarkedAsDeleted: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Address =
  mongoose.models.Address || model("Address", addressSchema);
