
import mongoose from "mongoose";
const { Schema, model } = mongoose;


const categorySchema = new Schema({
   name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase:true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // TODO: Change to true after adding authentication
    },
    Images: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
        unique: true,
      },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },

},
{ timestamps: true }
)

// Virtual field to populate jobs
categorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "categoryId",
});

// Ensure virtual fields are included in the output
categorySchema.set("toJSON", { virtuals: true });


export const Category =
  mongoose.models.Category || model("Category", categorySchema);
