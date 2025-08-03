import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Product from "../models/product.models";
import CustomError from "../middlewares/error-handler.middleware";
import Brand from "../models/brand.model";
import Category from "../models/category.models";
import mongoose from "mongoose";
import { deleteFiles, uploadFile } from "../utils/cloudinary.-service.utils";


const folder_name = "/products";


//Create category

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, brand, category, isFeatured, stock, price, description, size } =
    req.body;

  // req.files => []
  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  console.log(cover_image, images);
  if(!cover_image){
    throw new CustomError('Coverimage is required',400)
  }

  const createdBy = req.user._id;

  if (!brand) {
    throw new CustomError("Brand is required", 400);
  }

  if (!category) {
    throw new CustomError("Category is required", 400);
  }

  const product = new Product({
    name,
    isFeatured,
    stock,
    price,
    description,
    size,
  });

  const productBrand = await Brand.findById(brand);

  if (!productBrand) {
    throw new CustomError("Brand not found", 404);
  }

  const productCategory = await Category.findById(category);

  if (!productCategory) {
    throw new CustomError("Category not found", 404);
  }

  product.brand = productBrand._id;
  product.category = productCategory._id;
  product.createdBy = new mongoose.Types.ObjectId(createdBy.toString());

  // ! uploading cover image
  if (cover_image) {
    const { path, public_id } = await uploadFile(
      cover_image[0].path,
      folder_name
    );

    product.cover_image = {
      path,
      public_id,
    };
  }

  // !uploading images
  if (Array.isArray(images) && images.length > 0) {
    const imagePaths = await Promise.all(
      images.map(async (image) => await uploadFile(image.path, folder_name))
    );

    product.set("images", imagePaths);
  }
  await product.save();

  res.status(201).json({
    message: "Product created",
    success: true,
    status: "success",
    data: product,
  });
});


//update product

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    brand,
    category,
    isFeatured,
    stock,
    price,
    description,
    size,
    deletedImge,
  } = req.body;

  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  let deletedImages: string[] = [];
  if (deletedImge) {
    deletedImages = JSON.parse(deletedImge);
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new CustomError("Product not found", 400);
  }

  if (name) product.name = name;
  if (isFeatured) product.isFeatured = isFeatured;
  if (price) product.price = price;
  if (description) product.description = description;
  if (size) product.size = size;
  if (stock) product.stock = stock;

  if (brand) {
    const brandToUpdate = await Brand.findById(brand);
    if (!brandToUpdate) {
      throw new CustomError("Brand not found", 400);
    }
    product.brand = brandToUpdate._id;
  }

  if (category) {
    const categoryToUpdate = await Category.findById(category);
    if (!categoryToUpdate) {
      throw new CustomError("Category not found", 400);
    }
    product.category = categoryToUpdate._id;
  }

  if (cover_image) {
    const { path, public_id } = await uploadFile(
      cover_image[0].path,
      folder_name
    );
    if (product.cover_image) {
      await deleteFiles([product.cover_image.public_id]);
    }
    product.cover_image = {
      path,
      public_id,
    };
  }

  // ! id old images are deleted
  if (Array.isArray(deletedImages) && deletedImages.length > 0) {
    await deleteFiles(deletedImages);
    const filteredImages =
      product.images.length > 0
        ? product.images.filter(
            (image) => !deletedImages.includes(image.public_id as string)
          )
        : [];
    product.set("images", filteredImages);
  }

  // ! if new images uploaded

  if (images && images.length > 0) {
    const newImages = await Promise.all(
      images.map(async (image) => await uploadFile(image.path, folder_name))
    );
    product.set("images", [...product.images, ...newImages]);
  }

  // ! saving product
  await product.save();

  res.status(200).json({
    message: "producr updated",
    data: product,
    success: true,
    status: "success",
  });
});
//
//! remove
export const remove = asyncHandler(async (req: Request, res: Response) => {
  //
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  if (product.images && product.images.length > 0) {
    await deleteFiles(product.images?.map((img: any) => img.public_id));
  }

  if (product.cover_image) {
    await deleteFiles([product.cover_image?.public_id]);
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted",
    data: null,
    status: "success",
    success: true,
  });
});

// * get all
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({})
    .populate("brand")
    .populate("category")
    .populate("createdBy");

  res.status(200).json({
    message: "Products fetched Successfully",
    data: products,
    success: true,
    status: "success",
  });
});


//! get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("brand")
    .populate("category")
    .populate("createdBy");

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  res.status(200).json({
    message: "Product fetched Successfully",
    data: product,
    success: true,
    status: "success",
  });
});

//! get by category
export const getByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const {categoryId} = req.params;
    const products = await Product.find({category:categoryId})
    .populate("brand")
    .populate("category")
    .populate("createdBy");

    res.status(200).json({
    message: "Products fetched Successfully",
    data: products,
    success: true,
    status: "success",
  });

  }
);


//! get by brand
export const getByBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const {brandId} = req.params;
    const products = await Product.find({brand:brandId})
    .populate("brand")
    .populate("category")
    .populate("createdBy");

    res.status(200).json({
    message: "Products fetched Successfully",
    data: products,
    success: true,
    status: "success",
  });

  }
);


// get featured products
export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({isFeatured:true})
    .populate("brand")
    .populate("category")
    .populate("createdBy");

    res.status(200).json({
    message: "Products fetched Successfully",
    data: products,
    success: true,
    status: "success",
  });

  }
);
