import slugify from "slugify";
import { nanoid } from "nanoid";
// utils
import { ErrorClass, cloudinaryConfig, uploadFile } from "../../utils/index.js";
// models
import { Category, SubCategory } from "../../../DB/Models/index.js";


/**
 * @post /subCategories/createSubCategory
 * @body name , image
 * @query categoryId
 * @return create sub-category
 */

export const createSubCategory = async (req, res, next) => {
    // destruct categoryId from query
    const { categoryId } = req.query;
    // find the category by id in query
    const category = await Category.findById(categoryId);
    // check category exists
    if (!category) {
        return next(
            new ErrorClass("Category not found", 404, "Category not found")
        );
    }

    // Generating category slug
    const { name } = req.body;

    const slug = slugify(name, {
        replacement: "_",
        lower: true,
    });

    // Image
    if (!req.file) {
        return next(
            new ErrorClass("Please upload an image", 400, "Please upload an image")
        );
    }

    // upload the image to cloudinary
    const customId = nanoid(4);
    const { secure_url, public_id } = await uploadFile({
        file: req.file.path,
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`,
    });

    // prepare category object
    const subCategory = {
        name,
        slug,
        Images: {
            secure_url,
            public_id,
        },
        customId,
        categoryId: category._id,
    };

    // create the category in db
    const newSubCategory = await SubCategory.create(subCategory);

    // send the response
    res.status(201).json({
        status: "success",
        message: "Sub-Category created successfully",
        data: newSubCategory,
    });
}