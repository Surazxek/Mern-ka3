import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import CustomError from "../middlewares/error-handler.middleware";
import Cart from "../models/cart.model";
import Product from "../models/product.models";



export const create = asyncHandler(async(req:Request,res:Response)=>{
    const {productId,quantity} = req.body
    const{ _id:userId} = req.user
    let cart;

    if(!productId){
        throw new CustomError('productId is required',400)
    }

    cart = await Cart.findOne({user:userId})


    if(!cart){
        cart = await Cart.create({user:userId,total_amount:0})
    }

    const product = await Product.findById(productId)

    if(!product){
        throw new CustomError('product not found',400)
    }

    const isAlreadyExists = cart.items.find((item:any) => item.product.toString() === productId.toString()) 

 if (isAlreadyExists) {
    isAlreadyExists.quantity += Number(quantity);
    cart.total_amount = cart.total_amount - isAlreadyExists.total_price + isAlreadyExists.quantity * product.price;
} else {
    const total_price = Number(quantity) * product.price;
    const total_amount = cart.total_amount + total_price;
    cart.total_amount = total_amount;
    cart.items.push({ total_price, product: product._id, quantity });
}

await cart.save();

res.status(201).json({
    message: "product added to cart",
    success: true,
    status: "success",
    data: cart,
});
})



//get by user


export const getCart = asyncHandler(async(req:Request,res:Response)=>{
    const user = req.user._id

    const cart = await Cart.findOne({user})

    if(!cart){
        throw new CustomError(' Cart is not created',400)
    }

    res.status(200).json({
        message:'cart fetched',
        success:true,
        status:'success',
        data:cart
    })

})

//remove cart

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req.user._id;

  if (!productId) {
    throw new CustomError("productId is required", 400);
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new CustomError("Product not found in cart", 404);
  }

  const removedItem = cart.items[itemIndex];

  // Update total_amount
  cart.total_amount -= removedItem.total_price;

  // Remove item from cart
  cart.items.splice(itemIndex, 1);

  await cart.save();

  res.status(200).json({
    message: "Product removed from cart",
    success: true,
    status: "success",
    data: cart,
  });
});

// //update cart

// export const updateCart = asyncHandler(async (req: Request, res: Response) => {
//   const { productId, quantity } = req.body;
//   const userId = req.user._id;

//   if (!productId || quantity === undefined) {
//     throw new CustomError("productId and quantity are required", 400);
//   }

//   const cart = await Cart.findOne({ user: userId });

//   if (!cart) {
//     throw new CustomError("Cart not found", 404);
//   }

//   const itemIndex = cart.items.findIndex(
//     (item: any) => item.product.toString() === productId.toString()
//   );

//   if (itemIndex === -1) {
//     throw new CustomError("Product not found in cart", 404);
//   }

//   const product = await Product.findById(productId);

//   if (!product) {
//     throw new CustomError("Product not found", 404);
//   }

//   const item = cart.items[itemIndex];

//   // Recalculate total_amount
//   cart.total_amount -= item.total_price;

//   // Update quantity and total_price
//   item.quantity = Number(quantity);
//   item.total_price = item.quantity * product.price;

//   // Add updated total_price back to total_amount
//   cart.total_amount += item.total_price;

//   await cart.save();

//   res.status(200).json({
//     message: "Cart updated successfully",
//     success: true,
//     status: "success",
//     data: cart,
//   });
// });

// //clear cart

// export const clearCart = asyncHandler(async (req: Request, res: Response) => {
//   const userId = req.user._id;

//   const cart = await Cart.findOne({ user: userId });

//   if (!cart) {
//     throw new CustomError("Cart not found", 404);
//   }

//   cart.items = [];
//   cart.total_amount = 0;

//   await cart.save();

//   res.status(200).json({
//     message: "Cart cleared successfully",
//     success: true,
//     status: "success",
//     data: cart,
//   });
// });