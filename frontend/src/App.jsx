import { useEffect, useMemo, useState } from "react";
import AdminPanel from "./AdminPanel.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import PolicyPage from "./pages/PolicyPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
import Header from "./components/Header.jsx";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Play,
  RefreshCw,
  ShieldCheck,
  Truck,
  Volume2,
  VolumeX,
  X
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5003/api";
const HOMEPAGE_STORAGE_KEY = "calzare_homepage_v1";
const PAGE_ASSIGNMENTS_STORAGE_KEY = "calzare_page_assignments";

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

const BROKEN_IMAGE_IDS = [
  "photo-1614252369475-531506b0b9e9",
  "photo-1520256862855-9981c41d8ba0"
];

const VALID_COLLECTIONS = ["men", "women", "unisex", "kids"];

const DEFAULT_PAGE_ASSIGNMENTS = {
  home: { collections: [...VALID_COLLECTIONS], categories: ["sneakers", "formal", "slides"] },
  men: { collections: ["men", "unisex"], categories: ["sneakers", "formal", "slides"] },
  women: { collections: ["women", "unisex"], categories: ["sneakers", "formal", "slides"] },
  unisex: { collections: ["unisex"], categories: ["sneakers", "formal", "slides"] },
  kids: { collections: ["kids"], categories: ["sneakers", "formal", "slides"] },
  shop: { collections: [...VALID_COLLECTIONS], categories: ["sneakers", "formal", "slides"] }
};

function readLocalPageAssignments() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(PAGE_ASSIGNMENTS_STORAGE_KEY) || "null"
    );
    if (parsed && typeof parsed === "object") {
      return { ...DEFAULT_PAGE_ASSIGNMENTS, ...parsed };
    }
  } catch (_) {}
  return DEFAULT_PAGE_ASSIGNMENTS;
}

export function safeImg(url, fallback = SAFE_IMAGE_FALLBACK) {
  if (!url || typeof url !== "string" || !url.trim()) return fallback;
  const clean = url.trim();
  const isLocalHostOnProd =
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    clean.includes("localhost");

  if (
    clean.startsWith("file://") ||
    clean.startsWith("/Users/") ||
    isLocalHostOnProd ||
    BROKEN_IMAGE_IDS.some((id) => clean.includes(id))
  ) {
    return fallback;
  }
  return clean;
}

