import express from "express";

import {
  create,
  getAll,
  getById,
  remove,
  updateID,
} from "../controllers/brand.controller";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", updateID);
router.delete("/:id", remove);

export default router;
