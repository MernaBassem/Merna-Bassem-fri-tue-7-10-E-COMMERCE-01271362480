import slugify from "slugify";
import { nanoid } from "nanoid";
// utils
import { ErrorClass, cloudinaryConfig, uploadFile } from "../../utils/index.js";
// models
import { Brand, Category, Product, SubCategory } from "../../../DB/Models/index.js";

/**
 * @api {post} /subCategories/createSubCategory
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
};
//--------------------------------

/**
 * @api {get} /subCategories/getAllSubCategory with pagination
 * @return get all sub-categories
 *
 */

export const getAllSubCategory = async (req, res, next) => {
  const { page = 1, limit = 2 } = req.query;
  const skip = (page - 1) * limit;
  const subCategories = await SubCategory.paginate({}, { page, limit, skip,populate: "brands" });
  res.status(200).json({
    message: "Sub-categories fetched successfully",
    subCategories,
  });
};

//--------------------------------
/**
 * @api {get} /subCategories/getSubCategory By id or slug or name
 * @query id or slug or name
 * @return get sub-category by id or slug or name
 */

export const getSubCategory = async (req, res, next) => {
  const { id, name, slug } = req.query;
  const filterQuery = {};
  // check if the query params are present

  if (id) filterQuery._id = id;
  if (name) filterQuery.name = name;
  if (slug) filterQuery.slug = slug;

  const subCategory = await SubCategory.findOne(filterQuery);
  // check sub-category exists
  if (!subCategory)
    return next(
      new ErrorClass("Sub-Category not found", 404, "Sub-Category not found")
    );
    // send the response
  return res.status(200).json({ subCategory });
};
//--------------------------------------
/**
 * @api {put} /subCategories/updateSubCategory/:id update sub-category
 * @body name or image 
 * @return update sub-category
 * 
 */
export const updateSubCategory = async (req, res, next) => {
  // destruct id from params
  const { id } = req.params;
  // check if sub-category exists
  const subCategory = await SubCategory.findById(id).populate("categoryId");
  if (!subCategory)
    return next(
      new ErrorClass("Sub-Category not found", 404, "Sub-Category not found")
    );
    // destruct name and public_id_new from body
  const { name, public_id_new } = req.body;
  // if change name change slug
  if (name) {
    subCategory.name = name;
    subCategory.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }
  //image 
  if (req.file){
    //split the public_id
    const splitedPublicId =public_id_new.split(`${subCategory.customId}/`)[1];
    // upload the new image
    const { secure_url } = await uploadFile({
      file: req.file.path,
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}`,
      publicId: splitedPublicId,
    });
    // update the image
    subCategory.Images.secure_url = secure_url;
  }
  // save the sub-category
  await subCategory.save();
  // send the response
  res.status(200).json({
    message: "Sub-Category updated successfully",
    subCategory,
  });
};


//--------------------------------
/**
 * @api {delete} /subCategories/deleteSubCategory/:id delete sub-category
 * @return delete sub-category
 *
 */

export const deleteSubCategory = async (req, res, next) => {
  // destruct id from params
  const { id } = req.params;
  // check if sub-category exists
  const subCategory = await SubCategory.findByIdAndDelete(id).populate("categoryId");
  // if sub-category not found
  if (!subCategory)
    return next(
      new ErrorClass("Sub-Category not found", 404, "Sub-Category not found")
    );

  // delete the image from cloudinary
  const subCategoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}`;
  await cloudinaryConfig().api.delete_resources_by_prefix(subCategoryPath);
  await cloudinaryConfig().api.delete_folder(subCategoryPath);


    // delete all brands
   const deletedBrands=  await Brand.deleteMany({ subCategoryId: subCategory._id });
    // check if subcategories are deleted already
  
    if (deletedBrands.deletedCount) {
      const deletedProducts = await Product.deleteMany({ subCategoryId: subCategory._id });
  }
   /**
   * @todo  delete the related   ,  products from db
   */

  // send the response
  res.status(200).json({
    message: "Sub-Category deleted successfully",
    subCategory,
  });
};
