

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
