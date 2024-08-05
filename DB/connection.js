

import mongoose from "./global-setup.js";
import { Brand } from "./Models/brand.models.js";

// connection db use mongoose
export const connection_db = async () => {
  try {

    await mongoose.connect(process.env.CONNECTION_DB_URI);
    console.log("Database connected");
    


  } catch (error) {
    console.log("Error connecting to database", error);
  }
}

