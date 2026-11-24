import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import Razorpay from "razorpay";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/calzare";

const adminSessions = new Set();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({
  limit: "25mb",
  verify: (req, res, buf) => {
    if (String(req.originalUrl || "").split("?")[0] === "/api/webhooks/razorpay") {
      req.rawBody = Buffer.from(buf);
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Serve existing uploaded media files.
app.use("/uploads", express.static("/var/www/calzare-new/backend/uploads"));

// --- SCHEMAS ---
const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sku: { type: String, default: "" },
    brand: { type: String, default: "CALZARE" },
    name: { type: String, required: true },
    slug: { type: String, default: "" },
    status: { type: String, default: "published" },
    category: { type: String, default: "sneakers" },
    collection: { type: String, default: "unisex" },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    tagline: { type: String, default: "" },
    listingSummary: { type: String, default: "" },
    description: { type: String, default: "" },
    badge: { type: String, default: "" },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    featuredOnHome: { type: Boolean, default: false },
    titleOverride: { type: String, default: "" },
    hookSubtitle: { type: String, default: "" },
    shortSellingStatement: { type: String, default: "" },
    offerHeading: { type: String, default: "SPECIAL DROP DISCOUNT" },
    offerPromoCopy: { type: String, default: "" },
    addToBagText: { type: String, default: "ADD TO BAG" },
    buyNowText: { type: String, default: "BUY IT NOW" },
    outOfStockText: { type: String, default: "SOLD OUT" },
    lowStockThreshold: { type: Number, default: 5 },
    lowStockNotice: { type: String, default: "Hurry! High demand in this size." },
    storyBlocks: { type: Array, default: [] },
    featureCards: { type: Array, default: [] },
    highlights: { type: [String], default: [] },
    materials: { type: String, default: "" },
    moldingMethod: { type: String, default: "" },
    fitRecommendation: { type: String, default: "" },
    careInstructions: { type: String, default: "" },
    warrantyGuarantee: { type: String, default: "" },
    specsTable: { type: Array, default: [] },
    sizeGuideTitle: { type: String, default: "Measurement Guide" },
    sizeGuideUnit: { type: String, default: "Centimeters (cm)" },
    sizeGuideNote: { type: String, default: "" },
    sizeChartRows: { type: Array, default: [] },
    color: { type: String, default: "" },
    colorHex: { type: String, default: "#D9CFBE" },
    sizes: { type: [String], default: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"] },
    stockBySize: {
      type: Map,
      of: Number,
      default: { "UK 6": 20, "UK 7": 20, "UK 8": 19, "UK 9": 10, "UK 10": 10 }
    },
    image: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    comparisonMode: { type: String, default: "default" },
    shippingAccordionHeading: { type: String, default: "Default: Shipping & Delivery" },
    dispatchNotice: { type: String, default: "Orders processed within 1–2 business days." },
    returnAccordionHeading: { type: String, default: "Default: Refund, Return & Exchange Policy" },
    returnDetails: {
      type: String,
      default: "Size exchange requests must be submitted within 7 days of delivery."
    },
    faqs: { type: Array, default: [] },
    relatedTitle: { type: String, default: "YOU MIGHT ALSO LIKE" },
    relatedSubtitle: { type: String, default: "" },
    relatedIds: { type: [String], default: [] },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" }
  },
  { timestamps: true }
);

const reelSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tag: { type: String, default: "EVERYDAY WEAR" },
    productId: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    poster: { type: String, default: "" }
  },
  { timestamps: true }
);

const homepageSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: "main", unique: true },
    reelsEnabled: { type: Boolean, default: true },
    productReelsEnabled: { type: Boolean, default: true },
    heroVideoUrl: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    heroMobileImage: { type: String, default: "" },
    heroEyebrow: { type: String, default: "THE EVERYDAY COLLECTION — 2026" },
    heroTitle: { type: String, default: "0% BORING. 100% AIR." },
    heroTitleEmphasis: { type: String, default: "own way." },
    heroDescription: {
      type: String,
      default:
        "Dual-density closed-cell waterproof foam. Sculpted for pavement poets and real life strides."
    },
    heroCtaLabel: { type: String, default: "EXPLORE COLLECTION" },
    heroCtaRoute: { type: String, default: "/shop" },
    heroBadges: {
      type: String,
      default: "100% WATERPROOF FOAM, 280G ULTRA-LIGHT, CLOUDFOOTBED TECH"
    },
    campaignVideoUrl: { type: String, default: "" },
    mobileUI: { type: mongoose.Schema.Types.Mixed, default: {} },
    theme: { type: mongoose.Schema.Types.Mixed, default: {} },
    navbar: { type: mongoose.Schema.Types.Mixed, default: {} },
    sections: {
      type: Array,
      default: [
        { key: "hero_main", label: "HERO", title: "0% BORING. 100% AIR.", layout: "asymmetric_editorial", visible: true },
        { key: "trust_ticker", label: "TICKER", title: "Live Ticker", layout: "asymmetric_editorial", visible: true },
        { key: "bestsellers", label: "BESTSELLERS", title: "CROWD FAVORITES", layout: "luxury_grid", visible: true, maxItems: 8 },
        { key: "shop_audience", label: "AUDIENCE_CARDS", title: "DESIGNED FOR EVERY STRIDE", layout: "asymmetric_editorial", visible: true },
        { key: "affordable_store", label: "AFFORDABLE_STORE", title: "THE UNDER ₹999 STORE", layout: "asymmetric_editorial", visible: true },
        { key: "reels_motion", label: "REELS", title: "CALZARE IN MOTION", layout: "vertical_9_16", visible: true },
        { key: "storytelling", label: "STORYTELLING", title: "BUILT FOR REAL LIFE & WILD PERSONALITIES", layout: "editorial_split", visible: true },
        { key: "category_discovery", label: "CATEGORY_DISCOVERY", title: "CHOOSE YOUR SILHOUETTE", layout: "asymmetric_editorial", visible: true },
        { key: "customer_reviews", label: "REVIEWS", title: "WORDS FROM THE PAVEMENT", layout: "asymmetric_editorial", visible: true },
        { key: "benefits_trust", label: "BENEFITS", title: "THE CALZARE STANDARD", layout: "asymmetric_editorial", visible: true },
        { key: "newsletter", label: "NEWSLETTER", title: "DON'T MISS THE NEXT DROP.", layout: "asymmetric_editorial", visible: true }
      ]
    },
    sectionConfigs: { type: mongoose.Schema.Types.Mixed, default: {} },
    affordableStore: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        enabled: true,
        maxPrice: 999,
        badgeLabel: "/999 Store",
        title: "THE UNDER ₹999 STORE",
        subtitle:
          "High performance foam shouldn't cost a week's wage. Premium daily comfort at honest prices.",
        ctaLabel: "EXPLORE DROP",
        image: "",
        customSlides: []
      }
    },
    productPage: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        offer1Badge: "10% OFF",
        offer1Text: "Buy 2 Pairs",
        offer2Badge: "15% OFF",
        offer2Text: "Buy 3 Pairs",
        standardTitle: "THE CALZARE STANDARD",
        standardSubtitle: "Built with science. Tested with life.",
        guarantees: [
          { title: "Secure payment", subtitle: "UPI, cards & partial COD available" },
          { title: "Delivery", subtitle: "Ships within 24–48 hours across India" },
          { title: "Returns", subtitle: "7-day easy UK size exchange" },
          { title: "Customer Service", subtitle: "Dedicated support for sizing & orders" }
        ]
      }
    },
    footer: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        tagline: "We design and make every pair ourselves, then ship it straight to you.",
        hours: "Monday to Friday, 10:00 AM to 6:00 PM.",
        newsletterHeading: "Join the Calzare team",
        newsletterCopy:
          "Sign up for early access to drops and free shipping updates on new collections.",
        copyright: "© 2026 Calzare. All rights reserved."
      }
    },
    pipVideo: {
      enabled: { type: Boolean, default: true },
      label: { type: String, default: "WATCH FIT & FLEX" },
      productId: { type: String, default: "c-001" },
      videoUrl: { type: String, default: "" },
      poster: { type: String, default: "" }
    },
    featuredProduct: {
      enabled: { type: Boolean, default: true },
      sectionType: { type: String, default: "EXCLUSIVE / MOST SELLING" },
      productId: { type: String, default: "c-001" },
      redirectUrl: { type: String, default: "" },
      image: { type: String, default: "" },
      title: { type: String, default: "FORMA COURT — SIGNATURE EDITION" },
      price: { type: Number, default: 3499 }
    }
  },
  { timestamps: true }
);

const collectionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, default: "audience" },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "EXPLORE" },
    desktopImage: { type: String, default: "" },
    mobileImage: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { name: String, phone: String, address: String, city: String, pincode: String },
    items: [{ id: String, name: String, size: String, price: Number, quantity: Number }],
    subtotal: Number,
    discount: Number,
    couponCode: { type: String, default: null },
    couponDiscount: { type: Number, default: 0 },
    total: Number,
    paymentMethod: String,
    paymentStatus: { type: String, default: "Pending" },
    amountPaidNow: { type: Number, default: 0 },
    balanceDueOnDelivery: { type: Number, default: 0 },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
    courierName: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
    status: { type: String, default: "Confirmed" }
  },
  { timestamps: true }
);


orderSchema.index(
  { razorpayOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      razorpayOrderId: { $type: "string", $gt: "" }
    }
  }
);

orderSchema.index(
  { razorpayPaymentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      razorpayPaymentId: { $type: "string", $gt: "" }
    }
  }
);

const pendingPaymentSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: "" },
    expectedAmountPaise: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, required: true },
    checkoutSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending"
    },
    orderId: { type: String, default: "" },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: "" },
    discountType: { type: String, default: "percentage" },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscountCap: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 500 },
    usedCount: { type: Number, default: 0 },
    expiryDate: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, default: "c-001" },
    productName: { type: String, default: "FORMA COURT" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    location: { type: String, default: "Bengaluru" },
    rating: { type: Number, default: 5 },
    headline: { type: String, required: true },
    comment: { type: String, required: true },
    photoUrl: { type: String, default: "" },
    verifiedBuyer: { type: Boolean, default: true },
    featuredOnHomepage: { type: Boolean, default: true },
    status: { type: String, default: "approved" }
  },
  { timestamps: true }
);

const cmsPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: "POLICY" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const settingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: "store_settings", unique: true },
    brandName: { type: String, default: "CALZARE" },
    storeName: { type: String, default: "CALZARE" },
    legalEntity: { type: String, default: "Calzare Heels Private Limited" },
    websiteUrl: { type: String, default: "calzare.in" },
    tagline: { type: String, default: "Architectural footwear built for motion." },
    supportEmail: { type: String, default: "support@calzare.in" },
    supportPhone: { type: String, default: "+91 98765 43210" },
    contactItems: { type: Array, default: [] },
    paymentMethods: { type: [String], default: [] },
    businessAddress: { type: String, default: "12th Main Road, Indiranagar, Bengaluru" },
    freeShippingThreshold: { type: Number, default: 2999 },
    standardShippingFee: { type: Number, default: 149 },
    partialCodAdvance: { type: Number, default: 299 },
    codAdvanceFee: { type: Number, default: 299 },
    codEnabled: { type: Boolean, default: true },
    razorpayKeyPublic: { type: String, default: process.env.RAZORPAY_KEY_ID || "" },
    categories: { type: [String], default: ["sneakers", "formal", "slides"] },
    pageAssignments: { type: mongoose.Schema.Types.Mixed, default: {} },
    policies: { type: Array, default: [] },
    collectionImages: { type: mongoose.Schema.Types.Mixed, default: {} },
    categoryImages: { type: mongoose.Schema.Types.Mixed, default: {} },
    navigation: {
      type: Array,
      default: [
        { label: "Men", url: "#men", badge: "" },
        { label: "Women", url: "#women", badge: "NEW" },
        { label: "Unisex", url: "#unisex", badge: "" },
        { label: "Kids", url: "#kids", badge: "" }
      ]
    },
    storySections: { type: Array, default: [] },
    storyStatus: { type: String, default: "DRAFT" }
  },
  { timestamps: true }
);

