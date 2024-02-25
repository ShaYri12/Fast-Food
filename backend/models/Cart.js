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
        requierd:true
    },
    price:{
        type: Number,
        requierd:true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
