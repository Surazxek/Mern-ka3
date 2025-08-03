import express from "express";
import {
  createProduct,
  getAll,
  getByBrand,
  getByCategory,
  getById,
  getFeaturedProducts,
  remove,
  updateProduct,
} from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { allAdmins } from "../types/global.types";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.post(
  "/",
  authenticate(allAdmins),
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  createProduct
);

router.put(
  "/:id",
  authenticate(allAdmins),
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  updateProduct
);
router.get("/", getAll);
router.delete("/:id", authenticate(allAdmins), remove);
router.get("/:id", getById);
router.get("/brand/:brandId", getByBrand);
router.get("/category/:categoryId", getByCategory);
router.get("/featured", getFeaturedProducts);

export default router;
