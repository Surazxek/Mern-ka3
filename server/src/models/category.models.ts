import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name already exist"],
      trim: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Category = model("category", categorySchema);

export default Category;
