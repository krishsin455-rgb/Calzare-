import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      pincode: { type: String, default: "" }
    },
    items: [
      {
        id: String,
        name: String,
        size: { type: String, default: "Free Size" },
        price: Number,
        quantity: Number
      }
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    couponDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "Pending" },
    status: {
      type: String,
      enum: ["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Confirmed"
    },
    trackingNumber: { type: String, default: "" },
    trackingUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);