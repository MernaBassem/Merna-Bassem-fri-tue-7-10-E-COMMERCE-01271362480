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

//----------------------------------

/**
 * 
 * @api {GET} /categories  get all categories
 * @returns get all categories
 */

export const getAllCategory = async(req,res,next)=>{
  const getAllCategory = await Category.find()
  return res.status(200).json({count:getAllCategory.length,categories:getAllCategory})
}

//----------------------------------

/**
 * @api {GET} /categories Get category by name or id or slug
 */

export const getCategory = async(req,res,next)=>{
  // destruct data from query
  const { id, name, slug } = req.query;
  const filterQuery = {};

  // check if the query params are present
  if (id) {
    filterQuery._id = id;
  }
  if (name) {
    filterQuery.name = name;
  }
  if (slug) {
    filterQuery.slug = slug;
  }

  const category = await Category.findOne(filterQuery);

  // find the category
  if (!category) {
    return next(
      new ErrorClass("Category not found", 404, "Category not found")
    );
  }

  res.status(200).json({
    message: "Category found",
    data: category,
  });
}