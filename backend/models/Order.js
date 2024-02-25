import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
    address:{
      type: String,
      required: true,
    },
    total:{
        type: Number,
        requierd:true
    },
    status:{
        type: String,
        enum: ["preparing", "delivering", "delivered", "cancelled"],
        default: "preparing",
    },
    payment: {
      type: Boolean,
      default: false, // Default to false indicating not paid
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
