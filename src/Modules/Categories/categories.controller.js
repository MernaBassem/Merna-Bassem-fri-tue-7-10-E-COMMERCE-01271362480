import slugify from "slugify";
import { nanoid } from "nanoid";
import { cloudinaryConfig, uploadFile, ErrorClass } from "../../utils/index.js";
import { Category } from "../../../DB/Models/index.js";

/**
 * @api {POST} /categories/create  create a  new category
 * @body name , image
 * @return create category
 */

export const createCategory = async (req, res, next) => {
  // destructuring the request body
  const { name } = req.body;

  // Generating category slug
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
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`,
  });

  // create new instance
  const category = new Category({
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
  });

  // create the category in db
  await category.save();

  // send the response
  res.status(201).json({
    message: "Category created successfully",
    data: category,
  });
};
