import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Brand from "../models/brand.model";
import CustomError from "../middlewares/error-handler.middleware";
import { deleteFiles, uploadFile } from "../utils/cloudinary.-service.utils";

const folder_name = '/brands';

// Post brand
export const create = asyncHandler(async (req: Request, res: Response) => {
  // creating instance of brand
  const { name, description } = req.body;
  const logo = req.file as Express.Multer.File;

  // creating instance of brand
  const brand = new Brand({ name, description });

  const { path, public_id } = await uploadFile(logo.path, folder_name);
  brand.logo = {
    path,
    public_id,
  };

  //saving brand on database
  await brand.save();

  res.status(201).json({
    message: "Brand created",
    status: "success",
    success: true,
    data: brand,
  });
});

//GetAll

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.find({});

  res.status(201).json({
    message: "Brand fetched",
    status: "success",
    success: true,
    data: brand,
  });
});

// get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const brand = await Brand.findById(id);

  res.status(201).json({
    message: "Brand fetched",
    status: "success",
    success: true,
    data: brand,
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const brand = await Brand.findById(id);

  // if there is no brand
  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  if(brand.logo){
    await deleteFiles([brand.logo.public_id])
  }
   await brand.deleteOne()

  res.status(201).json({
    message: "Brand deleted",
    status: "success",
    success: true,
    data: brand,
  });
});

//update
export const updateID = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, description } = req.body;

  const logo = req.file as Express.Multer.File

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  if(name) brand.name = name
  if(description) brand.description = description


  if(logo){ //Delete old image
    const {path,public_id} = await uploadFile(logo.path, folder_name)
  

  if(brand.logo){
    await deleteFiles([brand.logo?.public_id])  // delFiles function from cloudinary utils

  }
  //Update new image
  brand.logo = {
    path,
    public_id
  }

}

await brand.save()

res.status(201).json({
    message: "Brand updated",
    status: "success",
    success: true,
    data: brand,
  });
});