const auditLogSchema = new mongoose.Schema(
  {
    action: String,
    target: String,
    actor: { type: String, default: "admin@calzare.in" },
    ip: { type: String, default: "127.0.0.1" }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: "" },
    role: { type: String, default: "customer" },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const subscriberSchema = new mongoose.Schema(
  { email: { type: String, required: true, unique: true, lowercase: true } },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Reel = mongoose.models.Reel || mongoose.model("Reel", reelSchema);
const Homepage = mongoose.models.Homepage || mongoose.model("Homepage", homepageSchema);
const Collection = mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
const PendingPayment =
  mongoose.models.PendingPayment ||
  mongoose.model("PendingPayment", pendingPaymentSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const CmsPage = mongoose.models.CmsPage || mongoose.model("CmsPage", cmsPageSchema);
const StoreSettings =
  mongoose.models.StoreSettings || mongoose.model("StoreSettings", settingsSchema);
const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Subscriber =
  mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function createAdminToken() {
  const token = crypto.randomBytes(32).toString("hex");
  adminSessions.add(token);
  return token;
}

async function logAudit(action, target, req) {
  try {
    await AuditLog.create({ action, target, ip: req?.ip || "127.0.0.1" });
  } catch {}
}

function mapFshipStatus(rawStatus) {
  const s = String(rawStatus || "").trim().toLowerCase();
  if (!s) return null;
  if (s.includes("deliver")) return "Delivered";
  if (
    s.includes("ship") ||
    s.includes("transit") ||
    s.includes("pickup") ||
    s.includes("out for delivery") ||
    s.includes("in_transit") ||
    s.includes("out_for_delivery")
  ) {
    return "Shipped";
  }
  if (s.includes("pack") || s.includes("manifest") || s.includes("label")) {
    return "Packed";
  }
  if (s.includes("cancel") || s.includes("rto") || s.includes("lost")) {
    return "Cancelled";
  }
  return "Confirmed";
}

async function seedInitialData() {
  const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = String(process.env.ADMIN_PASSWORD || "");
  if (adminEmail && adminPassword) {
    await User.updateOne(
      { email: adminEmail },
      {
        $set: {
          name: "CALZARE Admin",
          email: adminEmail,
          role: "admin",
          passwordHash: hashPassword(adminPassword)
        },
        $setOnInsert: { phone: "" }
      },
      { upsert: true }
    );
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany([
      {
        id: "c-001",
        sku: "CLZ-FRM-001",
        name: "FORMA COURT",
        category: "sneakers",
        collection: "unisex",
        price: 3499,
        oldPrice: 4299,
        badge: "BESTSELLER",
        tagline: "Sculpted court silhouette with dual-density memory footbed",
        color: "Cloud White",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        highlights: [
          "100% Waterproof & Hydrophobic",
          "Featherweight Ergonomics",
          "Dual-Density Memory Footbed"
        ],
        description: "A clean everyday court silhouette with a considered, minimal finish.",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85",
        videoUrl: ""
      },
      {
        id: "c-002",
        sku: "CLZ-MNO-002",
        name: "MONO RUNNER",
        category: "sneakers",
        collection: "unisex",
        price: 4299,
        oldPrice: null,
        badge: "NEW",
        tagline: "Featherweight EVA midsole for effortless daily mileage",
        color: "Stone / Sand",
        sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        highlights: [
          "Featherlight EVA midsole",
          "Breathable organic cotton lining",
          "All-day arch support"
        ],
        description: "Lightweight-inspired styling made for everyday movement.",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
        videoUrl: ""
      }
    ]);
  }

  if ((await Reel.countDocuments()) === 0) {
    await Reel.insertMany([
      {
        id: "reel-01",
        title: "Morning Commute in Forma Court",
        tag: "EVERYDAY WEAR",
        productId: "c-001",
        videoUrl: "",
        poster:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
      }
    ]);
  }

  if (!(await Homepage.findOne({ singletonKey: "main" }))) {
    await Homepage.create({
      singletonKey: "main",
      heroVideoUrl: "",
      heroImage:
        "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=2200&q=90"
    });
  }

  if (!(await StoreSettings.findOne({ singletonKey: "store_settings" }))) {
    await StoreSettings.create({ singletonKey: "store_settings" });
  }

  if ((await CmsPage.countDocuments()) === 0) {
    await CmsPage.insertMany([
      {
        slug: "/pages/return-exchange-policy",
        title: "7-Day Hassle-Free Return & Exchange Policy",
        category: "POLICY",
        excerpt: "Official Return & Exchange Policy of CALZARE™.",
        content:
          "Unworn pairs in original packaging can be exchanged within 7 days of delivery."
      },
      {
        slug: "/pages/shipping-policy",
        title: "Shipping & Delivery Policy",
        category: "INFO",
        excerpt: "Dispatch turnaround 1–2 business days.",
        content: "Complimentary express delivery across India on orders above ₹2,999."
      }
    ]);
  }
}

function requireAdmin(req, res, next) {
  const authHeader = String(req.headers.authorization || "");
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token || !adminSessions.has(token)) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Admin login required." });
  }
  next();
}


async function finalizeCapturedRazorpayPayment(payment, customerOverride = {}, req = null) {
  const rzpOrderId = String(payment?.order_id || "").trim();
  const rzpPaymentId = String(payment?.id || "").trim();

  if (!rzpOrderId || !rzpPaymentId || payment?.status !== "captured") {
    throw new Error("Razorpay payment is not captured.");
  }

  const pending = await PendingPayment.findOne({ razorpayOrderId: rzpOrderId });
  if (!pending) throw new Error("No matching pending checkout was found.");

  if (
    Number(payment.amount) !== Number(pending.expectedAmountPaise) ||
    String(payment.currency || "").toUpperCase() !== pending.currency
  ) {
    throw new Error("Payment amount or currency does not match the checkout.");
  }

  const existingOrders = await Order.find({
    $or: [
      { razorpayOrderId: rzpOrderId },
      { razorpayPaymentId: rzpPaymentId },
      { orderId: pending.orderId }
    ]
  }).limit(2).lean();

  if (existingOrders.length) {
    const existing = existingOrders[0];

    const exactMatch =
      existingOrders.length === 1 &&
      String(existing.orderId) === String(pending.orderId) &&
      String(existing.razorpayOrderId || "") === rzpOrderId &&
      String(existing.razorpayPaymentId || "") === rzpPaymentId;

    if (!exactMatch) {
      throw new Error("Payment identifiers conflict with an existing order.");
    }

    await PendingPayment.updateOne(
      { _id: pending._id },
      { $set: { status: "paid", razorpayPaymentId: rzpPaymentId, orderId: existing.orderId } }
    );

    return existing;
  }

  const snapshot = pending.checkoutSnapshot || {};
  const oldCustomer = snapshot.customer || {};
  const allowed = ["name", "phone", "email", "address", "city", "pincode"];
  const customer = {};

  for (const field of allowed) {
    const value = customerOverride?.[field] ?? oldCustomer[field] ?? "";
    customer[field] = String(value).trim().slice(0, field === "address" ? 500 : 120);
  }

  const isPartial = pending.paymentMethod.includes("Partial COD");
  const paidNow = Number(pending.expectedAmountPaise) / 100;
  const total = Number(snapshot.total || 0);

  const orderData = {
    ...snapshot,
    customer,
    orderId: pending.orderId,
    paymentMethod: pending.paymentMethod,
    paymentStatus: isPartial
      ? `Partial Advance Paid (₹${paidNow})`
      : "Paid Online",
    amountPaidNow: paidNow,
    balanceDueOnDelivery: Math.max(0, total - paidNow),
    razorpayOrderId: rzpOrderId,
    razorpayPaymentId: rzpPaymentId,
    status: "Confirmed"
  };

  let created = false;
  let order;

  try {
    order = await Order.create(orderData);
    created = true;
  } catch (err) {
    if (err?.code !== 11000) throw err;
    order = await Order.findOne({ orderId: pending.orderId });

    if (
      !order ||
      String(order.razorpayOrderId || "") !== rzpOrderId ||
      String(order.razorpayPaymentId || "") !== rzpPaymentId
    ) {
      throw err;
    }
  }

  await PendingPayment.updateOne(
    { _id: pending._id },
    { $set: { status: "paid", razorpayPaymentId: rzpPaymentId } }
  );

  if (created && snapshot.couponCode) {
    await Coupon.updateOne(
      { code: String(snapshot.couponCode).toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  }

  if (created && req) {
    await logAudit(
      "RAZORPAY_PAYMENT_CONFIRMED",
      `${order.orderId} (${rzpPaymentId})`,
      req
    );
  }

  return order;
}

// --- RAZORPAY WEBHOOK ---


app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const secret = String(process.env.RAZORPAY_WEBHOOK_SECRET || "").trim();
      const received = String(req.headers["x-razorpay-signature"] || "").trim();
      const raw = Buffer.isBuffer(req.rawBody)
        ? req.rawBody
        : Buffer.isBuffer(req.body)
          ? req.body
          : null;

      if (!secret || !received || !raw) {
        return res.status(400).json({ message: "Webhook signature data is missing." });
      }

      const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
      const a = Buffer.from(expected);
      const b = Buffer.from(received);

      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(400).json({ message: "Invalid webhook signature." });
      }

      const event = JSON.parse(raw.toString("utf8"));
      if (event.event === "payment.captured") {
        const payment = event?.payload?.payment?.entity;
        if (payment) await finalizeCapturedRazorpayPayment(payment, {}, req);
      }

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("Razorpay webhook error:", err.message);
      return res.status(500).json({ message: "Webhook processing failed." });
    }
  }
);


