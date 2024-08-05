

import slugify from "slugify";
import { nanoid } from "nanoid";
// models
import { SubCategory, Brand } from "../../../DB/Models/index.js";
// uitls
import { cloudinaryConfig, ErrorClass, uploadFile } from "../../utils/index.js";

/**
 * @api {post} /brands/createBrand  Create a brand
 * @query categoryId , subCategoryId
 * @body name
 * @return create brand
 */
export const createBrand = async (req, res, next) => {
  // destruct data categoryId , subCategory id from query
  const { categoryId, subCategoryId } = req.query;
  // check subCategoryId and categoryId
  const isSubcategoryExist = await SubCategory.findOne({
    _id: subCategoryId,
    categoryId: categoryId,
  }).populate("categoryId");
  if (!isSubcategoryExist) {
    return next(
      new ErrorClass("subCategory not found", 404, "subCategory not found")
    );
  }
  // destruct name from body
  const { name } = req.body;
  // generating brand slug
  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });
  // image
  if (!req.file) {
    return next(
      new ErrorClass("Please upload an image", 400, "Please upload an image")
    );
  }
  // upload the image to cloudinary
  const customId = nanoid(4);
  const { secure_url, public_id } = await uploadFile({
    file: req.file.path,
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${isSubcategoryExist.categoryId.customId}/SubCategories/${isSubcategoryExist.customId}/Brands/${customId}`,
  });
  
  // create the brand in db
  const newBrand = await Brand.create({
    name,
    slug,
    logo: {
      secure_url,
      public_id,
    },
    customId,
    categoryId: isSubcategoryExist.categoryId._id,
    subCategoryId: isSubcategoryExist._id,
  });
  // send the response
  res.status(201).json({
    message: "Brand created successfully",
    data: newBrand,
  });
};
//-----------------------------
/**
 * @api {get} /brands/getAllBrand  get all brands pagination
 * @return get all brands 
*/
export const getAllBrand = async (req, res, next) => {
  const { page = 1, limit = 2 } = req.query;
  const skip = (page - 1) * limit;
  const brands = await Brand.paginate({}, { page, limit, skip});
  res.status(200).json({
    message: "Brands fetched successfully",
    brands,
  });
};
//-----------------------------
/**
 * @api {get} /brands/filterBrand  get brand by id or slug or name or categoryId or subCategoryId
 * @return get brand
 */

export const filterBrand = async (req, res, next) => {
  const { id, slug, name, categoryId, subCategoryId } = req.query;
  const queryFilter = {};
  if (id) queryFilter._id = id;
  if (slug) queryFilter.slug = slug;
  if (name) queryFilter.name = name;
  if (categoryId) queryFilter.categoryId = categoryId;
  if (subCategoryId) queryFilter.subCategoryId = subCategoryId;
  const brands = await Brand.find(queryFilter);
  res.status(200).json({
    message: "Brands fetched successfully",
    brands,
  });
}

// ----------------------------------------

/**
 * @api {delete} /brands/deleteBrand/:id delete brand
 * @return delete brand
 */

export const deleteBrand = async (req, res, next) => {
  // get the brand id
  const { id } = req.params;

  // find the brand by id
  const brand = await Brand.findByIdAndDelete(id)
    .populate("categoryId")
    .populate("subCategoryId");
  if (!brand) {
    return next(new ErrorClass("brand not found", 404, "brand not found"));
  }
  // delete the related image from cloudinary
  const brandPath = `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`;
  // delete the related products from db
  // await Product.deleteMany({ brandId: brand.id });
  // delete the related folders from cloudinary
  await cloudinaryConfig().api.delete_resources_by_prefix(brandPath);
  await cloudinaryConfig().api.delete_folder(brandPath);

  res.status(200).json({
    message: "brand deleted successfully",
    deleteBrand
  });
};
