import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Brand from "../models/brand.model";
import CustomError from "../middlewares/error-handler.middleware";



// Post brand 
export const create = asyncHandler(async(req:Request,res:Response)=>{

    const {name,description} = req.body

    const brand = await Brand.create({name,description});

    res.status(201).json({
        message:'Brand created',
        status:'success',
        success:true,
        data:brand

    })

})

//GetAll

export const getAll = asyncHandler(async(req:Request,res:Response)=>{

    const brand = await Brand.find({})

     res.status(201).json({
        message:'Brand fetched',
        status:'success',
        success:true,
        data:brand

    })
})


// get by id
   export const getById = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.params.id

    

    const brand = await Brand.findById(id)

     res.status(201).json({
        message:'Brand fetched',
        status:'success',
        success:true,
        data:brand

    })


})



export const remove = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.params.id

    

    const brand = await Brand.findByIdAndDelete(id)

    // if there is no brand
     if(!brand) {
        throw new CustomError('Brand not found',404)
    
     }

     res.status(201).json({
        message:'Brand deleted',
        status:'success',
        success:true,
        data:brand

    })

})


//update
export const updateID = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.params.id
    const{name,description} = req.body

    const brand = await Brand.findByIdAndUpdate(id,{name,description},{new:true,reValidate:true})

    if(!brand) {
        throw new CustomError('Brand not found',404)
    
     }

     res.status(201).json({
        message:'Brand updated',
        status:'success',
        success:true,
        data:brand

    })

})

    
