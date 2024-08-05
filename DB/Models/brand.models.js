import mongoose from "mongoose";
const { Schema, model } = mongoose;

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // TODO: Change to true after adding authentication
    },
    logo: {
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
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
}, { timestamps: true });

// Add index on 'name' and 'subCategoryId'
brandSchema.index({ name: 1, subCategoryId: 1 }, { unique: true });

export const Brand = mongoose.models.Brand || model("Brand", brandSchema);