app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

// Memory storage only: never writes uploaded files to your Mac or Render disk
const ALLOWED_MEDIA_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm"
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_MEDIA_TYPES.has(file.mimetype));
  }
});

// --- PUBLIC STOREFRONT ROUTES ---
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/homepage", async (_req, res) => {
  res.json({
    homepage: await Homepage.findOne({ singletonKey: "main" }).lean()
  });
});

app.get("/api/reels", async (_req, res) => {
  res.json({ reels: await Reel.find().sort({ createdAt: -1 }).lean() });
});

app.get("/api/settings", async (_req, res) => {
  const settings = await StoreSettings.findOne({
    singletonKey: "store_settings"
  }).lean();
  res.json({ settings: settings || {} });
});

app.get("/api/products", async (req, res) => {
  const filter = { status: { $ne: "draft" } };
  if (req.query.category && req.query.category !== "all") {
    filter.category = req.query.category;
  }
  res.json({ products: await Product.find(filter).sort({ createdAt: 1 }).lean() });
});

app.get("/api/reviews", async (req, res) => {
  const filter = { status: "approved" };
  if (req.query.productId) {
    filter.productId = String(req.query.productId);
  }
  res.json({
    reviews: await Review.find(filter).sort({ createdAt: -1 }).lean()
  });
});

