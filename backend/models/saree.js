import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    collection: {
      type: String,
      enum: ["banarasi", "kanjivaram", "soft-silk", "kalamkari", "festive"],
      default: "banarasi"
    },
    category: { type: String, default: "silk-sarees" },
    fabric: { type: String, default: "Pure Silk" },
    weave: { type: String, default: "Handloom Zari" },
    occasion: { type: String, default: "Festive & Wedding" },
    sareeLength: { type: String, default: "5.5m" },
    blousePiece: { type: String, default: "0.8m Unstitched" },
    color: { type: String, default: "Maroon & Gold" },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    sizes: { type: [String], default: ["Free Size"] },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    videoUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    careInstructions: { type: String, default: "Dry clean only" },
    badge: { type: String, default: "" },
    status: { type: String, enum: ["published", "draft"], default: "published" }
  },
  { timestamps: true }
);

export default mongoose.model("Saree", sareeSchema);