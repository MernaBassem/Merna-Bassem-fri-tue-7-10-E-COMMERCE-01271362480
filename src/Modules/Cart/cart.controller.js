import { Product, Cart } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../utils/index.js";

/**
 * @api {post} cart/addToCart/productID Add To Cart
 * @body  quantity from body
 * @params productId
 * @query userId from token authentication req.authUser._id and productId from query
 * @returns add to cart
 */

export const addToCart = async (req, res, next) => {
  // destruct productId from params
  const { productId } = req.params;

  // destruct quantity from body
  const { quantity } = req.body;

  // check user online
  if (!req.authUser) {
    return next(new ErrorClass("User not found", 404, "User not found"));
  }
  if (req.authUser.status !== "online") {
    return next(
      new ErrorClass("User must be online", 400, "User must be online")
    );
  }
  // check if product exists and stock greater than quantity
  const product = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(new ErrorClass("Product not found", 404, "Product not found"));
  }
  // check if product already in cart
  const cart = await Cart.findOne({ userId: req.authUser._id });
  if (!cart) {
    const subTotal = product.appliedPrice * quantity;
    const newCart = new Cart({
      userId: req.authUser._id,
      products: [
        {
          productId: product._id,
          quantity,
          price: product.appliedPrice,
        },
      ],
      subTotal,
    });
    await newCart.save();
    return res.status(201).json({
      message: "Product added to cart successfully",
      newCart,
    });
  }
  // if product exist
  const isProductExist = cart.products.find(
    (pro) => pro.productId == productId
  );
  if (isProductExist) {
    return next(
      new ErrorClass("Product already in cart", 400, "Product already in cart")
    );
  }
  cart.products.push({
    productId: product._id,
    quantity,
    price: product.appliedPrice,
  });
  cart.subTotal += product.appliedPrice * quantity;
  await cart.save();
  res.status(200).json({
    message: "Product added to cart successfully",
    cart,
  });
};

//--------------------
/**
 * @api {put} cart/removeFromCart/productId Remove from Cart
 * @params productId
 * @query userId from token authentication req.authUser._id and productId from query
 * @returns remove to cart
 **/

export const removeFromCart = async (req, res, next) => {
  const userId = req?.authUser._id;
  const { productId } = req.params;
  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(
      new ErrorClass("Product not in cart", 404, "Product not in cart")
    );
  }
  cart.products = cart.products.filter((pro) => pro.productId != productId);
  if (cart.products.length === 0) {
    await Cart.deleteOne({ userId });
    return res.status(200).json({ message: "Product removed from cart" });
  }
  cart.subTotal = 0;
  cart.products.forEach((pro) => {
    cart.subTotal += pro.price * pro.quantity;
  });
  await cart.save();
  res.status(200).json({ message: "Product removed from cart", cart });
};

//------------------------
/**
 * @api {put} cart/updateCart/productId Update Cart
 * @body  quantity from body
 * @params productId
 * @query userId from token authentication req.authUser._id and productId from query
 * @returns add to cart
 */

export const updateCart = async (req, res, next) => {
  const userId = req?.authUser._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(
      new ErrorClass("Product not in cart", 404, "Product not in cart")
    );
  }
  // find product and check stock
  const product = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(
      new ErrorClass("product not available", 404, "Product not available")
    );
  }
  // index the product quantity change
  const productIndex = cart.products.findIndex(
    (pro) => pro.productId.toString() == product._id.toString()
  );
  console.log({ productIndex });
  cart.products[productIndex].quantity = quantity;

  cart.subTotal = 0;
  cart.products.forEach((pro) => {
    cart.subTotal += pro.price * pro.quantity;
  });
  await cart.save();
  res.status(200).json({ message: "Product updated in cart", cart });
};
