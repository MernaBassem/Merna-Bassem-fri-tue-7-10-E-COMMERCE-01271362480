import { Product , Cart } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../utils/index.js";

/**
 * @api {pos} cart/addToCart Add To Cart
 * @body  quantity from body
 * @query userId from token authentication req.authUser._id and productId from query
 * @returns add to cart
 */

export const addToCart = async (req, res, next) => {
  // destruct productId from params
  const { productId } = req.params;
  console.log(productId);
  
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
    _id:productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(new ErrorClass("Product not found", 404, "Product not found"));
  }
  // check if product already in cart
  const cart = await Cart.findOne({ userId: req.authUser._id });
  if (!cart) {
    const subTotal = product.appliedPrice*quantity
    const newCart = new Cart({
      userId: req.authUser._id,
      products:[{
        productId: product._id, quantity,price:product.appliedPrice
      }],
      subTotal
    });
    await newCart.save();
    return res.status(201).json({
      message: "Product added to cart successfully",
      newCart
    });

  }
  // if product exist
  const isProductExist = cart.products.find(
    (pro) => pro.productId == productId
  );
  console.log(isProductExist);
  if (isProductExist) {
    return next(new ErrorClass("Product already in cart", 400, "Product already in cart"));
  }
  cart.products.push({
    productId: product._id, quantity,price:product.appliedPrice
  })
  cart.subTotal += product.appliedPrice*quantity
  await cart.save();
  res.status(200).json({
    message: "Product added to cart successfully",
    cart
  });
};