export function safeVid(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
  if (url.includes("assets.mixkit.co")) return "";
  return url;
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

const FALLBACK_PRODUCTS = [
  {
    id: "c-001",
    name: "FORMA COURT",
    category: "sneakers",
    collection: "unisex",
    price: 3499,
    oldPrice: 4299,
    badge: "BESTSELLER",
    color: "Cloud White",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    highlights: [
      "Full-grain vegan micro-leather",
      "Dual-density memory footbed",
      "Hand-stitched cupsole"
    ],
    description: "A clean everyday court silhouette with a considered, minimal finish.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85",
    videoUrl: ""
  },
  {
    id: "c-002",
    name: "MONO RUNNER",
    category: "sneakers",
    collection: "unisex",
    price: 4299,
    oldPrice: null,
    badge: "NEW",
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
  },
  {
    id: "c-003",
    name: "ATELIER LOAFER",
    category: "formal",
    collection: "men",
    price: 3899,
    oldPrice: null,
    badge: "",
    color: "Espresso",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    highlights: [
      "Supple matte finish",
      "Blister-free heel collar",
      "Flexible rubber-injected sole"
    ],
    description: "A refined slip-on profile for smart days and evenings.",
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85",
    videoUrl: ""
  },
  {
    id: "c-004",
    name: "CITY DERBY",
    category: "formal",
    collection: "men",
    price: 4599,
    oldPrice: 4999,
    badge: "LIMITED",
    color: "Black",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    highlights: [
      "Water-resistant upper",
      "Cushioned leather-feel insole",
      "Waxed cotton laces"
    ],
    description: "A timeless lace-up shape with a modern, understated presence.",
    image: SAFE_IMAGE_FALLBACK,
    videoUrl: ""
  },
  {
    id: "c-005",
    name: "EVERYDAY SLIDE",
    category: "slides",
    collection: "unisex",
    price: 799,
    oldPrice: 1299,
    badge: "EVERYDAY SLIDE",
    color: "Warm Taupe",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    highlights: [
      "Contoured anatomical footbed",
      "Water-friendly matte strap",
      "Anti-slip tread"
    ],
    description: "An easy everyday slide priced under ₹999 for daily comfort.",
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1000&q=85",
    videoUrl: ""
  },
  {
    id: "c-006",
    name: "TERRA LOW",
    category: "sneakers",
    collection: "women",
    price: 3799,
    oldPrice: null,
    badge: "NEW",
    color: "Olive / Cream",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    highlights: [
      "Suede-textured tonal panels",
      "Natural gum outsole",
      "Breathable perforated toe"
    ],
    description: "A versatile low-top designed to work across your rotation.",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85",
    videoUrl: ""
  },
  {
    id: "c-007",
    name: "JUNIOR COURT VELCRO",
    category: "sneakers",
    collection: "kids",
    price: 2199,
    oldPrice: 2599,
    badge: "KIDS",
    color: "Chalk / Sage",
    sizes: ["UK 1", "UK 2", "UK 3", "UK 4", "UK 5"],
    highlights: [
      "Easy dual-strap closure",
      "Soft impact-absorbing sole",
      "Machine-washable footbed"
    ],
    description: "Built for playground sprints and everyday school runs.",
    image:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1000&q=85",
    videoUrl: ""
  },
  {
    id: "c-008",
    name: "CLOUD DAILY SLIDE",
    category: "slides",
    collection: "unisex",
    price: 899,
    oldPrice: 1399,
    badge: "AT ₹999",
    color: "Obsidian Matte",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    highlights: [
      "Closed-cell water-ready foam",
      "Arch-contoured footbed",
      "Lightweight all-day wear"
    ],
    description: "Everyday comfort priced under ₹999 with bundle-eligible savings.",
    image:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=85",
    videoUrl: ""
  }
];

const FALLBACK_REELS = [
  {
    id: "reel-01",
    title: "Morning Commute in Forma Court",
    tag: "EVERYDAY WEAR",
    productId: "c-001",
    videoUrl: "",
    poster:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "reel-02",
    title: "Zero Break-In Comfort Test",
    tag: "FLEX & CUSHION",
    productId: "c-002",
    videoUrl: "",
    poster:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "reel-03",
    title: "Desk to Dinner Styling",
    tag: "SMART EDIT",
    productId: "c-003",
    videoUrl: "",
    poster:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "reel-04",
    title: "Built for the Long Walk Home",
    tag: "CRAFT & DETAIL",
    productId: "c-006",
    videoUrl: "",
    poster:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
  }
];

const DEFAULT_HOMEPAGE = {
  reelsEnabled: true,
  heroVideoUrl: "",
  heroImage:
    "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=2200&q=90",
  heroEyebrow: "THE EVERYDAY COLLECTION — 2026",
  heroTitle: "Walk your",
  heroTitleEmphasis: "own way.",
  heroDescription:
    "Thoughtful footwear. Quiet confidence. Made for wherever the day takes you.",
  campaignVideoUrl: "",
  mobileUI: {
    navHeightPx: 58,
    logoSizePx: 17,
    logoTracking: 2.4,
    heroTitleSizePx: 34,
    collectionTitleSizePx: 26,
    trustLayout: "swipe"
  },
  pipVideo: {
    enabled: false,
    label: "WATCH FIT & FLEX",
    productId: "c-001",
    videoUrl: "",
    poster:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
  },
  featuredProduct: {
    enabled: true,
    sectionType: "EXCLUSIVE / MOST SELLING",
    productId: "c-001",
    redirectUrl: "",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
    title: "FORMA COURT — SIGNATURE EDITION",
    price: 3499
  },
  affordableStore: {
    enabled: true,
    badgeLabel: "/999 Store",
    title: "Your day\nfound its footing.",
    subtitle: "Everyday Calzare, everyday price.\nStarting ₹999",
    ctaLabel: "EXPLORE",
    maxPrice: 999,
    customSlides: []
  },
  editorialSlider: {
    enabled: true,
    slides: []
  }
};

const DEFAULT_SETTINGS = {
  storeName: "CALZARE",
  supportEmail: "support@calzare.in",
  supportPhone: "+91 98765 43210",
  freeShippingThreshold: 2999,
  categories: ["sneakers", "formal", "slides"],
  pageAssignments: DEFAULT_PAGE_ASSIGNMENTS,
  navigation: [
    { label: "HOME", url: "#home" },
    { label: "MEN", url: "#men" },
    { label: "WOMEN", url: "#women" },
    { label: "UNISEX", url: "#unisex" },
    { label: "KIDS", url: "#kids" },
    { label: "TRACK ORDER", url: "#track-order" },
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

function normalizeSlug(value) {
  const raw = String(value || "").trim().toLowerCase();
  const withoutHash = raw.replace(/^#/, "");
  const pathPart = withoutHash.startsWith("http")
    ? new URL(withoutHash).pathname
    : withoutHash;
  const clean = pathPart.replace(/^\/+|\/+$/g, "").split("/").pop() || "";
  if (clean === "kid") return "kids";
  if (clean === "our-story" || clean === "our_story" || clean === "about") return "story";
  if (clean === "track" || clean === "track-order" || clean === "track_order")
    return "track-order";
  return clean;
}

function parseRouteState() {
  const hash = (window.location.hash || "").trim();
  const path = window.location.pathname || "/";

  if (hash.toLowerCase().startsWith("#product/")) {
    const prodId = decodeURIComponent(hash.slice("#product/".length)).trim();
    return {
      view: "product",
      productId: prodId || null,
      collection: "all",
      isAdmin: false,
      isStoryPage: false,
      isTrackPage: false,
      trackOrderId: "",
      policyKey: null
    };
  }

  if (hash.toLowerCase().startsWith("#track-order")) {
    const [, queryPart] = hash.split("?");
    const params = new URLSearchParams(queryPart || "");
    return {
      view: "track",
      productId: null,
      collection: "all",
      isAdmin: false,
      isStoryPage: false,
      isTrackPage: true,
      trackOrderId: params.get("id") || "",
      policyKey: null
    };
  }

  const hashSlug = normalizeSlug(hash);
  const pathSlug = normalizeSlug(path);
  const slug = hashSlug || pathSlug;

  if (slug === "admin") {
    return {
      view: "admin",
      productId: null,
      collection: "all",
      isAdmin: true,
      isStoryPage: false,
      isTrackPage: false,
      trackOrderId: "",
      policyKey: null
    };
  }

  if (slug === "story") {
    return {
      view: "story",
      productId: null,
      collection: "all",
      isAdmin: false,
      isStoryPage: true,
      isTrackPage: false,
      trackOrderId: "",
      policyKey: null
    };
  }

  if (slug === "track-order") {
    return {
      view: "track",
      productId: null,
      collection: "all",
      isAdmin: false,
      isStoryPage: false,
      isTrackPage: true,
      trackOrderId: "",
      policyKey: null
    };
  }

  if (slug === "shipping-policy" || slug === "refund-policy" || slug === "policy") {
    return {
      view: "policy",
      productId: null,
      collection: "all",
      isAdmin: false,
      isStoryPage: false,
      isTrackPage: false,
      trackOrderId: "",
      policyKey: slug === "refund-policy" ? "refund-policy" : "shipping-policy"
    };
  }

  if (VALID_COLLECTIONS.includes(slug)) {
    return {
      view: "collection",
      productId: null,
      collection: slug,
      isAdmin: false,
      isStoryPage: false,
      isTrackPage: false,
      trackOrderId: "",
      policyKey: null
    };
  }

  return {
    view: "home",
    productId: null,
    collection: "all",
    isAdmin: false,
    isStoryPage: false,
    isTrackPage: false,
    trackOrderId: "",
    policyKey: null
  };
}

function applyHomepagePayload(hp, setHomepage) {
  if (!hp || typeof hp !== "object") return;
  setHomepage((prev) => ({
    ...prev,
    ...hp,
    reelsEnabled: hp.reelsEnabled !== undefined ? Boolean(hp.reelsEnabled) : prev.reelsEnabled,
    heroImage: safeImg(hp.heroImage || prev.heroImage),
    heroVideoUrl: safeVid(hp.heroVideoUrl),
    campaignVideoUrl: safeVid(hp.campaignVideoUrl),
    mobileUI: hp.mobileUI
      ? {
          ...prev.mobileUI,
          ...hp.mobileUI
        }
      : prev.mobileUI,
    pipVideo: hp.pipVideo
      ? {
          ...prev.pipVideo,
          ...hp.pipVideo,
          videoUrl: safeVid(hp.pipVideo.videoUrl),
          poster: safeImg(hp.pipVideo.poster || prev.pipVideo.poster),
          enabled: Boolean(hp.pipVideo.enabled && safeVid(hp.pipVideo.videoUrl))
        }
      : prev.pipVideo,
    featuredProduct: hp.featuredProduct
      ? {
          ...prev.featuredProduct,
          ...hp.featuredProduct,
          image: safeImg(hp.featuredProduct.image || prev.featuredProduct.image)
        }
      : prev.featuredProduct,
    affordableStore: hp.affordableStore
      ? {
          ...prev.affordableStore,
          ...hp.affordableStore
        }
      : prev.affordableStore,
    editorialSlider: hp.editorialSlider
      ? {
          ...prev.editorialSlider,
          ...hp.editorialSlider
        }
      : prev.editorialSlider,
    productPage: hp.productPage
      ? {
          ...prev.productPage,
          ...hp.productPage
        }
      : prev.productPage,
    theme: hp.theme
      ? {
          ...prev.theme,
          ...hp.theme
        }
      : prev.theme,
    navbar: hp.navbar
      ? {
          ...prev.navbar,
          ...hp.navbar
        }
      : prev.navbar,
    footer: hp.footer
      ? {
          ...prev.footer,
          ...hp.footer
        }
      : prev.footer
  }));
}

export function StorySection({ homepage, storeSettings, onExploreShop, onGoHome }) {
  const sections =
    Array.isArray(storeSettings?.storySections) && storeSettings.storySections.length > 0
      ? storeSettings.storySections
      : [
          {
            eyebrow: "OUR PHILOSOPHY",
            heading: "Wear what moves you.",
            body:
              homepage?.heroDescription ||
              "CALZARE is built around a simple idea: everyday essentials deserve exceptional attention.",
            image: safeImg(homepage?.heroImage)
          }
        ];

  return (
    <section id="story" className="story section-pad">
      <div>
        {onGoHome && (
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <button type="button" onClick={onGoHome} className="pdp-back-btn">
              ← BACK TO HOME
            </button>
          </div>
        )}

        {sections.map((st, idx) => (
          <div key={idx} style={{ marginBottom: idx < sections.length - 1 ? "48px" : 0 }}>
            <p className="eyebrow">{st.eyebrow || "OUR STORY"}</p>
            <h2>{st.heading || "Wear what moves you."}</h2>
            <p>{st.body}</p>
            {st.image && (
              <div
                style={{
                  maxWidth: "760px",
                  margin: "24px auto 0",
                  borderRadius: "16px",
                  overflow: "hidden"
                }}
              >
                <img
                  src={safeImg(st.image)}
                  alt={st.heading || "Calzare Story"}
                  style={{
                    width: "100%",
                    maxHeight: "420px",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {onExploreShop && (
          <div style={{ marginTop: "28px" }}>
            <button
              type="button"
              className="primary-cta-btn"
              style={{ maxWidth: "240px", margin: "0 auto" }}
              onClick={onExploreShop}
            >
              EXPLORE FOOTWEAR <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function Under999StoreSection({
  homepage,
  products = [],
  onExploreDrop,
  onSelectProduct
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isMobileView, setIsMobileView] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );

  useEffect(() => {
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const config = homepage?.affordableStore || {};
  if (config.enabled === false || config.visible === false) return null;

  const badgeLabel = config.badgeLabel ?? "/999 Store";
  const rawTitle = String(config.title ?? "").trim();
  const title =
    !rawTitle || rawTitle.toUpperCase() === "THE UNDER ₹999 STORE"
      ? "Your day\nfound its footing."
      : rawTitle;

  const rawSubtitle = String(config.subtitle ?? "").trim();
  const subtitle =
    !rawSubtitle || rawSubtitle.startsWith("High performance foam")
      ? "Everyday Calzare, everyday price.\nStarting ₹999"
      : rawSubtitle;

  const rawCta = String(config.ctaLabel ?? "").trim();
  const ctaLabel =
    !rawCta || rawCta.toUpperCase() === "EXPLORE DROP" ? "EXPLORE" : rawCta;

  const maxPrice = Number(config.maxPrice ?? 999);

  const publishedProducts = (Array.isArray(products) ? products : []).filter(
    (p) => p && (p.status || "published") !== "draft"
  );

  const under999Slides = useMemo(() => {
    const custom = Array.isArray(config.customSlides)
      ? config.customSlides.filter(
          (s) => s && typeof s.image === "string" && s.image.trim().length > 0
        )
      : [];

    return custom.map((s, i) => {
      const linkedProd =
        publishedProducts.find((p) => String(p.id) === String(s.productId)) || null;
      return {
        key: s.id || `custom-999-${i}`,
        alt: s.title || linkedProd?.name || `Calzare ₹${maxPrice} Slide ${i + 1}`,
        slideImage: safeImg(s.image.trim()),
        imageFit: s.imageFit || "contain",
        imagePosX: s.imagePosX ?? 50,
        imagePosY: s.imagePosY ?? 50,
        imageZoom: Number(s.imageZoom) || 1,
        targetProduct: linkedProd,
        redirectUrl: String(s.redirectUrl || "").trim()
      };
    });
  }, [config.customSlides, publishedProducts, maxPrice]);

  if (!under999Slides.length) return null;

  const visibleCount = isMobileView ? 1 : 2;
  const maxIndex = Math.max(0, under999Slides.length - visibleCount);
  const safeIndex = Math.min(slideIndex, maxIndex);
  const canPrev = safeIndex > 0;
  const canNext = safeIndex < maxIndex;
  const stepPercent = isMobileView ? 100 : 50;

  function handlePrev() {
    if (canPrev) setSlideIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    if (canNext) setSlideIndex((i) => Math.min(maxIndex, i + 1));
  }

  function handleTouchStart(e) {
    setTouchStartX(e.touches?.[0]?.clientX ?? null);
  }

  function handleTouchEnd(e) {
    if (touchStartX === null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStartX;
    const diff = touchStartX - endX;
    if (Math.abs(diff) > 36) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
  }

  function handleSlideClick(item) {
    if (item.redirectUrl) {
      if (item.redirectUrl.startsWith("#")) {
        window.location.hash = item.redirectUrl;
      } else {
        window.location.href = item.redirectUrl;
      }
      return;
    }
    if (item.targetProduct) {
      onSelectProduct?.(item.targetProduct);
    }
  }

  return (
    <section id="under-999-store" style={under999Styles.sectionBlock}>
      <div className="under999-split-wrap" style={under999Styles.splitRow}>
        <div className="under999-blue-banner" style={under999Styles.bannerCard}>
          <div style={under999Styles.bannerTopRow}>
            <span style={under999Styles.badge}>{badgeLabel}</span>
          </div>

          <div style={under999Styles.bannerMiddle}>
            <h2 style={under999Styles.leftTitle}>{title}</h2>
            <p style={under999Styles.leftSubtitle}>{subtitle}</p>
          </div>

          <div style={under999Styles.bannerBottomRow}>
            <button
              type="button"
              onClick={onExploreDrop}
              style={under999Styles.leftBtn}
            >
              {ctaLabel}
            </button>

            <svg
              width="54"
              height="54"
              viewBox="0 0 100 100"
              aria-hidden="true"
              style={{ flexShrink: 0, display: "block" }}
            >
              <defs>
                <path
                  id="calzareSealPath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                />
              </defs>
              <text
                fill="rgba(255,255,255,0.9)"
                fontSize="9"
                fontWeight="700"
                letterSpacing="2.2"
              >
                <textPath href="#calzareSealPath">
                  FACTORY DIRECT • CALZARE •
                </textPath>
              </text>
              <circle
                cx="50"
                cy="50"
                r="17"
                fill="none"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.5"
              />
              <text
                x="50"
                y="54"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12.5"
                fontWeight="800"
              >
                ₹{maxPrice}
              </text>
            </svg>
          </div>
        </div>

        <div
          className="under999-outside-slide"
          style={under999Styles.scrollCol}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div style={under999Styles.viewport}>
            <div
              className="under999-track"
              style={{
                display: "flex",
                alignItems: "center",
                transform: `translateX(-${safeIndex * stepPercent}%)`,
                transition: "transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)"
              }}
            >
              {under999Slides.map((item, idx) => (
                <div
                  key={`${item.key}-${idx}`}
                  className="under999-slide-item"
                  onClick={() => handleSlideClick(item)}
                  style={under999Styles.slideItem}
                >
                  <div style={under999Styles.featuredSlideImgWrap}>
                    <img
                      src={item.slideImage}
                      alt={item.alt}
                      style={{
                        ...under999Styles.productImg,
                        objectFit: item.imageFit,
                        objectPosition: `${item.imagePosX}% ${item.imagePosY}%`,
                        transform: `scale(${item.imageZoom})`,
                        transformOrigin: `${item.imagePosX}% ${item.imagePosY}%`
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {under999Slides.length > visibleCount && (
            <div style={under999Styles.outsideControlsRow}>
              <button
                type="button"
                aria-label="Previous 999 store item"
                disabled={!canPrev}
                onClick={handlePrev}
                style={{
                  ...under999Styles.outsideArrowBtn,
                  opacity: canPrev ? 1 : 0.35,
                  cursor: canPrev ? "pointer" : "default"
                }}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next 999 store item"
                disabled={!canNext}
                onClick={handleNext}
                style={{
                  ...under999Styles.outsideArrowBtn,
                  opacity: canNext ? 1 : 0.35,
                  cursor: canNext ? "pointer" : "default"
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const under999Styles = {
  sectionBlock: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "44px 4%",
    background: "#FFFFFF",
    boxSizing: "border-box"
  },
  splitRow: {
    display: "grid",
    gridTemplateColumns: "minmax(290px, 385px) minmax(0, 1fr)",
    gap: "36px",
    alignItems: "center"
  },
  bannerCard: {
    borderRadius: "20px",
    padding: "28px 28px 26px",
    minHeight: "480px",
    backgroundColor: "#03226B",
    backgroundImage:
      "radial-gradient(circle at 80% 15%, #0D57DC 0%, #053396 46%, #02184E 100%)",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "24px",
    boxSizing: "border-box"
  },
  bannerTopRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  badge: {
    fontSize: "24px",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    color: "#FFFFFF"
  },
  bannerMiddle: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  leftTitle: {
    margin: 0,
    fontSize: "clamp(32px, 3.3vw, 44px)",
    lineHeight: 1.08,
    fontWeight: 600,
    letterSpacing: "-0.025em",
    whiteSpace: "pre-line",
    color: "#FFFFFF"
  },
  leftSubtitle: {
    margin: 0,
    fontSize: "14.5px",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
    color: "rgba(255, 255, 255, 0.9)"
  },
  bannerBottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "2px"
  },
  leftBtn: {
    background: "rgba(9, 53, 150, 0.45)",
    color: "#FFFFFF",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    borderRadius: "999px",
    padding: "11px 28px",
    fontSize: "11.5px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer"
  },
  scrollCol: {
    background: "#FFFFFF",
    padding: "12px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "24px",
    minWidth: 0
  },
  viewport: {
    overflow: "hidden",
    width: "100%",
    background: "#FFFFFF"
  },
  slideItem: {
    flex: "0 0 50%",
    maxWidth: "50%",
    padding: "0 18px",
    boxSizing: "border-box",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  featuredSlideImgWrap: {
    width: "100%",
    maxWidth: "330px",
    height: "260px",
    background: "#FFFFFF",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  productImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    background: "#FFFFFF"
  },
  outsideControlsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "4px",
    background: "#FFFFFF"
  },
  outsideArrowBtn: {
    width: "46px",
    height: "30px",
    borderRadius: "999px",
    border: "1px solid #D4D4CE",
    background: "#FFFFFF",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 500,
    display: "grid",
    placeItems: "center"
  }
};

const DEFAULT_SHORT_VIDEOS = [
  {
    id: "reel-01",
    title: "Morning Commute in Forma Court",
    tag: "EVERYDAY WEAR",
    productId: "c-001",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "reel-02",
    title: "Zero Break-In Comfort Test",
    tag: "FLEX & CUSHION",
    productId: "c-002",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "reel-03",
    title: "Everyday Slide On-Foot Check",
    tag: "UNDER ₹999 SLIDE",
    productId: "c-005",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: "reel-04",
    title: "Built for the Long Walk Home",
    tag: "CRAFT & DETAIL",
    productId: "c-006",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
    poster:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
  }
];

export function ShortVideoReelsSection({
  reels = [],
  products = [],
  onOpenReel,
  onQuickAdd
}) {
  const list = Array.isArray(reels) && reels.length > 0 ? reels : DEFAULT_SHORT_VIDEOS;

  return (
    <section
      id="short-videos"
      className="section-pad"
      style={{ maxWidth: "1360px", margin: "0 auto" }}
    >
      <div className="section-heading" style={{ marginBottom: "20px" }}>
        <div>
          <p className="eyebrow">SOLA PLAY • ON-FOOT CLIPS</p>
          <h2>
            Calzare <em>in Motion.</em>
          </h2>
        </div>
      </div>

      <div className="reels-grid">
        {list.map((clip, idx) => {
          const linkedProduct =
            (Array.isArray(products) ? products : []).find(
              (p) => (p.id || p._id) === clip.productId
            ) || products[0];
          const vidSrc = safeVid(clip.videoUrl);
          const posterSrc = safeImg(clip.poster || linkedProduct?.image);

          return (
            <article
              key={clip.id || clip._id || idx}
              className="reel-card"
              onClick={() =>
                onOpenReel?.({
                  ...clip,
                  videoUrl: vidSrc,
                  poster: posterSrc
                })
              }
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#111318",
                color: "#FFFFFF",
                cursor: "pointer"
              }}
            >
              {vidSrc ? (
                <video
                  src={vidSrc}
                  poster={posterSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              ) : (
                <img
                  src={posterSrc}
                  alt={clip.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.82) 100%)",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
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
                  <span
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(6px)",
                      padding: "4px 9px",
                      borderRadius: "999px",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase"
                    }}
                  >
                    {clip.tag || "SOLA PLAY"}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.92)",
                      color: "#0F172A",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    <Play size={14} fill="currentColor" />
                  </span>
                </div>

                <div>
                  <strong style={{ display: "block", fontSize: "14px", lineHeight: 1.3 }}>
                    {clip.title}
                  </strong>
                  {linkedProduct && (
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        fontSize: "11.5px"
                      }}
                    >
                      <span style={{ opacity: 0.88 }}>
                        {linkedProduct.name} • {money(linkedProduct.price)}
                      </span>
                      {onQuickAdd && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickAdd(
                              linkedProduct,
                              linkedProduct.sizes?.[2] ||
                                linkedProduct.sizes?.[0] ||
                                "UK 8"
                            );
                          }}
                          style={{
                            background: "#FFFFFF",
                            color: "#0F172A",
                            border: 0,
                            borderRadius: "999px",
                            padding: "5px 10px",
                            fontSize: "10px",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          + ADD
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function App() {
  const initialRoute = parseRouteState();

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [reels, setReels] = useState(FALLBACK_REELS);
  const [homepage, setHomepage] = useState(DEFAULT_HOMEPAGE);
  const [storeSettings, setStoreSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    pageAssignments: readLocalPageAssignments()
  }));
  const [category, setCategory] = useState("all");
  const [collection, setCollection] = useState(initialRoute.collection);
  const [storyPageOpen, setStoryPageOpen] = useState(initialRoute.isStoryPage);
  const [trackPageOpen, setTrackPageOpen] = useState(initialRoute.isTrackPage);
  const [trackOrderId, setTrackOrderId] = useState(initialRoute.trackOrderId);
  const [policyPageKey, setPolicyPageKey] = useState(initialRoute.policyKey);

  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("calzare_user") || "null")
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [myOrders, setMyOrders] = useState([]);
  const [productPageId, setProductPageId] = useState(initialRoute.productId);

  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("calzare_cart_v2") || "[]")
  );
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [isAdmin, setIsAdmin] = useState(initialRoute.isAdmin);

  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("UK 8");
  const [showProductVideo, setShowProductVideo] = useState(false);

  const [activeReel, setActiveReel] = useState(null);
  const [reelMuted, setReelMuted] = useState(false);
  const [reelSize, setReelSize] = useState("UK 8");

  const [pipVisible, setPipVisible] = useState(true);
  const [pipMuted, setPipMuted] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "Partial COD (₹299 Advance)"
  });

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [showConfetti, setShowConfetti] = useState(false);
  const [prevTier, setPrevTier] = useState(0);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const canManageReviews = Boolean(
    currentUser?.role === "admin" || sessionStorage.getItem("calzare_admin_token")
  );

  function scrollToCatalogSection() {
    setTimeout(() => {
      const target =
        document.getElementById("find-your-form") ||
        document.getElementById("shop") ||
        document.querySelector("main");
      target?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  useEffect(() => {
    const syncRoute = () => {
      const next = parseRouteState();
      setIsAdmin(next.isAdmin);
      setProductPageId(next.productId);
      setCollection(next.collection);
      setStoryPageOpen(next.isStoryPage);
      setTrackPageOpen(next.isTrackPage);
      if (next.trackOrderId) setTrackOrderId(next.trackOrderId);
      setPolicyPageKey(next.policyKey);
    };

    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  function openTrackOrderPage(orderId = "") {
    setCollection("all");
    setStoryPageOpen(false);
    setProductPageId(null);
    setPolicyPageKey(null);
    setTrackOrderId(orderId);
    setTrackPageOpen(true);
    setMenuOpen(false);
    window.location.hash = orderId
      ? `track-order?id=${encodeURIComponent(orderId)}`
      : "track-order";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openPolicyPage(key = "shipping-policy") {
    setCollection("all");
    setStoryPageOpen(false);
    setProductPageId(null);
    setTrackPageOpen(false);
    setPolicyPageKey(key);
    setMenuOpen(false);
    window.location.hash = key;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateCollection(target) {
    const normalized = normalizeSlug(target) || "all";

    if (normalized === "home" || normalized === "all") {
      setCollection("all");
      setStoryPageOpen(false);
      setTrackPageOpen(false);
      setPolicyPageKey(null);
      setProductPageId(null);
      setCategory("all");
      setMenuOpen(false);
      window.location.hash = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (normalized === "story") {
      setCollection("all");
      setStoryPageOpen(true);
      setTrackPageOpen(false);
      setPolicyPageKey(null);
      setProductPageId(null);
      setCategory("all");
      setMenuOpen(false);
      window.location.hash = "story";
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (normalized === "track-order") {
      openTrackOrderPage();
      return;
    }

    if (normalized === "shipping-policy" || normalized === "refund-policy") {
      openPolicyPage(normalized);
      return;
    }

    const validCol = VALID_COLLECTIONS.includes(normalized) ? normalized : "all";
    setCollection(validCol);
    setStoryPageOpen(false);
    setTrackPageOpen(false);
    setPolicyPageKey(null);
    setProductPageId(null);
    setCategory("all");
    setMenuOpen(false);
    window.location.hash = validCol === "all" ? "" : validCol;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openFullProductPage(product) {
    const prodId = product?.id || product?._id;
    if (!prodId) return;
    setIsAdmin(false);
    setStoryPageOpen(false);
    setTrackPageOpen(false);
    setPolicyPageKey(null);
    setMenuOpen(false);
    setProductPageId(String(prodId));
    window.location.hash = `#product/${encodeURIComponent(String(prodId))}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function refreshStore() {
    try {
      const cachedHp = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null");
      if (cachedHp) {
        applyHomepagePayload(cachedHp, setHomepage);
      }
    } catch {}

    setStoreSettings((prev) => ({
      ...prev,
      pageAssignments: {
        ...(prev.pageAssignments || DEFAULT_PAGE_ASSIGNMENTS),
        ...readLocalPageAssignments()
      }
    }));

    fetch(`${API}/products`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = data?.products || (Array.isArray(data) ? data : null);
        if (list?.length) {
          setProducts(
            list.filter(Boolean).map((p) => ({
              ...p,
              image: safeImg(p.image),
              videoUrl: safeVid(p.videoUrl)
            }))
          );
        }
      })
      .catch(() => {});

    fetch(`${API}/homepage`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const hp =
          data?.homepage ||
          (data && typeof data === "object" && !Array.isArray(data) ? data : null);
        if (hp && Object.keys(hp).length > 0) {
          applyHomepagePayload(hp, setHomepage);
          try {
            localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(hp));
          } catch {}
        }
      })
      .catch(() => {});

    fetch(`${API}/reels`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = data?.reels || (Array.isArray(data) ? data : null);
        if (list?.length) {
          setReels(
            list.filter(Boolean).map((r) => ({
              ...r,
              poster: safeImg(r.poster),
              videoUrl: safeVid(r.videoUrl)
            }))
          );
        }
      })
      .catch(() => {});

    fetch(`${API}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const incoming = data?.settings || data;
        if (incoming && typeof incoming === "object") {
          setStoreSettings((prev) => ({
            ...prev,
            ...incoming,
            categories: incoming.categories?.length ? incoming.categories : prev.categories,
            pageAssignments:
              incoming.pageAssignments && typeof incoming.pageAssignments === "object"
                ? {
                    ...(prev.pageAssignments || DEFAULT_PAGE_ASSIGNMENTS),
                    ...incoming.pageAssignments,
                    ...readLocalPageAssignments()
                  }
                : prev.pageAssignments || readLocalPageAssignments(),
            navigation: incoming.navigation?.length ? incoming.navigation : prev.navigation,
            storySections: incoming.storySections?.length
              ? incoming.storySections
              : prev.storySections
          }));
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshStore();

    const onStorage = (e) => {
      if (
        e.key === "calzare_store_sync" ||
        e.key === HOMEPAGE_STORAGE_KEY ||
        e.key === PAGE_ASSIGNMENTS_STORAGE_KEY
      ) {
        refreshStore();
      }
    };
    const onFocus = () => refreshStore();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("calzare_cart_v2", JSON.stringify(cart));
  }, [cart]);

  const activePageKey = collection !== "all" ? collection : "home";
  const currentPageRule =
    storeSettings.pageAssignments?.[activePageKey] ||
    DEFAULT_PAGE_ASSIGNMENTS[activePageKey] ||
    DEFAULT_PAGE_ASSIGNMENTS.home;

  const activeCategories = useMemo(() => {
    const baseCats = ["sneakers", "slides", "formal"];
    const allKnownCats = Array.from(
      new Set([
        ...baseCats,
        ...(storeSettings.categories || []).map((c) => String(c).toLowerCase()),
        ...products.map((p) => String(p.category || "").toLowerCase()).filter(Boolean)
      ])
    );

    const assignedCats = Array.isArray(currentPageRule?.categories)
      ? currentPageRule.categories.map((c) => String(c).toLowerCase())
      : null;

    if (!assignedCats || assignedCats.length === 0) return allKnownCats;
    const filtered = allKnownCats.filter((cat) => assignedCats.includes(cat));
    return filtered.length > 0 ? filtered : allKnownCats;
  }, [storeSettings.categories, products, currentPageRule]);

  const activeCollectionsForPage = useMemo(() => {
    const assignedCols = Array.isArray(currentPageRule?.collections)
      ? currentPageRule.collections.map((c) => String(c).toLowerCase())
      : VALID_COLLECTIONS;
    const filtered = VALID_COLLECTIONS.filter((col) => assignedCols.includes(col));
    return filtered.length > 0 ? filtered : VALID_COLLECTIONS;
  }, [currentPageRule]);

  useEffect(() => {
    if (
      category !== "all" &&
      category !== "under999" &&
      !activeCategories.includes(category.toLowerCase())
    ) {
      setCategory("all");
    }
  }, [category, activeCategories]);

  const maxBudgetPrice = Number(homepage?.affordableStore?.maxPrice ?? 999);

  const visibleProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const term = search.trim().toLowerCase();
    const published = list.filter((p) => p && (p.status || "published") !== "draft");

    return published.filter((p) => {
      const productCol = normalizeSlug(p.collection || p.gender || "unisex");
      const productCat = String(p.category || "").toLowerCase();

      const matchesCollection =
        collection === "all" ||
        productCol === collection ||
        (collection !== "kids" && productCol === "unisex");

      const matchesPageCategories =
        activeCategories.length === 0 ? true : activeCategories.includes(productCat);

      const matchesCategory =
        category === "all"
          ? matchesPageCategories
          : category === "under999"
          ? Number(p.price) > 0 && Number(p.price) <= maxBudgetPrice
          : productCat === category;

      const matchesSearch =
        !term || `${p.name} ${p.color} ${p.description}`.toLowerCase().includes(term);

      return matchesCollection && matchesCategory && matchesSearch;
    });
  }, [products, collection, category, search, maxBudgetPrice, activeCategories]);

  const freeShipMin = Number(storeSettings.freeShippingThreshold ?? 2999);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountRate = cartCount >= 3 ? 0.15 : cartCount >= 2 ? 0.1 : 0;
  const discountAmount = Math.round(cartSubtotal * discountRate);
  const afterBundleTotal = Math.max(0, cartSubtotal - discountAmount);

  useEffect(() => {
    const currentTier = cartCount >= 3 ? 2 : cartCount >= 2 ? 1 : 0;
    if (currentTier > prevTier) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2200);
      setPrevTier(currentTier);
      return () => clearTimeout(t);
    }
    setPrevTier(currentTier);
  }, [cartCount, prevTier]);

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(afterBundleTotal * (Number(appliedCoupon.value) / 100))
      : Math.min(Number(appliedCoupon.value) || 0, afterBundleTotal)
    : 0;

  const shippingFee = cartSubtotal >= freeShipMin || cartSubtotal === 0 ? 0 : 149;
  const cartFinalTotal = Math.max(
    0,
    cartSubtotal - discountAmount - couponDiscount + shippingFee
  );

  const tierProgress = useMemo(() => {
    if (cartCount === 0) {
      return { percent: 8, text: "Add any pair to start unlocking bundle rewards." };
    }
    if (cartCount === 1) {
      return { percent: 55, text: "Add 1 more pair to unlock 10% OFF your entire bag." };
    }
    if (cartCount === 2) {
      return { percent: 82, text: "10% OFF unlocked! Add 1 more pair for 15% OFF." };
    }
    return {
      percent: 100,
      text: "Maximum 15% OFF + Complimentary Express Shipping unlocked!"
    };
  }, [cartCount]);

  const upsellProducts = useMemo(() => {
    const inBagIds = new Set(cart.map((c) => c.id));
    return products.filter((p) => !inBagIds.has(p.id)).slice(0, 4);
  }, [products, cart]);

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError("");
    try {
      const res = await fetch(`${API}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid or expired coupon.");
      setAppliedCoupon(data.coupon || data);
      setNotice(`Coupon ${code} applied!`);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || "Could not validate coupon.");
    }
  }

  function openProductModal(product, startWithVideo = false) {
    const vid = safeVid(product.videoUrl);
    setActiveProduct({ ...product, image: safeImg(product.image), videoUrl: vid });
    setSelectedSize(product.sizes?.[2] || product.sizes?.[0] || "UK 8");
    setShowProductVideo(startWithVideo && Boolean(vid));
  }

  function handleFeaturedClick() {
    const feat = homepage.featuredProduct;
    if (!feat) return;
    const rawUrl = String(feat.redirectUrl || "").trim();
    if (rawUrl) {
      if (rawUrl.startsWith("#")) {
        navigateCollection(rawUrl);
        return;
      }
      if (/^https?:\/\//i.test(rawUrl)) {
        window.open(rawUrl, "_blank", "noopener,noreferrer");
        return;
      }
      const slug = normalizeSlug(rawUrl);
      if (VALID_COLLECTIONS.includes(slug) || slug === "story") {
        navigateCollection(slug);
        return;
      }
      window.location.href = rawUrl;
      return;
    }
    const target = products.find((p) => p.id === feat.productId) || products[0];
    if (target) openFullProductPage(target);
  }

  function openReelModal(reel) {
    setActiveReel(reel);
    setReelMuted(false);
    const linked = products.find((p) => p.id === reel.productId) || products[0];
    setReelSize(linked?.sizes?.[2] || "UK 8");
  }

  function addToCart(product, size = "UK 8", openDrawer = false) {
    const cleanItem = { ...product, image: safeImg(product.image) };
    const cartKey = `${cleanItem.id}__${size}`;
    setCart((current) => {
      const found = current.find((item) => item.cartKey === cartKey);
      return found
        ? current.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...current, { ...cleanItem, size, cartKey, quantity: 1 }];
    });
    setNotice(`${cleanItem.name} (${size}) added to your bag.`);
    if (openDrawer) setCartOpen(true);
  }

  function changeQuantity(cartKey, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function subscribe(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not subscribe.");
      setNotice(data.message);
      setEmail("");
    } catch (error) {
      setNotice(error.message || "Subscribed locally.");
      setEmail("");
    }
  }

  async function openAccountModal() {
    setAuthError("");
    setAuthOpen(true);
    if (currentUser?.phone || currentUser?.name) {
      const q = currentUser.phone
        ? `phone=${encodeURIComponent(currentUser.phone)}`
        : `name=${encodeURIComponent(currentUser.name)}`;
      fetch(`${API}/auth/orders?${q}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.orders) setMyOrders(d.orders);
        })
        .catch(() => {});
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthError("");
    const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed.");

      if (data.user?.role === "admin" && data.user?.adminToken) {
        sessionStorage.setItem("calzare_admin_token", data.user.adminToken);
      }

      setCurrentUser(data.user);
      localStorage.setItem("calzare_user", JSON.stringify(data.user));
      setCheckoutForm((prev) => ({
        ...prev,
        name: prev.name || data.user.name || "",
        phone: prev.phone || data.user.phone || ""
      }));
      setAuthForm({ name: "", email: "", phone: "", password: "" });
      setAuthOpen(false);

      if (data.user?.role === "admin" && data.user?.adminToken) {
        setIsAdmin(true);
        window.location.hash = "admin";
      } else {
        setNotice(`Welcome back, ${data.user.name}.`);
      }
    } catch (err) {
      setAuthError(err.message);
    }
  }

  function handleSignOut() {
    setCurrentUser(null);
    setMyOrders([]);
    setIsAdmin(false);
    localStorage.removeItem("calzare_user");
    sessionStorage.removeItem("calzare_admin_token");
    if (window.location.hash.toLowerCase() === "#admin") {
      window.location.hash = "";
    }
    setAuthOpen(false);
    setNotice("Signed out.");
  }

  function recordLocalOrder(orderObj) {
    if (!orderObj) return;
    try {
      const existing = JSON.parse(
        localStorage.getItem("calzare_recent_orders") || "[]"
      );
      const next = [
        orderObj,
        ...(Array.isArray(existing)
          ? existing.filter((o) => o.orderId !== orderObj.orderId)
          : [])
      ].slice(0, 15);
      localStorage.setItem("calzare_recent_orders", JSON.stringify(next));
    } catch {}
  }

  async function handlePlaceOrder(event) {
    event.preventDefault();
    const orderPayload = {
      customer: checkoutForm,
      items: cart.map(({ id, name, size, price, quantity }) => ({
        id,
        name,
        size,
        price,
        quantity
      })),
      subtotal: cartSubtotal,
      discount: discountAmount + couponDiscount,
      couponCode: appliedCoupon?.code || null,
      couponDiscount,
      total: cartFinalTotal,
      paymentMethod: checkoutForm.paymentMethod
    };

    if (checkoutForm.paymentMethod === "Cash on Delivery") {
      try {
        const res = await fetch(`${API}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Order error");
        recordLocalOrder(data.order);
        setOrderConfirmed(data.order);
        setCart([]);
        setAppliedCoupon(null);
        setCouponInput("");
      } catch (err) {
        setNotice(err.message || "Could not place COD order.");
      }
      return;
    }

    const chargeAmount = checkoutForm.paymentMethod.includes("Partial COD")
      ? 299
      : cartFinalTotal;

    try {
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Check your internet connection.");
      }

      const createRes = await fetch(`${API}/payments/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInPaise: Math.round(chargeAmount * 100) })
      });
      const rzpData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(rzpData.message || "Razorpay initialization failed");
      }

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: `${storeSettings.storeName || "CALZARE"}®`,
        description: checkoutForm.paymentMethod,
        order_id: rzpData.order_id,
        prefill: {
          name: checkoutForm.name,
          contact: checkoutForm.phone
        },
        theme: { color: "#252a22" },
        modal: {
          ondismiss: () => setNotice("Payment cancelled. No charge was made.")
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API}/payments/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderPayload
              })
            });
            const verified = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verified.message || "Payment verification failed.");
            }
            recordLocalOrder(verified.order);
            setOrderConfirmed(verified.order);
            setCart([]);
            setAppliedCoupon(null);
            setCouponInput("");
          } catch (err) {
            setNotice(err.message || "Payment verification failed.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setNotice(
          response.error?.description || "Payment failed. Please try again."
        );
      });
      rzp.open();
    } catch (err) {
      setNotice(err.message || "Payment could not be started.");
    }
  }

  const activeReelProduct = activeReel
    ? products.find((p) => p.id === activeReel.productId) || products[0]
    : null;

  const pipVideoUrl = safeVid(homepage.pipVideo?.videoUrl);

  const navItems = useMemo(() => {
    const raw = (
      storeSettings.navigation?.length
        ? storeSettings.navigation
        : DEFAULT_SETTINGS.navigation
    ).filter((item) => item && String(item.label || "").trim());

    const hasTrack = raw.some(
      (item) => normalizeSlug(item.url || item.label) === "track-order"
    );
    const withTrack = hasTrack
      ? raw
      : [...raw, { label: "TRACK ORDER", url: "#track-order" }];

    const homeIdx = withTrack.findIndex(
      (item) => normalizeSlug(item.url || item.label) === "home"
    );

    if (homeIdx > 0) {
      const [homeEntry] = withTrack.splice(homeIdx, 1);
      return [homeEntry, ...withTrack];
    }
    if (homeIdx === -1) {
      return [{ label: "HOME", url: "#home" }, ...withTrack];
    }
    return withTrack;
  }, [storeSettings.navigation]);

  if (isAdmin) {
    return (
      <AdminPanel
        onExit={() => {
          if (window.location.hash.toLowerCase() === "#admin") {
            window.location.hash = "";
          }
          setIsAdmin(false);
          refreshStore();
        }}
        onStoreUpdated={refreshStore}
      />
    );
  }

  const under999SectionElement = (
    <Under999StoreSection
      homepage={homepage}
      products={products}
      onExploreDrop={() => {
        setProductPageId(null);
        setStoryPageOpen(false);
        setTrackPageOpen(false);
        setPolicyPageKey(null);
        setCollection("all");
        setCategory("under999");
        window.location.hash = "";
        scrollToCatalogSection();
      }}
      onSelectProduct={(p) => openFullProductPage(p)}
    />
  );

  return (
    <div
      className="site-shell"
      style={{
        "--paper": homepage.theme?.pageBgColor || "#f7f6f2",
        "--ink": homepage.theme?.textColor || "#1e211d",
        "--surface": homepage.theme?.surfaceColor || "#f2f1eb",
        "--surface-alt": homepage.theme?.cardBgColor || "#eeede7",
        "--accent": homepage.theme?.accentColor || "#252a22",
        "--accent-ink": homepage.theme?.accentTextColor || "#f7f6f2",
        "--mobile-nav-height": `${homepage.mobileUI?.navHeightPx || 58}px`,
        "--mobile-logo-size": `${homepage.mobileUI?.logoSizePx || 17}px`,
        "--mobile-hero-title-size": `${homepage.mobileUI?.heroTitleSizePx || 34}px`,
        "--mobile-collection-title-size": `${homepage.mobileUI?.collectionTitleSizePx || 26}px`,
        fontFamily: homepage.theme?.fontFamily || "'DM Sans', sans-serif",
        fontSize: homepage.theme?.fontSizePx ? `${homepage.theme.fontSizePx}px` : undefined
      }}
    >
      <div className="announcement">
        {homepage.navbar?.announcementText ||
          `COMPLIMENTARY SHIPPING ABOVE ${money(freeShipMin)}  •  BUY 2 GET 10% OFF  •  BUY 3 GET 15% OFF`}
      </div>

      <Header
        homepage={homepage}
        storeSettings={storeSettings}
        navItems={navItems}
        collection={collection}
        storyPageOpen={storyPageOpen}
        trackPageOpen={trackPageOpen}
        policyPageKey={policyPageKey}
        productPageId={productPageId}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        setCartOpen={setCartOpen}
        currentUser={currentUser}
        openAccountModal={openAccountModal}
        navigateCollection={navigateCollection}
        openTrackOrderPage={openTrackOrderPage}
      />

      <main>
        {trackPageOpen ? (
          <TrackOrderPage
            initialOrderId={trackOrderId}
            initialPhone={currentUser?.phone || ""}
            onGoHome={() => navigateCollection("home")}
            money={money}
          />
        ) : policyPageKey ? (
          <PolicyPage
            policyKey={policyPageKey}
            onSwitchPolicy={(nextKey) => openPolicyPage(nextKey)}
            onGoHome={() => navigateCollection("home")}
          />
        ) : storyPageOpen ? (
          <StorySection
            homepage={homepage}
            storeSettings={storeSettings}
            onGoHome={() => navigateCollection("home")}
            onExploreShop={() => {
              navigateCollection("all");
              scrollToCatalogSection();
            }}
          />
        ) : productPageId ? (
          <>
            <ProductPage
              homepage={homepage}
              product={products.find((p) => p.id === productPageId) || products[0]}
              products={products}
              reels={reels}
              favorites={favorites}
              canManageReviews={canManageReviews}
              onToggleFavorite={(id) =>
                setFavorites((old) =>
                  old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
                )
              }
              onAddToCart={addToCart}
              onSelectProduct={openFullProductPage}
              onGoBack={() => {
                setProductPageId(null);
                window.location.hash = collection === "all" ? "" : collection;
              }}
              money={money}
            />

            {homepage.reelsEnabled !== false && (
              <ShortVideoReelsSection
                reels={reels}
                products={products}
                onOpenReel={openReelModal}
                onQuickAdd={(prod, sz) => addToCart(prod, sz, true)}
              />
            )}
          </>
        ) : collection !== "all" ? (
          <CollectionPage
            collection={collection}
            products={
              visibleProducts.length > 0
                ? visibleProducts
                : products.filter((p) => p && (p.status || "published") !== "draft")
            }
            allowedCategories={activeCategories}
            allowedCollections={activeCollectionsForPage}
            search={search}
            favorites={favorites}
            onToggleFavorite={(id) =>
              setFavorites((old) =>
                old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
              )
            }
            onOpenProduct={(p, startVideo) =>
              startVideo ? openProductModal(p, true) : openFullProductPage(p)
            }
            onGoHome={() => navigateCollection("home")}
            money={money}
          />
        ) : (
          <HomePage
            homepage={homepage}
            storeSettings={storeSettings}
            products={products}
            visibleProducts={visibleProducts}
            reels={homepage.reelsEnabled === false ? [] : reels}
            categories={activeCategories}
            allowedCollections={activeCollectionsForPage}
            category={category}
            setCategory={setCategory}
            favorites={favorites}
            onToggleFavorite={(id) =>
              setFavorites((old) =>
                old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
              )
            }
            onOpenProductPage={openFullProductPage}
            onOpenQuickView={openProductModal}
            onDirectAddToCart={(product, sz) => addToCart(product, sz, true)}
            onOpenReel={openReelModal}
            onFeaturedClick={handleFeaturedClick}
            onNavigateCollection={navigateCollection}
            under999Section={under999SectionElement}
            email={email}
            setEmail={setEmail}
            onSubscribe={subscribe}
            money={money}
          />
        )}
      </main>

      <footer className="site-footer-dark">
        <div className="footer-grid-4">
          <div>
            <p className="footer-brand-blurb">
              {homepage.footer?.tagline ||
                "We design and make every pair ourselves, then ship it straight to you."}
            </p>
            <p className="footer-connect-title">Connect with us</p>
            <a
              href={`mailto:${storeSettings.supportEmail || "support@calzare.in"}`}
              className="footer-contact-link"
            >
              {storeSettings.supportEmail || "support@calzare.in"}
            </a>
            <a
              href={`tel:${(storeSettings.supportPhone || "+91 98765 43210").replace(/\s+/g, "")}`}
              className="footer-contact-link"
            >
              {storeSettings.supportPhone || "+91 98765 43210"}
            </a>
            <p className="footer-hours">
              {homepage.footer?.hours || "Monday to Friday, 10:00 AM to 6:00 PM."}
            </p>
            <div className="footer-social-row">
              <a
                href="#shop"
                className="footer-social-btn"
                aria-label="Instagram"
                onClick={(e) => {
                  e.preventDefault();
                  navigateCollection("home");
                }}
              >
                IG
              </a>
              <a
                href={`mailto:${storeSettings.supportEmail || "support@calzare.in"}`}
                className="footer-social-btn"
                aria-label="Email"
              >
                ✉
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-heading">Main Menu</h4>
            <ul className="footer-col-list">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateCollection("home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#shop"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateCollection("all");
                    scrollToCatalogSection();
                  }}
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#track-order"
                  onClick={(e) => {
                    e.preventDefault();
                    openTrackOrderPage();
                  }}
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#story"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateCollection("story");
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setInfoModal("contact");
                  }}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-heading">Useful Links</h4>
            <ul className="footer-col-list">
              <li>
                <a
                  href="#men"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateCollection("men");
                  }}
                >
                  Men
                </a>
              </li>
              <li>
                <a
                  href="#women"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateCollection("women");
                  }}
                >
                  Women
                </a>
              </li>
              <li>
                <a
                  href="#shipping-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    openPolicyPage("shipping-policy");
                  }}
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#refund-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    openPolicyPage("refund-policy");
                  }}
                >
                  Refund & Exchange Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-heading">
              {homepage.footer?.newsletterHeading ||
                `Join the ${storeSettings.storeName || "Calzare"} team`}
            </h4>
            <p className="footer-newsletter-copy">
              {homepage.footer?.newsletterCopy ||
                "Sign up for early access to drops and free shipping updates on new collections."}
            </p>
            <form className="footer-newsletter-form" onSubmit={subscribe}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="footer-newsletter-input"
              />
              <button type="submit" className="footer-newsletter-submit">
                Sign Up
              </button>
            </form>
            <p className="footer-privacy-note">
              By entering the e-mail you accept the{" "}
              <a
                href="#shipping-policy"
                onClick={(e) => {
                  e.preventDefault();
                  openPolicyPage("shipping-policy");
                }}
              >
                store policies
              </a>
              .
            </p>
          </div>
        </div>

        <div className="footer-watermark-wordmark" aria-hidden="true">
          {storeSettings.storeName || "Calzare"}
        </div>

        <div className="footer-bottom-bar">
          <span>
            {homepage.footer?.copyright ||
              `© 2026 ${storeSettings.storeName || "Calzare"}. All rights reserved.`}
          </span>
          <div className="footer-payment-badges">
            <span className="footer-pay-pill">VISA</span>
            <span className="footer-pay-pill">MASTERCARD</span>
            <span className="footer-pay-pill">RuPay</span>
            <span className="footer-pay-pill">UPI</span>
          </div>
        </div>
      </footer>

      {pipVisible && homepage.pipVideo?.enabled && pipVideoUrl && (
        <div className="pip-widget">
          <video
            src={pipVideoUrl}
            poster={safeImg(homepage.pipVideo.poster)}
            autoPlay
            loop
            muted={pipMuted}
            playsInline
            onError={() => setPipVisible(false)}
            onClick={() => {
              const target =
                products.find((p) => p.id === homepage.pipVideo.productId) || products[0];
              if (target) openProductModal(target, true);
            }}
          />
          <div className="pip-controls">
            <button
              type="button"
              onClick={() => setPipMuted((m) => !m)}
              aria-label={pipMuted ? "Unmute video" : "Mute video"}
            >
              {pipMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
            <button
              type="button"
              onClick={() => setPipVisible(false)}
              aria-label="Close floating video"
            >
              <X size={13} />
            </button>
          </div>
          <button
            type="button"
            className="pip-caption"
            onClick={() => {
              const target =
                products.find((p) => p.id === homepage.pipVideo.productId) || products[0];
              if (target) openProductModal(target, true);
            }}
          >
            {homepage.pipVideo.label} <ArrowUpRight size={12} />
          </button>
        </div>
      )}

      {activeProduct && (
        <div className="modal-backdrop" onClick={() => setActiveProduct(null)}>
          <div className="pdp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setActiveProduct(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="pdp-media">
              {showProductVideo && safeVid(activeProduct.videoUrl) ? (
                <video
                  src={safeVid(activeProduct.videoUrl)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  onError={() => setShowProductVideo(false)}
                />
              ) : (
                <img
                  src={safeImg(activeProduct.image)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                  }}
                  alt={activeProduct.name}
                />
              )}

              {safeVid(activeProduct.videoUrl) && (
                <div className="media-switcher">
                  <button
                    type="button"
                    className={!showProductVideo ? "active" : ""}
                    onClick={() => setShowProductVideo(false)}
                  >
                    PHOTO
                  </button>
                  <button
                    type="button"
                    className={showProductVideo ? "active" : ""}
                    onClick={() => setShowProductVideo(true)}
                  >
                    <Play size={11} /> MOTION FIT
                  </button>
                </div>
              )}
            </div>

            <div className="pdp-details">
              <p className="eyebrow">
                {activeProduct.category.toUpperCase()} — {activeProduct.color.toUpperCase()}
              </p>
              <h2>{activeProduct.name}</h2>
              <div className="pdp-price-row">
                <strong>{money(activeProduct.price)}</strong>
                {activeProduct.oldPrice && (
                  <span className="old-price">{money(activeProduct.oldPrice)}</span>
                )}
              </div>
              <p className="pdp-desc">{activeProduct.description}</p>

              {activeProduct.highlights && (
                <ul className="pdp-highlights">
                  {activeProduct.highlights.map((h, i) => (
                    <li key={i}>
                      <Check size={13} /> {h}
                    </li>
                  ))}
                </ul>
              )}

              <div className="size-block">
                <span className="size-label">SELECT UK SIZE</span>
                <div className="size-grid">
                  {(activeProduct.sizes || ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={selectedSize === sz ? "size-pill active" : "size-pill"}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="primary-cta-btn"
                onClick={() => {
                  addToCart(activeProduct, selectedSize, true);
                  setActiveProduct(null);
                }}
              >
                ADD TO BAG — {money(activeProduct.price)} <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeReel && activeReelProduct && (
        <div className="modal-backdrop" onClick={() => setActiveReel(null)}>
          <div className="reel-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setActiveReel(null)}
              aria-label="Close video"
            >
              <X size={18} />
            </button>

            <div className="reel-modal-video">
              {safeVid(activeReel.videoUrl) ? (
                <video
                  src={safeVid(activeReel.videoUrl)}
                  poster={safeImg(activeReel.poster)}
                  autoPlay
                  loop
                  muted={reelMuted}
                  playsInline
                />
              ) : (
                <img
                  src={safeImg(activeReel.poster || activeReelProduct.image)}
                  alt={activeReel.title}
                />
              )}
              {safeVid(activeReel.videoUrl) && (
                <button
                  type="button"
                  className="reel-mute-btn"
                  onClick={() => setReelMuted((m) => !m)}
                >
                  {reelMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              )}
            </div>

            <div className="reel-modal-shop">
              <p className="eyebrow">{activeReel.tag}</p>
              <h3>{activeReel.title}</h3>
              <div className="reel-featured-box">
                <img
                  src={safeImg(activeReelProduct.image)}
                  alt={activeReelProduct.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                  }}
                />
                <div>
                  <strong>{activeReelProduct.name}</strong>
                  <p>{activeReelProduct.color}</p>
                  <span>{money(activeReelProduct.price)}</span>
                </div>
              </div>

              <span className="size-label">CHOOSE SIZE</span>
              <div className="size-grid">
                {(activeReelProduct.sizes || ["UK 7", "UK 8", "UK 9", "UK 10"]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={reelSize === sz ? "size-pill active" : "size-pill"}
                    onClick={() => setReelSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="primary-cta-btn"
                onClick={() => {
                  addToCart(activeReelProduct, reelSize, true);
                  setActiveReel(null);
                }}
              >
                ADD TO BAG — {money(activeReelProduct.price)}
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          {notice}
          <button onClick={() => setNotice("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            style={{ position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head">
              <h2>YOUR BAG ({cartCount})</h2>
              <button className="icon-button" onClick={() => setCartOpen(false)}>
                <X />
              </button>
            </div>

            {showConfetti && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  overflow: "hidden",
                  zIndex: 25
                }}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: `${(i * 4.2) % 98}%`,
                      width: "8px",
                      height: "8px",
                      borderRadius: i % 2 === 0 ? "50%" : "2px",
                      background: ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][i % 5],
                      animation: `calzareConfettiFall ${1.1 + (i % 5) * 0.2}s ease-out forwards`,
                      animationDelay: `${(i % 6) * 0.06}s`
                    }}
                  />
                ))}
                <style>{`
                  @keyframes calzareConfettiFall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(420px) rotate(360deg); opacity: 0; }
                  }
                `}</style>
              </div>
            )}

            <div className="offer-bar-box">
              <p>{tierProgress.text}</p>
              <div className="offer-track">
                <div className="offer-fill" style={{ width: `${tierProgress.percent}%` }} />
              </div>
              <div className="offer-milestones">
                <span className={cartSubtotal >= freeShipMin ? "done" : ""}>FREE SHIP</span>
                <span className={cartCount >= 2 ? "done" : ""}>2 PAIRS: 10% OFF</span>
                <span className={cartCount >= 3 ? "done" : ""}>3 PAIRS: 15% OFF</span>
              </div>
            </div>

            {cart.length ? (
              <>
                <div className="cart-items">
                  {cart.map((item) => {
                    const unitDiscounted =
                      discountRate > 0
                        ? Math.round(item.price * (1 - discountRate))
                        : item.price;

                    return (
                      <div className="cart-item" key={item.cartKey}>
                        <img
                          src={safeImg(item.image)}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                          }}
                        />
                        <div className="cart-item-info">
                          <h3>{item.name}</h3>
                          <span className="cart-size-tag">SIZE: {item.size}</span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                              margin: "4px 0"
                            }}
                          >
                            <strong style={{ fontSize: "14px" }}>
                              {money(unitDiscounted)}
                            </strong>
                            {discountRate > 0 && (
                              <>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    textDecoration: "line-through",
                                    opacity: 0.55
                                  }}
                                >
                                  {money(item.price)}
                                </span>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    background: "#DCFCE7",
                                    color: "#166534",
                                    padding: "2px 6px",
                                    borderRadius: "999px"
                                  }}
                                >
                                  {Math.round(discountRate * 100)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          <div className="quantity">
                            <button onClick={() => changeQuantity(item.cartKey, -1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => changeQuantity(item.cartKey, 1)}>+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {upsellProducts.length > 0 && (
                    <div
                      style={{
                        marginTop: "16px",
                        paddingTop: "14px",
                        borderTop: "1px solid var(--line)"
                      }}
                    >
                      <span
                        className="upsell-title"
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          fontSize: "10.5px",
                          fontWeight: 700
                        }}
                      >
                        COMPLETE THE ROTATION (UNLOCK EXTRA SAVINGS)
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          overflowX: "auto",
                          paddingBottom: "6px",
                          scrollbarWidth: "none"
                        }}
                      >
                        {upsellProducts.map((u) => (
                          <div
                            key={u.id}
                            style={{
                              flex: "0 0 135px",
                              border: "1px solid var(--line, #e2e8f0)",
                              borderRadius: "10px",
                              padding: "8px",
                              background: "#FFFFFF",
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px"
                            }}
                          >
                            <img
                              src={safeImg(u.image)}
                              alt={u.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                              }}
                              style={{
                                width: "100%",
                                height: "84px",
                                objectFit: "cover",
                                borderRadius: "6px"
                              }}
                            />
                            <strong
                              style={{
                                fontSize: "11px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {u.name}
                            </strong>
                            <span style={{ fontSize: "11.5px", fontWeight: 600 }}>
                              {money(u.price)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                addToCart(u, u.sizes?.[2] || u.sizes?.[0] || "UK 8", false)
                              }
                              style={{
                                marginTop: "auto",
                                padding: "6px 8px",
                                borderRadius: "999px",
                                border: "1px solid var(--ink, #1e211d)",
                                background: "var(--ink, #1e211d)",
                                color: "#FFFFFF",
                                fontSize: "10px",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              + ADD
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="cart-trust-strip">
                  <span>
                    <Truck size={13} /> Free Shipping
                  </span>
                  <span>
                    <RefreshCw size={13} /> 7-Day Exchange
                  </span>
                  <span>
                    <ShieldCheck size={13} /> Partial COD
                  </span>
                </div>

                <div className="cart-summary">
                  <div className="summary-line">
                    <span>SUBTOTAL</span>
                    <span>{money(cartSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="summary-line discount">
                      <span>BUNDLE SAVINGS ({Math.round(discountRate * 100)}%)</span>
                      <span>−{money(discountAmount)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && appliedCoupon && (
                    <div className="summary-line discount">
                      <span>COUPON ({appliedCoupon.code})</span>
                      <span>−{money(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="summary-line">
                    <span>SHIPPING</span>
                    <span>{shippingFee === 0 ? "COMPLIMENTARY" : money(shippingFee)}</span>
                  </div>
                  <div className="cart-total">
                    <span>TOTAL</span>
                    <strong>{money(cartFinalTotal)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-cta-btn"
                  onClick={() => {
                    setCartOpen(false);
                    setOrderConfirmed(null);
                    setCheckoutOpen(true);
                  }}
                >
                  PROCEED TO CHECKOUT <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <p className="empty-state">Your bag is currently empty.</p>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCheckoutOpen(false)}>
              <X size={18} />
            </button>

            {orderConfirmed ? (
              <div className="order-success">
                <p className="eyebrow">ORDER CONFIRMED</p>
                <h2>
                  Thank you for walking with <em>CALZARE.</em>
                </h2>
                <p>
                  Reference ID: <strong>{orderConfirmed.orderId}</strong>
                  <br />
                  Total Payable: <strong>{money(orderConfirmed.total)}</strong> (
                  {orderConfirmed.paymentMethod})
                </p>
                <div style={{ display: "grid", gap: "10px" }}>
                  <button
                    type="button"
                    className="primary-cta-btn"
                    onClick={() => {
                      const confirmedId = orderConfirmed.orderId;
                      setCheckoutOpen(false);
                      openTrackOrderPage(confirmedId);
                    }}
                  >
                    TRACK THIS ORDER <ArrowUpRight size={15} />
                  </button>
                  <button
                    type="button"
                    className="size-pill"
                    style={{ width: "100%", padding: "12px" }}
                    onClick={() => setCheckoutOpen(false)}
                  >
                    CONTINUE EXPLORING
                  </button>
                </div>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={handlePlaceOrder}>
                <p className="eyebrow">EXPRESS CHECKOUT</p>
                <h3>Delivery Details</h3>
                <input
                  required
                  placeholder="Full Name"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                />
                <input
                  required
                  placeholder="Mobile Number (for doorstep updates)"
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                />
                <input
                  required
                  placeholder="Street Address / Apartment"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                />
                <div className="checkout-row">
                  <input
                    required
                    placeholder="City"
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                  />
                  <input
                    required
                    placeholder="PIN Code"
                    value={checkoutForm.pincode}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                  />
                </div>
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })
                  }
                >
                  <option>Partial COD (₹299 Advance)</option>
                  <option>UPI / Cards / NetBanking</option>
                  <option>Cash on Delivery</option>
                </select>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    placeholder="Coupon Code (optional)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  />
                  <button
                    type="button"
                    className="size-pill"
                    onClick={handleApplyCoupon}
                    style={{ whiteSpace: "nowrap", padding: "0 14px" }}
                  >
                    APPLY
                  </button>
                </div>
                {couponError && (
                  <p style={{ color: "#9f2d2d", fontSize: "11.5px", margin: 0 }}>{couponError}</p>
                )}
                {appliedCoupon && (
                  <p style={{ color: "#166534", fontSize: "11.5px", margin: 0 }}>
                    ✓ {appliedCoupon.code} applied (−{money(couponDiscount)})
                  </p>
                )}

                <button type="submit" className="primary-cta-btn">
                  PLACE ORDER — {money(cartFinalTotal)} <ArrowUpRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {infoModal && (
        <div className="modal-backdrop" onClick={() => setInfoModal(null)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setInfoModal(null)} aria-label="Close">
              <X size={18} />
            </button>

            <div style={{ display: "grid", gap: "14px" }}>
              <p className="eyebrow">GET IN TOUCH</p>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px",
                  fontWeight: 500,
                  margin: 0
                }}
              >
                Contact CALZARE
              </h3>
              <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.8, margin: 0 }}>
                Have a question about sizing, orders, or collaborations? Our studio team responds
                within 24 hours.
              </p>
              <div
                style={{
                  fontSize: "12px",
                  lineHeight: 1.9,
                  background: "var(--surface-alt)",
                  padding: "14px"
                }}
              >
                <strong>Email:</strong> {storeSettings.supportEmail || "support@calzare.in"}
                <br />
                <strong>WhatsApp Concierge:</strong>{" "}
                {storeSettings.supportPhone || "+91 98765 43210"}
                <br />
                <strong>Studio Hours:</strong> Mon – Sat, 10:00 AM – 6:30 PM IST
              </div>
              <button
                type="button"
                className="primary-cta-btn"
                onClick={() => setInfoModal(null)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {authOpen && (
        <div className="modal-backdrop" onClick={() => setAuthOpen(false)}>
          <div
            className="checkout-modal"
            style={{ maxHeight: "85dvh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Close">
              <X size={18} />
            </button>

            {currentUser ? (
              <div style={{ display: "grid", gap: "16px" }}>
                <p className="eyebrow">CALZARE MEMBER</p>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "28px",
                    fontWeight: 500,
                    margin: 0
                  }}
                >
                  Hello, <em>{currentUser.name}.</em>
                </h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                  {currentUser.email} {currentUser.phone ? `• ${currentUser.phone}` : ""}
                </p>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                  <p className="eyebrow" style={{ marginBottom: "10px" }}>
                    YOUR ORDERS ({myOrders.length})
                  </p>
                  {myOrders.length ? (
                    <div style={{ display: "grid", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                      {myOrders.map((ord) => (
                        <div
                          key={ord.orderId}
                          onClick={() => {
                            setAuthOpen(false);
                            openTrackOrderPage(ord.orderId);
                          }}
                          style={{
                            padding: "10px 12px",
                            background: "var(--surface-alt)",
                            fontSize: "11.5px",
                            display: "flex",
                            justifyContent: "space-between",
                            cursor: "pointer"
                          }}
                        >
                          <div>
                            <strong>{ord.orderId}</strong>
                            <div style={{ color: "var(--muted)" }}>
                              {ord.items?.length || 1} item(s) • {ord.paymentStatus}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <strong>{money(ord.total)}</strong>
                            <div style={{ color: "#166534", fontWeight: 600 }}>
                              {ord.status} →
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                      No orders linked to this profile yet.
                    </p>
                  )}
                </div>

                {currentUser.role === "admin" && (
                  <button
                    type="button"
                    className="primary-cta-btn"
                    onClick={() => {
                      setAuthOpen(false);
                      setIsAdmin(true);
                      window.location.hash = "admin";
                    }}
                  >
                    OPEN ADMIN PANEL
                  </button>
                )}

                <button type="button" className="primary-cta-btn" onClick={handleSignOut}>
                  SIGN OUT
                </button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={handleAuthSubmit}>
                <p className="eyebrow">
                  {authMode === "login" ? "WELCOME BACK" : "JOIN CALZARE"}
                </p>
                <h3>{authMode === "login" ? "Sign in to your account" : "Create an account"}</h3>

                {authMode === "register" && (
                  <>
                    <input
                      required
                      placeholder="Full Name"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    />
                    <input
                      required
                      placeholder="Mobile Number (links your orders)"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                    />
                  </>
                )}

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />

                {authError && (
                  <p style={{ color: "#9f2d2d", fontSize: "11.5px", margin: 0 }}>{authError}</p>
                )}

                <button type="submit" className="primary-cta-btn">
                  {authMode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}{" "}
                  <ArrowUpRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setAuthForm({ name: "", email: "", phone: "", password: "" });
                    setAuthError("");
                  }}
                  style={{
                    border: 0,
                    background: "none",
                    fontSize: "11px",
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "var(--muted)",
                    marginTop: "4px"
                  }}
                >
                  {authMode === "login"
                    ? "New to CALZARE? Create an account"
                    : "Already have an account? Sign in"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;