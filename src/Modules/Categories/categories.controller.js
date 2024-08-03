import slugify from "slugify";
import { nanoid } from "nanoid";
import { cloudinaryConfig, uploadFile, ErrorClass } from "../../utils/index.js";
import { Category, SubCategory } from "../../../DB/Models/index.js";

/**
 * @api {POST} /categories/createCategory  create a  new category
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
 * @api {GET} /categories/getAllCategory  get all categories with pagination
 * @returns get all categories
 */

export const getAllCategory = async (req, res, next) => {
  const { page = 1, limit = 2 } = req.query;
  const skip = (page - 1) * limit;
  const getAllCategory = await Category.paginate(
    {},
    { page, limit, skip, populate: "subCategories" }
  );
  return res
    .status(200)
    .json({ count: getAllCategory.length, categories: getAllCategory });
};

//----------------------------------

/**
 * @api {GET} /categories/getCategory Get category by name or id or slug
 */

export const getCategory = async (req, res, next) => {
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
};

//----------------------------------

/**
 * @api {put} /categories/upadateCategory/:id update category
 * @body name , image
 * @return update category
 */

export const updateCategory = async (req, res, next) => {
  // get the category id
  const { id } = req.params;
  // find the category by id
  const category = await Category.findById(id);
  // check if the category exists
  if (!category) {
    return next(
      new ErrorClass("Category not found", 404, "Category not found")
    );
  }

  // name of the category and public_id_new
  const { name, public_id_new } = req.body;
  // if send name change slug
  if (name) {
    category.name = name;
    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  // image
  if (req.file) {
    // split the public_id
    const splitedPublicId = public_id_new.split(`${category.customId}/`)[1];

    // upload the new image
    const { secure_url } = await uploadFile({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`,
      publicId: splitedPublicId,
    });
    // update the image
    category.Images.secure_url = secure_url;
  }

  // save the category
  await category.save();
  // return the response
  res.status(200).json({
    message: "Category updated successfully",
    data: category,
  });
};
//----------------------------------
/**
 * @api {delete} /categories/deleteCategory/:id delete category
 * @return delete category
 */

export const deleteCategory = async (req, res, next) => {
  // get the category id
  const { id } = req.params;
  // find and delete  the category by id
  const category = await Category.findByIdAndDelete(id);
  // check if the category exists
  if (!category) {
    return next(
      new ErrorClass("Category not found", 404, "Category not found")
    );
  }

  // delete the image from cloudinary

  const categoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${category?.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath);
  await cloudinaryConfig().api.delete_folder(categoryPath);

  // delete sub categories 
  await SubCategory.deleteMany({ categoryId: category._id });
  /**
   * @todo  delete the related  , brand ,  products from db
   */

  // return the response
  res.status(200).json({
    message: "Category deleted successfully",
    data: category,
  });
};

//----------------------------------
