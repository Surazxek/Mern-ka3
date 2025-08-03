import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
      trim: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand", // this is refrence const Brand = model('brand',brandSchema);
      required: [true, "brand is required"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category", // this is refrence const Category = model('category',categorySchema);
      required: [true, "Category is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // this is refrence const User = model('user',userSchema);
      required: [true, "User is required"],
    },
    cover_image: {
      path: {
        type: String,
        required: [true, "cover image is required "],
      },
      public_id: {
        type: String,
        required: [true, "cover image is required "],
      },
    },
    images: [
      {
        path: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    description: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('product', productSchema);

export default Product;
