
import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import User from "../models/user.models";
import CustomError from "../middlewares/error-handler.middleware";
import Product from "../models/product.models";

//wishlist
export const getWishlist = asyncHandler(async(req:Request, res:Response)=>{
    const userId = req.user._id

    const user = await User.findById(userId).populate('wish_list.product')
     //user ko model bhita bhanako xa wishlist hamle better ma new model

     if(!user){
        throw new CustomError('user not found',400)
     }

    
  res.status(200).json({
    data: user.wish_list ?? [],
    message: "Fetched wishlist",
    success: true,
    status: "success",
  });
    

})

//add to wishlist
export const addWishlist = asyncHandler(async(req:Request, res:Response)=>{
    const userId = req.user._id
    const productId = req.body.id

    if(!productId){
        throw new CustomError(' product id is required',400)
    }

    const product = await Product.findById(productId);

     if(!product){
        throw new CustomError(' product not found',400)
    }
     // check if product already exist
    const user = await User.findById(userId);

    const isProductAlreadyExist = user?.wish_list.find((id)=>product._id.toString() === id.toString())
   // if already exist remove from list
    if(isProductAlreadyExist){
        const list = user?.wish_list.filter((id) => id.toString() !== product._id.toString())
        user?.set('wish_list',list)
        await user?.save()

        res.status(200).json({
            message: "product removed from wish_list",
            success: true,
            status: 'success'
        })
    }
 // if not exist add to wishlist
    user?.wish_list.push(product._id);

    await user?.save()

     res.status(200).json({
            message: "product added to wish_list",
            success: true,
            status: 'success'
        })
})



//clear wishlist

export const clearWishList = asyncHandler(async(req:Request,res:Response)=>{
    const userId = req.user._id

    const user = await User.findById(userId)
    if(!user){
        throw new CustomError('User not found',404)
    }

    user.set('wish_list',[])

    // user.wish_list.splice(0, user.wish_list.length)
    await user.save()

    res.status(200).json({
        message:'Wishlist successfully deleted',
        success : true,
        status:'success',
        data : user.wish_list
    })
})

//User.wishlist = []
