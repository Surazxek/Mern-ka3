import express from "express";

import {
  create,
  getAll,
  getById,
  remove,
  updateID,
} from "../controllers/brand.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Role } from "../types/enum.types";
import { allAdmins } from "../types/global.types";
import { uploader } from "../middlewares/uploader.middleware";

const router = express.Router();

const upload = uploader();

router.post("/", authenticate(allAdmins), upload.single("logo"), create);
router.get("/", getAll); // public always
router.get("/:id", getById); // public always
router.put("/:id", authenticate(allAdmins), upload.single("logo"), updateID);
router.delete("/:id", authenticate(allAdmins), remove);

export default router;
