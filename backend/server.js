import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import Razorpay from "razorpay";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5003;
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/calzare";

const adminSessions = new Set();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir, { acceptRanges: true, maxAge: "7d" }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".mp4";
    const safeBase = path
      .basename(file.originalname || "media", ext)
      .replace(/[^a-z0-9-_]/gi, "_")
      .slice(0, 40);
    cb(null, `${Date.now()}-${safeBase}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

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
        image: ""
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
    total: Number,
    paymentMethod: String,
    paymentStatus: { type: String, default: "Pending" },
    amountPaidNow: { type: Number, default: 0 },
    balanceDueOnDelivery: { type: Number, default: 0 },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    status: { type: String, default: "Confirmed" }
  },
  { timestamps: true }
);

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: "" },
    discountType: { type: String, default: "percentage" },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 999 },
    maxDiscountCap: { type: Number, default: 500 },
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
    businessAddress: { type: String, default: "12th Main Road, Indiranagar, Bengaluru" },
    freeShippingThreshold: { type: Number, default: 2999 },
    standardShippingFee: { type: Number, default: 149 },
    codAdvanceFee: { type: Number, default: 299 },
    codEnabled: { type: Boolean, default: true },
    razorpayKeyPublic: { type: String, default: process.env.RAZORPAY_KEY_ID || "" },
    categories: { type: [String], default: ["sneakers", "formal", "slides"] },
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
    role: { type: String, default: "customer" }, // "customer" | "admin"
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
  const code = String(req.body.code || "").trim().toUpperCase();
  const coupon = await Coupon.findOne({ code, active: true }).lean();
  if (!coupon) {
    return res.status(404).json({ message: "Invalid or expired coupon code." });
  }
  res.json({ coupon });
});

// --- RAZORPAY & ORDERS ---
app.post("/api/payments/razorpay/create-order", async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res
        .status(400)
        .json({ message: "Razorpay keys not configured in backend/.env." });
    }
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const amountInPaise = Math.round(Number(req.body.amountInRupees || 299) * 100);
    const rzpOrder = await rzp.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });
    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/payments/razorpay/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload
    } = req.body;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature." });
    }
    const isPartial = (orderPayload.paymentMethod || "").includes("Partial COD");
    const paidNow = isPartial ? 299 : Number(orderPayload.total || 0);
    const newOrder = await Order.create({
      ...orderPayload,
      orderId: `CLZ-${Date.now().toString().slice(-6)}`,
      paymentStatus: isPartial ? "Partial Advance Paid (₹299)" : "Paid Online",
      amountPaidNow: paidNow,
      balanceDueOnDelivery: Math.max(0, Number(orderPayload.total || 0) - paidNow),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "Confirmed"
    });
    res.json({ order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  if (!req.file) {
    return res.status(400).json({ message: "No media file received." });
  }
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const fileUrl = `${protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  await logAudit("UPLOAD_MEDIA", req.file.filename, req);
  res.json({ url: fileUrl, filename: req.file.filename });
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
    const body = req.body?.homepage && typeof req.body.homepage === "object"
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

app.post("/api/admin/coupons", requireAdmin, async (req, res) => {
  const coupon = await Coupon.findOneAndUpdate(
    { code: req.body.code.toUpperCase() },
    { $set: req.body },
    { upsert: true, new: true }
  );
  await logAudit("CREATE_COUPON", coupon.code, req);
  res.json({ coupon });
});

app.delete("/api/admin/coupons/:id", requireAdmin, async (req, res) => {
  await Coupon.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
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
    const body = req.body?.settings && typeof req.body.settings === "object"
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
    await seedInitialData();
    app.listen(PORT, () =>
      console.log(`CALZARE Control Center API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });