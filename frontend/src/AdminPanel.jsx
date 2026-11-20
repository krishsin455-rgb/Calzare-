import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Check,
  Compass,
  Eye,
  EyeOff,
  FileText,
  Film,
  Layers,
  LayoutDashboard,
  Lock,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Unlock,
  Upload,
  Users,
  X
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5003/api";
const HOMEPAGE_STORAGE_KEY = "calzare_homepage_v1";
const CATEGORIES_STORAGE_KEY = "calzare_custom_categories";
const PAGE_ASSIGNMENTS_STORAGE_KEY = "calzare_page_assignments";
const POLICIES_STORAGE_KEY = "calzare_store_policies_v1";

const DEFAULT_PAYMENT_METHODS = [
  "Partial COD (₹299 Advance)",
  "UPI / Cards / NetBanking",
  "Cash on Delivery"
];

const DEFAULT_STORE_POLICIES = [
  {
    key: "shipping",
    title: "Shipping Policy",
    updatedAt: "November 2026",
    content:
      "Orders are processed and dispatched within 24–48 business hours. Complimentary express shipping applies automatically on orders above ₹2,999. Standard delivery takes 3–5 business days across metro cities and 5–7 business days for rest of India."
  },
  {
    key: "exchange",
    title: "Exchange & Return Policy",
    updatedAt: "November 2026",
    content:
      "We offer a 7-day hassle-free doorstep size exchange on unworn pairs in their original box and packaging. To initiate an exchange, reach out with your Order ID within 7 days of delivery."
  },
  {
    key: "refund",
    title: "Refund Policy",
    updatedAt: "November 2026",
    content:
      "Once a returned pair passes quality inspection at our warehouse, prepaid refunds are credited back to your original payment method within 5–7 business days."
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    updatedAt: "November 2026",
    content:
      "Your name, phone number, email, and delivery address are collected strictly to fulfill your CALZARE order, send shipping updates, and provide customer support."
  },
  {
    key: "terms",
    title: "Terms of Service",
    updatedAt: "November 2026",
    content:
      "By accessing or purchasing from CALZARE, you agree to our pricing, dispatch timelines, and 7-day exchange guidelines."
  }
];

const STOREFRONT_PAGES = [
  { key: "home", label: "HOME PAGE" },
  { key: "men", label: "MEN PAGE" },
  { key: "women", label: "WOMEN PAGE" },
  { key: "unisex", label: "UNISEX PAGE" },
  { key: "kids", label: "KIDS PAGE" },
  { key: "shop", label: "SHOP / ALL PAGE" }
];

const ALL_COLLECTIONS = ["men", "women", "unisex", "kids"];

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

const NAV_GROUPS = [
  {
    group: "CORE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "orders", label: "Orders & Fulfillment", icon: ShoppingBag },
      { id: "products", label: "Products & SKUs", icon: Package },
      { id: "inventory", label: "Inventory Tracker", icon: BarChart3 },
      { id: "collections", label: "Collections & Cats", icon: Layers }
    ]
  },
  {
    group: "CONTENT & CMS",
    items: [
      { id: "homepage", label: "Homepage CMS", icon: Sparkles },
      { id: "reels", label: "Shoppable Reels", icon: Film },
      { id: "story", label: "Our Story Manager", icon: FileText },
      { id: "pages", label: "Pages & Policies", icon: FileText },
      { id: "reviews", label: "Customer Reviews", icon: Star }
    ]
  },
  {
    group: "MARKETING & CRM",
    items: [
      { id: "coupons", label: "Coupons & Promos", icon: Tag },
      { id: "customers", label: "Customer Directory", icon: Users }
    ]
  },
  {
    group: "SYSTEM & SECURITY",
    items: [
      { id: "navigation", label: "Navigation Menus", icon: Compass },
      { id: "settings", label: "Settings & Security", icon: Settings }
    ]
  }
];

const DEFAULT_HOMEPAGE_CMS = {
  reelsEnabled: true,
  sections: [
    {
      key: "hero_main",
      label: "HERO",
      title: "0% BORING. 100% AIR.",
      layout: "asymmetric_editorial",
      visible: true,
      image: ""
    },
    {
      key: "trust_ticker",
      label: "TICKER",
      title: "Live Ticker",
      layout: "marquee_strip",
      visible: true,
      image: ""
    },
    {
      key: "bestsellers",
      label: "BESTSELLERS",
      title: "CROWD FAVORITES",
      layout: "luxury_grid",
      visible: true,
      maxItems: 8,
      image: ""
    },
    {
      key: "shop_audience",
      label: "AUDIENCE_CARDS",
      title: "DESIGNED FOR EVERY STRIDE",
      layout: "split_4_panels",
      visible: true,
      image: ""
    },
    {
      key: "affordable_store",
      label: "AFFORDABLE_STORE",
      title: "THE UNDER ₹999 STORE",
      layout: "editorial_split",
      visible: true,
      image: ""
    },
    {
      key: "storytelling",
      label: "STORYTELLING",
      title: "BUILT FOR REAL LIFE & WILD PERSONALITIES",
      layout: "editorial_split",
      visible: true,
      image: ""
    },
    {
      key: "category_discovery",
      label: "CATEGORY_DISCOVERY",
      title: "CHOOSE YOUR SILHOUETTE",
      layout: "luxury_grid",
      visible: true,
      image: ""
    },
    {
      key: "customer_reviews",
      label: "REVIEWS",
      title: "WORDS FROM THE PAVEMENT",
      layout: "verified_grid",
      visible: true,
      image: ""
    },
    {
      key: "benefits_trust",
      label: "BENEFITS",
      title: "THE CALZARE STANDARD",
      layout: "asymmetric_editorial",
      visible: true,
      image: ""
    },
    {
      key: "newsletter",
      label: "NEWSLETTER",
      title: "DON'T MISS THE NEXT DROP.",
      layout: "dark_banner",
      visible: true,
      image: ""
    }
  ],
  featuredProduct: {
    enabled: true,
    sectionType: "EXCLUSIVE / MOST SELLING",
    productId: "c-001",
    redirectUrl: "",
    image: FALLBACK_IMG,
    title: "FORMA COURT — SIGNATURE EDITION",
    price: 3499
  },
  pipVideo: {},
  heroEyebrow: "THE EVERYDAY COLLECTION — 2026",
  heroTitle: "Walk your",
  heroTitleEmphasis: "own way.",
  heroDescription:
    "Thoughtful footwear. Quiet confidence. Made for wherever the day takes you.",
  heroImage: "",
  heroVideoUrl: "",
  theme: {
    pageBgColor: "#F8FAFC",
    surfaceColor: "#FFFFFF",
    textColor: "#0F172A",
    accentColor: "#2563EB",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizePx: 14
  },
  navbar: {
    bgColor: "#FFFFFF",
    textColor: "#0F172A",
    accentColor: "#2563EB",
    logoSizePx: 27,
    sticky: true,
    announcementText: "COMPLIMENTARY EXPRESS SHIPPING ABOVE ₹2,999 • 7-DAY EASY EXCHANGE"
  },
  affordableStore: {
    enabled: true,
    title: "Your day\nfound its footing.",
    subtitle: "Everyday Calzare, everyday price.\nStarting ₹999",
    badgeLabel: "/999 Store",
    image: "",
    maxPrice: 999,
    ctaLabel: "EXPLORE",
    ctaRoute: "#shop",
    customSlides: []
  },
  footer: {
    bgColor: "#0F172A",
    textColor: "#CBD5E1",
    logo: "",
    tagline: "Architectural footwear built for motion.",
    copyright: "© 2026 CALZARE. All rights reserved.",
    showContact: true,
    hours: "Monday to Friday, 10:00 AM to 6:00 PM.",
    contactItems: [
      { type: "Email", label: "Support Email", value: "support@calzare.in" },
      { type: "Phone", label: "Helpline", value: "+91 98765 43210" }
    ],
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Sneakers", url: "#sneakers" },
          { label: "Slides & Clogs", url: "#slides" }
        ]
      },
      {
        title: "Support",
        links: [
          { label: "Shipping & Returns", url: "#policy" },
          { label: "Size Guide", url: "#shop" }
        ]
      }
    ]
  }
};

const DEFAULT_SIZE_ROWS = [
  { uk: "UK 6", eu: "EU 40", us: "US 7", cm: "25.0 cm" },
  { uk: "UK 7", eu: "EU 41", us: "US 8", cm: "25.8 cm" },
  { uk: "UK 8", eu: "EU 42", us: "US 9", cm: "26.6 cm" },
  { uk: "UK 9", eu: "EU 43", us: "US 10", cm: "27.4 cm" },
  { uk: "UK 10", eu: "EU 44", us: "US 11", cm: "28.2 cm" }
];

const KIDS_SIZE_ROWS = [
  { uk: "UK 1", eu: "EU 33", us: "US 2Y", cm: "19.8 cm" },
  { uk: "UK 2", eu: "EU 34", us: "US 3Y", cm: "20.6 cm" },
  { uk: "UK 3", eu: "EU 35.5", us: "US 4Y", cm: "21.5 cm" },
  { uk: "UK 4", eu: "EU 37", us: "US 5Y", cm: "22.3 cm" },
  { uk: "UK 5", eu: "EU 38", us: "US 6Y", cm: "23.2 cm" }
];

const PRODUCT_STEPS = [
  "1. Basic Info",
  "2. Page Copy",
  "3. Storytelling",
  "4. Key Features",
  "5. Materials & Care",
  "6. Size Guide",
  "7. Colours & Stock",
  "8. Shipping & FAQs",
  "9. SEO & Social"
];

const EMPTY_PRODUCT = {
  id: "",
  sku: "",
  brand: "CALZARE",
  name: "",
  slug: "",
  status: "published",
  category: "sneakers",
  collection: "unisex",
  price: 1499,
  oldPrice: 2499,
  badge: "NEW ARRIVAL",
  tagline: "",
  listingSummary: "",
  color: "Cloud White",
  colorHex: "#D9CFBE",
  sizes: "UK 6, UK 7, UK 8, UK 9, UK 10",
  sizeGuideTitle: "Measurement Guide",
  sizeGuideUnit: "Centimeters (cm)",
  sizeGuideNote:
    "Place your foot on a blank sheet of paper with heel against the wall. Mark the tip of your longest toe and measure.",
  sizeChartRows: DEFAULT_SIZE_ROWS,
  stockBySize: { "UK 6": 15, "UK 7": 20, "UK 8": 25, "UK 9": 18, "UK 10": 12 },
  storyBlocks: [
    {
      visible: true,
      heading: "ENGINEERED FOR THE CONCRETE WILD",
      subheading: "Closed-Cell Microfoam Technology",
      copy: "Every contour of the silhouette is pressure-mapped against human biomechanics to absorb shock and distribute bodyweight evenly across your stride.",
      layout: "Image on Right",
      image: ""
    }
  ],
  featureCards: [
    {
      title: "100% Waterproof & Hydrophobic",
      desc: "Closed-cell EVA matrix resists water, mud, and stains.",
      visible: true
    },
    {
      title: "Featherweight Ergonomics",
      desc: "Lightweight build for all-day city movement.",
      visible: true
    },
    {
      title: "Deep Lug Anti-Slip Outsole",
      desc: "Reliable traction across everyday surfaces.",
      visible: true
    },
    {
      title: "Antimicrobial Odor Barrier",
      desc: "Breathable, easy-care finish for daily wear.",
      visible: true
    }
  ],
  highlights:
    "100% Waterproof & Hydrophobic, Featherweight Ergonomics, Dual-Density Memory Footbed",
  description: "",
  materials: "Closed-Cell EVA & Vegan Micro-Leather",
  moldingMethod: "Monolithic Injection-Molded Ergonomic Shell",
  fitRecommendation: "True to UK size. Roomy toe box for natural splay.",
  careInstructions: "Hand wash with mild soap and cool water. Air dry in shade.",
  dispatchNotice: "Orders processed within 1–2 business days.",
  returnDetails: "Size exchange requests must be submitted within 7 days of delivery.",
  faqs: [
    {
      q: "Are these true to size?",
      a: "Yes! Choose your regular UK size for a comfortable everyday fit."
    },
    {
      q: "How do I clean my CALZARE shoes?",
      a: "Rinse with cool water and mild soap, then air dry in the shade."
    }
  ],
  seoTitle: "",
  seoDescription: "",
  image: "",
  videoUrl: "",
  published: true
};

const handleImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_IMG;
};

function readLocalCategories() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CATEGORIES_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalCategories(cats) {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
  } catch (_) {}
}

function buildDefaultPageAssignments(allCats) {
  return {
    home: { collections: [...ALL_COLLECTIONS], categories: [...allCats] },
    men: { collections: ["men", "unisex"], categories: [...allCats] },
    women: { collections: ["women", "unisex"], categories: [...allCats] },
    unisex: { collections: ["unisex"], categories: [...allCats] },
    kids: { collections: ["kids"], categories: [...allCats] },
    shop: { collections: [...ALL_COLLECTIONS], categories: [...allCats] }
  };
}

function readLocalPageAssignments(allCats) {
  const defaults = buildDefaultPageAssignments(allCats);
  try {
    const parsed = JSON.parse(
      localStorage.getItem(PAGE_ASSIGNMENTS_STORAGE_KEY) || "null"
    );
    if (parsed && typeof parsed === "object") {
      return { ...defaults, ...parsed };
    }
  } catch (_) {}
  return defaults;
}

function writeLocalPageAssignments(assignments) {
  try {
    localStorage.setItem(
      PAGE_ASSIGNMENTS_STORAGE_KEY,
      JSON.stringify(assignments)
    );
  } catch (_) {}
}

function readLocalPolicies() {
  try {
    const parsed = JSON.parse(localStorage.getItem(POLICIES_STORAGE_KEY) || "null");
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (_) {}
  return DEFAULT_STORE_POLICIES;
}

function writeLocalPolicies(pols) {
  try {
    localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(pols));
  } catch (_) {}
}

function DropZoneField({
  label,
  value,
  uploadKey,
  uploadingKey,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  maxBytes = 25 * 1024 * 1024,
  onChange,
  onUploadFile
}) {
  const [dragging, setDragging] = useState(false);
  const isBusy = uploadingKey === uploadKey;
  const isVideo = accept.includes("video");

  const handleSelectedFile = (file) => {
    if (!file) return;
    if (file.size > maxBytes) {
      alert(`File exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit.`);
      return;
    }
    onUploadFile(file, uploadKey, onChange);
  };

  return (
    <div style={{ display: "grid", gap: "6px" }}>
      {label && <label style={fieldLabel}>{label}</label>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragging(false);
          const dropped = e.dataTransfer?.files?.[0];
          handleSelectedFile(dropped);
        }}
        style={{
          border: dragging ? "2px dashed #2563EB" : "1.5px dashed #CBD5E1",
          background: dragging ? "#EFF6FF" : "#F8FAFC",
          borderRadius: "10px",
          padding: "14px",
          textAlign: "center",
          transition: "all 0.15s ease"
        }}
      >
        <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0F172A" }}>
          {isBusy
            ? "Uploading file..."
            : "Click to upload or drag image/file here"}
        </div>
        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
          {isVideo
            ? "MP4, WEBM or PNG, JPG, WEBP, SVG up to 25MB"
            : "PNG, JPG, WEBP, SVG up to 25MB"}
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "10px",
            alignItems: "center"
          }}
        >
          <input
            placeholder="Paste URL or drag & drop above"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...ctrlInput, background: "#FFFFFF" }}
          />
          <label style={{ ...primaryBlueBtn, whiteSpace: "nowrap" }}>
            <Upload size={14} /> {isBusy ? "..." : "Upload"}
            <input
              type="file"
              accept={accept}
              hidden
              disabled={isBusy}
              onChange={(e) => handleSelectedFile(e.target.files?.[0])}
            />
          </label>
        </div>

        {value && !isVideo && (
          <img
            src={value}
            alt={label || "Preview"}
            onError={handleImgError}
            style={{
              width: "100%",
              maxHeight: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              marginTop: "10px"
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminPanel({ onExit, onStoreUpdated }) {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("calzare_admin_token") || ""
  );
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [locked, setLocked] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState("");
  const [syncingFship, setSyncingFship] = useState(false);
  const [timeframe, setTimeframe] = useState("30 Days");

  const [selectedAssignPage, setSelectedAssignPage] = useState("home");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [reels, setReels] = useState([]);
  const [homepage, setHomepage] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        return { ...DEFAULT_HOMEPAGE_CMS, ...saved };
      }
    } catch (_) {}
    return DEFAULT_HOMEPAGE_CMS;
  });
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pages, setPages] = useState([]);
  const [settings, setSettings] = useState(() => {
    const localCats = readLocalCategories();
    const baseCats = ["sneakers", "formal", "slides"];
    const mergedCats = Array.from(new Set([...baseCats, ...localCats]));
    return {
      storeName: "CALZARE",
      supportEmail: "support@calzare.in",
      supportPhone: "+91 98765 43210",
      contactItems: [
        { type: "Email", label: "Customer Support", value: "support@calzare.in" },
        { type: "Phone", label: "Helpline", value: "+91 98765 43210" }
      ],
      paymentMethods: [...DEFAULT_PAYMENT_METHODS],
      freeShippingThreshold: 2999,
      partialCodAdvance: 299,
      categories: mergedCats,
      pageAssignments: readLocalPageAssignments(mergedCats),
      policies: readLocalPolicies(),
      collectionImages: {
        men: "",
        women: "",
        unisex: "",
        kids: ""
      },
      categoryImages: {},
      navigation: [
        { label: "HOME", url: "#home" },
        { label: "MEN", url: "#men" },
        { label: "WOMEN", url: "#women" },
        { label: "UNISEX", url: "#unisex" },
        { label: "KIDS", url: "#kids" },
        { label: "OUR STORY", url: "#story" }
      ],
      storySections: [
        {
          eyebrow: "OUR PHILOSOPHY",
          heading: "Wear what moves you.",
          body: "CALZARE is built around a simple idea: everyday essentials deserve exceptional attention.",
          image: ""
        }
      ]
    };
  });
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [orderTab, setOrderTab] = useState("All");
  const [orderSearch, setOrderSearch] = useState("");

  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [productStep, setProductStep] = useState(1);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

  const [editingSection, setEditingSection] = useState(null);

  const [reelForm, setReelForm] = useState({
    id: "",
    title: "",
    tag: "EVERYDAY WEAR",
    productId: "c-001",
    videoUrl: "",
    poster: ""
  });

  const [couponModal, setCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 999,
    maxDiscountCap: 500,
    usageLimit: 500,
    expiryDate: "",
    active: true
  });

  const [reviewModal, setReviewModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewForm, setReviewForm] = useState({
    productId: "c-001",
    productName: "FORMA COURT",
    customerName: "",
    customerEmail: "",
    location: "Bengaluru",
    rating: 5,
    headline: "",
    comment: "",
    photoUrl: "",
    verifiedBuyer: true,
    featuredOnHomepage: true,
    status: "approved"
  });

  const [pageModal, setPageModal] = useState(false);
  const [pageForm, setPageForm] = useState({
    title: "",
    slug: "",
    category: "POLICY",
    excerpt: "",
    content: "",
    image: "",
    published: true
  });

  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("");

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3800);
  }

  function persistHomepageLocal(hp) {
    try {
      localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(hp));
    } catch (_) {}
  }

  function broadcastSync() {
    try {
      localStorage.setItem("calzare_store_sync", Date.now().toString());
      window.dispatchEvent(new Event("calzare_store_updated"));
    } catch (_) {}
    onStoreUpdated?.();
  }

  async function syncAll(activeToken = token) {
    try {
      const res = await fetch(`${API}/admin/overview`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.status === 401) {
        sessionStorage.removeItem("calzare_admin_token");
        setToken("");
        throw new Error("Session expired. Please sign in with admin email & password.");
      }
      if (!res.ok) throw new Error("Backend offline or sync failed");
      const data = await res.json();
      setOrders(data.orders || []);
      setProducts(data.products || []);
      setReels(data.reels || []);
      if (data.homepage) {
        setHomepage((p) => {
          const merged = {
            ...DEFAULT_HOMEPAGE_CMS,
            ...p,
            ...data.homepage,
            sections: data.homepage.sections?.length
              ? data.homepage.sections
              : DEFAULT_HOMEPAGE_CMS.sections,
            featuredProduct: {
              ...DEFAULT_HOMEPAGE_CMS.featuredProduct,
              ...(p.featuredProduct || {}),
              ...(data.homepage.featuredProduct || {})
            },
            theme: {
              ...DEFAULT_HOMEPAGE_CMS.theme,
              ...(p.theme || {}),
              ...(data.homepage.theme || {})
            },
            navbar: {
              ...DEFAULT_HOMEPAGE_CMS.navbar,
              ...(p.navbar || {}),
              ...(data.homepage.navbar || {})
            },
            affordableStore: {
              ...DEFAULT_HOMEPAGE_CMS.affordableStore,
              ...(p.affordableStore || {}),
              ...(data.homepage.affordableStore || {})
            },
            footer: {
              ...DEFAULT_HOMEPAGE_CMS.footer,
              ...(p.footer || {}),
              ...(data.homepage.footer || {})
            }
          };
          persistHomepageLocal(merged);
          return merged;
        });
      }
      setCoupons(data.coupons || []);
      setReviews(data.reviews || []);
      setPages(data.pages || []);
      if (data.settings) {
        setSettings((p) => {
          const localCats = readLocalCategories();
          const incomingContacts = Array.isArray(data.settings.contactItems)
            ? data.settings.contactItems
            : [
                ...(data.settings.supportEmail
                  ? [
                      {
                        type: "Email",
                        label: "Customer Support",
                        value: data.settings.supportEmail
                      }
                    ]
                  : []),
                ...(data.settings.supportPhone
                  ? [
                      {
                        type: "Phone",
                        label: "Helpline",
                        value: data.settings.supportPhone
                      }
                    ]
                  : [])
              ];
          const mergedCats = Array.from(
            new Set([
              ...(data.settings.categories?.length
                ? data.settings.categories
                : p.categories),
              ...localCats
            ])
          );
          const mergedAssignments = {
            ...readLocalPageAssignments(mergedCats),
            ...(p.pageAssignments || {}),
            ...(data.settings.pageAssignments || {})
          };
          writeLocalPageAssignments(mergedAssignments);
          const mergedPolicies =
            Array.isArray(data.settings.policies) && data.settings.policies.length
              ? data.settings.policies
              : p.policies || readLocalPolicies();
          writeLocalPolicies(mergedPolicies);
          const mergedPaymentMethods = Array.isArray(data.settings.paymentMethods)
            ? data.settings.paymentMethods
            : p.paymentMethods || [...DEFAULT_PAYMENT_METHODS];
          return {
            ...p,
            ...data.settings,
            contactItems: incomingContacts,
            paymentMethods: mergedPaymentMethods,
            categories: mergedCats,
            pageAssignments: mergedAssignments,
            policies: mergedPolicies,
            collectionImages: {
              ...(p.collectionImages || {}),
              ...(data.settings.collectionImages || {})
            },
            categoryImages: {
              ...(p.categoryImages || {}),
              ...(data.settings.categoryImages || {})
            },
            navigation: data.settings.navigation?.length
              ? data.settings.navigation
              : p.navigation,
            storySections: data.settings.storySections?.length
              ? data.settings.storySections
              : p.storySections
          };
        });
      }
      setUsers(data.users || []);
      setSubscribers(data.subscribers || []);
      setAuditLogs(data.auditLogs || []);
      return true;
    } catch (err) {
      notify(err.message || "Backend sync error");
      return false;
    }
  }

  async function handleFshipSync() {
    setSyncingFship(true);
    try {
      const res = await fetch(`${API}/admin/orders/sync-fship`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      await syncAll(token);
      notify(
        res.ok
          ? "Synced live order statuses from FShip."
          : "Refreshed orders (connect FShip webhook at /api/webhooks/fship)."
      );
    } catch {
      await syncAll(token);
      notify("Refreshed orders.");
    } finally {
      setSyncingFship(false);
    }
  }

  useEffect(() => {
    if (token && !locked) syncAll(token);
  }, [token, locked]);

  useEffect(() => {
    if (!token || locked || activeNav !== "orders") return;
    const interval = setInterval(() => {
      syncAll(token);
    }, 15000);
    return () => clearInterval(interval);
  }, [token, locked, activeNav]);

  async function handleAdminLogin(e) {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok || data.user?.role !== "admin" || !data.user?.adminToken) {
        setAuthError(data.message || "Invalid admin email or password.");
        return;
      }
      sessionStorage.setItem("calzare_admin_token", data.user.adminToken);
      setToken(data.user.adminToken);
      setLocked(false);
      setLoginPassword("");
    } catch {
      setAuthError(
        `Cannot reach backend at ${API}. Make sure the server on port 5003 is running.`
      );
    }
  }

  async function uploadMedia(file, key, onUrl) {
    if (!file) return;
    setUploading(key);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${API}/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      if (!data?.url) throw new Error("Upload response did not include a media URL");
      onUrl(data.url);
      notify("Media uploaded & linked.");
    } catch (err) {
      notify(err.message);
    } finally {
      setUploading("");
    }
  }

  async function handleSaveProduct(e, statusOverride) {
    if (e?.preventDefault) e.preventDefault();
    if (!(productForm.name || "").trim()) {
      alert("Please enter a Product Name in 1. Basic Info.");
      setProductStep(1);
      return;
    }
    const activeRows = productForm.sizeChartRows?.length
      ? productForm.sizeChartRows
      : DEFAULT_SIZE_ROWS;
    const derivedSizes = activeRows.map((r) => String(r.uk || "").trim()).filter(Boolean);
    const parsedSizes =
      typeof productForm.sizes === "string"
        ? productForm.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : productForm.sizes;

    const slug =
      (productForm.slug || "").trim() ||
      productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload = {
      ...productForm,
      id: (productForm.id || "").trim() || `c-${Date.now().toString().slice(-4)}`,
      sku: (productForm.sku || "").trim() || `CLZ-${Date.now().toString().slice(-4)}`,
      slug,
      status: statusOverride || productForm.status || "published",
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      sizeChartRows: activeRows,
      sizes: derivedSizes.length ? derivedSizes : parsedSizes,
      image: (productForm.image || "").trim() || FALLBACK_IMG,
      highlights:
        typeof productForm.highlights === "string"
          ? productForm.highlights.split(",").map((h) => h.trim()).filter(Boolean)
          : productForm.highlights
    };

    try {
      const res = await fetch(`${API}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save product");
      }
      notify(
        payload.status === "draft"
          ? "Product saved as draft."
          : "Footwear silhouette published."
      );
      setProductEditorOpen(false);
      setProductForm(EMPTY_PRODUCT);
      await syncAll();
      broadcastSync();
    } catch (err) {
      notify(err.message || "Error saving product");
    }
  }

  async function handleQuickStockUpdate(product, sizeKey, qty) {
    const updatedProduct = {
      ...product,
      stockBySize: {
        ...(product.stockBySize || {}),
        [sizeKey]: Math.max(0, Number(qty) || 0)
      }
    };
    try {
      const res = await fetch(`${API}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });
      if (!res.ok) throw new Error("Failed to update stock");
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? updatedProduct : p))
      );
      notify(
        `Updated ${product.name} (${sizeKey}) stock to ${updatedProduct.stockBySize[sizeKey]}.`
      );
      broadcastSync();
    } catch (err) {
      notify(err.message || "Stock update failed");
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Remove this SKU permanently?")) return;
    await fetch(`${API}/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    notify("SKU removed.");
    await syncAll();
    broadcastSync();
  }

  async function handleUpdateOrderStatus(orderId, status) {
    const res = await fetch(`${API}/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
      );
      notify(`Order ${orderId} updated to ${status}.`);
    }
  }

  async function handleSaveHomepage(updatedHome = homepage) {
    setHomepage(updatedHome);
    persistHomepageLocal(updatedHome);

    try {
      const res = await fetch(`${API}/admin/homepage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedHome)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Backend rejected Homepage CMS update");
      }
      setEditingSection(null);
      notify("Homepage CMS updated live.");
      broadcastSync();
    } catch (err) {
      notify(err.message || "Saved locally, but live API save failed");
    }
  }

  async function handleSaveReel(e) {
    e.preventDefault();
    const payload = {
      ...reelForm,
      id: (reelForm.id || "").trim() || `reel-${Date.now().toString().slice(-4)}`
    };
    const res = await fetch(`${API}/admin/reels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      notify("Shoppable reel published.");
      setReelForm({
        id: "",
        title: "",
        tag: "EVERYDAY WEAR",
        productId: products[0]?.id || "c-001",
        videoUrl: "",
        poster: ""
      });
      await syncAll();
      broadcastSync();
    }
  }

  async function handleDeleteReel(id) {
    if (!window.confirm("Delete this reel?")) return;
    await fetch(`${API}/admin/reels/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    notify("Reel deleted.");
    await syncAll();
    broadcastSync();
  }

  async function handleSaveCoupon(e) {
    e.preventDefault();
    const res = await fetch(`${API}/admin/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...couponForm,
        code: couponForm.code.trim().toUpperCase(),
        discountValue: Number(couponForm.discountValue),
        minOrderValue: Number(couponForm.minOrderValue),
        maxDiscountCap: Number(couponForm.maxDiscountCap),
        usageLimit: Number(couponForm.usageLimit)
      })
    });
    if (res.ok) {
      notify(`Coupon ${couponForm.code.toUpperCase()} activated.`);
      setCouponModal(false);
      await syncAll();
      broadcastSync();
    }
  }

  async function handleDeleteCoupon(id) {
    await fetch(`${API}/admin/coupons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    notify("Coupon removed.");
    await syncAll();
    broadcastSync();
  }

  async function handleSaveReview(e) {
    e.preventDefault();
    const prod = products.find((p) => p.id === reviewForm.productId);
    const res = await fetch(`${API}/admin/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...reviewForm,
        rating: Number(reviewForm.rating),
        productName: prod?.name || "FORMA COURT"
      })
    });
    if (res.ok) {
      notify("Customer review added.");
      setReviewModal(false);
      await syncAll();
      broadcastSync();
    }
  }

  async function handleReviewAction(id, patchObj) {
    await fetch(`${API}/admin/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(patchObj)
    });
    notify("Review updated.");
    await syncAll();
    broadcastSync();
  }

  async function handleDeleteReview(id) {
    await fetch(`${API}/admin/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    notify("Review deleted.");
    await syncAll();
    broadcastSync();
  }

  async function handleSavePage(e) {
    e.preventDefault();
    const slug = pageForm.slug.startsWith("/")
      ? pageForm.slug
      : `/pages/${pageForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const res = await fetch(`${API}/admin/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...pageForm, slug })
    });
    if (res.ok) {
      notify("CMS page saved.");
      setPageModal(false);
      setPageForm({
        title: "",
        slug: "",
        category: "POLICY",
        excerpt: "",
        content: "",
        image: "",
        published: true
      });
      await syncAll();
      broadcastSync();
    }
  }

  async function handleSaveSettings(
    updated = settings,
    successMsg = "Store settings & configuration saved."
  ) {
    if (Array.isArray(updated.categories)) {
      writeLocalCategories(updated.categories);
    }
    if (updated.pageAssignments && typeof updated.pageAssignments === "object") {
      writeLocalPageAssignments(updated.pageAssignments);
    }
    if (Array.isArray(updated.policies)) {
      writeLocalPolicies(updated.policies);
    }

    if (!token) {
      setSettings(updated);
      notify(`${successMsg} (Saved locally; sign in to sync with server)`);
      broadcastSync();
      return true;
    }

    try {
      const res = await fetch(`${API}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSettings(updated);
        broadcastSync();
        notify(
          `${successMsg} (Saved locally; server returned: ${
            data.message || `HTTP ${res.status}`
          })`
        );
        return true;
      }

      const nextSettings =
        data.settings && typeof data.settings === "object"
          ? {
              ...updated,
              ...data.settings,
              contactItems: Array.isArray(data.settings.contactItems)
                ? data.settings.contactItems
                : updated.contactItems,
              paymentMethods: Array.isArray(data.settings.paymentMethods)
                ? data.settings.paymentMethods
                : updated.paymentMethods,
              categories:
                Array.isArray(data.settings.categories) &&
                data.settings.categories.length
                  ? data.settings.categories
                  : updated.categories,
              pageAssignments:
                data.settings.pageAssignments &&
                typeof data.settings.pageAssignments === "object"
                  ? { ...updated.pageAssignments, ...data.settings.pageAssignments }
                  : updated.pageAssignments,
              policies:
                Array.isArray(data.settings.policies) && data.settings.policies.length
                  ? data.settings.policies
                  : updated.policies
            }
          : updated;

      writeLocalCategories(nextSettings.categories || []);
      if (nextSettings.pageAssignments) {
        writeLocalPageAssignments(nextSettings.pageAssignments);
      }
      if (nextSettings.policies) {
        writeLocalPolicies(nextSettings.policies);
      }
      setSettings(nextSettings);
      notify(successMsg);
      broadcastSync();
      return true;
    } catch (err) {
      setSettings(updated);
      broadcastSync();
      notify(`${successMsg} (Saved locally; network error: ${err.message || "offline"})`);
      return true;
    }
  }

  if (!token || locked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0F172A",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          fontFamily: "Inter, system-ui, sans-serif"
        }}
      >
        <form
          onSubmit={handleAdminLogin}
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "36px 32px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.45)",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#EFF6FF",
              color: "#2563EB",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 14px"
            }}
          >
            <Lock size={20} />
          </div>
          <h2
            style={{
              margin: "0 0 6px",
              fontSize: "20px",
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "0.5px"
            }}
          >
            {locked ? "WORKSTATION LOCKED" : "CALZARE CONTROL CENTER"}
          </h2>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: "12.5px",
              color: "#64748B",
              lineHeight: 1.5
            }}
          >
            {locked
              ? "Administrative session locked. Sign in with your admin credentials to resume."
              : "RBAC: SUPERADMIN • Sign in with your Admin Email and Password."}
          </p>
          <input
            type="email"
            required
            placeholder="Admin Email Address"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              fontSize: "14px",
              marginBottom: "10px",
              boxSizing: "border-box"
            }}
          />
          <input
            type="password"
            required
            placeholder="Admin Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              fontSize: "14px",
              marginBottom: "12px",
              boxSizing: "border-box"
            }}
          />
          {authError && (
            <p style={{ color: "#DC2626", fontSize: "12px", margin: "0 0 12px" }}>
              {authError}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: 0,
              background: "#2563EB",
              color: "#fff",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <Unlock size={15} /> Sign In to Control Center
          </button>
          <button
            type="button"
            onClick={onExit}
            style={{
              marginTop: "14px",
              background: "none",
              border: 0,
              color: "#64748B",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            ← Return to Live Storefront
          </button>
        </form>
      </div>
    );
  }

  const validOrders = orders.filter((o) => o.status !== "Cancelled");
  const netRevenue = validOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const confirmedCount = orders.filter((o) => o.status === "Confirmed").length;
  const aov = validOrders.length ? Math.round(netRevenue / validOrders.length) : 0;
  const lowStockCount = products.filter((p) =>
    Object.values(p.stockBySize || {}).some((v) => Number(v) <= 5)
  ).length;

  const activeNavObj =
    NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === activeNav) || {
      label: "Dashboard"
    };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderTab === "All" || o.status === orderTab;
    const term = orderSearch.toLowerCase();
    const matchSearch =
      !term ||
      `${o.orderId} ${o.customer?.name} ${o.customer?.phone} ${o.trackingNumber || ""}`
        .toLowerCase()
        .includes(term);
    return matchStatus && matchSearch;
  });

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "pending") return r.status === "pending";
    if (reviewFilter === "approved") return r.status === "approved";
    return true;
  });

  const activeSizeRows = productForm.sizeChartRows?.length
    ? productForm.sizeChartRows
    : DEFAULT_SIZE_ROWS;

  const availableCategories = Array.from(
    new Set([
      ...(settings.categories?.length
        ? settings.categories
        : ["sneakers", "formal", "slides"]),
      ...readLocalCategories(),
      ...products.map((p) => (p.category || "").toLowerCase()).filter(Boolean)
    ])
  );

  const categoriesSummary = availableCategories.map((cat) => ({
    key: cat,
    name: cat.toUpperCase(),
    count: products.filter((p) => (p.category || "").toLowerCase() === cat).length
  }));

  async function handleTogglePageAssignment(pageKey, groupType, itemKey) {
    const fallbackRule = buildDefaultPageAssignments(availableCategories)[pageKey] || {
      collections: [...ALL_COLLECTIONS],
      categories: [...availableCategories]
    };
    const currentPageRule =
      settings.pageAssignments?.[pageKey] || fallbackRule;
    const currentList = Array.isArray(currentPageRule[groupType])
      ? currentPageRule[groupType]
      : [];
    const isCurrentlyShown = currentList.includes(itemKey);

    const nextList = isCurrentlyShown
      ? currentList.filter((k) => k !== itemKey)
      : [...currentList, itemKey];

    const updatedAssignments = {
      ...(settings.pageAssignments || buildDefaultPageAssignments(availableCategories)),
      [pageKey]: {
        ...currentPageRule,
        [groupType]: nextList
      }
    };

    const updated = {
      ...settings,
      pageAssignments: updatedAssignments
    };

    writeLocalPageAssignments(updatedAssignments);
    setSettings(updated);

    await handleSaveSettings(
      updated,
      `${isCurrentlyShown ? "Removed" : "Added"} "${itemKey.toUpperCase()}" ${
        isCurrentlyShown ? "from" : "to"
      } ${pageKey.toUpperCase()} page.`
    );
  }

  async function handleResetPageAssignments(pageKey) {
    const defaultRule = buildDefaultPageAssignments(availableCategories)[pageKey] || {
      collections: [...ALL_COLLECTIONS],
      categories: [...availableCategories]
    };
    const updatedAssignments = {
      ...(settings.pageAssignments || buildDefaultPageAssignments(availableCategories)),
      [pageKey]: defaultRule
    };
    const updated = {
      ...settings,
      pageAssignments: updatedAssignments
    };
    writeLocalPageAssignments(updatedAssignments);
    setSettings(updated);
    await handleSaveSettings(
      updated,
      `Restored all collections & categories on ${pageKey.toUpperCase()} page.`
    );
  }

  async function handleAddCategory(e) {
    if (e?.preventDefault) e.preventDefault();
    const clean = (newCategoryInput || "").trim().toLowerCase();
    if (!clean) {
      notify("Type a category name first.");
      return;
    }
    if (availableCategories.includes(clean)) {
      notify(`Category "${clean.toUpperCase()}" already exists.`);
      setNewCategoryInput("");
      return;
    }

    const updatedCats = [...availableCategories, clean];
    const currentAssignments =
      settings.pageAssignments || buildDefaultPageAssignments(availableCategories);
    const updatedAssignments = Object.fromEntries(
      STOREFRONT_PAGES.map(({ key }) => {
        const existing = currentAssignments[key] || {
          collections: [...ALL_COLLECTIONS],
          categories: [...availableCategories]
        };
        return [
          key,
          {
            ...existing,
            categories: Array.from(new Set([...(existing.categories || []), clean]))
          }
        ];
      })
    );

    const updated = {
      ...settings,
      categories: updatedCats,
      pageAssignments: updatedAssignments
    };

    setNewCategoryInput("");
    writeLocalCategories(updatedCats);
    writeLocalPageAssignments(updatedAssignments);
    setSettings(updated);

    await handleSaveSettings(
      updated,
      `Added category "${clean.toUpperCase()}".`
    );
  }

  async function handleRenameCategory(oldCatKey, rawNewName) {
    const cleanNew = (rawNewName || "").trim().toLowerCase();
    if (!cleanNew || cleanNew === oldCatKey) return;

    if (availableCategories.includes(cleanNew)) {
      notify(`Category "${cleanNew.toUpperCase()}" already exists.`);
      return;
    }

    const updatedCats = availableCategories.map((c) =>
      c === oldCatKey ? cleanNew : c
    );
    const prevCatImg = settings.categoryImages?.[oldCatKey] || "";
    const nextCatImages = { ...(settings.categoryImages || {}) };
    if (prevCatImg) {
      nextCatImages[cleanNew] = prevCatImg;
    }
    delete nextCatImages[oldCatKey];

    const currentAssignments =
      settings.pageAssignments || buildDefaultPageAssignments(availableCategories);
    const updatedAssignments = Object.fromEntries(
      Object.entries(currentAssignments).map(([pgKey, rule]) => [
        pgKey,
        {
          ...rule,
          categories: (rule.categories || []).map((c) =>
            c === oldCatKey ? cleanNew : c
          )
        }
      ])
    );

    const updatedSettings = {
      ...settings,
      categories: updatedCats,
      categoryImages: nextCatImages,
      pageAssignments: updatedAssignments
    };

    writeLocalCategories(updatedCats);
    writeLocalPageAssignments(updatedAssignments);
    setSettings(updatedSettings);

    const affectedProducts = products.filter(
      (p) => (p.category || "").toLowerCase() === oldCatKey
    );

    if (affectedProducts.length) {
      setProducts((prev) =>
        prev.map((p) =>
          (p.category || "").toLowerCase() === oldCatKey
            ? { ...p, category: cleanNew }
            : p
        )
      );

      if (token) {
        await Promise.all(
          affectedProducts.map((prod) =>
            fetch(`${API}/admin/products`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ ...prod, category: cleanNew })
            }).catch(() => null)
          )
        );
      }
    }

    await handleSaveSettings(
      updatedSettings,
      `Renamed "${oldCatKey.toUpperCase()}" to "${cleanNew.toUpperCase()}".`
    );
  }

  async function handleRemoveCategory(catKey) {
    const inUseCount = products.filter(
      (p) => (p.category || "").toLowerCase() === catKey
    ).length;
    if (inUseCount > 0) {
      alert(
        `Cannot remove "${catKey.toUpperCase()}" because ${inUseCount} product(s) are currently assigned to it. Reassign those products first.`
      );
      return;
    }

    const updatedCats = availableCategories.filter((c) => c !== catKey);
    const nextCatImages = { ...(settings.categoryImages || {}) };
    delete nextCatImages[catKey];

    const currentAssignments =
      settings.pageAssignments || buildDefaultPageAssignments(availableCategories);
    const updatedAssignments = Object.fromEntries(
      Object.entries(currentAssignments).map(([pgKey, rule]) => [
        pgKey,
        {
          ...rule,
          categories: (rule.categories || []).filter((c) => c !== catKey)
        }
      ])
    );

    const updated = {
      ...settings,
      categories: updatedCats,
      categoryImages: nextCatImages,
      pageAssignments: updatedAssignments
    };

    writeLocalCategories(updatedCats);
    writeLocalPageAssignments(updatedAssignments);
    setSettings(updated);

    await handleSaveSettings(
      updated,
      `Removed category "${catKey.toUpperCase()}".`
    );
  }

  const collectionsSummary = ALL_COLLECTIONS.map((col) => ({
    key: col,
    name: col.toUpperCase(),
    count: products.filter((p) => (p.collection || "unisex") === col).length
  }));

  const currentPageAssignment =
    settings.pageAssignments?.[selectedAssignPage] ||
    buildDefaultPageAssignments(availableCategories)[selectedAssignPage] || {
      collections: [...ALL_COLLECTIONS],
      categories: [...availableCategories]
    };

  const activePaymentMethods =
    Array.isArray(settings.paymentMethods) && settings.paymentMethods.length
      ? settings.paymentMethods
      : DEFAULT_PAYMENT_METHODS;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
        color: "#0F172A",
        fontFamily: "Inter, system-ui, sans-serif"
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: "250px",
          background: "#0F172A",
          color: "#94A3B8",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto"
        }}
      >
        <div
          style={{
            padding: "20px 18px",
            borderBottom: "1px solid #1E293B",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "#2563EB",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "14px"
            }}
          >
            C
          </div>
          <div>
            <strong
              style={{
                display: "block",
                color: "#F8FAFC",
                fontSize: "14px",
                letterSpacing: "1px"
              }}
            >
              CALZARE
            </strong>
            <span style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#64748B" }}>
              CONTROL CENTER
            </span>
          </div>
        </div>

        <div style={{ padding: "14px 10px", flex: 1 }}>
          {NAV_GROUPS.map((grp) => (
            <div key={grp.group} style={{ marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "1.4px",
                  color: "#475569",
                  padding: "0 10px 6px"
                }}
              >
                {grp.group}
              </div>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveNav(item.id);
                      setProductEditorOpen(false);
                      setMobileNavOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 12px",
                      marginBottom: "2px",
                      borderRadius: "8px",
                      border: 0,
                      background: isActive ? "#2563EB" : "transparent",
                      color: isActive ? "#FFFFFF" : "#CBD5E1",
                      fontSize: "12.5px",
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            padding: "12px 24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            position: "sticky",
            top: 0,
            zIndex: 20
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12.5px",
              color: "#64748B"
            }}
          >
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              style={{ display: "none", background: "none", border: 0 }}
            >
              <Menu size={18} />
            </button>
            <span>Control Center</span>
            <span>›</span>
            <strong style={{ color: "#0F172A" }}>{activeNavObj.label}</strong>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "#ECFDF5",
                color: "#059669",
                border: "1px solid #A7F3D0",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700
              }}
            >
              <ShieldCheck size={13} /> RBAC: SUPERADMIN
            </span>
            <button type="button" onClick={() => syncAll()} style={topActionBtn}>
              <RefreshCw size={13} /> Sync
            </button>
            <button type="button" onClick={() => setLocked(true)} style={topActionBtn}>
              <Lock size={13} /> Lock Workstation
            </button>
            <button type="button" onClick={onExit} style={topActionBtn}>
              <ArrowUpRight size={13} /> View Storefront
            </button>
          </div>
        </header>

        {toast && (
          <div
            style={{
              margin: "16px 24px 0",
              padding: "10px 16px",
              background: "#0F172A",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "12.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Check size={14} color="#34D399" /> {toast}
            </span>
            <button
              type="button"
              onClick={() => setToast("")}
              style={{
                background: "none",
                border: 0,
                color: "#94A3B8",
                cursor: "pointer"
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        <main
          style={{
            padding: "24px",
            maxWidth: "1400px",
            width: "100%",
            boxSizing: "border-box",
            paddingBottom: productEditorOpen ? "84px" : "48px"
          }}
        >
          {/* ==================== DASHBOARD ==================== */}
          {activeNav === "dashboard" && (
            <div style={{ display: "grid", gap: "20px" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <div>
                  <h1 style={pageTitle}>EXECUTIVE OVERVIEW</h1>
                  <p style={pageSub}>
                    Live commerce analytics and inventory status derived directly from
                    transactional records.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    background: "#E2E8F0",
                    padding: "3px",
                    borderRadius: "8px"
                  }}
                >
                  {["Today", "7 Days", "30 Days", "90 Days"].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: 0,
                        background: timeframe === tf ? "#0F172A" : "transparent",
                        color: timeframe === tf ? "#fff" : "#475569",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px"
                }}
              >
                <div style={cardBox}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                    NET REVENUE
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 800, margin: "8px 0 4px" }}>
                    {money(netRevenue)}
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#64748B" }}>
                    Excludes cancelled
                  </span>
                </div>
                <div style={cardBox}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                    TOTAL ORDERS
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 800, margin: "8px 0 4px" }}>
                    {orders.length}
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#059669" }}>
                    {confirmedCount} Confirmed
                  </span>
                </div>
                <div style={cardBox}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                    AVERAGE ORDER VALUE
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 800, margin: "8px 0 4px" }}>
                    {money(aov)}
                  </div>
                  <span style={{ fontSize: "11.5px", color: "#64748B" }}>
                    Across {validOrders.length} active orders
                  </span>
                </div>
                <div style={cardBox}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>
                    LOW STOCK ALERT
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 800, margin: "8px 0 4px" }}>
                    {lowStockCount}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav("inventory")}
                    style={linkBtn}
                  >
                    Manage inventory →
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "16px"
                }}
              >
                <div style={cardBox}>
                  <h3 style={sectionSubTitle}>RECENT ORDERS</h3>
                  {orders.slice(0, 5).map((o) => (
                    <div
                      key={o.orderId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid #F1F5F9",
                        fontSize: "12.5px"
                      }}
                    >
                      <div>
                        <strong>{o.orderId}</strong> • {o.customer?.name || "Customer"}
                      </div>
                      <div>
                        <strong>{money(o.total)}</strong>{" "}
                        <span style={{ color: "#64748B" }}>({o.status})</span>
                      </div>
                    </div>
                  ))}
                  {!orders.length && <p style={pageSub}>No orders recorded yet.</p>}
                </div>

                <div style={cardBox}>
                  <h3 style={sectionSubTitle}>CATALOG SNAPSHOT</h3>
                  <p style={{ fontSize: "13px", margin: "0 0 8px" }}>
                    <strong>{products.length}</strong> Published Silhouettes •{" "}
                    <strong>{reels.length}</strong> Shoppable Reels •{" "}
                    <strong>{coupons.length}</strong> Active Promos
                  </p>
                  <p style={{ fontSize: "13px", margin: 0, color: "#64748B" }}>
                    <strong>{users.length}</strong> Registered Customers •{" "}
                    <strong>{subscribers.length}</strong> Newsletter Subscribers
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ORDERS & FULFILLMENT ==================== */}
          {activeNav === "orders" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <div>
                  <h1 style={pageTitle}>ORDERS & FULFILLMENT</h1>
                  <p style={pageSub}>
                    Auto-syncs every 15s and via FShip webhook (`/api/webhooks/fship`).
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    disabled={syncingFship}
                    onClick={handleFshipSync}
                    style={primaryBlueBtn}
                  >
                    <RefreshCw size={13} /> {syncingFship ? "Syncing FShip..." : "Sync FShip"}
                  </button>
                  <button type="button" onClick={() => syncAll()} style={topActionBtn}>
                    <RefreshCw size={13} /> Refresh Orders
                  </button>
                </div>
              </div>
              <div style={cardBox}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "12px"
                  }}
                >
                  {["All", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setOrderTab(st)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: "1px solid #E2E8F0",
                          background: orderTab === st ? "#0F172A" : "#fff",
                          color: orderTab === st ? "#fff" : "#475569",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
                <input
                  placeholder="Search orders by ID, name, phone, or AWB..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  style={{ ...ctrlInput, marginBottom: "12px" }}
                />
                {!filteredOrders.length ? (
                  <p style={{ textAlign: "center", color: "#94A3B8" }}>No orders found.</p>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      style={{
                        border: "1px solid #E2E8F0",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "10px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <strong>{ord.orderId}</strong> — {ord.customer?.name}{" "}
                        <span style={{ fontSize: "12px", color: "#64748B" }}>
                          ({ord.customer?.phone} • {ord.customer?.city})
                        </span>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                          {(ord.items || [])
                            .map((i) => `${i.name} (${i.size}) ×${i.quantity}`)
                            .join(", ")}{" "}
                          • {ord.paymentMethod}
                        </div>
                        {(ord.trackingNumber || ord.courierName) && (
                          <div style={{ fontSize: "11.5px", color: "#2563EB", marginTop: "4px" }}>
                            FShip: {ord.courierName || "Courier"}
                            {ord.trackingNumber ? ` • AWB: ${ord.trackingNumber}` : ""}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <strong>{money(ord.total)}</strong>
                        <select
                          value={ord.status || "Confirmed"}
                          onChange={(e) =>
                            handleUpdateOrderStatus(ord.orderId, e.target.value)
                          }
                          style={{ ...ctrlInput, width: "145px" }}
                        >
                          {["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map(
                            (s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== PRODUCTS & SKUS ==================== */}
          {activeNav === "products" && !productEditorOpen && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h1 style={pageTitle}>PRODUCTS & CATALOG</h1>
                  <p style={pageSub}>Manage footwear models and SKUs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProductForm(EMPTY_PRODUCT);
                    setProductStep(1);
                    setProductEditorOpen(true);
                  }}
                  style={primaryBlueBtn}
                >
                  <Plus size={15} /> Register New Silhouette
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "16px"
                }}
              >
                {products.map((p) => (
                  <div key={p.id} style={cardBox}>
                    <img
                      src={p.image || FALLBACK_IMG}
                      alt={p.name}
                      onError={handleImgError}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px"
                      }}
                    />
                    <div style={{ fontSize: "11px", color: "#64748B", fontWeight: 600 }}>
                      {p.sku || p.id} • {(p.collection || "unisex").toUpperCase()} •{" "}
                      {(p.category || "sneakers").toUpperCase()}
                    </div>
                    <h3 style={{ margin: "4px 0 6px", fontSize: "15px" }}>{p.name}</h3>
                    <div style={{ marginBottom: "10px" }}>
                      <strong>{money(p.price)}</strong>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setProductForm({
                            ...EMPTY_PRODUCT,
                            ...p,
                            highlights: Array.isArray(p.highlights)
                              ? p.highlights.join(", ")
                              : p.highlights || ""
                          });
                          setProductStep(1);
                          setProductEditorOpen(true);
                        }}
                        style={{ ...topActionBtn, flex: 1, justifyContent: "center" }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        style={{ ...topActionBtn, color: "#DC2626" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "products" && productEditorOpen && (
            <form
              onSubmit={(e) => handleSaveProduct(e, "published")}
              style={{ display: "grid", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setProductEditorOpen(false)}
                    style={linkBtn}
                  >
                    ← Back to Catalog
                  </button>
                  <h1 style={pageTitle}>
                    {productForm.id
                      ? `EDIT: ${productForm.name}`
                      : "REGISTER NEW FOOTWEAR SILHOUETTE"}
                  </h1>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleSaveProduct(null, "draft")}
                    style={topActionBtn}
                  >
                    Save as Draft
                  </button>
                  <button type="submit" style={primaryBlueBtn}>
                    <Check size={15} /> Publish Product
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                {PRODUCT_STEPS.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setProductStep(idx + 1)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      background: productStep === idx + 1 ? "#0F172A" : "#fff",
                      color: productStep === idx + 1 ? "#fff" : "#334155",
                      fontSize: "12px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      cursor: "pointer"
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div style={cardBox}>
                {productStep === 1 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>GROUP 1: BASIC INFO & MEDIA UPLOAD</h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <label style={fieldLabel}>Product Name *</label>
                        <input
                          required
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm({ ...productForm, name: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <div>
                        <label style={fieldLabel}>SKU</label>
                        <input
                          value={productForm.sku}
                          onChange={(e) =>
                            setProductForm({ ...productForm, sku: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <div>
                        <label style={fieldLabel}>Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({ ...productForm, category: e.target.value })
                          }
                          style={ctrlInput}
                        >
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <label style={fieldLabel}>Target Audience</label>
                        <select
                          value={productForm.collection}
                          onChange={(e) => {
                            const col = e.target.value;
                            const rows =
                              col === "kids" ? KIDS_SIZE_ROWS : DEFAULT_SIZE_ROWS;
                            setProductForm({
                              ...productForm,
                              collection: col,
                              sizeChartRows: rows,
                              sizes: rows.map((r) => r.uk).join(", ")
                            });
                          }}
                          style={ctrlInput}
                        >
                          <option value="unisex">Unisex</option>
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="kids">Kids (UK 1–5)</option>
                        </select>
                      </div>
                      <div>
                        <label style={fieldLabel}>Selling Price (INR) *</label>
                        <input
                          required
                          type="number"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <div>
                        <label style={fieldLabel}>MRP / Compare Price (INR)</label>
                        <input
                          type="number"
                          value={productForm.oldPrice || ""}
                          onChange={(e) =>
                            setProductForm({ ...productForm, oldPrice: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px"
                      }}
                    >
                      <DropZoneField
                        label="Product Photo (Drag & Drop or Upload)"
                        uploadKey="pImg"
                        uploadingKey={uploading}
                        value={productForm.image}
                        onUploadFile={uploadMedia}
                        onChange={(u) => setProductForm((p) => ({ ...p, image: u }))}
                      />
                      <DropZoneField
                        label="Hover Video MP4 (Drag & Drop or Upload)"
                        uploadKey="pVid"
                        uploadingKey={uploading}
                        accept="video/mp4,video/webm"
                        value={productForm.videoUrl}
                        onUploadFile={uploadMedia}
                        onChange={(u) => setProductForm((p) => ({ ...p, videoUrl: u }))}
                      />
                    </div>
                  </div>
                )}

                {productStep === 2 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>GROUP 2: PRODUCT COPY & BADGES</h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <label style={fieldLabel}>Badge Label</label>
                        <input
                          value={productForm.badge || ""}
                          onChange={(e) =>
                            setProductForm({ ...productForm, badge: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <div>
                        <label style={fieldLabel}>Tagline</label>
                        <input
                          value={productForm.tagline || ""}
                          onChange={(e) =>
                            setProductForm({ ...productForm, tagline: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={fieldLabel}>Full Description</label>
                      <textarea
                        rows={4}
                        value={productForm.description || ""}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        style={ctrlInput}
                      />
                    </div>
                  </div>
                )}

                {productStep === 3 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>GROUP 3: STORYTELLING CHAPTERS</h3>
                    {(productForm.storyBlocks || []).map((blk, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                          padding: "12px",
                          display: "grid",
                          gap: "8px"
                        }}
                      >
                        <input
                          placeholder="Chapter Heading"
                          value={blk.heading}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              storyBlocks: productForm.storyBlocks.map((b, idx) =>
                                idx === i ? { ...b, heading: e.target.value } : b
                              )
                            })
                          }
                          style={ctrlInput}
                        />
                        <textarea
                          rows={2}
                          placeholder="Chapter Copy"
                          value={blk.copy}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              storyBlocks: productForm.storyBlocks.map((b, idx) =>
                                idx === i ? { ...b, copy: e.target.value } : b
                              )
                            })
                          }
                          style={ctrlInput}
                        />
                        <DropZoneField
                          label="Chapter Editorial Photograph"
                          uploadKey={`prodStoryImg-${i}`}
                          uploadingKey={uploading}
                          value={blk.image || ""}
                          onUploadFile={uploadMedia}
                          onChange={(url) =>
                            setProductForm((prev) => ({
                              ...prev,
                              storyBlocks: prev.storyBlocks.map((b, idx) =>
                                idx === i ? { ...b, image: url } : b
                              )
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                {productStep === 4 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>GROUP 4: KEY FOOTWEAR HIGHLIGHTS</h3>
                    <label style={fieldLabel}>Comma-Separated Bullet Highlights</label>
                    <textarea
                      rows={3}
                      value={
                        Array.isArray(productForm.highlights)
                          ? productForm.highlights.join(", ")
                          : productForm.highlights || ""
                      }
                      onChange={(e) =>
                        setProductForm({ ...productForm, highlights: e.target.value })
                      }
                      style={ctrlInput}
                    />
                  </div>
                )}

                {productStep === 5 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>GROUP 5: MATERIALS, FIT & CARE</h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <label style={fieldLabel}>Upper & Sole Materials</label>
                        <input
                          value={productForm.materials || ""}
                          onChange={(e) =>
                            setProductForm({ ...productForm, materials: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <div>
                        <label style={fieldLabel}>Fit Advice</label>
                        <input
                          value={productForm.fitRecommendation || ""}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              fitRecommendation: e.target.value
                            })
                          }
                          style={ctrlInput}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={fieldLabel}>Care Instructions</label>
                      <textarea
                        rows={2}
                        value={productForm.careInstructions || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            careInstructions: e.target.value
                          })
                        }
                        style={ctrlInput}
                      />
                    </div>
                  </div>
                )}

                {productStep === 6 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px"
                      }}
                    >
                      <h3 style={{ ...sectionSubTitle, margin: 0 }}>
                        GROUP 6: SIZE CHART & MEASUREMENT GUIDE
                      </h3>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              sizeChartRows: DEFAULT_SIZE_ROWS
                            })
                          }
                          style={topActionBtn}
                        >
                          Adult (UK 6–10)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              sizeChartRows: KIDS_SIZE_ROWS
                            })
                          }
                          style={topActionBtn}
                        >
                          Kids (UK 1–5)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              sizeChartRows: [
                                ...activeSizeRows,
                                { uk: "", eu: "", us: "", cm: "" }
                              ]
                            })
                          }
                          style={primaryBlueBtn}
                        >
                          <Plus size={14} /> Add Size Row
                        </button>
                      </div>
                    </div>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "12.5px"
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#F1F5F9", textAlign: "left" }}>
                          <th style={{ padding: "8px" }}>UK / INDIA</th>
                          <th style={{ padding: "8px" }}>EU SIZE</th>
                          <th style={{ padding: "8px" }}>US SIZE</th>
                          <th style={{ padding: "8px" }}>FOOT LENGTH</th>
                          <th style={{ padding: "8px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeSizeRows.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0" }}>
                            {["uk", "eu", "us", "cm"].map((f) => (
                              <td key={f} style={{ padding: "6px" }}>
                                <input
                                  value={row[f] || ""}
                                  onChange={(e) =>
                                    setProductForm({
                                      ...productForm,
                                      sizeChartRows: activeSizeRows.map((r, i) =>
                                        i === idx ? { ...r, [f]: e.target.value } : r
                                      )
                                    })
                                  }
                                  style={ctrlInput}
                                />
                              </td>
                            ))}
                            <td style={{ padding: "6px" }}>
                              <button
                                type="button"
                                onClick={() =>
                                  setProductForm({
                                    ...productForm,
                                    sizeChartRows: activeSizeRows.filter(
                                      (_, i) => i !== idx
                                    )
                                  })
                                }
                                style={{ ...topActionBtn, color: "#DC2626" }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {productStep === 7 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>
                      GROUP 7: COLOURWAY & UK SIZE STOCK MATRIX
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <label style={fieldLabel}>Colorway Name</label>
                        <input
                          value={productForm.color || ""}
                          onChange={(e) =>
                            setProductForm({ ...productForm, color: e.target.value })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <div>
                        <label style={fieldLabel}>Color Swatch Hex</label>
                        <input
                          type="color"
                          value={productForm.colorHex || "#D9CFBE"}
                          onChange={(e) =>
                            setProductForm({ ...productForm, colorHex: e.target.value })
                          }
                          style={{
                            width: "100%",
                            height: "38px",
                            border: "1px solid #CBD5E1",
                            borderRadius: "8px"
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                        gap: "10px"
                      }}
                    >
                      {activeSizeRows.map((r) => {
                        const sz = r.uk || "UK 8";
                        return (
                          <div
                            key={sz}
                            style={{
                              border: "1px solid #E2E8F0",
                              borderRadius: "8px",
                              padding: "10px",
                              textAlign: "center"
                            }}
                          >
                            <strong
                              style={{
                                display: "block",
                                fontSize: "12px",
                                marginBottom: "6px"
                              }}
                            >
                              {sz}
                            </strong>
                            <input
                              type="number"
                              value={productForm.stockBySize?.[sz] ?? 15}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  stockBySize: {
                                    ...(productForm.stockBySize || {}),
                                    [sz]: Number(e.target.value)
                                  }
                                })
                              }
                              style={{ ...ctrlInput, textAlign: "center" }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {productStep === 8 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>GROUP 8: DISPATCH & EXCHANGE POLICY</h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <label style={fieldLabel}>Dispatch Notice</label>
                        <input
                          value={productForm.dispatchNotice || ""}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              dispatchNotice: e.target.value
                            })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <div>
                        <label style={fieldLabel}>Return & Exchange Details</label>
                        <input
                          value={productForm.returnDetails || ""}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              returnDetails: e.target.value
                            })
                          }
                          style={ctrlInput}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {productStep === 9 && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <h3 style={sectionSubTitle}>GROUP 9: SEO META TAGS</h3>
                    <div>
                      <label style={fieldLabel}>SEO Meta Title</label>
                      <input
                        value={productForm.seoTitle || ""}
                        onChange={(e) =>
                          setProductForm({ ...productForm, seoTitle: e.target.value })
                        }
                        style={ctrlInput}
                      />
                    </div>
                    <div>
                      <label style={fieldLabel}>SEO Meta Description</label>
                      <textarea
                        rows={2}
                        value={productForm.seoDescription || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            seoDescription: e.target.value
                          })
                        }
                        style={ctrlInput}
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* ==================== INVENTORY TRACKER ==================== */}
          {activeNav === "inventory" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <h1 style={pageTitle}>INVENTORY TRACKER</h1>
                <p style={pageSub}>
                  Live per-size stock matrix across all active footwear SKUs.
                </p>
              </div>
              {products.map((prod) => {
                const stockEntries = Object.entries(
                  prod.stockBySize || {
                    "UK 6": 10,
                    "UK 7": 12,
                    "UK 8": 15,
                    "UK 9": 10,
                    "UK 10": 8
                  }
                );
                const totalUnits = stockEntries.reduce(
                  (s, [, v]) => s + Number(v || 0),
                  0
                );
                return (
                  <div key={prod.id} style={cardBox}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={prod.image || FALLBACK_IMG}
                          alt={prod.name}
                          onError={handleImgError}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "8px",
                            objectFit: "cover"
                          }}
                        />
                        <div>
                          <strong>{prod.name}</strong>
                          <div style={{ fontSize: "11.5px", color: "#64748B" }}>
                            {prod.sku || prod.id} • {totalUnits} total units
                          </div>
                        </div>
                      </div>
                      {totalUnits <= 10 && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "#FEF3C7",
                            color: "#B45309",
                            padding: "4px 10px",
                            borderRadius: "99px",
                            fontSize: "11px",
                            fontWeight: 700
                          }}
                        >
                          <AlertTriangle size={13} /> Low Stock
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                        gap: "10px"
                      }}
                    >
                      {stockEntries.map(([sz, qty]) => (
                        <div
                          key={sz}
                          style={{
                            border:
                              Number(qty) <= 5
                                ? "1px solid #F59E0B"
                                : "1px solid #E2E8F0",
                            borderRadius: "8px",
                            padding: "8px",
                            textAlign: "center"
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              marginBottom: "4px"
                            }}
                          >
                            {sz}
                          </div>
                          <input
                            type="number"
                            min={0}
                            value={qty}
                            onChange={(e) =>
                              handleQuickStockUpdate(prod, sz, e.target.value)
                            }
                            style={{ ...ctrlInput, textAlign: "center", padding: "6px" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================== COLLECTIONS & CATS ==================== */}
          {activeNav === "collections" && (
            <div style={{ display: "grid", gap: "18px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <h1 style={pageTitle}>COLLECTIONS & CATEGORIES</h1>
                  <p style={pageSub}>
                    Add or remove which Collections and Categories appear on each
                    storefront page, and manage global banners.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSettings(settings)}
                  style={primaryBlueBtn}
                >
                  <Check size={14} /> Save Collections & Categories
                </button>
              </div>

              {/* 1. PER-PAGE ADD / REMOVE COLLECTIONS & CATEGORIES */}
              <div style={cardBox}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "14px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #E2E8F0"
                  }}
                >
                  <div>
                    <h3 style={{ ...sectionSubTitle, margin: 0 }}>
                      PER-PAGE VISIBILITY: ADD OR REMOVE COLLECTIONS & CATEGORIES
                    </h3>
                    <p style={pageSub}>
                      Select any page below to choose which Collections and Categories are
                      displayed or removed on that page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResetPageAssignments(selectedAssignPage)}
                    style={topActionBtn}
                  >
                    <RefreshCw size={13} /> Reset {selectedAssignPage.toUpperCase()} Defaults
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "16px"
                  }}
                >
                  {STOREFRONT_PAGES.map((pg) => {
                    const active = selectedAssignPage === pg.key;
                    const pgRule =
                      settings.pageAssignments?.[pg.key] ||
                      buildDefaultPageAssignments(availableCategories)[pg.key];
                    const totalShown =
                      (pgRule?.collections?.length || 0) +
                      (pgRule?.categories?.length || 0);
                    return (
                      <button
                        key={pg.key}
                        type="button"
                        onClick={() => setSelectedAssignPage(pg.key)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: active ? "1px solid #2563EB" : "1px solid #CBD5E1",
                          background: active ? "#2563EB" : "#FFFFFF",
                          color: active ? "#FFFFFF" : "#0F172A",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span>{pg.label}</span>
                        <span
                          style={{
                            fontSize: "10.5px",
                            padding: "2px 7px",
                            borderRadius: "999px",
                            background: active ? "rgba(255,255,255,0.22)" : "#F1F5F9",
                            color: active ? "#FFFFFF" : "#475569"
                          }}
                        >
                          {totalShown} active
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "16px"
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      padding: "14px",
                      background: "#F8FAFC"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px"
                      }}
                    >
                      <strong style={{ fontSize: "12px", color: "#0F172A" }}>
                        COLLECTIONS ON {selectedAssignPage.toUpperCase()} PAGE
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>
                        {(currentPageAssignment.collections || []).length} /{" "}
                        {ALL_COLLECTIONS.length} shown
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: "8px" }}>
                      {ALL_COLLECTIONS.map((colKey) => {
                        const isShown = (
                          currentPageAssignment.collections || []
                        ).includes(colKey);
                        return (
                          <div
                            key={colKey}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              background: isShown ? "#FFFFFF" : "#FEF2F2",
                              border: isShown
                                ? "1px solid #E2E8F0"
                                : "1px dashed #FCA5A5"
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: "13px" }}>
                                {colKey.toUpperCase()}
                              </strong>
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: isShown ? "#059669" : "#DC2626"
                                }}
                              >
                                {isShown ? "• Visible on page" : "• Removed from page"}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleTogglePageAssignment(
                                  selectedAssignPage,
                                  "collections",
                                  colKey
                                )
                              }
                              style={
                                isShown
                                  ? {
                                      ...topActionBtn,
                                      color: "#DC2626",
                                      padding: "5px 10px"
                                    }
                                  : { ...primaryBlueBtn, padding: "5px 10px" }
                              }
                            >
                              {isShown ? (
                                <>
                                  <Trash2 size={12} /> Remove
                                </>
                              ) : (
                                <>
                                  <Plus size={12} /> Add
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "10px",
                      padding: "14px",
                      background: "#F8FAFC"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px"
                      }}
                    >
                      <strong style={{ fontSize: "12px", color: "#0F172A" }}>
                        CATEGORIES ON {selectedAssignPage.toUpperCase()} PAGE
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>
                        {(currentPageAssignment.categories || []).length} /{" "}
                        {availableCategories.length} shown
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: "8px" }}>
                      {availableCategories.map((catKey) => {
                        const isShown = (
                          currentPageAssignment.categories || []
                        ).includes(catKey);
                        return (
                          <div
                            key={catKey}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 12px",
                              borderRadius: "8px",
                              background: isShown ? "#FFFFFF" : "#FEF2F2",
                              border: isShown
                                ? "1px solid #E2E8F0"
                                : "1px dashed #FCA5A5"
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: "13px" }}>
                                {catKey.toUpperCase()}
                              </strong>
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: isShown ? "#059669" : "#DC2626"
                                }}
                              >
                                {isShown ? "• Visible on page" : "• Removed from page"}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleTogglePageAssignment(
                                  selectedAssignPage,
                                  "categories",
                                  catKey
                                )
                              }
                              style={
                                isShown
                                  ? {
                                      ...topActionBtn,
                                      color: "#DC2626",
                                      padding: "5px 10px"
                                    }
                                  : { ...primaryBlueBtn, padding: "5px 10px" }
                              }
                            >
                              {isShown ? (
                                <>
                                  <Trash2 size={12} /> Remove
                                </>
                              ) : (
                                <>
                                  <Plus size={12} /> Add
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. GLOBAL COLLECTIONS & CATEGORIES BANNERS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "16px"
                }}
              >
                <div style={cardBox}>
                  <h3 style={sectionSubTitle}>AUDIENCE COLLECTIONS & BANNERS</h3>
                  <div style={{ display: "grid", gap: "14px" }}>
                    {collectionsSummary.map((c) => (
                      <div
                        key={c.key}
                        style={{
                          padding: "12px",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          display: "grid",
                          gap: "8px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <strong>{c.name}</strong>
                          <span style={{ color: "#64748B", fontSize: "12.5px" }}>
                            {c.count} {c.count === 1 ? "style" : "styles"}
                          </span>
                        </div>
                        <DropZoneField
                          label={`${c.name} Hero / Card Image`}
                          uploadKey={`colImg-${c.key}`}
                          uploadingKey={uploading}
                          value={settings.collectionImages?.[c.key] || ""}
                          onUploadFile={uploadMedia}
                          onChange={(url) =>
                            setSettings((prev) => ({
                              ...prev,
                              collectionImages: {
                                ...(prev.collectionImages || {}),
                                [c.key]: url
                              }
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={cardBox}>
                  <h3 style={sectionSubTitle}>FOOTWEAR CATEGORIES & BANNERS</h3>
                  <form
                    onSubmit={handleAddCategory}
                    style={{ display: "flex", gap: "8px", marginBottom: "14px" }}
                  >
                    <input
                      placeholder="New category (e.g. Loafers, Boots, Clogs)"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      style={ctrlInput}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      style={primaryBlueBtn}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </form>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {categoriesSummary.map((c) => (
                      <div
                        key={c.key}
                        style={{
                          padding: "12px",
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          display: "grid",
                          gap: "8px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px"
                          }}
                        >
                          <div>
                            <strong>{c.name}</strong>
                            <span
                              style={{
                                marginLeft: "10px",
                                color: "#64748B",
                                fontSize: "12.5px"
                              }}
                            >
                              {c.count} {c.count === 1 ? "style" : "styles"}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => {
                                const nextName = window.prompt(
                                  `Rename category "${c.name}" to:`,
                                  c.key
                                );
                                if (nextName) handleRenameCategory(c.key, nextName);
                              }}
                              style={{ ...topActionBtn, padding: "5px 9px" }}
                            >
                              Rename
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(c.key)}
                              title={
                                c.count > 0
                                  ? "Reassign products before deleting"
                                  : `Remove ${c.name}`
                              }
                              style={{
                                ...topActionBtn,
                                color: c.count > 0 ? "#94A3B8" : "#DC2626",
                                padding: "5px 9px"
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <DropZoneField
                          label={`${c.name} Category Image`}
                          uploadKey={`catImg-${c.key}`}
                          uploadingKey={uploading}
                          value={settings.categoryImages?.[c.key] || ""}
                          onUploadFile={uploadMedia}
                          onChange={(url) =>
                            setSettings((prev) => ({
                              ...prev,
                              categoryImages: {
                                ...(prev.categoryImages || {}),
                                [c.key]: url
                              }
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== HOMEPAGE CMS BUILDER ==================== */}
          {activeNav === "homepage" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <div>
                  <h1 style={pageTitle}>HOMEPAGE CMS BUILDER</h1>
                  <p style={pageSub}>
                    Edit hero text, CALZARE logo size, colors, fonts, navbar, footer, featured product redirect, and Under ₹999 showcase slides.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => handleSaveHomepage(homepage)}
                    style={primaryBlueBtn}
                  >
                    <Check size={14} /> Publish Homepage CMS
                  </button>
                  <button type="button" onClick={onExit} style={topActionBtn}>
                    <ArrowUpRight size={14} /> View Storefront
                  </button>
                </div>
              </div>

              {/* HERO TEXT & CALZARE LOGO SIZE */}
              <div style={cardBox}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px"
                  }}
                >
                  <h3 style={{ ...sectionSubTitle, margin: 0 }}>
                    HERO SECTION TEXT & CALZARE LOGO SIZE
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSaveHomepage(homepage)}
                    style={primaryBlueBtn}
                  >
                    <Check size={14} /> Save Hero & Logo
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "12px",
                    marginBottom: "12px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Hero Eyebrow</label>
                    <input
                      value={homepage.heroEyebrow || ""}
                      onChange={(e) =>
                        setHomepage({ ...homepage, heroEyebrow: e.target.value })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Hero Title</label>
                    <input
                      value={homepage.heroTitle || ""}
                      onChange={(e) =>
                        setHomepage({ ...homepage, heroTitle: e.target.value })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Hero Italic Emphasis Word</label>
                    <input
                      value={homepage.heroTitleEmphasis || ""}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          heroTitleEmphasis: e.target.value
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>CALZARE Logo Size (px)</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        type="button"
                        aria-label="Decrease CALZARE font size"
                        onClick={() =>
                          setHomepage((prev) => ({
                            ...prev,
                            navbar: {
                              ...(prev.navbar || {}),
                              logoSizePx: Math.max(
                                14,
                                (Number(prev.navbar?.logoSizePx) || 27) - 2
                              )
                            }
                          }))
                        }
                        style={topActionBtn}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={14}
                        max={64}
                        value={homepage.navbar?.logoSizePx ?? 27}
                        onChange={(e) =>
                          setHomepage({
                            ...homepage,
                            navbar: {
                              ...(homepage.navbar || {}),
                              logoSizePx: Number(e.target.value) || 27
                            }
                          })
                        }
                        style={{ ...ctrlInput, textAlign: "center" }}
                      />
                      <button
                        type="button"
                        aria-label="Increase CALZARE font size"
                        onClick={() =>
                          setHomepage((prev) => ({
                            ...prev,
                            navbar: {
                              ...(prev.navbar || {}),
                              logoSizePx: Math.min(
                                64,
                                (Number(prev.navbar?.logoSizePx) || 27) + 2
                              )
                            }
                          }))
                        }
                        style={topActionBtn}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={fieldLabel}>Hero Subtext / Description</label>
                  <textarea
                    rows={2}
                    value={homepage.heroDescription || ""}
                    onChange={(e) =>
                      setHomepage({ ...homepage, heroDescription: e.target.value })
                    }
                    style={ctrlInput}
                  />
                </div>
              </div>

              {/* DEDICATED UNDER ₹999 HOMEPAGE SHOWCASE SLIDES (PHOTO + PRODUCT PAGE URL) */}
              <div style={cardBox}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "12px"
                  }}
                >
                  <div>
                    <h3 style={{ ...sectionSubTitle, margin: 0 }}>
                      UNDER ₹999 HOMEPAGE SHOWCASE SLIDES (PHOTO → PRODUCT PAGE URL)
                    </h3>
                    <p style={pageSub}>
                      Upload a photo and choose a product or product page redirect URL for each slide.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() =>
                        setHomepage((prev) => ({
                          ...prev,
                          affordableStore: {
                            ...(prev.affordableStore || {}),
                            customSlides: [
                              ...(prev.affordableStore?.customSlides || []),
                              {
                                id: `u999-${Date.now().toString().slice(-4)}`,
                                image: "",
                                productId: products[0]?.id || "c-005",
                                redirectUrl: ""
                              }
                            ]
                          }
                        }))
                      }
                      style={topActionBtn}
                    >
                      <Plus size={14} /> Add ₹999 Slide
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveHomepage(homepage)}
                      style={primaryBlueBtn}
                    >
                      <Check size={14} /> Save ₹999 Slides
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: "10px",
                    marginBottom: "14px",
                    paddingBottom: "14px",
                    borderBottom: "1px solid #E2E8F0"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Blue Card Badge</label>
                    <input
                      value={homepage.affordableStore?.badgeLabel || "/999 Store"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          affordableStore: {
                            ...(homepage.affordableStore || {}),
                            badgeLabel: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Blue Card Heading</label>
                    <input
                      value={
                        homepage.affordableStore?.title || "Your day\nfound its footing."
                      }
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          affordableStore: {
                            ...(homepage.affordableStore || {}),
                            title: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Blue Card Subtitle</label>
                    <input
                      value={
                        homepage.affordableStore?.subtitle ||
                        "Everyday Calzare, everyday price.\nStarting ₹999"
                      }
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          affordableStore: {
                            ...(homepage.affordableStore || {}),
                            subtitle: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Explore Button Label</label>
                    <input
                      value={homepage.affordableStore?.ctaLabel || "EXPLORE"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          affordableStore: {
                            ...(homepage.affordableStore || {}),
                            ctaLabel: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                </div>

                {!(homepage.affordableStore?.customSlides || []).length ? (
                  <p style={pageSub}>
                    No custom ₹999 slides added yet. Click <strong>+ Add ₹999 Slide</strong> to add a photo and product page URL.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: "14px" }}>
                    {(homepage.affordableStore?.customSlides || []).map((slide, sIdx) => (
                      <div
                        key={slide.id || sIdx}
                        style={{
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          padding: "14px",
                          background: "#F8FAFC",
                          display: "grid",
                          gap: "10px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <strong style={{ fontSize: "12px", color: "#2563EB" }}>
                            ₹999 HOMEPAGE SLIDE #{sIdx + 1}
                          </strong>
                          <button
                            type="button"
                            onClick={() =>
                              setHomepage((prev) => ({
                                ...prev,
                                affordableStore: {
                                  ...(prev.affordableStore || {}),
                                  customSlides: prev.affordableStore.customSlides.filter(
                                    (_, i) => i !== sIdx
                                  )
                                }
                              }))
                            }
                            style={{ ...topActionBtn, color: "#DC2626", padding: "4px 8px" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "10px"
                          }}
                        >
                          <div>
                            <label style={fieldLabel}>
                              Target Product Page (Redirects on Click)
                            </label>
                            <select
                              value={slide.productId || ""}
                              onChange={(e) =>
                                setHomepage((prev) => ({
                                  ...prev,
                                  affordableStore: {
                                    ...(prev.affordableStore || {}),
                                    customSlides: prev.affordableStore.customSlides.map(
                                      (it, i) =>
                                        i === sIdx
                                          ? { ...it, productId: e.target.value }
                                          : it
                                    )
                                  }
                                }))
                              }
                              style={{ ...ctrlInput, background: "#FFFFFF" }}
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({money(p.price)})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={fieldLabel}>
                              Product Page Redirect URL (Optional)
                            </label>
                            <input
                              placeholder="#product/c-005 or https://..."
                              value={slide.redirectUrl || ""}
                              onChange={(e) =>
                                setHomepage((prev) => ({
                                  ...prev,
                                  affordableStore: {
                                    ...(prev.affordableStore || {}),
                                    customSlides: prev.affordableStore.customSlides.map(
                                      (it, i) =>
                                        i === sIdx
                                          ? { ...it, redirectUrl: e.target.value }
                                          : it
                                    )
                                  }
                                }))
                              }
                              style={{ ...ctrlInput, background: "#FFFFFF" }}
                            />
                          </div>
                        </div>

                        <DropZoneField
                          label="Homepage Slide Photo"
                          uploadKey={`u999SlideImg-${sIdx}`}
                          uploadingKey={uploading}
                          value={slide.image || ""}
                          onUploadFile={uploadMedia}
                          onChange={(url) =>
                            setHomepage((prev) => ({
                              ...prev,
                              affordableStore: {
                                ...(prev.affordableStore || {}),
                                customSlides: prev.affordableStore.customSlides.map(
                                  (it, i) =>
                                    i === sIdx ? { ...it, image: url } : it
                                )
                              }
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={cardBox}>
                <h3 style={sectionSubTitle}>FEATURED PRODUCT / REDIRECT SETUP</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "12px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Featured Title</label>
                    <input
                      value={homepage.featuredProduct?.title || ""}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          featuredProduct: {
                            ...(homepage.featuredProduct || {}),
                            title: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Featured Price (₹)</label>
                    <input
                      type="number"
                      value={homepage.featuredProduct?.price ?? 3499}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          featuredProduct: {
                            ...(homepage.featuredProduct || {}),
                            price: Number(e.target.value)
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Redirect URL (Optional)</label>
                    <input
                      placeholder="#men, #unisex, or https://..."
                      value={homepage.featuredProduct?.redirectUrl || ""}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          featuredProduct: {
                            ...(homepage.featuredProduct || {}),
                            redirectUrl: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <DropZoneField
                    label="Featured Image (Drag & Drop or Upload)"
                    uploadKey="cmsFeat"
                    uploadingKey={uploading}
                    value={homepage.featuredProduct?.image || ""}
                    onUploadFile={uploadMedia}
                    onChange={(url) =>
                      setHomepage((h) => ({
                        ...h,
                        featuredProduct: {
                          ...(h.featuredProduct || {}),
                          image: url
                        }
                      }))
                    }
                  />
                </div>
              </div>

              <div style={cardBox}>
                <h3 style={sectionSubTitle}>PAGE COLORS, FONT & FONT SIZE</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                    gap: "12px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Page Background</label>
                    <input
                      type="color"
                      value={homepage.theme?.pageBgColor || "#F8FAFC"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          theme: {
                            ...(homepage.theme || {}),
                            pageBgColor: e.target.value
                          }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Card / Surface Color</label>
                    <input
                      type="color"
                      value={homepage.theme?.surfaceColor || "#FFFFFF"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          theme: {
                            ...(homepage.theme || {}),
                            surfaceColor: e.target.value
                          }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Text Color</label>
                    <input
                      type="color"
                      value={homepage.theme?.textColor || "#0F172A"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          theme: {
                            ...(homepage.theme || {}),
                            textColor: e.target.value
                          }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Accent Color</label>
                    <input
                      type="color"
                      value={homepage.theme?.accentColor || "#2563EB"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          theme: {
                            ...(homepage.theme || {}),
                            accentColor: e.target.value
                          }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Font Family</label>
                    <select
                      value={homepage.theme?.fontFamily || "Inter, system-ui, sans-serif"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          theme: {
                            ...(homepage.theme || {}),
                            fontFamily: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    >
                      <option value="Inter, system-ui, sans-serif">Inter (Sans)</option>
                      <option value="Georgia, serif">Georgia (Editorial Serif)</option>
                      <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>
                  <div>
                    <label style={fieldLabel}>Base Font Size (px)</label>
                    <input
                      type="number"
                      min={12}
                      max={24}
                      value={homepage.theme?.fontSizePx || 14}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          theme: {
                            ...(homepage.theme || {}),
                            fontSizePx: Number(e.target.value)
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                </div>
              </div>

              <div style={cardBox}>
                <h3 style={sectionSubTitle}>
                  NAVBAR, HERO PHOTO & UNDER ₹999 SECTION IMAGE
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                    marginBottom: "14px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Navbar Background</label>
                    <input
                      type="color"
                      value={homepage.navbar?.bgColor || "#FFFFFF"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          navbar: { ...(homepage.navbar || {}), bgColor: e.target.value }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Navbar Text Color</label>
                    <input
                      type="color"
                      value={homepage.navbar?.textColor || "#0F172A"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          navbar: {
                            ...(homepage.navbar || {}),
                            textColor: e.target.value
                          }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={fieldLabel}>Announcement Bar Text</label>
                    <input
                      value={homepage.navbar?.announcementText || ""}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          navbar: {
                            ...(homepage.navbar || {}),
                            announcementText: e.target.value
                          }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "14px"
                  }}
                >
                  <DropZoneField
                    label="Hero Photo (Homepage Hero)"
                    uploadKey="cmsHero"
                    uploadingKey={uploading}
                    value={homepage.heroImage || ""}
                    onUploadFile={uploadMedia}
                    onChange={(url) =>
                      setHomepage((h) => ({ ...h, heroImage: url }))
                    }
                  />
                  <DropZoneField
                    label="Under ₹999 Section Image"
                    uploadKey="cms999"
                    uploadingKey={uploading}
                    value={homepage.affordableStore?.image || ""}
                    onUploadFile={uploadMedia}
                    onChange={(url) =>
                      setHomepage((h) => ({
                        ...h,
                        affordableStore: {
                          ...(h.affordableStore || {}),
                          image: url
                        }
                      }))
                    }
                  />
                </div>
              </div>

              {/* FOOTER STYLING, LOGO, CONTACT INFO & NAVIGATION COLUMNS */}
              <div style={cardBox}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px"
                  }}
                >
                  <h3 style={{ ...sectionSubTitle, margin: 0 }}>
                    FOOTER STYLING, LOGO, CONTACT INFO & COLUMNS
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSaveHomepage(homepage)}
                    style={primaryBlueBtn}
                  >
                    <Check size={14} /> Save Footer
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 120px 1fr",
                    gap: "12px",
                    marginBottom: "12px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Footer BG</label>
                    <input
                      type="color"
                      value={homepage.footer?.bgColor || "#0F172A"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          footer: { ...(homepage.footer || {}), bgColor: e.target.value }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Footer Text</label>
                    <input
                      type="color"
                      value={homepage.footer?.textColor || "#CBD5E1"}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          footer: {
                            ...(homepage.footer || {}),
                            textColor: e.target.value
                          }
                        })
                      }
                      style={{
                        width: "100%",
                        height: "38px",
                        border: "1px solid #CBD5E1",
                        borderRadius: "8px"
                      }}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Footer Tagline</label>
                    <input
                      value={homepage.footer?.tagline || ""}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          footer: { ...(homepage.footer || {}), tagline: e.target.value }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "12px",
                    marginBottom: "16px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Copyright Notice</label>
                    <input
                      value={homepage.footer?.copyright || ""}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          footer: { ...(homepage.footer || {}), copyright: e.target.value }
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <DropZoneField
                    label="Footer Brand Logo / Badge Image (Optional)"
                    uploadKey="footerLogo"
                    uploadingKey={uploading}
                    value={homepage.footer?.logo || ""}
                    onUploadFile={uploadMedia}
                    onChange={(url) =>
                      setHomepage((h) => ({
                        ...h,
                        footer: { ...(h.footer || {}), logo: url }
                      }))
                    }
                  />
                </div>

                <div
                  style={{
                    borderTop: "1px solid #E2E8F0",
                    paddingTop: "14px",
                    marginBottom: "16px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "10px"
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                      FOOTER CONTACT INFO
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() =>
                          setHomepage((prev) => ({
                            ...prev,
                            footer: {
                              ...(prev.footer || {}),
                              showContact: prev.footer?.showContact === false
                            }
                          }))
                        }
                        style={topActionBtn}
                      >
                        {homepage.footer?.showContact === false ? (
                          <>
                            <Eye size={13} /> Show Contact Block
                          </>
                        ) : (
                          <>
                            <EyeOff size={13} /> Hide Contact Block
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHomepage((prev) => ({
                            ...prev,
                            footer: {
                              ...(prev.footer || {}),
                              showContact: true,
                              contactItems: [
                                ...(prev.footer?.contactItems || []),
                                { type: "Phone", label: "Support", value: "" }
                              ]
                            }
                          }))
                        }
                        style={topActionBtn}
                      >
                        <Plus size={13} /> Add Footer Contact
                      </button>
                      {(homepage.footer?.contactItems || []).length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setHomepage((prev) => ({
                              ...prev,
                              footer: {
                                ...(prev.footer || {}),
                                contactItems: []
                              }
                            }))
                          }
                          style={{ ...topActionBtn, color: "#DC2626" }}
                        >
                          <Trash2 size={13} /> Remove All Contact Info
                        </button>
                      )}
                    </div>
                  </div>

                  {!(homepage.footer?.contactItems || []).length ? (
                    <p style={{ ...pageSub, marginBottom: "8px" }}>
                      No contact info in footer. Click "+ Add Footer Contact" to add an
                      email, phone, WhatsApp, or address.
                    </p>
                  ) : (
                    (homepage.footer?.contactItems || []).map((cItem, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "120px 1fr 1.5fr auto",
                          gap: "8px",
                          marginBottom: "8px"
                        }}
                      >
                        <select
                          value={cItem.type || "Email"}
                          onChange={(e) =>
                            setHomepage((prev) => ({
                              ...prev,
                              footer: {
                                ...(prev.footer || {}),
                                contactItems: prev.footer.contactItems.map((it, i) =>
                                  i === cIdx ? { ...it, type: e.target.value } : it
                                )
                              }
                            }))
                          }
                          style={ctrlInput}
                        >
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Address">Address</option>
                          <option value="Hours">Hours</option>
                        </select>
                        <input
                          placeholder="Label (e.g. Support)"
                          value={cItem.label || ""}
                          onChange={(e) =>
                            setHomepage((prev) => ({
                              ...prev,
                              footer: {
                                ...(prev.footer || {}),
                                contactItems: prev.footer.contactItems.map((it, i) =>
                                  i === cIdx ? { ...it, label: e.target.value } : it
                                )
                              }
                            }))
                          }
                          style={ctrlInput}
                        />
                        <input
                          placeholder="Email, Phone, or Address"
                          value={cItem.value || ""}
                          onChange={(e) =>
                            setHomepage((prev) => ({
                              ...prev,
                              footer: {
                                ...(prev.footer || {}),
                                contactItems: prev.footer.contactItems.map((it, i) =>
                                  i === cIdx ? { ...it, value: e.target.value } : it
                                )
                              }
                            }))
                          }
                          style={ctrlInput}
                        />
                        <button
                          type="button"
                          title="Remove Contact Entry"
                          onClick={() =>
                            setHomepage((prev) => ({
                              ...prev,
                              footer: {
                                ...(prev.footer || {}),
                                contactItems: prev.footer.contactItems.filter(
                                  (_, i) => i !== cIdx
                                )
                              }
                            }))
                          }
                          style={{
                            ...topActionBtn,
                            color: "#DC2626",
                            padding: "6px 9px"
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "14px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px"
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                      FOOTER LINK COLUMNS
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setHomepage({
                          ...homepage,
                          footer: {
                            ...(homepage.footer || {}),
                            columns: [
                              ...(homepage.footer?.columns || []),
                              {
                                title: "New Column",
                                links: [{ label: "New Link", url: "#shop" }]
                              }
                            ]
                          }
                        })
                      }
                      style={topActionBtn}
                    >
                      <Plus size={13} /> Add Column
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "12px"
                    }}
                  >
                    {(homepage.footer?.columns || []).map((col, colIdx) => (
                      <div
                        key={colIdx}
                        style={{
                          border: "1px solid #E2E8F0",
                          borderRadius: "10px",
                          padding: "12px",
                          background: "#F8FAFC"
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                          <input
                            placeholder="Column Title (e.g. Shop)"
                            value={col.title || ""}
                            onChange={(e) =>
                              setHomepage({
                                ...homepage,
                                footer: {
                                  ...(homepage.footer || {}),
                                  columns: homepage.footer.columns.map((c, i) =>
                                    i === colIdx ? { ...c, title: e.target.value } : c
                                  )
                                }
                              })
                            }
                            style={{ ...ctrlInput, fontWeight: 700, background: "#FFFFFF" }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setHomepage({
                                ...homepage,
                                footer: {
                                  ...(homepage.footer || {}),
                                  columns: homepage.footer.columns.filter(
                                    (_, i) => i !== colIdx
                                  )
                                }
                              })
                            }
                            title="Delete Column"
                            style={{
                              ...topActionBtn,
                              color: "#DC2626",
                              padding: "6px 9px"
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {(col.links || []).map((lnk, lnkIdx) => (
                          <div
                            key={lnkIdx}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr auto",
                              gap: "6px",
                              marginBottom: "6px"
                            }}
                          >
                            <input
                              placeholder="Label"
                              value={lnk.label || ""}
                              onChange={(e) =>
                                setHomepage({
                                  ...homepage,
                                  footer: {
                                    ...(homepage.footer || {}),
                                    columns: homepage.footer.columns.map((c, i) =>
                                      i === colIdx
                                        ? {
                                            ...c,
                                            links: c.links.map((l, j) =>
                                              j === lnkIdx
                                                ? { ...l, label: e.target.value }
                                                : l
                                            )
                                          }
                                        : c
                                    )
                                  }
                                })
                              }
                              style={{
                                ...ctrlInput,
                                padding: "6px 8px",
                                background: "#FFFFFF"
                              }}
                            />
                            <input
                              placeholder="URL (#shop or /pages/...)"
                              value={lnk.url || ""}
                              onChange={(e) =>
                                setHomepage({
                                  ...homepage,
                                  footer: {
                                    ...(homepage.footer || {}),
                                    columns: homepage.footer.columns.map((c, i) =>
                                      i === colIdx
                                        ? {
                                            ...c,
                                            links: c.links.map((l, j) =>
                                              j === lnkIdx
                                                ? { ...l, url: e.target.value }
                                                : l
                                            )
                                          }
                                        : c
                                    )
                                  }
                                })
                              }
                              style={{
                                ...ctrlInput,
                                padding: "6px 8px",
                                background: "#FFFFFF"
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setHomepage({
                                  ...homepage,
                                  footer: {
                                    ...(homepage.footer || {}),
                                    columns: homepage.footer.columns.map((c, i) =>
                                      i === colIdx
                                        ? {
                                            ...c,
                                            links: c.links.filter((_, j) => j !== lnkIdx)
                                          }
                                        : c
                                    )
                                  }
                                })
                              }
                              style={{
                                ...topActionBtn,
                                color: "#DC2626",
                                padding: "5px 7px"
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            setHomepage({
                              ...homepage,
                              footer: {
                                ...(homepage.footer || {}),
                                columns: homepage.footer.columns.map((c, i) =>
                                  i === colIdx
                                    ? {
                                        ...c,
                                        links: [
                                          ...(c.links || []),
                                          { label: "Link", url: "#" }
                                        ]
                                      }
                                    : c
                                )
                              }
                            })
                          }
                          style={{ ...linkBtn, marginTop: "4px" }}
                        >
                          + Add Link
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {(homepage.sections || []).map((sec, idx) => (
                <div
                  key={sec.key}
                  style={{
                    ...cardBox,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const next = [...homepage.sections];
                          [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                          handleSaveHomepage({ ...homepage, sections: next });
                        }}
                        style={miniIconBtn}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === homepage.sections.length - 1}
                        onClick={() => {
                          const next = [...homepage.sections];
                          [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                          handleSaveHomepage({ ...homepage, sections: next });
                        }}
                        style={miniIconBtn}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#64748B",
                          letterSpacing: "1px"
                        }}
                      >
                        {sec.label}
                      </span>
                      <strong style={{ display: "block", fontSize: "14px" }}>
                        {sec.title}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                        Key: {sec.key} • Layout: {sec.layout}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveHomepage({
                          ...homepage,
                          sections: homepage.sections.map((s) =>
                            s.key === sec.key ? { ...s, visible: !s.visible } : s
                          )
                        })
                      }
                      style={{
                        padding: "6px 12px",
                        borderRadius: "99px",
                        border: "1px solid #E2E8F0",
                        background: sec.visible ? "#ECFDF5" : "#F1F5F9",
                        color: sec.visible ? "#059669" : "#64748B",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      {sec.visible ? (
                        <>
                          <Eye size={13} /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} /> Hidden
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(sec)}
                      style={primaryBlueBtn}
                    >
                      Edit Section
                    </button>
                  </div>
                </div>
              ))}

              {editingSection && (
                <div style={modalOverlay} onClick={() => setEditingSection(null)}>
                  <div style={modalCard} onClick={(e) => e.stopPropagation()}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "14px"
                      }}
                    >
                      <h3 style={{ margin: 0 }}>
                        Configure Section: {editingSection.key}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingSection(null)}
                        style={{
                          background: "none",
                          border: 0,
                          cursor: "pointer"
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div>
                        <label style={fieldLabel}>Section Heading / Title</label>
                        <input
                          value={editingSection.title}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              title: e.target.value
                            })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <DropZoneField
                        label="Section Image (Drag & Drop or Upload)"
                        uploadKey="secImg"
                        uploadingKey={uploading}
                        value={
                          editingSection.key === "affordable_store"
                            ? homepage.affordableStore?.image ||
                              editingSection.image ||
                              ""
                            : editingSection.image || ""
                        }
                        onUploadFile={uploadMedia}
                        onChange={(val) => {
                          setEditingSection((s) => ({ ...s, image: val }));
                          if (editingSection.key === "affordable_store") {
                            setHomepage((h) => ({
                              ...h,
                              affordableStore: {
                                ...(h.affordableStore || {}),
                                image: val
                              }
                            }));
                          }
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "10px",
                          marginTop: "8px"
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setEditingSection(null)}
                          style={topActionBtn}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSaveHomepage({
                              ...homepage,
                              sections: homepage.sections.map((s) =>
                                s.key === editingSection.key ? editingSection : s
                              )
                            })
                          }
                          style={primaryBlueBtn}
                        >
                          Publish Section
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== SHOPPABLE REELS ==================== */}
          {activeNav === "reels" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <div>
                  <h1 style={pageTitle}>SHOPPABLE REELS MANAGER</h1>
                  <p style={pageSub}>
                    Upload vertical fit & motion reels linked directly to products, or toggle reels on/off.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextEnabled = homepage.reelsEnabled === false ? true : false;
                    handleSaveHomepage({
                      ...homepage,
                      reelsEnabled: nextEnabled
                    });
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "999px",
                    border: "1px solid #CBD5E1",
                    background: homepage.reelsEnabled === false ? "#F1F5F9" : "#ECFDF5",
                    color: homepage.reelsEnabled === false ? "#475569" : "#059669",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {homepage.reelsEnabled === false ? (
                    <>
                      <EyeOff size={14} /> Reels Disabled
                    </>
                  ) : (
                    <>
                      <Eye size={14} /> Reels Enabled
                    </>
                  )}
                </button>
              </div>
              <form onSubmit={handleSaveReel} style={cardBox}>
                <h3 style={sectionSubTitle}>ADD / UPDATE REEL</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Reel Title *</label>
                    <input
                      required
                      placeholder="e.g. Morning Commute in Forma Court"
                      value={reelForm.title}
                      onChange={(e) =>
                        setReelForm({ ...reelForm, title: e.target.value })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Tag Pill</label>
                    <input
                      value={reelForm.tag}
                      onChange={(e) => setReelForm({ ...reelForm, tag: e.target.value })}
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Linked Product</label>
                    <select
                      value={reelForm.productId}
                      onChange={(e) =>
                        setReelForm({ ...reelForm, productId: e.target.value })
                      }
                      style={ctrlInput}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px"
                  }}
                >
                  <DropZoneField
                    label="Video MP4 (Drag & Drop or Upload)"
                    uploadKey="reelVid"
                    uploadingKey={uploading}
                    accept="video/mp4,video/webm"
                    value={reelForm.videoUrl}
                    onUploadFile={uploadMedia}
                    onChange={(u) => setReelForm((r) => ({ ...r, videoUrl: u }))}
                  />
                  <DropZoneField
                    label="Cover Poster Image (Drag & Drop or Upload)"
                    uploadKey="reelImg"
                    uploadingKey={uploading}
                    value={reelForm.poster}
                    onUploadFile={uploadMedia}
                    onChange={(u) => setReelForm((r) => ({ ...r, poster: u }))}
                  />
                </div>
                <button type="submit" style={primaryBlueBtn}>
                  <Plus size={14} /> Publish Shoppable Reel
                </button>
              </form>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "16px"
                }}
              >
                {reels.map((r) => (
                  <div key={r.id} style={cardBox}>
                    <img
                      src={r.poster || FALLBACK_IMG}
                      alt={r.title}
                      onError={handleImgError}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "8px"
                      }}
                    />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#2563EB"
                      }}
                    >
                      {r.tag}
                    </span>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "13.5px",
                        margin: "4px 0 8px"
                      }}
                    >
                      {r.title}
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleDeleteReel(r.id)}
                      style={{
                        ...topActionBtn,
                        color: "#DC2626",
                        width: "100%",
                        justifyContent: "center"
                      }}
                    >
                      <Trash2 size={13} /> Delete Reel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== OUR STORY MANAGER ==================== */}
          {activeNav === "story" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div>
                  <h1 style={pageTitle}>OUR STORY MANAGER</h1>
                  <p style={pageSub}>
                    Edit brand philosophy blocks, editorial storytelling copy, and section
                    photography.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        storySections: [
                          ...(prev.storySections || []),
                          { eyebrow: "", heading: "", body: "", image: "" }
                        ]
                      }))
                    }
                    style={topActionBtn}
                  >
                    <Plus size={14} /> Add Story Section
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSettings(settings)}
                    style={primaryBlueBtn}
                  >
                    <Check size={14} /> Save Story
                  </button>
                </div>
              </div>
              {(settings.storySections || []).map((st, idx) => (
                <div key={idx} style={cardBox}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px"
                    }}
                  >
                    <strong style={{ fontSize: "12px", color: "#475569" }}>
                      STORY SECTION #{idx + 1}
                    </strong>
                    {(settings.storySections || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            storySections: prev.storySections.filter((_, i) => i !== idx)
                          }))
                        }
                        style={{ ...topActionBtn, color: "#DC2626", padding: "4px 8px" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <input
                      placeholder="Eyebrow"
                      value={st.eyebrow || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storySections: settings.storySections.map((s, i) =>
                            i === idx ? { ...s, eyebrow: e.target.value } : s
                          )
                        })
                      }
                      style={ctrlInput}
                    />
                    <input
                      placeholder="Heading"
                      value={st.heading || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storySections: settings.storySections.map((s, i) =>
                            i === idx ? { ...s, heading: e.target.value } : s
                          )
                        })
                      }
                      style={ctrlInput}
                    />
                    <textarea
                      rows={4}
                      placeholder="Story Body"
                      value={st.body || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          storySections: settings.storySections.map((s, i) =>
                            i === idx ? { ...s, body: e.target.value } : s
                          )
                        })
                      }
                      style={ctrlInput}
                    />
                    <DropZoneField
                      label="Story Editorial Photograph"
                      uploadKey={`storyImg-${idx}`}
                      uploadingKey={uploading}
                      value={st.image || ""}
                      onUploadFile={uploadMedia}
                      onChange={(url) =>
                        setSettings((prev) => ({
                          ...prev,
                          storySections: prev.storySections.map((s, i) =>
                            i === idx ? { ...s, image: url } : s
                          )
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== PAGES & POLICIES ==================== */}
          {activeNav === "pages" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div>
                  <h1 style={pageTitle}>CMS PAGES & BRAND POLICIES</h1>
                  <p style={pageSub}>Edit store policies or create custom pages.</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => {
                      const nextPolicies = settings.policies || DEFAULT_STORE_POLICIES;
                      writeLocalPolicies(nextPolicies);
                      handleSaveSettings(
                        { ...settings, policies: nextPolicies },
                        "Store policies saved."
                      );
                    }}
                    style={primaryBlueBtn}
                  >
                    <Check size={14} /> Save Policies
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageModal(true)}
                    style={topActionBtn}
                  >
                    <Plus size={14} /> Create Page
                  </button>
                </div>
              </div>

              <div style={cardBox}>
                <h3 style={sectionSubTitle}>
                  STORE POLICIES (SHIPPING, EXCHANGE, REFUND, PRIVACY, TERMS)
                </h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  {(settings.policies || DEFAULT_STORE_POLICIES).map((pol, idx) => (
                    <div
                      key={pol.key || idx}
                      style={{
                        border: "1px solid #E2E8F0",
                        borderRadius: "10px",
                        padding: "12px",
                        background: "#F8FAFC",
                        display: "grid",
                        gap: "8px"
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 180px",
                          gap: "8px"
                        }}
                      >
                        <input
                          placeholder="Policy Title"
                          value={pol.title || ""}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              policies: (prev.policies || DEFAULT_STORE_POLICIES).map(
                                (item, i) =>
                                  i === idx ? { ...item, title: e.target.value } : item
                              )
                            }))
                          }
                          style={{ ...ctrlInput, background: "#FFFFFF" }}
                        />
                        <input
                          placeholder="Updated Date"
                          value={pol.updatedAt || ""}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              policies: (prev.policies || DEFAULT_STORE_POLICIES).map(
                                (item, i) =>
                                  i === idx
                                    ? { ...item, updatedAt: e.target.value }
                                    : item
                              )
                            }))
                          }
                          style={{ ...ctrlInput, background: "#FFFFFF" }}
                        />
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Policy content..."
                        value={pol.content || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            policies: (prev.policies || DEFAULT_STORE_POLICIES).map(
                              (item, i) =>
                                i === idx ? { ...item, content: e.target.value } : item
                            )
                          }))
                        }
                        style={{ ...ctrlInput, background: "#FFFFFF" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={cardBox}>
                <h3 style={sectionSubTitle}>CUSTOM CMS PAGES</h3>
                {!pages.length && <p style={pageSub}>No custom pages created yet.</p>}
                {pages.map((pg) => (
                  <div
                    key={pg._id || pg.slug}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #E2E8F0"
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      {pg.image && (
                        <img
                          src={pg.image}
                          alt={pg.title}
                          onError={handleImgError}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "6px",
                            objectFit: "cover"
                          }}
                        />
                      )}
                      <div>
                        <strong>{pg.title}</strong>
                        <div style={{ fontSize: "11.5px", color: "#2563EB" }}>
                          {pg.slug} •{" "}
                          <span style={{ color: "#64748B" }}>{pg.category}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch(`${API}/admin/pages/${pg._id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        syncAll();
                        broadcastSync();
                      }}
                      style={{ ...topActionBtn, color: "#DC2626" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              {pageModal && (
                <div style={modalOverlay} onClick={() => setPageModal(false)}>
                  <form
                    onSubmit={handleSavePage}
                    style={modalCard}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 style={{ marginTop: 0 }}>Create New CMS Page</h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      <input
                        required
                        placeholder="Page Title"
                        value={pageForm.title}
                        onChange={(e) =>
                          setPageForm({ ...pageForm, title: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <input
                        placeholder="URL Slug (e.g. /pages/returns)"
                        value={pageForm.slug}
                        onChange={(e) =>
                          setPageForm({ ...pageForm, slug: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <DropZoneField
                        label="Page Header Image (Drag & Drop or Upload)"
                        uploadKey="pgImg"
                        uploadingKey={uploading}
                        value={pageForm.image || ""}
                        onUploadFile={uploadMedia}
                        onChange={(url) =>
                          setPageForm((p) => ({ ...p, image: url }))
                        }
                      />
                      <textarea
                        rows={4}
                        required
                        placeholder="Write policy or page content..."
                        value={pageForm.content}
                        onChange={(e) =>
                          setPageForm({ ...pageForm, content: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <button type="submit" style={primaryBlueBtn}>
                        Save Page
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== CUSTOMER REVIEWS ==================== */}
          {activeNav === "reviews" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h1 style={pageTitle}>CUSTOMER REVIEWS</h1>
                  <p style={pageSub}>
                    Approve, feature, or add verified customer reviews.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewModal(true)}
                  style={primaryBlueBtn}
                >
                  <Plus size={14} /> Add Review
                </button>
              </div>
              <div style={cardBox}>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  {["all", "approved", "pending"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setReviewFilter(f)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        background: reviewFilter === f ? "#0F172A" : "#fff",
                        color: reviewFilter === f ? "#fff" : "#334155",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
                {!filteredReviews.length && (
                  <p style={pageSub}>No reviews in this view.</p>
                )}
                {filteredReviews.map((rev) => (
                  <div
                    key={rev._id || rev.id}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #E2E8F0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <strong>{rev.customerName}</strong> •{" "}
                      <span style={{ color: "#F59E0B" }}>
                        {"★".repeat(rev.rating || 5)}
                      </span>{" "}
                      •{" "}
                      <span style={{ fontSize: "12px", color: "#64748B" }}>
                        {rev.productName}
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "13px" }}>{rev.comment}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {rev.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleReviewAction(rev._id || rev.id, { status: "approved" })
                          }
                          style={primaryBlueBtn}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev._id || rev.id)}
                        style={{ ...topActionBtn, color: "#DC2626" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {reviewModal && (
                <div style={modalOverlay} onClick={() => setReviewModal(false)}>
                  <form
                    onSubmit={handleSaveReview}
                    style={modalCard}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 style={{ marginTop: 0 }}>Add Customer Review</h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      <select
                        value={reviewForm.productId}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, productId: e.target.value })
                        }
                        style={ctrlInput}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        required
                        placeholder="Customer Name"
                        value={reviewForm.customerName}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, customerName: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <input
                        required
                        placeholder="Headline (e.g. Most comfortable daily pair)"
                        value={reviewForm.headline}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, headline: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, rating: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <textarea
                        required
                        rows={3}
                        placeholder="Review comment"
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({ ...reviewForm, comment: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <DropZoneField
                        label="Customer Photo (Optional)"
                        uploadKey="revImg"
                        uploadingKey={uploading}
                        value={reviewForm.photoUrl || ""}
                        onUploadFile={uploadMedia}
                        onChange={(url) =>
                          setReviewForm((r) => ({ ...r, photoUrl: url }))
                        }
                      />
                      <button type="submit" style={primaryBlueBtn}>
                        Save Review
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== COUPONS & PROMOS ==================== */}
          {activeNav === "coupons" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h1 style={pageTitle}>COUPONS & PROMOS</h1>
                  <p style={pageSub}>
                    Manage discount codes and cart promotional rules.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCouponModal(true)}
                  style={primaryBlueBtn}
                >
                  <Plus size={14} /> Create Coupon
                </button>
              </div>
              <div style={cardBox}>
                {!coupons.length && <p style={pageSub}>No active coupon codes yet.</p>}
                {coupons.map((cp) => (
                  <div
                    key={cp._id || cp.code}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #E2E8F0"
                    }}
                  >
                    <div>
                      <strong>{cp.code}</strong> —{" "}
                      <span>
                        {cp.discountType === "percentage"
                          ? `${cp.discountValue}% OFF`
                          : `${money(cp.discountValue)} OFF`}
                      </span>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>
                        Min order: {money(cp.minOrderValue)} • {cp.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(cp._id || cp.code)}
                      style={{ ...topActionBtn, color: "#DC2626" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              {couponModal && (
                <div style={modalOverlay} onClick={() => setCouponModal(false)}>
                  <form
                    onSubmit={handleSaveCoupon}
                    style={modalCard}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 style={{ marginTop: 0 }}>Create Promo Code</h3>
                    <div style={{ display: "grid", gap: "10px" }}>
                      <input
                        required
                        placeholder="CODE (e.g. CALZARE15)"
                        value={couponForm.code}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, code: e.target.value })
                        }
                        style={ctrlInput}
                      />
                      <input
                        placeholder="Description"
                        value={couponForm.description}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            description: e.target.value
                          })
                        }
                        style={ctrlInput}
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "10px"
                        }}
                      >
                        <select
                          value={couponForm.discountType}
                          onChange={(e) =>
                            setCouponForm({
                              ...couponForm,
                              discountType: e.target.value
                            })
                          }
                          style={ctrlInput}
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Amount (₹)</option>
                        </select>
                        <input
                          type="number"
                          required
                          placeholder="Discount Value"
                          value={couponForm.discountValue}
                          onChange={(e) =>
                            setCouponForm({
                              ...couponForm,
                              discountValue: e.target.value
                            })
                          }
                          style={ctrlInput}
                        />
                      </div>
                      <input
                        type="number"
                        placeholder="Minimum Order Value (₹)"
                        value={couponForm.minOrderValue}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            minOrderValue: e.target.value
                          })
                        }
                        style={ctrlInput}
                      />
                      <button type="submit" style={primaryBlueBtn}>
                        Activate Coupon
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== CUSTOMER DIRECTORY ==================== */}
          {activeNav === "customers" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <h1 style={pageTitle}>CUSTOMER DIRECTORY & SUBSCRIBERS</h1>
                <p style={pageSub}>Registered accounts and newsletter sign-ups.</p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px"
                }}
              >
                <div style={cardBox}>
                  <h3 style={sectionSubTitle}>
                    REGISTERED ACCOUNTS ({users.length})
                  </h3>
                  {!users.length && (
                    <p style={pageSub}>No registered customers yet.</p>
                  )}
                  {users.map((u, i) => (
                    <div
                      key={u._id || u.email || i}
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #E2E8F0"
                      }}
                    >
                      <strong>{u.name}</strong>{" "}
                      {u.role === "admin" && (
                        <span
                          style={{
                            fontSize: "10px",
                            background: "#DBEAFE",
                            color: "#1D4ED8",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: 700
                          }}
                        >
                          ADMIN
                        </span>
                      )}
                      <div style={{ fontSize: "12px", color: "#64748B" }}>
                        {u.email} {u.phone ? `• ${u.phone}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={cardBox}>
                  <h3 style={sectionSubTitle}>
                    NEWSLETTER SUBSCRIBERS ({subscribers.length})
                  </h3>
                  {!subscribers.length && (
                    <p style={pageSub}>No newsletter subscribers yet.</p>
                  )}
                  {subscribers.map((s, i) => (
                    <div
                      key={s._id || s.email || i}
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #E2E8F0",
                        fontSize: "13px"
                      }}
                    >
                      {typeof s === "string" ? s : s.email}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== NAVIGATION MENUS ==================== */}
          {activeNav === "navigation" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h1 style={pageTitle}>NAVIGATION MENUS</h1>
                  <p style={pageSub}>
                    Manage storefront header links and destinations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSettings(settings)}
                  style={primaryBlueBtn}
                >
                  <Check size={14} /> Save Navigation
                </button>
              </div>
              <div style={cardBox}>
                {(settings.navigation || []).map((navItem, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr auto",
                      gap: "10px",
                      marginBottom: "10px"
                    }}
                  >
                    <input
                      value={navItem.label}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          navigation: settings.navigation.map((n, i) =>
                            i === idx ? { ...n, label: e.target.value } : n
                          )
                        })
                      }
                      style={ctrlInput}
                    />
                    <input
                      value={navItem.url}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          navigation: settings.navigation.map((n, i) =>
                            i === idx ? { ...n, url: e.target.value } : n
                          )
                        })
                      }
                      style={ctrlInput}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          navigation: settings.navigation.filter((_, i) => i !== idx)
                        })
                      }
                      style={{ ...topActionBtn, color: "#DC2626" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      navigation: [
                        ...(settings.navigation || []),
                        { label: "NEW LINK", url: "#shop" }
                      ]
                    })
                  }
                  style={topActionBtn}
                >
                  <Plus size={14} /> Add Menu Item
                </button>
              </div>
            </div>
          )}

          {/* ==================== SETTINGS & SECURITY ==================== */}
          {activeNav === "settings" && (
            <div style={{ display: "grid", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h1 style={pageTitle}>SETTINGS & SECURITY</h1>
                  <p style={pageSub}>
                    Configure store details, payment methods, contact info, and shipping thresholds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSettings(settings)}
                  style={primaryBlueBtn}
                >
                  <Check size={14} /> Save Settings
                </button>
              </div>

              <div style={cardBox}>
                <h3 style={sectionSubTitle}>STORE & SHIPPING SETTINGS</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "16px"
                  }}
                >
                  <div>
                    <label style={fieldLabel}>Store Name</label>
                    <input
                      value={settings.storeName || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, storeName: e.target.value })
                      }
                      style={ctrlInput}
                    />
                  </div>
                  <div>
                    <label style={fieldLabel}>Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold ?? 2999}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          freeShippingThreshold: Number(e.target.value)
                        })
                      }
                      style={ctrlInput}
                    />
                  </div>
                </div>

                {/* PAYMENT METHODS (ADD & REMOVE) */}
                <div
                  style={{
                    borderTop: "1px solid #E2E8F0",
                    paddingTop: "14px",
                    marginBottom: "16px"
                  }}
                >
                  <h3 style={sectionSubTitle}>PAYMENT METHODS (ADD / REMOVE)</h3>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                    <input
                      placeholder="New payment method (e.g. UPI / Cards / NetBanking)"
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      style={ctrlInput}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const clean = newPaymentMethod.trim();
                        if (!clean) return;
                        if (!activePaymentMethods.includes(clean)) {
                          setSettings((prev) => ({
                            ...prev,
                            paymentMethods: [...activePaymentMethods, clean]
                          }));
                        }
                        setNewPaymentMethod("");
                      }}
                      style={primaryBlueBtn}
                    >
                      <Plus size={14} /> Add Payment Method
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "8px" }}>
                    {activePaymentMethods.map((pm, idx) => (
                      <div
                        key={`${pm}-${idx}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #E2E8F0",
                          background: "#F8FAFC",
                          fontSize: "13px"
                        }}
                      >
                        <span>{pm}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              paymentMethods: activePaymentMethods.filter(
                                (_, i) => i !== idx
                              )
                            }))
                          }
                          style={{ ...topActionBtn, color: "#DC2626", padding: "5px 9px" }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STORE CONTACT INFORMATION (ADD & REMOVE) */}
                <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "14px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "10px"
                    }}
                  >
                    <h3 style={{ ...sectionSubTitle, margin: 0 }}>
                      STORE CONTACT INFORMATION
                    </h3>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            contactItems: [
                              ...(prev.contactItems || []),
                              { type: "Phone", label: "Support", value: "" }
                            ]
                          }))
                        }
                        style={topActionBtn}
                      >
                        <Plus size={14} /> Add Contact Info
                      </button>
                      {(settings.contactItems || []).length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              contactItems: [],
                              supportEmail: "",
                              supportPhone: ""
                            }))
                          }
                          style={{ ...topActionBtn, color: "#DC2626" }}
                        >
                          <Trash2 size={14} /> Remove All
                        </button>
                      )}
                    </div>
                  </div>

                  {!(settings.contactItems || []).length && (
                    <p style={{ ...pageSub, marginBottom: "10px" }}>
                      No contact info listed. Click "+ Add Contact Info" to add an email,
                      phone, WhatsApp, or address.
                    </p>
                  )}

                  {(settings.contactItems || []).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "130px 1fr 1.5fr auto",
                        gap: "8px",
                        marginBottom: "8px",
                        alignItems: "center"
                      }}
                    >
                      <select
                        value={item.type || "Phone"}
                        onChange={(e) =>
                          setSettings((prev) => {
                            const next = prev.contactItems.map((c, i) =>
                              i === idx ? { ...c, type: e.target.value } : c
                            );
                            return {
                              ...prev,
                              contactItems: next,
                              supportEmail:
                                next.find((c) => c.type === "Email")?.value || "",
                              supportPhone:
                                next.find((c) => c.type === "Phone")?.value || ""
                            };
                          })
                        }
                        style={ctrlInput}
                      >
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Address">Address</option>
                        <option value="Hours">Support Hours</option>
                      </select>

                      <input
                        placeholder="Label (e.g. Sales, Returns, HQ)"
                        value={item.label || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            contactItems: prev.contactItems.map((c, i) =>
                              i === idx ? { ...c, label: e.target.value } : c
                            )
                          }))
                        }
                        style={ctrlInput}
                      />

                      <input
                        placeholder="Value (e.g. +91 98765 43210 or care@calzare.in)"
                        value={item.value || ""}
                        onChange={(e) =>
                          setSettings((prev) => {
                            const next = prev.contactItems.map((c, i) =>
                              i === idx ? { ...c, value: e.target.value } : c
                            );
                            return {
                              ...prev,
                              contactItems: next,
                              supportEmail:
                                next.find((c) => c.type === "Email")?.value || "",
                              supportPhone:
                                next.find((c) => c.type === "Phone")?.value || ""
                            };
                          })
                        }
                        style={ctrlInput}
                      />

                      <button
                        type="button"
                        title="Remove Contact Info"
                        onClick={() =>
                          setSettings((prev) => {
                            const next = prev.contactItems.filter((_, i) => i !== idx);
                            return {
                              ...prev,
                              contactItems: next,
                              supportEmail:
                                next.find((c) => c.type === "Email")?.value || "",
                              supportPhone:
                                next.find((c) => c.type === "Phone")?.value || ""
                            };
                          })
                        }
                        style={{
                          ...topActionBtn,
                          color: "#DC2626",
                          padding: "8px 10px"
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {auditLogs.length > 0 && (
                <div style={cardBox}>
                  <h3 style={sectionSubTitle}>SECURITY AUDIT LOGS</h3>
                  {auditLogs.slice(0, 10).map((log, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #F1F5F9",
                        fontSize: "12px"
                      }}
                    >
                      <strong>{log.action || "Update"}</strong> —{" "}
                      {log.target || log.detail || JSON.stringify(log)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const pageTitle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: 800,
  letterSpacing: "0.3px",
  color: "#0F172A"
};
const pageSub = { margin: "4px 0 0", fontSize: "12.5px", color: "#64748B" };
const sectionSubTitle = {
  margin: "0 0 12px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "1px",
  color: "#475569"
};
const fieldLabel = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "4px"
};
const cardBox = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  padding: "18px"
};
const ctrlInput = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  fontSize: "13px",
  boxSizing: "border-box",
  fontFamily: "inherit"
};
const primaryBlueBtn = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: 0,
  borderRadius: "8px",
  padding: "9px 14px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px"
};
const topActionBtn = {
  background: "#FFFFFF",
  color: "#0F172A",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  padding: "7px 12px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px"
};
const linkBtn = {
  background: "none",
  border: 0,
  color: "#2563EB",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  padding: 0
};
const miniIconBtn = {
  background: "#F1F5F9",
  border: "1px solid #E2E8F0",
  borderRadius: "4px",
  padding: "2px 4px",
  cursor: "pointer"
};
const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)",
  display: "grid",
  placeItems: "center",
  padding: "20px",
  zIndex: 50
};
const modalCard = {
  background: "#FFFFFF",
  borderRadius: "14px",
  padding: "24px",
  width: "100%",
  maxWidth: "520px",
  maxHeight: "90vh",
  overflowY: "auto"
};