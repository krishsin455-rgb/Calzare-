import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, default: "sneakers" },
    collection: { type: String, default: "unisex" },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    badge: { type: String, default: "" },
    color: { type: String, default: "Signature" },
    sizes: { type: [String], default: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"] },
    highlights: { type: [String], default: [] },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    videoUrl: { type: String, default: "" }
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const reelSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tag: { type: String, default: "IN MOTION" },
    productId: { type: String, required: true },
    videoUrl: { type: String, required: true },
    poster: { type: String, default: "" }
  },
  { timestamps: true }
);

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name: String,
      phone: String,
      address: String,
      city: String,
      pincode: String
    },
    items: [
      {
        id: String,
        name: String,
        size: String,
        price: Number,
        quantity: Number
      }
    ],
    subtotal: Number,
    discount: Number,
    total: Number,
    amountPaidNow: { type: Number, default: 0 },
    balanceDueOnDelivery: { type: Number, default: 0 },
    paymentMethod: String,
    paymentStatus: { type: String, default: "Pending" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    status: { type: String, default: "Confirmed" }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
export const Reel = mongoose.model("Reel", reelSchema);
export const Setting = mongoose.model("Setting", settingSchema);
export const Order = mongoose.model("Order", orderSchema);
export const User = mongoose.model("User", userSchema);
