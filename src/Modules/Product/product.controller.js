
/**
 * @api {post} /products/addPRoduct  Add Product
 * @body title, overview, specs, price, discountAmount, discountType, stock from body
 * @query  brandId , categoryId, subCategoryId from query
 * @returns add product
 */

import { nanoid } from "nanoid";
import { Brand ,Product} from "../../../DB/Models/index.js";
// utils
import {
  ErrorClass,
  uploadFile,
} from "../../utils/index.js";

export const addProduct = async(req, res, next) => {
    // destruct from body
    const { title, overview, specs, price, discountAmount, discountType, stock } = req.body;
    // destruct from query
    const { brandId, categoryId, subCategoryId } = req.query;
    // check image send
    if(!req.files.length){
         return next(new ErrorClass("No images uploaded", { status: 400 }));
    }
    // check brandId and categoryId and subCategoryId
    const isBrandExist = await Brand.findOne({
        _id: brandId,
        categoryId: categoryId,
        subCategoryId: subCategoryId
    }).populate("categoryId subCategoryId");

    if(!isBrandExist){
        return next(new ErrorClass("Brand not found", { status: 404 }));
    }

    // Access the customIds from the brandDocument
  const brandCustomId = isBrandExist.customId;
  const catgeoryCustomId = isBrandExist.categoryId.customId;
  const subCategoryCustomId = isBrandExist.subCategoryId.customId;

  // create customId
  const customId = nanoid(4);
  const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`;
  // upload each file to cloudinary
  const URLs = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await uploadFile({
      file: file.path,
      folder,
    });
    URLs.push({ secure_url, public_id });
  }

  // prepare product object
  const productObject = {
    title,
    overview,
    specs: JSON.parse(specs),
    price,
    appliedDiscount: {
      amount: discountAmount,
      type: discountType,
    },
    stock,
    Images: {
      URLs,
      customId,
    },
    categoryId: isBrandExist.categoryId._id,
    subCategoryId: isBrandExist.subCategoryId._id,
    brandId: isBrandExist._id,
  };
  // create in db
  const newProduct = await Product.create(productObject);
  // send the response
  res.status(201).json({
    message: "Product created successfully",
    data: newProduct,
  });

}