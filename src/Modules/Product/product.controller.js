/**
 * @api {post} /products/addPRoduct  Add Product
 * @body title, overview, specs, price, discountAmount, discountType, stock from body
 * @query  brandId , categoryId, subCategoryId from query
 * @returns add product
 */

import { nanoid } from "nanoid";
import { Brand, Product } from "../../../DB/Models/index.js";
// utils
import { ErrorClass, uploadFile, cloudinaryConfig, calculateProductPrice } from "../../utils/index.js";
import slugify from "slugify";
import { ApiFeatures } from "../../utils/api-feature.utils.js";

export const addProduct = async (req, res, next) => {
  //check user online
  if (!req.authUser) {
    return next(new ErrorClass("user not found", 404, "user not found"));
  }
  // check user online
  if (!req.authUser.status==="online") {
    return next(new ErrorClass("user not found", 404, "user not found"));
  }
  // destruct from body
  const { title, overview, specs, price, discountAmount, discountType, stock } =
    req.body;
  // destruct from query
  const { brandId, categoryId, subCategoryId } = req.query;
  // check image send
  if (!req.files.length) {
    return next(new ErrorClass("No images uploaded", { status: 400 }));
  }
  // check brandId and categoryId and subCategoryId
  const isBrandExist = await Brand.findOne({
    _id: brandId,
    categoryId: categoryId,
    subCategoryId: subCategoryId,
  }).populate("categoryId subCategoryId");

  if (!isBrandExist) {
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
    createdBy: req.authUser._id,
  };
  // create in db
  const newProduct = await Product.create(productObject);
  // send the response
  res.status(201).json({
    message: "Product created successfully",
    data: newProduct,
  });
};
// ----------------------------------------------------

/**
 * @api {delete} /products/deleteProduct  Delete Product
 * @query productId
 */

export const deleteProduct = async (req, res, next) => {
  // productId from params
  //check user online
  if (!req.authUser) {
    return next(new ErrorClass("user not found", 404, "user not found"));
  }
  // check user online
  if (!req.authUser.status === "online") {
    return next(new ErrorClass("user not found", 404, "user not found"));
  }
  const { productId } = req.params;
  // find product
  const product = await Product.findByIdAndDelete(productId).populate(
    "categoryId subCategoryId brandId"
  );
  if (!product) {
    return next(new ErrorClass("Product not found", 404, "Product not found"));
  }
  const brandCustomId = product.brandId.customId;
  const catgeoryCustomId = product.categoryId.customId;
  const subCategoryCustomId = product.subCategoryId.customId;

  //  delete related images from cloudinary
  const ProductPath = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${product.Images.customId}`;
  // delete the related folders from cloudinary
  await cloudinaryConfig().api.delete_resources_by_prefix(ProductPath);
  await cloudinaryConfig().api.delete_folder(ProductPath);

  res.status(200).json({
    message: "product deleted successfully",
    product,
  });
};
//-----------------------------------------

/**
 * @api {put} /products/updateProduct  Update Product
 * @query productId
 * @body title, overview, specs, price, discountAmount, discountType, stock , image from body
 * @returns update product
 */

export const updateProduct = async (req, res, next) => {
  //check user online
  if (!req.authUser) {
    return next(new ErrorClass("user not found", 404, "user not found"));
  }
  // check user online
  if (!req.authUser.status === "online") {
    return next(new ErrorClass("user not found", 404, "user not found"));
  }
  // productId from params
  const { productId } = req.params;
  // destructuring the request body
  const {
    title,
    stock,
    overview,
    badge,
    price,
    discountAmount,
    discountType,
    specsAdd,
    specsRemove,
    public_id_new,
  } = req.body;

  // find product
  const product = await Product.findById(productId).populate(
    "categoryId subCategoryId brandId"
  );
  if (!product) {
    return next(new ErrorClass("Product not found", 404, "Product not found"));
  }

  //  update the product title and slug
  if (title) {
    product.title = title;
    product.slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
  }
  // update the product stock, overview, badge
  if (stock) product.stock = stock;
  if (overview) product.overview = overview;
  if (badge) product.badge = badge;

  // update the product price and discount
  if (price || discountAmount || discountType) {
    const newPrice = price || product.price;
    const discount = {};
    discount.amount = discountAmount || product.appliedDiscount.amount;
    discount.type = discountType || product.appliedDiscount.type;

    product.appliedPrice = calculateProductPrice(newPrice, discount);
    product.price = newPrice;
    product.appliedDiscount = discount;
  }

  // Dynamic updates for specs
  if (specsAdd) {
    const specsToAdd = JSON.parse(specsAdd);
    product.specs = [...new Set([...product.specs, ...specsToAdd])];
  }

  if (specsRemove) {
    const specsToRemove = JSON.parse(specsRemove);
    product.specs = product.specs.filter(
      (spec) =>
        !specsToRemove.some(
          (removeSpec) => JSON.stringify(removeSpec) === JSON.stringify(spec)
        )
    );
  }
  // Update a specific image in the Images array if a new file is provided
  if (req.file && public_id_new) {
    // Find the image in the array by public_id
    const imageIndex = product.Images.URLs.findIndex(
      (image) => image.public_id === public_id_new
    );

    if (imageIndex !== -1) {
      // Split the public_id to get the customId part
      const splitedPublicId = public_id_new.split(
        `${product.Images.customId}/`
      )[1];

      // Upload the new image
      const { secure_url } = await uploadFile({
        file: req.file.path,
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${product.categoryId.customId}/SubCategories/${product.subCategoryId.customId}/Brands/${product.brandId.customId}/Products/${product.Images.customId}`,
        publicId: splitedPublicId,
      });

      // Update the image in the array
      product.Images.URLs[imageIndex].secure_url = secure_url;
    }
  }

  // save data
  await product.save();

  res.status(200).json({
    message: "Product updated successfully",
    product,
  });
}
//--------------------------------
/**
 * @api {get} /products/getProduct/:productId Get Product byId
 * @params productId
 * @returns product
 */
export const getProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate(
    "categoryId subCategoryId brandId"
  );

  if (!product) {
    return next(new ErrorClass("Product not found", 404, "Product not found"));
  }

  res.status(200).json({
    message: "Product fetched successfully",
    product,
  });
};

//-------------------------------
/**
 * @api {get} /products/getProducts Get Products use class apiFeature
 * @returns products
 */

export const getProducts = async (req, res, next) => {
  const mongooseQuery = Product.find();
  const apiFeaturesInstance = new ApiFeatures(mongooseQuery, req.query)
    .filter()
    .sort()
    .paginate();
  const products = await apiFeaturesInstance.mongooseQuery;

  res.status(200).json({
    message: "Products fetched successfully",
    products,
  });
};
