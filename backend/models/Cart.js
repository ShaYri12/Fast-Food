import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    foodId: {
      type: String,
    },
    foodName: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    quantity:{
        type: Number,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    category:{
        type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