app.post("/api/reviews", async (req, res) => {
  try {
    const customerName = String(req.body.customerName || req.body.author || "").trim();
    const comment = String(req.body.comment || req.body.body || "").trim();
    if (!customerName || !comment) {
      return res.status(400).json({ message: "Name and comment are required." });
    }
    const review = await Review.create({
      productId: String(req.body.productId || "c-001"),
      productName: String(req.body.productName || "CALZARE").trim(),
      customerName,
      customerEmail: String(req.body.customerEmail || "").trim(),
      location: String(req.body.location || "India").trim(),
      rating: Math.max(1, Math.min(5, Number(req.body.rating) || 5)),
      headline: String(req.body.headline || req.body.quote || "VERIFIED REVIEW").trim(),
      comment,
      photoUrl: String(req.body.photoUrl || "").trim(),
      verifiedBuyer: true,
      featuredOnHomepage: true,
      status: "approved"
    });
    res.status(201).json({ review });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/coupons/validate", async (req, res) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    const subtotal = Number(req.body.subtotal || 0);
    if (!code) {
      return res.status(400).json({ message: "Please enter a coupon code." });
    }

    const coupon = await Coupon.findOne({ code, active: true }).lean();
    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon code." });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: "This coupon has expired." });
    }

    if (coupon.usageLimit > 0 && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return res.status(400).json({ message: "This coupon has reached its usage limit." });
    }

    if (subtotal > 0 && subtotal < Number(coupon.minOrderValue || 0)) {
      return res.status(400).json({
        message: `Minimum order of ₹${coupon.minOrderValue} required for ${coupon.code}.`
      });
    }

    res.json({
      coupon: {
        ...coupon,
        type: coupon.discountType === "percentage" ? "percent" : "flat",
        value: Number(coupon.discountValue || 0)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Coupon validation failed." });
  }
});

// --- RAZORPAY MAGIC CHECKOUT & ORDERS ---
app.post("/api/payments/razorpay/shipping-info", async (req, res) => {
  try {
    const magicSecret = String(process.env.RAZORPAY_MAGIC_SECRET_KEY || "").trim();
    if (magicSecret) {
      const providedSecret = String(
        req.headers["x-razorpay-magic-secret"] ||
          req.headers["x-razorpay-secret"] ||
          ""
      ).trim();
      if (!providedSecret || providedSecret !== magicSecret) {
        return res.status(401).json({ message: "Invalid Magic Checkout secret." });
      }
    }

    const settings =
      (await StoreSettings.findOne({ singletonKey: "store_settings" }).lean()) || {};
    const freeShipMin = Number(settings.freeShippingThreshold ?? 2999);
    const stdShipFeeRupees = Number(settings.standardShippingFee ?? 149);
    const codEnabled = settings.codEnabled !== false;

    const { addresses = [], order_amount } = req.body || {};
    const amountRupees =
      typeof order_amount === "number" ? order_amount / 100 : Number(order_amount || 0);
    const shippingFeePaise =
      amountRupees >= freeShipMin ? 0 : Math.max(0, Math.round(stdShipFeeRupees * 100));

    const evaluated = (Array.isArray(addresses) ? addresses : []).map((addr, idx) => {
      const zip = String(addr?.zipcode || addr?.pincode || "").replace(/\D/g, "");
      const serviceable = /^[1-9][0-9]{5}$/.test(zip);
      const cod = serviceable && codEnabled;

      return {
        id: addr?.id || String(idx + 1),
        zipcode: zip,
        country: addr?.country || "IN",
        state: addr?.state || "",
        serviceable,
        cod,
        shipping_fee: serviceable ? shippingFeePaise : 0,
        cod_fee: cod ? 0 : 0
      };
    });

    return res.status(200).json({ addresses: evaluated });
  } catch (err) {
    console.error("Magic Checkout shipping-info error:", err);
    return res.status(500).json({ message: err.message || "Shipping info failed." });
  }
});


app.post("/api/payments/razorpay/create-order", async (req, res) => {
  try {
    const keyId = String(process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = String(process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!keyId || !keySecret) {
      return res.status(503).json({ message: "Razorpay is not configured." });
    }

    const paymentMethod = String(req.body?.paymentMethod || "");
    const isPartial = paymentMethod === "Partial COD (₹299 Advance)";
    if (paymentMethod !== "Razorpay Magic Checkout" && !isPartial) {
      return res.status(400).json({ message: "Unsupported payment method." });
    }

    const requested = req.body?.items;
    if (!Array.isArray(requested) || !requested.length || requested.length > 30) {
      return res.status(400).json({ message: "Cart is empty or invalid." });
    }

    const clean = requested.map(x => ({
      id: String(x?.id || "").trim(),
      size: String(x?.size || "").trim(),
      quantity: Number(x?.quantity)
    }));

    if (clean.some(x => !x.id || !x.size ||
        !Number.isSafeInteger(x.quantity) || x.quantity < 1 || x.quantity > 10) ||
        clean.reduce((n, x) => n + x.quantity, 0) > 20) {
      return res.status(400).json({ message: "Invalid cart item or quantity." });
    }

    const products = await Product.find({
      id: { $in: [...new Set(clean.map(x => x.id))] },
      status: { $ne: "draft" }
    }).lean();

    const productMap = new Map(products.map(p => [String(p.id), p]));
    const items = clean.map(x => {
      const p = productMap.get(x.id);
      if (!p || !Array.isArray(p.sizes) || !p.sizes.includes(x.size) ||
          !Number.isFinite(Number(p.price)) || Number(p.price) <= 0) {
        throw new Error("A product or selected size is unavailable. Refresh your cart.");
      }
      return {
        id: p.id,
        name: String(p.name || "CALZARE Footwear"),
        size: x.size,
        price: Number(p.price),
        quantity: x.quantity
      };
    });

    const count = items.reduce((n, x) => n + x.quantity, 0);
    const subtotal = items.reduce((n, x) => n + x.price * x.quantity, 0);
    let bundleDiscount = 0;
    if (count >= 3) bundleDiscount = Math.min(...items.map(x => x.price));
    else if (count === 2) bundleDiscount = Math.round(subtotal * 0.1);

    const afterBundle = Math.max(0, subtotal - bundleDiscount);
    const couponCode = String(req.body?.couponCode || "").trim().toUpperCase();
    let couponDiscount = 0;
    let savedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, active: true }).lean();
      if (!coupon || (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) ||
          (coupon.usageLimit > 0 && Number(coupon.usedCount || 0) >= coupon.usageLimit) ||
          subtotal < Number(coupon.minOrderValue || 0)) {
        return res.status(400).json({ message: "Coupon is invalid, expired, or its conditions are not met." });
      }
      couponDiscount = coupon.discountType === "percentage"
        ? Math.round(afterBundle * Number(coupon.discountValue || 0) / 100)
        : Math.min(Number(coupon.discountValue || 0), afterBundle);
      couponDiscount = Math.max(0, Math.min(afterBundle, couponDiscount));
      savedCoupon = coupon.code;
    }

    const settings = (await StoreSettings.findOne({
      singletonKey: "store_settings"
    }).lean()) || {};

    if (isPartial && settings.codEnabled === false) {
      return res.status(400).json({ message: "Partial COD is unavailable." });
    }

    const freeThreshold = Number(settings.freeShippingThreshold ?? 2999);
    const shipping = subtotal >= freeThreshold || subtotal === 0
      ? 0 : Math.max(0, Number(settings.standardShippingFee ?? 149));
    const total = Math.max(0, subtotal - bundleDiscount - couponDiscount + shipping);
    const advance = Math.min(total, Number(settings.partialCodAdvance ?? 299));
    const amount = Math.round((isPartial ? advance : total) * 100);

    if (!Number.isSafeInteger(amount) || amount < 100) {
      return res.status(400).json({ message: "Payment amount is below Razorpay minimum." });
    }

    const customer = {};
    for (const field of ["name", "phone", "address", "city", "pincode"]) {
      customer[field] = String(req.body?.customer?.[field] || "").trim().slice(0, 500);
    }

    const snapshot = {
      customer, items, subtotal,
      discount: bundleDiscount + couponDiscount,
      couponCode: savedCoupon, couponDiscount, total, paymentMethod
    };

    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const rzpOrder = await rzp.orders.create({
      amount, currency: "INR", receipt: `clz_${Date.now()}`
    });

    await PendingPayment.create({
      razorpayOrderId: rzpOrder.id,
      expectedAmountPaise: amount,
      currency: "INR",
      paymentMethod,
      checkoutSnapshot: snapshot,
      status: "pending",
      orderId: `CLZ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    return res.json({
      keyId, order_id: rzpOrder.id,
      amount: rzpOrder.amount, currency: rzpOrder.currency
    });
  } catch (err) {
    const providerStatus = Number(err?.statusCode || err?.error?.statusCode || 0);

    if (providerStatus) {
      console.error("Razorpay provider error:", {
        statusCode: providerStatus,
        code: err?.error?.code || err?.code || "UNKNOWN"
      });

      return res.status(502).json({
        message: providerStatus === 401
          ? "Razorpay authentication failed. Check the matching API credentials."
          : "Razorpay could not create the payment order. Please try again."
      });
    }

    const clientErrors = [
      "A product or selected size is unavailable. Refresh your cart."
    ];

    if (clientErrors.includes(err.message)) {
      return res.status(400).json({ message: err.message });
    }

    console.error("Razorpay create-order internal error:", err.message);
    return res.status(500).json({
      message: "Could not create payment order. Please try again."
    });
  }
});

app.post("/api/payments/razorpay/verify", async (req, res) => {
  try {
    const orderId = String(req.body?.razorpay_order_id || "").trim();
    const paymentId = String(req.body?.razorpay_payment_id || "").trim();
    const signature = String(req.body?.razorpay_signature || "").trim();
    const secret = String(process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!orderId || !paymentId || !signature || !secret) {
      return res.status(400).json({ message: "Payment verification details are incomplete." });
    }

    const expected = crypto.createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(400).json({ message: "Invalid payment signature." });
    }

    const pending = await PendingPayment.findOne({ razorpayOrderId: orderId });
    if (!pending) {
      const existing = await Order.findOne({ razorpayOrderId: orderId });

      if (
        existing &&
        String(existing.razorpayPaymentId || "") === paymentId
      ) {
        return res.json({ order: existing });
      }

      if (existing) {
        return res.status(409).json({
          message: "Payment identifiers do not match the existing order."
        });
      }

      return res.status(404).json({ message: "Checkout session not found." });
    }

    const rzp = new Razorpay({
      key_id: String(process.env.RAZORPAY_KEY_ID || "").trim(),
      key_secret: secret
    });

    const payment = await rzp.payments.fetch(paymentId);
    if (
      String(payment.order_id || "") !== orderId ||
      payment.status !== "captured" ||
      Number(payment.amount) !== Number(pending.expectedAmountPaise) ||
      String(payment.currency || "").toUpperCase() !== pending.currency
    ) {
      return res.status(400).json({ message: "Captured payment does not match this checkout." });
    }

    const order = await finalizeCapturedRazorpayPayment(
      payment,
      req.body?.customer || {},
      req
    );

    return res.json({ order });
  } catch (err) {
    const providerStatus = Number(err?.statusCode || err?.error?.statusCode || 0);

    if (providerStatus) {
      console.error("Razorpay verification provider error:", {
        statusCode: providerStatus,
        code: err?.error?.code || err?.code || "UNKNOWN"
      });

      return res.status(502).json({
        message: "Razorpay could not verify the payment. Please retry or contact support."
      });
    }

    if (String(err?.message || "").includes("Payment identifiers conflict")) {
      return res.status(409).json({
        message: "Payment identifiers conflict with an existing order."
      });
    }

    console.error("Razorpay verification error:", err.message);
    return res.status(500).json({
      message: "Payment verification failed. Contact support if money was deducted."
    });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = await Order.create({
      ...req.body,
      orderId: `CLZ-${Date.now().toString().slice(-6)}`,
      paymentStatus: "COD Pending",
      amountPaidNow: 0,
      balanceDueOnDelivery: Number(req.body.total || 0),
      status: "Confirmed"
    });

    if (req.body.couponCode) {
      await Coupon.updateOne(
        { code: String(req.body.couponCode).toUpperCase() },
        { $inc: { usedCount: 1 } }
      ).catch(() => {});
    }

    res.json({ order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/newsletter", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required." });
  await Subscriber.updateOne({ email }, { $set: { email } }, { upsert: true });
  res.json({ message: "Welcome to CALZARE®. You are on the list." });
});

// --- CONTROL CENTER ADMIN ROUTES ---
app.get("/api/admin/overview", requireAdmin, async (req, res) => {
  await logAudit("SUCCESSFUL_LOGIN", "Admin Control Center", req);
  const [
    orders,
    products,
    reels,
    homepage,
    collections,
    categories,
    coupons,
    reviews,
    pages,
    settings,
    users,
    subscribers,
    auditLogs
  ] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).lean(),
    Product.find().sort({ createdAt: -1 }).lean(),
    Reel.find().sort({ createdAt: -1 }).lean(),
    Homepage.findOne({ singletonKey: "main" }).lean(),
    Collection.find().sort({ createdAt: 1 }).lean(),
    Category.find().sort({ displayOrder: 1 }).lean(),
    Coupon.find().sort({ createdAt: -1 }).lean(),
    Review.find().sort({ createdAt: -1 }).lean(),
    CmsPage.find().sort({ createdAt: -1 }).lean(),
    StoreSettings.findOne({ singletonKey: "store_settings" }).lean(),
    User.find({}, "-passwordHash").sort({ createdAt: -1 }).lean(),
    Subscriber.find().sort({ createdAt: -1 }).lean(),
    AuditLog.find().sort({ createdAt: -1 }).limit(30).lean()
  ]);
  res.json({
    orders,
    products,
    reels,
    homepage,
    collections,
    categories,
    coupons,
    reviews,
    pages,
    settings,
    users,
    subscribers,
    auditLogs
  });
});

app.post("/api/admin/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No media file received." });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const formBody = new URLSearchParams();
      formBody.append("file", base64);
      formBody.append("upload_preset", uploadPreset);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: formBody }
      );
      const cloudData = await cloudRes.json();
      if (!cloudRes.ok || !cloudData.secure_url) {
        throw new Error(cloudData.error?.message || "Cloudinary upload failed.");
      }
      await logAudit("UPLOAD_MEDIA_CLOUD", req.file.originalname, req);
      return res.json({ url: cloudData.secure_url, filename: req.file.originalname });
    }

    if (req.file.mimetype.startsWith("image/") && req.file.size <= 2 * 1024 * 1024) {
      const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      await logAudit("UPLOAD_MEDIA_INLINE", req.file.originalname, req);
      return res.json({ url: dataUrl, filename: req.file.originalname });
    }

    return res.status(400).json({
      message:
        "Configure CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in Render env to upload large images or videos without local disk storage."
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Media upload failed." });
  }
});

app.post("/api/admin/products", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.body.id },
      { $set: req.body },
      { upsert: true, new: true }
    );
    await logAudit("UPSERT_PRODUCT", `${product.name} (${product.status})`, req);
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
  await Product.deleteOne({ id: req.params.id });
  await logAudit("DELETE_PRODUCT", req.params.id, req);
  res.json({ ok: true });
});

app.post("/api/admin/collections/init-defaults", requireAdmin, async (req, res) => {
  const defaults = [
    {
      slug: "women",
      title: "WOMEN",
      type: "audience",
      subtitle: "Sculpted contours & bold vibrant silhouettes.",
      ctaLabel: "EXPLORE WOMEN"
    },
    {
      slug: "men",
      title: "MEN",
      type: "audience",
      subtitle: "High-traction outdoor & rugged everyday mules.",
      ctaLabel: "EXPLORE MEN"
    },
    {
      slug: "kids",
      title: "KIDS",
      type: "audience",
      subtitle: "Featherweight, indestructible foam for playground champions.",
      ctaLabel: "EXPLORE KIDS"
    },
    {
      slug: "unisex",
      title: "UNISEX",
      type: "audience",
      subtitle: "Pure architectural foam with universal ergonomics.",
      ctaLabel: "EXPLORE UNISEX"
    }
  ];
  for (const item of defaults) {
    await Collection.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });
  }
  await logAudit("INIT_COLLECTIONS", "4 Core Audience Collections", req);
  res.json({ collections: await Collection.find().lean() });
});

app.post("/api/admin/collections", requireAdmin, async (req, res) => {
  const col = await Collection.findOneAndUpdate(
    { slug: req.body.slug },
    { $set: req.body },
    { upsert: true, new: true }
  );
  res.json({ collection: col });
});

app.post("/api/admin/categories", requireAdmin, async (req, res) => {
  const slug =
    req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cat = await Category.findOneAndUpdate(
    { slug },
    { $set: { ...req.body, slug } },
    { upsert: true, new: true }
  );
  await logAudit("UPSERT_CATEGORY", cat.name, req);
  res.json({ category: cat });
});

app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
  await Category.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

app.post("/api/admin/reels", requireAdmin, async (req, res) => {
  const reel = await Reel.findOneAndUpdate(
    { id: req.body.id },
    { $set: req.body },
    { upsert: true, new: true }
  );
  await logAudit("UPSERT_REEL", reel.title, req);
  res.json({ reel });
});

app.delete("/api/admin/reels/:id", requireAdmin, async (req, res) => {
  await Reel.deleteOne({ id: req.params.id });
  res.json({ ok: true });
});

app.put("/api/admin/homepage", requireAdmin, async (req, res) => {
  try {
    const current = (await Homepage.findOne({ singletonKey: "main" }).lean()) || {};
    const body =
      req.body?.homepage && typeof req.body.homepage === "object"
        ? req.body.homepage
        : req.body || {};

    const merged = {
      ...body,
      affordableStore: {
        ...(current.affordableStore || {}),
        ...(body.affordableStore || {})
      },
      featuredProduct: {
        ...(current.featuredProduct || {}),
        ...(body.featuredProduct || {})
      },
      productPage: {
        ...(current.productPage || {}),
        ...(body.productPage || {})
      },
      footer: {
        ...(current.footer || {}),
        ...(body.footer || {})
      },
      pipVideo: {
        ...(current.pipVideo || {}),
        ...(body.pipVideo || {})
      }
    };

    const homepage = await Homepage.findOneAndUpdate(
      { singletonKey: "main" },
      { $set: merged },
      { upsert: true, new: true, lean: true }
    );
    await logAudit("UPDATE_HOMEPAGE_CMS", "Homepage / ProductPage / Footer", req);
    res.json({ homepage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/api/admin/orders/:orderId", requireAdmin, async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { orderId: req.params.orderId },
    { $set: { status: req.body.status } },
    { new: true }
  );
  await logAudit(
    "UPDATE_ORDER_STATUS",
    `${req.params.orderId} -> ${req.body.status}`,
    req
  );
  res.json({ order });
});

app.post("/api/webhooks/fship", async (req, res) => {
  try {
    const payload = req.body || {};
    const data = payload.data && typeof payload.data === "object" ? payload.data : payload;

    const rawOrderId = String(
      data.order_id ||
        data.orderId ||
        data.customer_order_id ||
        data.order_number ||
        ""
    ).trim();

    const awb = String(
      data.awb ||
        data.awb_number ||
        data.awb_code ||
        data.trackingNumber ||
        data.tracking_number ||
        ""
    ).trim();

    const courier = String(
      data.courier_name || data.courierName || data.courier || "FShip"
    ).trim();

    const trackUrl = String(
      data.tracking_url ||
        data.trackingUrl ||
        data.track_url ||
        (awb ? `https://ship.fship.in/tracking?awb=${encodeURIComponent(awb)}` : "")
    ).trim();

    const mappedStatus = mapFshipStatus(
      data.status ||
        data.current_status ||
        data.shipment_status ||
        data.event_status ||
        payload.status
    );

    const query = rawOrderId
      ? { orderId: rawOrderId }
      : awb
      ? { trackingNumber: awb }
      : null;

    if (!query) {
      return res.status(400).json({ message: "Missing order_id or awb in FShip payload." });
    }

    const updateFields = {};
    if (mappedStatus) updateFields.status = mappedStatus;
    if (awb) updateFields.trackingNumber = awb;
    if (courier) updateFields.courierName = courier;
    if (trackUrl) updateFields.trackingUrl = trackUrl;

    const order = await Order.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Matching order not found in MongoDB." });
    }

    await logAudit("FSHIP_WEBHOOK_UPDATE", `${order.orderId} -> ${order.status}`, req);
    res.json({ ok: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/orders/sync-fship", requireAdmin, async (req, res) => {
  try {
    const fshipToken = String(process.env.FSHIP_API_TOKEN || "").trim();
    const fshipTrackUrl = String(
      process.env.FSHIP_TRACK_API_URL || "https://capi.fship.in/api/track"
    ).trim();

    if (!fshipToken) {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return res.json({
        ok: true,
        mode: "webhook_ready",
        message:
          "FSHIP_API_TOKEN not set; webhook endpoint /api/webhooks/fship is active for live pushes.",
        orders
      });
    }

    const activeOrders = await Order.find({
      status: { $nin: ["Delivered", "Cancelled"] }
    }).lean();

    let updatedCount = 0;

    for (const ord of activeOrders) {
      const lookupId = ord.trackingNumber || ord.orderId;
      if (!lookupId) continue;

      try {
        const resp = await fetch(fshipTrackUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fshipToken}`
          },
          body: JSON.stringify({
            awb: ord.trackingNumber || undefined,
            orderId: ord.orderId
          })
        });
        if (!resp.ok) continue;
        const info = await resp.json();
        const statusCandidate =
          info?.status || info?.current_status || info?.data?.status || "";
        const nextStatus = mapFshipStatus(statusCandidate);
        const nextAwb = String(
          info?.awb || info?.awb_number || info?.data?.awb || ord.trackingNumber || ""
        ).trim();
        const nextCourier = String(
          info?.courier_name ||
            info?.courier ||
            info?.data?.courier_name ||
            ord.courierName ||
            ""
        ).trim();

        const patch = {};
        if (nextStatus && nextStatus !== ord.status) patch.status = nextStatus;
        if (nextAwb && nextAwb !== ord.trackingNumber) patch.trackingNumber = nextAwb;
        if (nextCourier && nextCourier !== ord.courierName) patch.courierName = nextCourier;

        if (Object.keys(patch).length > 0) {
          await Order.updateOne({ _id: ord._id }, { $set: patch });
          updatedCount += 1;
        }
      } catch {}
    }

    await logAudit("FSHIP_MANUAL_SYNC", `Updated ${updatedCount} order(s)`, req);
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({ ok: true, updatedCount, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/coupons", requireAdmin, async (req, res) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }
    const payload = {
      ...req.body,
      code,
      discountValue: Number(req.body.discountValue || 0),
      minOrderValue: Number(req.body.minOrderValue || 0),
      maxDiscountCap: Number(req.body.maxDiscountCap || 0),
      usageLimit: Number(req.body.usageLimit || 500),
      active: req.body.active !== false
    };
    const coupon = await Coupon.findOneAndUpdate(
      { code },
      { $set: payload },
      { upsert: true, new: true }
    );
    await logAudit("CREATE_COUPON", coupon.code, req);
    res.json({ coupon });
  } catch (err) {
    res.status(400).json({ message: err.message || "Could not save coupon." });
  }
});

app.delete("/api/admin/coupons/:id", requireAdmin, async (req, res) => {
  try {
    const raw = String(req.params.id || "").trim();
    if (mongoose.Types.ObjectId.isValid(raw)) {
      await Coupon.deleteOne({ _id: raw });
    } else {
      await Coupon.deleteOne({ code: raw.toUpperCase() });
    }
    await logAudit("DELETE_COUPON", raw, req);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message || "Could not delete coupon." });
  }
});

app.post("/api/admin/reviews", requireAdmin, async (req, res) => {
  const review = await Review.create(req.body);
  await logAudit("ADD_CUSTOMER_REVIEW", review.customerName, req);
  res.json({ review });
});

app.patch("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, lean: true }
  );
  await logAudit("UPDATE_CUSTOMER_REVIEW", req.params.id, req);
  res.json({ review });
});

app.delete("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
  await Review.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

app.post("/api/admin/pages", requireAdmin, async (req, res) => {
  const page = await CmsPage.findOneAndUpdate(
    { slug: req.body.slug },
    { $set: req.body },
    { upsert: true, new: true }
  );
  await logAudit("UPSERT_CMS_PAGE", page.title, req);
  res.json({ page });
});

app.delete("/api/admin/pages/:id", requireAdmin, async (req, res) => {
  await CmsPage.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});

app.put("/api/admin/settings", requireAdmin, async (req, res) => {
  try {
    const current =
      (await StoreSettings.findOne({ singletonKey: "store_settings" }).lean()) || {};
    const body =
      req.body?.settings && typeof req.body.settings === "object"
        ? req.body.settings
        : req.body || {};

    const settings = await StoreSettings.findOneAndUpdate(
      { singletonKey: "store_settings" },
      { $set: { ...current, ...body } },
      { upsert: true, new: true, lean: true }
    );
    await logAudit("UPDATE_STORE_SETTINGS", "System Config", req);
    res.json({ settings });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- CUSTOMER & ADMIN SINGLE LOGIN ---
app.post("/api/auth/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required." });
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    return res.status(400).json({ message: "Email already registered." });
  }
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone: phone || "",
    role: "customer",
    passwordHash: hashPassword(password)
  });
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const user = await User.findOne({ email });
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isAdminUser = user.role === "admin";
  const adminToken = isAdminUser ? createAdminToken() : undefined;

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: isAdminUser ? "admin" : "customer",
      adminToken
    }
  });
});

app.get("/api/auth/orders", async (req, res) => {
  const { phone, name } = req.query;
  const query = phone
    ? { "customer.phone": phone }
    : name
    ? { "customer.name": new RegExp(`^${name}$`, "i") }
    : null;
  if (!query) return res.json({ orders: [] });
  res.json({ orders: await Order.find(query).sort({ createdAt: -1 }).lean() });
});

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Order.init();
    console.log("Order collection and indexes ready");
    await PendingPayment.init();
    console.log("PendingPayment collection and indexes ready");
    await seedInitialData();
    app.listen(PORT, () =>
      console.log(`CALZARE Control Center API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
