
import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Category from "../models/category.models"; 
import CustomError from "../middlewares/error-handler.middleware";



// getALL

export const getAllCategory = asyncHandler(async(req:Request,res:Response)=>{

    

    const category = await Category.find({})

     res.status(201).json({
        message:'Category fetched',
        status:'success',
        success:true,
        data:category

    })
})

// post category

export const postCategory = asyncHandler(async(req:Request,res:Response)=>{

    const {name,description} = req.body

    const category = await Category.create({name,description});

    res.status(201).json({
        message:'Brand created',
        status:'success',
        success:true,
        data:category

    })

})


// get by id
   export const getCategoryById = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.params.id

    

    const category = await Category.findById(id)

     res.status(201).json({
        message:'Category fetched',
        status:'success',
        success:true,
        data:category

    })


})

//remove

export const removeCategory = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.params.id

    

    const category = await Category.findByIdAndDelete(id)

    // if there is no Category
     if(!category) {
        throw new CustomError('Category not found',404)
    
     }

     res.status(201).json({
        message:'Category deleted',
        status:'success',
        success:true,
        data:category

    })

})

//update
export const updateCategory = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.params.id
    const{name,description} = req.body

    const category = await Category.findByIdAndUpdate(id,{name,description},{new:true,reValidate:true})

    if(!category) {
        throw new CustomError('Category not found',404)
    
     }

     res.status(201).json({
        message:'Category updated',
        status:'success',
        success:true,
        data:category

    })

})
