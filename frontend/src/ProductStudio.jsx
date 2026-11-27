import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Edit3,
  Film,
  Headphones,
  Heart,
  Maximize2,
  Minus,
  PictureInPicture2,
  Play,
  Plus,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Upload,
  Volume2,
  VolumeX,
  X
} from "lucide-react";

function resolveApiBase() {
  try {
    if (
      typeof globalThis !== "undefined" &&
      globalThis.__VITE_API_URL__
    ) {
      return String(globalThis.__VITE_API_URL__);
    }
    if (typeof window !== "undefined") {
      if (window.__VITE_API_URL__) {
        return String(window.__VITE_API_URL__);
      }
      if (window.location?.hostname === "localhost") {
        return "http://localhost:5003/api";
      }
    }
  } catch {}
  return "http://localhost:5003/api";
}

const API = resolveApiBase();

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

const BROKEN_IMAGE_IDS = [
  "photo-1614252369475-531506b0b9e9",
  "photo-1520256862855-9981c41d8ba0"
];

const DEFAULT_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

const DEFAULT_PRODUCT_SHORT_VIDEOS = [
  {
    id: "pdp-clip-1",
    label: "15s Fit Check",
    tag: "ON-FOOT FIT",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: SAFE_IMAGE_FALLBACK
  },
  {
    id: "pdp-clip-2",
    label: "Sole Flex Test",
    tag: "CUSHION & GRIP",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: SAFE_IMAGE_FALLBACK
  },
  {
    id: "pdp-clip-3",
    label: "Street Styling",
    tag: "DAILY LOOK",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: SAFE_IMAGE_FALLBACK
  }
];

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    rating: 5,
    quote: '"WALKED 18,000 STEPS WITHOUT CALF FATIGUE"',
    body: "Tested these across Bangalore monsoons and broken pavement. The dual-density microfoam absorbs every harsh impact without feeling mushy. Genuinely superior to standard EVA clogs.",
    author: "Aarav Mehta",
    meta: "Verified Owner: Apex Closed-Cell Clog",
    location: "Bengaluru • Verified Buyer"
  },
  {
    id: "rev-2",
    rating: 5,
    quote: '"ARCHITECTURAL SHAPE MEETS ALL-DAY ARCH SUPPORT"',
    body: "I wear these for 10-hour hospital shifts. The sculpted arch cradle is unmatched. My feet feel fresh when clocking off.",
    author: "Priya Sundaram",
    meta: "Verified Owner: Apex All-Terrain Mule",
    location: "Mumbai • Verified Buyer"
  },
  {
    id: "rev-3",
    rating: 5,
    quote: '"100% WATERPROOF AND EFFORTLESS TO RINSE"',
    body: "Got caught in a flash downpour. Rinsed them under tap water in 20 seconds and they looked brand new. Bold aesthetic, zero ordinary energy.",
    author: "Rohan Kapoor",
    meta: "Verified Owner: Urban Hydro Slide",
    location: "Delhi • Verified Buyer"
  }
];

const CALZARE_STANDARD_CARDS = [
  {
    id: "std-1",
    title: "Fast Dispatch",
    desc: "Shipped within 24–48 hours with live tracking across India.",
    icon: Truck
  },
  {
    id: "std-2",
    title: "Easy 7-Day Swap",
    desc: "Hassle-free UK size exchange if your fit needs adjusting.",
    icon: RefreshCw
  },
  {
    id: "std-3",
    title: "100% Waterproof",
    desc: "Closed-cell construction built for rain, heat, and daily rinse.",
    icon: Droplets
  },
  {
    id: "std-4",
    title: "Direct Support",
    desc: "Real sizing and order help whenever you need it.",
    icon: Headphones
  }
];

const DEMO_CATALOG = [
  {
    id: "bayaband-army-green",
    name: "Bayaband Clog",
    tagline: "Signature side band • Dual-density Croslite comfort",
    color: "Army Green / Cobblestone",
    category: "Clogs",
    collection: "Bayaband",
    price: 2998,
    oldPrice: 5995,
    badge: "50% OFF THIS COLOR",
    image: SAFE_IMAGE_FALLBACK,
    images: [
      SAFE_IMAGE_FALLBACK,
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1000&q=85"
    ],
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    sizes: ["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    highlights: [
      "Holds up to 26 Jibbitz charms",
      "Pivoting heel straps for a secure fit",
      "Water-friendly and buoyant"
    ],
    variants: [
      {
        id: "var-army-cobble",
        label: "Army Green / Cobblestone",
        color: "Army Green / Cobblestone",
        price: 2998,
        oldPrice: 5995,
        image: SAFE_IMAGE_FALLBACK
      },
      {
        id: "var-black-white",
        label: "Black / White Band",
        color: "Black / White",
        price: 3497,
        oldPrice: 4995,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85"
      },
      {
        id: "var-stucco-sand",
        label: "Stucco / Bone Sand",
        color: "Stucco / Bone Sand",
        price: 3995,
        oldPrice: 5495,
        image:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1000&q=85"
      }
    ]
  },
  {
    id: "bayaband-stucco",
    name: "Classic Crafted Stucco Clog",
    tagline: "Textured upper • All-day arch cradle",
    color: "Stucco / Chalk",
    category: "Clogs",
    collection: "Crafted",
    price: 4495,
    oldPrice: 5495,
    badge: "NEW CRAFT",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1000&q=85",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
  },
  {
    id: "bayaband-obsidian",
    name: "Apex Closed-Cell Clog",
    tagline: "Monsoon-ready grip • High-rebound foam",
    color: "Obsidian / Slate",
    category: "Clogs",
    collection: "Bayaband",
    price: 3795,
    oldPrice: 4995,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"]
  }
];

function safeImgSrc(url) {
  if (!url || typeof url !== "string" || !url.trim()) return SAFE_IMAGE_FALLBACK;
  const clean = url.trim();
  if (clean.startsWith("blob:") || clean.startsWith("data:image/")) {
    return clean;
  }
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
    return SAFE_IMAGE_FALLBACK;
  }
  return clean;
}

function safeVideoSrc(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
  const clean = url.trim();
  if (clean.includes("assets.mixkit.co")) return "";
  return clean;
}

function createEmptyDraft(defaultSize = "UK 8") {
  return {
    author: "",
    location: "",
    size: defaultSize,
    rating: 5,
    quote: "",
    body: ""
  };
}

export function ProductPage({
  homepage,
  product,
  products = [],
  reels = [],
  favorites = [],
  onToggleFavorite,
  onAddToCart,
  onOpenCart,
  onSelectProduct,
  onGoBack,
  money,
  canManageReviews = false,
  onUpdateProduct,
  onAddVariant
}) {
  const current = product || products[0] || DEMO_CATALOG[0];
  const productId = current?.id || current?._id || "";

  const [selectedImageOverride, setSelectedImageOverride] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState("description");
  const [isMobileView, setIsMobileView] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );

  // PIP Video state (product-level PIP video & drag-and-drop)
  const [pipVideoUrl, setPipVideoUrl] = useState(() =>
    safeVideoSrc(current?.pipVideoUrl || current?.videoUrl || "")
  );
  const [pipVideoTitle, setPipVideoTitle] = useState(
    () => current?.pipVideoTitle || `${current?.name || "Product"} PIP Walkthrough`
  );
  const [pipVideoFileName, setPipVideoFileName] = useState("");
  const [pipEnabled, setPipEnabled] = useState(
    () => current?.pipEnabled !== false
  );
  const [pipFloatingOpen, setPipFloatingOpen] = useState(false);
  const [pipMuted, setPipMuted] = useState(true);
  const [isDraggingPipVideo, setIsDraggingPipVideo] = useState(false);
  const [pipUploadError, setPipUploadError] = useState("");

  // Admin panel state (Variants + Product PIP Video section)
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("variants");
  const [newVariantLabel, setNewVariantLabel] = useState("");
  const [newVariantColor, setNewVariantColor] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState("");
  const [newVariantOldPrice, setNewVariantOldPrice] = useState("");
  const [newVariantImage, setNewVariantImage] = useState("");
  const [newVariantVideo, setNewVariantVideo] = useState("");
  const [adminSavedNotice, setAdminSavedNotice] = useState("");

  const pipFileInputRef = useRef(null);
  const blobUrlRef = useRef("");

  const variantList = useMemo(() => {
    if (!current) return [];
    if (Array.isArray(current.variants) && current.variants.length > 0) {
      return current.variants.map((v, idx) => ({
        id: v.id || v._id || `${productId}-var-${idx}`,
        label: v.label || v.name || v.color || `Variant ${idx + 1}`,
        color: v.color || v.label || v.name || current.color || "Standard",
        price:
          v.price !== undefined && v.price !== null
            ? Number(v.price)
            : Number(current.price) || 0,
        oldPrice:
          v.oldPrice !== undefined && v.oldPrice !== null
            ? Number(v.oldPrice)
            : current.oldPrice
            ? Number(current.oldPrice)
            : null,
        image: safeImgSrc(v.image || current.image),
        videoUrl: safeVideoSrc(v.videoUrl || current.videoUrl),
        sizes: Array.isArray(v.sizes) && v.sizes.length > 0 ? v.sizes : null
      }));
    }
    return [];
  }, [current, productId]);

  useEffect(() => {
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const activeVariant =
    variantList.length > 0
      ? variantList[Math.min(selectedVariantIndex, variantList.length - 1)]
      : null;

  const sizes = useMemo(() => {
    if (activeVariant?.sizes?.length) return activeVariant.sizes;
    if (current?.sizes?.length) return current.sizes;
    return DEFAULT_SIZES;
  }, [activeVariant, current?.sizes]);

  const [selectedSize, setSelectedSize] = useState(
    sizes.includes("UK 8") ? "UK 8" : sizes[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedColorwayId, setSelectedColorwayId] = useState(productId);

  const [activeClipIndex, setActiveClipIndex] = useState(null);
  const [clipMuted, setClipMuted] = useState(false);
  const [failedClipIds, setFailedClipIds] = useState({});

  const [backendReviews, setBackendReviews] = useState([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewDraft, setReviewDraft] = useState(() =>
    createEmptyDraft(sizes.includes("UK 8") ? "UK 8" : sizes[0])
  );

  async function fetchBackendReviews() {
    try {
      const res = await fetch(`${API}/reviews`);
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data?.reviews)
        ? data.reviews
        : Array.isArray(data)
        ? data
        : [];
      const approved = list.filter(
        (r) => r && (r.status || "approved") === "approved"
      );
      setBackendReviews(
        approved.map((r, i) => ({
          id: r._id || r.id || `api-rev-${i}`,
          productId: r.productId || "",
          rating: Number(r.rating) || 5,
          quote: r.headline
            ? `"${String(r.headline).replace(/^"+|"+$/g, "").toUpperCase()}"`
            : `"VERIFIED EXPERIENCE"`,
          body: r.comment || "",
          author: r.customerName || "Verified Buyer",
          meta: `Verified Owner: ${r.productName || current?.name || "CALZARE"}`,
          location: `${r.location || "India"} • Verified Buyer`
        }))
      );
    } catch {}
  }

  useEffect(() => {
    fetchBackendReviews();
    window.addEventListener("calzare_store_updated", fetchBackendReviews);
    return () => {
      window.removeEventListener("calzare_store_updated", fetchBackendReviews);
    };
  }, [current?.name]);

  useEffect(() => {
    const nextSizes = current?.sizes?.length ? current.sizes : DEFAULT_SIZES;
    const defaultSz = nextSizes.includes("UK 8") ? "UK 8" : nextSizes[0];
    setSelectedVariantIndex(0);
    setSelectedImageOverride("");
    setSelectedSize(defaultSz);
    setQuantity(1);
    setShowVideo(false);
    setActiveClipIndex(null);
    setFailedClipIds({});
    setSelectedColorwayId(productId);
    setReviewFormOpen(false);
    setEditingReviewId(null);
    setReviewDraft(createEmptyDraft(defaultSz));
    setActiveInfoTab("description");
    setPipVideoUrl(safeVideoSrc(current?.pipVideoUrl || current?.videoUrl || ""));
    setPipVideoTitle(
      current?.pipVideoTitle || `${current?.name || "Product"} PIP Walkthrough`
    );
    setPipVideoFileName(current?.pipVideoFileName || "");
    setPipEnabled(current?.pipEnabled !== false);
    setPipFloatingOpen(false);
    setPipUploadError("");
    setNewVariantPrice(String(Number(current?.price) || 2998));
    setNewVariantOldPrice(
      current?.oldPrice ? String(Number(current.oldPrice)) : ""
    );
  }, [productId]);

  useEffect(() => {
    if (!sizes.includes(selectedSize)) {
      setSelectedSize(sizes.includes("UK 8") ? "UK 8" : sizes[0]);
    }
  }, [sizes, selectedSize]);

  useEffect(() => {
    if (!canManageReviews) {
      setReviewFormOpen(false);
      setEditingReviewId(null);
    }
  }, [canManageReviews]);

  function notifyAdminNotice(msg) {
    setAdminSavedNotice(msg);
    setTimeout(() => {
      setAdminSavedNotice((prev) => (prev === msg ? "" : prev));
    }, 2800);
  }

  function handlePipVideoFile(file) {
    setPipUploadError("");
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setPipUploadError("Please drop or choose a valid video file (MP4, WebM, MOV).");
      return;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    blobUrlRef.current = objectUrl;
    setPipVideoUrl(objectUrl);
    setPipVideoFileName(file.name);
    if (!pipVideoTitle.trim() || pipVideoTitle.endsWith("PIP Walkthrough")) {
      setPipVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    setPipEnabled(true);
    setPipFloatingOpen(true);
    onUpdateProduct?.(productId, {
      pipVideoUrl: objectUrl,
      pipVideoFileName: file.name,
      pipEnabled: true
    });
    notifyAdminNotice(`Loaded PIP video: ${file.name}`);
  }

  function handlePipDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPipVideo(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handlePipVideoFile(files[0]);
    }
  }

  function handleSavePipSettings(e) {
    e.preventDefault();
    const cleanedUrl = safeVideoSrc(pipVideoUrl);
    onUpdateProduct?.(productId, {
      pipVideoUrl: cleanedUrl,
      pipVideoTitle: pipVideoTitle.trim() || `${current.name} PIP`,
      pipVideoFileName: pipVideoFileName || "",
      pipEnabled
    });
    if (cleanedUrl && pipEnabled) {
      setPipFloatingOpen(true);
    }
    notifyAdminNotice("Product PIP video settings saved.");
  }

  function handleClearPipVideo() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = "";
    }
    setPipVideoUrl("");
    setPipVideoFileName("");
    setPipFloatingOpen(false);
    setPipUploadError("");
    onUpdateProduct?.(productId, {
      pipVideoUrl: "",
      pipVideoFileName: ""
    });
    notifyAdminNotice("PIP video cleared.");
  }

  function handleAddVariantSubmit(e) {
    e.preventDefault();
    const label = newVariantLabel.trim();
    if (!label) return;

    const color = newVariantColor.trim() || label;
    const price = Number(newVariantPrice) || Number(current.price) || 2998;
    const oldPrice = newVariantOldPrice ? Number(newVariantOldPrice) : null;
    const image = safeImgSrc(newVariantImage || current.image);
    const videoUrl = safeVideoSrc(newVariantVideo || current.videoUrl || "");

    const createdVariant = {
      id: `var-${Date.now()}`,
      label,
      color,
      price,
      oldPrice,
      image,
      videoUrl
    };

    const updatedVariants = [...variantList, createdVariant];
    onAddVariant?.(productId, createdVariant);
    onUpdateProduct?.(productId, { variants: updatedVariants });

    setSelectedVariantIndex(updatedVariants.length - 1);
    setSelectedImageOverride("");
    setNewVariantLabel("");
    setNewVariantColor("");
    setNewVariantImage("");
    setNewVariantVideo("");
    notifyAdminNotice(`Added variant "${label}".`);
  }

  function handleRemoveVariant(idx) {
    const updatedVariants = variantList.filter((_, i) => i !== idx);
    onUpdateProduct?.(productId, { variants: updatedVariants });
    setSelectedVariantIndex(0);
    setSelectedImageOverride("");
    notifyAdminNotice("Removed variant.");
  }

  const productReelsEnabled = homepage?.productReelsEnabled !== false;

  const baseVariantOrProductImage = activeVariant
    ? activeVariant.image
    : safeImgSrc(current?.image);

  const currentImage = selectedImageOverride
    ? safeImgSrc(selectedImageOverride)
    : baseVariantOrProductImage;

  const currentVideo = activeVariant
    ? activeVariant.videoUrl
    : safeVideoSrc(current?.videoUrl);

  const activeColorLabel = activeVariant
    ? activeVariant.color
    : current?.color || "";

  const activePipVideo = safeVideoSrc(pipVideoUrl || current?.pipVideoUrl || "");

  const productShortClips = useMemo(() => {
    if (!current || !productReelsEnabled) return [];
    const posterImg = currentImage;
    const clips = [];

    if (activePipVideo) {
      clips.push({
        id: `${productId}-pip-clip`,
        label: pipVideoTitle || "PIP Preview",
        tag: "PIP VIDEO",
        videoUrl: activePipVideo,
        poster: posterImg
      });
    }

    if (currentVideo) {
      clips.push({
        id: `${productId}-main-clip`,
        label: "Official Demo",
        tag: "IN MOTION",
        videoUrl: currentVideo,
        poster: posterImg
      });
    }

    const matchingReels = (Array.isArray(reels) ? reels : []).filter(
      (r) => r && safeVideoSrc(r.videoUrl)
    );
    matchingReels.forEach((r, idx) => {
      clips.push({
        id: r.id || `reel-clip-${idx}`,
        label: r.title || `Clip ${idx + 1}`,
        tag: r.tag || "SHORT PLAY",
        videoUrl: safeVideoSrc(r.videoUrl),
        poster: safeImgSrc(r.poster || posterImg)
      });
    });

    if (clips.length === 0) {
      DEFAULT_PRODUCT_SHORT_VIDEOS.forEach((demo, idx) => {
        clips.push({
          ...demo,
          id: `${productId}-${demo.id}-${idx}`,
          poster: posterImg
        });
      });
    }

    return clips.slice(0, 5);
  }, [
    current,
    productId,
    reels,
    productReelsEnabled,
    currentVideo,
    currentImage,
    activePipVideo,
    pipVideoTitle
  ]);

  const productReviews = useMemo(() => {
    const matched = backendReviews.filter(
      (r) => !r.productId || r.productId === productId
    );
    return matched.length > 0 ? matched : DEFAULT_REVIEWS;
  }, [backendReviews, productId]);

  const averageRating = useMemo(() => {
    if (!productReviews.length) return "5.0";
    const total = productReviews.reduce(
      (sum, r) => sum + (Number(r.rating) || 5),
      0
    );
    return (total / productReviews.length).toFixed(1);
  }, [productReviews]);

  const colorOptions = useMemo(() => {
    if (!current) return [];
    const list = Array.isArray(products) && products.length > 0 ? products : DEMO_CATALOG;
    const sameGroup = list.filter(
      (p) =>
        p &&
        (p.category === current.category || p.collection === current.collection)
    );
    const ordered = sameGroup.some((p) => (p.id || p._id) === productId)
      ? sameGroup
      : [...sameGroup, current];
    const seen = new Set();
    return ordered
      .filter((item) => {
        const id = item.id || item._id;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 4);
  }, [products, current, productId]);

  const { suggestedItems, alsoBoughtItems } = useMemo(() => {
    const sourceList =
      Array.isArray(products) && products.length > 0 ? products : DEMO_CATALOG;
    const list = sourceList.filter((p) => {
      const id = p?.id || p?._id;
      return p && id && id !== productId && (p.status || "published") !== "draft";
    });

    const curCat = String(current?.category || "").toLowerCase();
    const curCol = String(current?.collection || "").toLowerCase();

    const similar = list.filter((p) => {
      const pCat = String(p.category || "").toLowerCase();
      const pCol = String(p.collection || "").toLowerCase();
      return (curCat && pCat === curCat) || (curCol && pCol === curCol);
    });

    const primarySuggestions = (similar.length >= 3 ? similar : list).slice(0, 4);
    const primaryIds = new Set(primarySuggestions.map((p) => p.id || p._id));
    const secondaryAlsoBought = list
      .filter((p) => !primaryIds.has(p.id || p._id))
      .concat(list.filter((p) => primaryIds.has(p.id || p._id)))
      .slice(0, 3);

    return {
      suggestedItems: primarySuggestions,
      alsoBoughtItems: secondaryAlsoBought
    };
  }, [products, productId, current?.category, current?.collection]);

  const pdpCfg = homepage?.productPage || {};

  const formatPrice =
    typeof money === "function"
      ? money
      : (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

  const priceNum = activeVariant
    ? Number(activeVariant.price) || 0
    : Number(current.price) || 0;
  const oldPriceNum = activeVariant
    ? Number(activeVariant.oldPrice) || 0
    : Number(current.oldPrice) || 0;
  const discountPct =
    oldPriceNum > priceNum && priceNum > 0
      ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
      : 0;

  const isFavorite = favorites.includes(productId);

  function buildCartProductPayload() {
    const variantSuffix =
      activeVariant && activeVariant.label ? ` — ${activeVariant.label}` : "";
    return {
      ...current,
      id: activeVariant ? `${productId}__${activeVariant.id}` : productId,
      baseProductId: productId,
      name: `${current.name}${variantSuffix}`,
      color: activeColorLabel || current.color,
      price: priceNum,
      oldPrice: oldPriceNum || null,
      image: currentImage,
      videoUrl: currentVideo
    };
  }

  function handleAddSelection(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();

    const itemToAdd = buildCartProductPayload();
    onAddToCart?.(itemToAdd, selectedSize, true, quantity);
    onOpenCart?.();
  }

  function handleExpandMedia() {
    const el = document.querySelector(".pdp-stage");
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }

  function handleOpenNewReviewForm() {
    if (!canManageReviews) return;
    setEditingReviewId(null);
    setReviewDraft(createEmptyDraft(selectedSize));
    setReviewFormOpen(true);
  }

  function handleStartEditReview(rev) {
    if (!canManageReviews) return;
    const rawQuote = String(rev.quote || "").replace(/^"+|"+$/g, "").trim();
    const cleanCity = String(rev.location || "")
      .split("•")[0]
      .trim();

    setEditingReviewId(rev.id);
    setReviewDraft({
      author: rev.author || "",
      location: cleanCity === "Verified Buyer" ? "" : cleanCity,
      size: selectedSize,
      rating: Number(rev.rating) || 5,
      quote: rawQuote,
      body: rev.body || ""
    });
    setReviewFormOpen(true);
  }

  async function handleDeleteReview(revId) {
    if (!canManageReviews) return;
    const adminToken = sessionStorage.getItem("calzare_admin_token") || "";
    try {
      await fetch(`${API}/admin/reviews/${revId}`, {
        method: "DELETE",
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
      });
      await fetchBackendReviews();
      window.dispatchEvent(new Event("calzare_store_updated"));
    } catch {}
    if (editingReviewId === revId) {
      setEditingReviewId(null);
      setReviewFormOpen(false);
    }
  }

  async function handleSaveReview(e) {
    e.preventDefault();
    if (!canManageReviews) return;

    const author = reviewDraft.author.trim();
    const body = reviewDraft.body.trim();
    if (!author || !body) return;

    const rawHeadline = reviewDraft.quote.trim() || `LOVED MY ${current.name}`;
    const adminToken = sessionStorage.getItem("calzare_admin_token") || "";

    const isBackendId =
      editingReviewId &&
      backendReviews.some((item) => String(item.id) === String(editingReviewId));

    const payload = {
      productId,
      productName: current.name,
      customerName: author,
      location: reviewDraft.location.trim() || "India",
      rating: Number(reviewDraft.rating) || 5,
      headline: rawHeadline.toUpperCase(),
      comment: body,
      status: "approved",
      verifiedBuyer: true,
      featuredOnHomepage: true
    };

    try {
      const endpoint = isBackendId
        ? `${API}/admin/reviews/${editingReviewId}`
        : `${API}/admin/reviews`;
      const method = isBackendId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchBackendReviews();
        window.dispatchEvent(new Event("calzare_store_updated"));
      }
    } catch {}

    setReviewDraft(createEmptyDraft(selectedSize));
    setEditingReviewId(null);
    setReviewFormOpen(false);
  }

  const activeClip =
    productReelsEnabled &&
    activeClipIndex !== null &&
    productShortClips[activeClipIndex]
      ? productShortClips[activeClipIndex]
      : null;

  const galleryThumbnails = [
    baseVariantOrProductImage,
    ...(Array.isArray(current.images) ? current.images.map(safeImgSrc) : []),
    ...colorOptions.map((opt) => safeImgSrc(opt.image))
  ]
    .filter(Boolean)
    .filter((url, idx, arr) => arr.indexOf(url) === idx)
    .slice(0, 5);

  return (
    <div className="pdp-page" style={{ paddingBottom: isMobileView ? "76px" : 0 }}>
      <div
        className="pdp-topbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {onGoBack && (
            <button type="button" className="pdp-back-btn" onClick={onGoBack}>
              <ArrowLeft size={14} /> BACK TO COLLECTION
            </button>
          )}
          <span className="pdp-crumb">
            {(current.collection || "UNISEX").toUpperCase()} /{" "}
            {(current.category || "FOOTWEAR").toUpperCase()} / {current.name}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {activePipVideo && pipEnabled && (
            <button
              type="button"
              onClick={() => setPipFloatingOpen((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 12px",
                borderRadius: "999px",
                border: "1px solid rgba(15, 23, 42, 0.16)",
                background: pipFloatingOpen ? "#0F172A" : "#FFFFFF",
                color: pipFloatingOpen ? "#FFFFFF" : "#0F172A",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <PictureInPicture2 size={13} />
              {pipFloatingOpen ? "HIDE PIP VIDEO" : "OPEN PIP VIDEO"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setAdminOpen((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "999px",
              border: "1px solid #0F172A",
              background: adminOpen ? "#111827" : "#F8FAFC",
              color: adminOpen ? "#FFFFFF" : "#0F172A",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer"
            }}
          >
            <SlidersHorizontal size={13} />
            {adminOpen ? "CLOSE ADMIN PANEL" : "PRODUCT ADMIN (VARIANTS & PIP)"}
          </button>
        </div>
      </div>

      {adminOpen && (
        <section
          aria-label="Product Admin Panel"
          style={{
            margin: "12px 0 22px",
            padding: "18px",
            borderRadius: "14px",
            border: "1px solid #CBD5E1",
            background: "#F8FAFC",
            color: "#0F172A"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <strong style={{ fontSize: "14px" }}>
                Admin Panel — {current.name}
              </strong>
              <button
                type="button"
                onClick={() => setAdminTab("variants")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1px solid #0F172A",
                  background: adminTab === "variants" ? "#0F172A" : "#FFFFFF",
                  color: adminTab === "variants" ? "#FFFFFF" : "#0F172A",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Variants ({variantList.length})
              </button>
              <button
                type="button"
                onClick={() => setAdminTab("pip-video")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: "1px solid #0F172A",
                  background: adminTab === "pip-video" ? "#0F172A" : "#FFFFFF",
                  color: adminTab === "pip-video" ? "#FFFFFF" : "#0F172A",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                <PictureInPicture2 size={12} /> Product PIP Video
              </button>
            </div>

            {adminSavedNotice && (
              <span
                style={{
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#15803D",
                  background: "#DCFCE7",
                  padding: "4px 10px",
                  borderRadius: "999px"
                }}
              >
                {adminSavedNotice}
              </span>
            )}
          </div>

          {adminTab === "variants" && (
            <div style={{ display: "grid", gap: "14px" }}>
              <form
                onSubmit={handleAddVariantSubmit}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "10px",
                  alignItems: "end"
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                    Variant Label *
                  </label>
                  <input
                    required
                    placeholder="e.g., Olive / Bone"
                    value={newVariantLabel}
                    onChange={(e) => setNewVariantLabel(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                    Color Name
                  </label>
                  <input
                    placeholder="e.g., Olive Green"
                    value={newVariantColor}
                    onChange={(e) => setNewVariantColor(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="2998"
                    value={newVariantPrice}
                    onChange={(e) => setNewVariantPrice(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                    MRP / Old Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="5995"
                    value={newVariantOldPrice}
                    onChange={(e) => setNewVariantOldPrice(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                    Image URL
                  </label>
                  <input
                    placeholder="https://..."
                    value={newVariantImage}
                    onChange={(e) => setNewVariantImage(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: "9px 14px",
                    borderRadius: "8px",
                    border: 0,
                    background: "#0F172A",
                    color: "#FFFFFF",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  + ADD VARIANT
                </button>
              </form>

              {variantList.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {variantList.map((vr, idx) => (
                    <div
                      key={vr.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        background: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        fontSize: "12px"
                      }}
                    >
                      <strong>{vr.label}</strong>
                      <span>• {formatPrice(vr.price)}</span>
                      <button
                        type="button"
                        aria-label={`Delete variant ${vr.label}`}
                        onClick={() => handleRemoveVariant(idx)}
                        style={{
                          border: 0,
                          background: "transparent",
                          color: "#B91C1C",
                          cursor: "pointer",
                          display: "grid",
                          placeItems: "center",
                          padding: 0
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === "pip-video" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
                alignItems: "start"
              }}
            >
              {/* Video Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingPipVideo(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDraggingPipVideo(false);
                }}
                onDrop={handlePipDrop}
                onClick={() => pipFileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pipFileInputRef.current?.click();
                  }
                }}
                style={{
                  border: isDraggingPipVideo
                    ? "2px dashed #2563EB"
                    : "2px dashed #94A3B8",
                  borderRadius: "12px",
                  padding: "20px",
                  background: isDraggingPipVideo ? "#EFF6FF" : "#FFFFFF",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <input
                  ref={pipFileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePipVideoFile(file);
                    e.target.value = "";
                  }}
                />
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "999px",
                    background: "#E2E8F0",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 10px"
                  }}
                >
                  <Upload size={18} />
                </div>
                <strong style={{ display: "block", fontSize: "13px", marginBottom: "4px" }}>
                  Drag & Drop Product PIP Video Here
                </strong>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#475569" }}>
                  or click to browse MP4 / WebM / MOV from your device
                </p>
                {pipVideoFileName && (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#0F172A",
                      background: "#F1F5F9",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      display: "inline-block"
                    }}
                  >
                    File: {pipVideoFileName}
                  </div>
                )}
                {pipUploadError && (
                  <p style={{ margin: "8px 0 0", fontSize: "11.5px", color: "#DC2626", fontWeight: 600 }}>
                    {pipUploadError}
                  </p>
                )}
              </div>

              {/* PIP Video URL & Controls */}
              <form onSubmit={handleSavePipSettings} style={{ display: "grid", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                    PIP Video Title
                  </label>
                  <input
                    value={pipVideoTitle}
                    onChange={(e) => setPipVideoTitle(e.target.value)}
                    placeholder="On-Foot Fit & Sole Walkthrough"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                    PIP Video URL (MP4 / WebM)
                  </label>
                  <input
                    value={pipVideoUrl}
                    onChange={(e) => setPipVideoUrl(e.target.value)}
                    placeholder="https://example.com/product-pip.mp4"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  />
                </div>

                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={pipEnabled}
                    onChange={(e) => setPipEnabled(e.target.checked)}
                  />
                  Show floating Picture-in-Picture (PIP) player on product page
                </label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: 0,
                      background: "#0F172A",
                      color: "#FFFFFF",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    SAVE PIP VIDEO
                  </button>

                  {activePipVideo && (
                    <button
                      type="button"
                      onClick={() => setPipFloatingOpen((v) => !v)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #0F172A",
                        background: "#FFFFFF",
                        color: "#0F172A",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {pipFloatingOpen ? "CLOSE PIP PREVIEW" : "PREVIEW FLOATING PIP"}
                    </button>
                  )}

                  {activePipVideo && (
                    <button
                      type="button"
                      onClick={handleClearPipVideo}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #FCA5A5",
                        background: "#FEF2F2",
                        color: "#B91C1C",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      REMOVE VIDEO
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </section>
      )}

      <div className="pdp-main-grid">
        <div
          style={{
            display: "flex",
            flexDirection: isMobileView ? "column-reverse" : "row",
            gap: "12px",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobileView ? "row" : "column",
              gap: "8px",
              overflowX: isMobileView ? "auto" : "visible",
              flexShrink: 0
            }}
          >
            {galleryThumbnails.map((thumbUrl, tIdx) => {
              const isThumbActive = !showVideo && currentImage === thumbUrl;
              return (
                <button
                  key={`${thumbUrl}-${tIdx}`}
                  type="button"
                  aria-label={`View image ${tIdx + 1}`}
                  onClick={() => {
                    setShowVideo(false);
                    setSelectedImageOverride(thumbUrl);
                    const matchingColor = colorOptions.find(
                      (c) => safeImgSrc(c.image) === thumbUrl
                    );
                    if (matchingColor) {
                      setSelectedColorwayId(matchingColor.id || matchingColor._id);
                    }
                  }}
                  style={{
                    width: isMobileView ? "60px" : "68px",
                    height: isMobileView ? "60px" : "68px",
                    padding: "4px",
                    borderRadius: "8px",
                    border: isThumbActive
                      ? "1.5px solid #0F172A"
                      : "1px solid #E2E8F0",
                    background: "#F5F5F5",
                    cursor: "pointer",
                    overflow: "hidden",
                    flexShrink: 0
                  }}
                >
                  <img
                    src={thumbUrl}
                    alt={`${current.name} angle ${tIdx + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block"
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div
            className="pdp-stage"
            style={{
              flex: 1,
              width: "100%",
              background: "#FFFFFF",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              maxHeight: isMobileView
                ? undefined
                : `${Number(homepage?.productPage?.galleryMaxHeightPx) || 560}px`
            }}
          >
            {showVideo && currentVideo ? (
              <video
                src={currentVideo}
                poster={currentImage}
                autoPlay
                loop
                muted
                playsInline
                controls
                onError={() => setShowVideo(false)}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <img
                src={currentImage}
                alt={current.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: current.imageFit || "contain",
                  objectPosition: `${current.imagePosX ?? 50}% ${current.imagePosY ?? 50}%`,
                  transform: `scale(${Number(current.imageZoom) || 1})`,
                  transformOrigin: `${current.imagePosX ?? 50}% ${current.imagePosY ?? 50}%`
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                }}
              />
            )}

            <button
              type="button"
              className="pdp-expand-btn"
              aria-label="Expand product image"
              onClick={handleExpandMedia}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid var(--line)",
                background: "rgba(255, 255, 255, 0.92)",
                color: "#111",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                zIndex: 3
              }}
            >
              <Maximize2 size={15} />
            </button>

            {currentVideo && (
              <div className="media-switcher">
                <button
                  type="button"
                  className={!showVideo ? "active" : ""}
                  onClick={() => setShowVideo(false)}
                >
                  PHOTO
                </button>
                <button
                  type="button"
                  className={showVideo ? "active" : ""}
                  onClick={() => setShowVideo(true)}
                >
                  <Film size={11} /> MOTION FIT
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pdp-info-col">
          <h1>{current.name}</h1>

          {current.tagline && (
            <p className="pdp-colorway" style={{ marginBottom: "8px" }}>
              {current.tagline}
            </p>
          )}

          {current.highlights?.length > 0 && (
            <p
              style={{
                fontSize: "12.5px",
                color: "var(--ink)",
                margin: "0 0 14px",
                fontWeight: 500
              }}
            >
              {current.highlights.slice(0, 3).join(" | ")}
            </p>
          )}

          <div className="pdp-price-row" style={{ marginBottom: "14px" }}>
            {discountPct > 0 && (
              <span className="pdp-discount-badge">{discountPct}% OFF</span>
            )}
            <strong style={{ fontSize: "24px", fontWeight: 700 }}>
              {formatPrice(priceNum)}
            </strong>
            {oldPriceNum > priceNum && (
              <span className="old-price" style={{ fontSize: "15px" }}>
                {formatPrice(oldPriceNum)}
              </span>
            )}
          </div>

          {variantList.length > 0 && (
            <div className="size-block" style={{ marginBottom: "14px" }}>
              <span className="size-label" style={{ marginBottom: "8px" }}>
                Variant:{" "}
                <strong style={{ color: "var(--ink)" }}>
                  {activeVariant?.label}
                </strong>
              </span>
              <div className="size-grid" style={{ marginBottom: 0 }}>
                {variantList.map((vr, idx) => {
                  const isSelected = idx === selectedVariantIndex;
                  return (
                    <button
                      key={vr.id}
                      type="button"
                      className={isSelected ? "size-pill active" : "size-pill"}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setSelectedImageOverride("");
                        setShowVideo(false);
                      }}
                    >
                      {vr.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {productReelsEnabled && productShortClips.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px"
                }}
              >
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Play size={11} fill="currentColor" /> SEE IT IN ACTION (SHORT PLAY)
                </span>
                <span style={{ fontSize: "11px", opacity: 0.65 }}>
                  Tap to watch
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: "10px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                  scrollbarWidth: "none"
                }}
              >
                {productShortClips.map((clip, idx) => {
                  const clipPoster = safeImgSrc(clip.poster || currentImage);
                  const videoBroken = Boolean(failedClipIds[clip.id]);
                  const isSelected = activeClipIndex === idx;

                  return (
                    <button
                      key={clip.id}
                      type="button"
                      onClick={() => {
                        setClipMuted(false);
                        setActiveClipIndex(idx);
                      }}
                      style={{
                        flex: "0 0 84px",
                        height: "126px",
                        borderRadius: "12px",
                        border: isSelected
                          ? "2px solid #2563EB"
                          : "2px solid #0645B8",
                        padding: "2px",
                        background: "#0B0D12",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer"
                      }}
                    >
                      {!videoBroken && clip.videoUrl ? (
                        <video
                          src={clip.videoUrl}
                          poster={clipPoster}
                          autoPlay
                          loop
                          muted
                          playsInline
                          onError={() =>
                            setFailedClipIds((prev) => ({
                              ...prev,
                              [clip.id]: true
                            }))
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "9px",
                            display: "block"
                          }}
                        />
                      ) : (
                        <img
                          src={clipPoster}
                          alt={clip.label}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "9px",
                            display: "block"
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: "absolute",
                          inset: "2px",
                          borderRadius: "9px",
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.85) 100%)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 4px",
                          color: "#FFFFFF"
                        }}
                      >
                        <span
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.92)",
                            color: "#0F172A",
                            display: "grid",
                            placeItems: "center",
                            marginTop: "28px"
                          }}
                        >
                          <Play size={10} fill="currentColor" />
                        </span>
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textAlign: "center",
                            letterSpacing: "0.03em"
                          }}
                        >
                          {clip.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pdp-offers-box">
            <div className="pdp-offers-head">
              <Tag size={14} />
              <strong>Offers</strong>
              <span>Auto applies at checkout</span>
            </div>
            <div className="pdp-offer-cards">
              <div className="pdp-offer-card blue">
                <span className="pdp-offer-pill blue">
                  {pdpCfg.offer1Badge || "10% OFF"}
                </span>
                <span>{pdpCfg.offer1Text || "Buy 2 Pairs"}</span>
              </div>
              <div className="pdp-offer-card green">
                <span className="pdp-offer-pill green">
                  {pdpCfg.offer2Badge || "15% OFF"}
                </span>
                <span>{pdpCfg.offer2Text || "Buy 3 Pairs"}</span>
              </div>
            </div>
          </div>

          {activeColorLabel && (
            <div>
              <span className="size-label" style={{ marginBottom: "6px" }}>
                Colors:{" "}
                <strong style={{ color: "var(--ink)" }}>{activeColorLabel}</strong>
              </span>
              <div className="pdp-swatch-row">
                {colorOptions.map((opt) => {
                  const optId = opt.id || opt._id;
                  const active = optId === selectedColorwayId;
                  return (
                    <button
                      key={optId}
                      type="button"
                      className={`pdp-swatch ${active ? "active" : ""}`}
                      title={opt.color || opt.name}
                      onClick={() => {
                        setSelectedColorwayId(optId);
                        setSelectedImageOverride("");
                        if (optId !== productId) {
                          onSelectProduct?.(opt);
                        }
                      }}
                    >
                      <img
                        src={safeImgSrc(opt.image)}
                        alt={opt.color || opt.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="size-block">
            <div className="size-head-row">
              <span className="size-label">Select Shoe size: UK/India</span>
            </div>
            <div className="size-grid">
              {sizes.map((sz) => (
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

          <div className="pdp-qty-cta-row">
            <div className="pdp-qty-box">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              className="primary-cta-btn pdp-pill-cta"
              onClick={handleAddSelection}
            >
              ADD TO CART — {formatPrice(priceNum * quantity)}
            </button>

            <button
              type="button"
              className={`pdp-wish-btn ${isFavorite ? "selected" : ""}`}
              aria-label="Save to wishlist"
              onClick={() => onToggleFavorite?.(productId)}
              style={{ borderRadius: "999px", width: "48px" }}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          <div
            style={{
              marginTop: "14px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "var(--surface, #f2f1eb)",
              border: "1px solid var(--line, rgba(0,0,0,0.08))",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              fontSize: "11px"
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>
              Partial COD • Ships in 24–48 hrs • 7-Day Swap
            </span>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {["UPI", "RuPay", "VISA", "Mastercard", "Razorpay"].map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: "2px 7px",
                    borderRadius: "4px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.1)",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.04em"
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                gap: "16px",
                borderBottom: "1px solid var(--line, rgba(0,0,0,0.12))",
                marginBottom: "12px"
              }}
            >
              {[
                { key: "description", label: "Description" },
                { key: "features", label: "Key Features" },
                { key: "shipping", label: "Shipping & Returns" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveInfoTab(tab.key)}
                  style={{
                    background: "none",
                    border: 0,
                    borderBottom:
                      activeInfoTab === tab.key
                        ? "2px solid var(--ink, #1e211d)"
                        : "2px solid transparent",
                    padding: "8px 0",
                    fontSize: "12px",
                    fontWeight: activeInfoTab === tab.key ? 700 : 500,
                    color: activeInfoTab === tab.key ? "var(--ink)" : "var(--muted)",
                    cursor: "pointer"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeInfoTab === "description" && (
              <p className="pdp-desc" style={{ margin: 0 }}>
                {current.description ||
                  "Engineered for everyday comfort with lightweight cushioning and durable grip."}
              </p>
            )}

            {activeInfoTab === "features" && (
              <ul className="pdp-highlights" style={{ margin: 0 }}>
                {(current.highlights?.length
                  ? current.highlights
                  : [
                      "Dual-density memory footbed",
                      "Lightweight all-day construction",
                      "Anti-slip everyday outsole"
                    ]
                ).map((item, idx) => (
                  <li key={idx}>
                    <Check size={14} /> {item}
                  </li>
                ))}
              </ul>
            )}

            {activeInfoTab === "shipping" && (
              <div style={{ fontSize: "12.5px", lineHeight: 1.7, color: "var(--muted)" }}>
                <p style={{ margin: "0 0 6px" }}>
                  <strong>Dispatch:</strong>{" "}
                  {current.dispatchNotice || "Orders processed within 1–2 business days."}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Returns & Exchange:</strong>{" "}
                  {current.returnDetails ||
                    "7-day easy UK size exchange on unworn pairs in original packaging."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating PIP Video Player */}
      {pipFloatingOpen && activePipVideo && pipEnabled && (
        <div
          aria-label="Floating Picture-in-Picture Product Video"
          style={{
            position: "fixed",
            right: "18px",
            bottom: isMobileView ? "76px" : "18px",
            width: "240px",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#090B0E",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "0 18px 42px rgba(0,0,0,0.45)",
            zIndex: 95
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 10px",
              background: "rgba(0,0,0,0.78)",
              fontSize: "10.5px",
              fontWeight: 700
            }}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "155px"
              }}
            >
              PIP: {pipVideoTitle || current.name}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                type="button"
                aria-label={pipMuted ? "Unmute PIP video" : "Mute PIP video"}
                onClick={() => setPipMuted((m) => !m)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  padding: "2px",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                {pipMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <button
                type="button"
                aria-label="Close PIP video"
                onClick={() => setPipFloatingOpen(false)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  padding: "2px",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <X size={13} />
              </button>
            </div>
          </div>
          <video
            src={activePipVideo}
            poster={currentImage}
            autoPlay
            loop
            muted={pipMuted}
            playsInline
            controls
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              display: "block"
            }}
          />
        </div>
      )}

      {suggestedItems.length > 0 && (
        <section className="shop-section section-pad">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECOMMENDED FOR YOUR ROTATION</p>
              <h2>
                Suggested <em>for you.</em>
              </h2>
            </div>
            <span className="product-count">CURATED PICKS</span>
          </div>

          <div
            className="product-grid"
            style={{
              marginTop: "24px",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))"
            }}
          >
            {suggestedItems.map((item) => {
              const itemId = item.id || item._id;
              const defaultSz = item.sizes?.[2] || item.sizes?.[0] || "UK 8";
              return (
                <article key={itemId} className="product-card">
                  <div
                    className="product-image-wrap clickable"
                    onClick={() => onSelectProduct?.(item)}
                  >
                    <img
                      src={safeImgSrc(item.image)}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                      }}
                    />
                    {item.badge && (
                      <span className="product-badge">{item.badge}</span>
                    )}
                    <button
                      type="button"
                      className="quick-add"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(item, defaultSz, true, 1);
                        onOpenCart?.();
                      }}
                    >
                      QUICK ADD ({defaultSz})
                    </button>
                  </div>
                  <div
                    className="product-meta clickable"
                    onClick={() => onSelectProduct?.(item)}
                  >
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.color}</p>
                    </div>
                    <strong>{formatPrice(item.price)}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeClip && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveClipIndex(null)}
          style={{ zIndex: 120 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(410px, 94vw)",
              height: "min(730px, 90svh)",
              borderRadius: "22px",
              overflow: "hidden",
              background: "#090B0E",
              color: "#FFFFFF",
              boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <img
              src={safeImgSrc(activeClip.poster || currentImage)}
              alt={activeClip.label}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = SAFE_IMAGE_FALLBACK;
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />

            {!failedClipIds[activeClip.id] && activeClip.videoUrl && (
              <video
                key={activeClip.id}
                src={activeClip.videoUrl}
                poster={safeImgSrc(activeClip.poster || currentImage)}
                autoPlay
                loop
                muted={clipMuted}
                playsInline
                onError={() =>
                  setFailedClipIds((prev) => ({
                    ...prev,
                    [activeClip.id]: true
                  }))
                }
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            )}

            <div
              style={{
                position: "relative",
                zIndex: 3,
                padding: "12px 14px",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)"
              }}
            >
              <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
                {productShortClips.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={`Play clip ${idx + 1}`}
                    onClick={() => setActiveClipIndex(idx)}
                    style={{
                      flex: 1,
                      height: "3px",
                      borderRadius: "999px",
                      border: 0,
                      padding: 0,
                      background:
                        idx === activeClipIndex
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.35)",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px"
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: "rgba(255,255,255,0.18)",
                    padding: "4px 10px",
                    borderRadius: "999px"
                  }}
                >
                  {activeClip.tag} • {activeClip.label}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    aria-label={clipMuted ? "Unmute video" : "Mute video"}
                    onClick={() => setClipMuted((m) => !m)}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      border: 0,
                      background: "rgba(0,0,0,0.5)",
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    {clipMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button
                    type="button"
                    aria-label="Close video"
                    onClick={() => setActiveClipIndex(null)}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      border: 0,
                      background: "rgba(0,0,0,0.5)",
                      color: "#FFFFFF",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer"
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {productShortClips.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous video"
                  onClick={() =>
                    setActiveClipIndex(
                      (prev) =>
                        (prev - 1 + productShortClips.length) %
                        productShortClips.length
                    )
                  }
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 3,
                    width: "36px",
                    height: "36px",
                    borderRadius: "999px",
                    border: 0,
                    background: "rgba(0,0,0,0.48)",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next video"
                  onClick={() =>
                    setActiveClipIndex(
                      (prev) => (prev + 1) % productShortClips.length
                    )
                  }
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 3,
                    width: "36px",
                    height: "36px",
                    borderRadius: "999px",
                    border: 0,
                    background: "rgba(0,0,0,0.48)",
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <div
              style={{
                marginTop: "auto",
                position: "relative",
                zIndex: 3,
                padding: "16px",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.92) 35%)"
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "14px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={currentImage}
                    alt={current.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block", fontSize: "13.5px" }}>
                      {current.name}
                    </strong>
                    <span style={{ fontSize: "12px", opacity: 0.85 }}>
                      {formatPrice(priceNum)} • Size: {selectedSize}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: "4px 9px",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.35)",
                        background:
                          selectedSize === sz ? "#FFFFFF" : "transparent",
                        color: selectedSize === sz ? "#0F172A" : "#FFFFFF",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart?.(buildCartProductPayload(), selectedSize, true, 1);
                    onOpenCart?.();
                    setActiveClipIndex(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    borderRadius: "999px",
                    border: 0,
                    background: "#FFFFFF",
                    color: "#0F172A",
                    fontSize: "11.5px",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    cursor: "pointer"
                  }}
                >
                  ADD TO BAG — {formatPrice(priceNum)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="calzare-reviews-section" id="product-reviews">
        <div className="calzare-reviews-header">
          <div className="calzare-rating-pill">
            <span className="calzare-stars" aria-hidden="true">
              ★★★★★
            </span>
            <strong>{averageRating} / 5.0</strong>
            <span>({productReviews.length} Customer Reviews)</span>
          </div>
          <p className="calzare-reviews-sub">
            Honest reviews from customers walking in real rain, heat, and city transit.
          </p>
          {canManageReviews && (
            <button
              type="button"
              className="filter active"
              onClick={() =>
                reviewFormOpen
                  ? (setReviewFormOpen(false), setEditingReviewId(null))
                  : handleOpenNewReviewForm()
              }
            >
              {reviewFormOpen ? "CLOSE REVIEW EDITOR" : "MANAGE / ADD REVIEW"}
            </button>
          )}
        </div>

        {canManageReviews && reviewFormOpen && (
          <form
            onSubmit={handleSaveReview}
            style={{
              background: "var(--surface, #f2f1eb)",
              border: "1px solid var(--line, rgba(0,0,0,0.12))",
              borderRadius: "14px",
              padding: "20px",
              margin: "0 auto 28px",
              maxWidth: "780px",
              display: "grid",
              gap: "12px"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))",
                gap: "10px"
              }}
            >
              <input
                required
                placeholder="Reviewer / Writer Name *"
                value={reviewDraft.author}
                onChange={(e) =>
                  setReviewDraft({ ...reviewDraft, author: e.target.value })
                }
              />
              <input
                placeholder="City (e.g., Bengaluru, Delhi)"
                value={reviewDraft.location}
                onChange={(e) =>
                  setReviewDraft({ ...reviewDraft, location: e.target.value })
                }
              />
              <select
                value={reviewDraft.size}
                onChange={(e) =>
                  setReviewDraft({ ...reviewDraft, size: e.target.value })
                }
              >
                {sizes.map((sz) => (
                  <option key={sz} value={sz}>
                    Size: {sz}
                  </option>
                ))}
              </select>
              <select
                value={reviewDraft.rating}
                onChange={(e) =>
                  setReviewDraft({
                    ...reviewDraft,
                    rating: Number(e.target.value)
                  })
                }
              >
                <option value={5}>★★★★★ (5 / 5)</option>
                <option value={4}>★★★★☆ (4 / 5)</option>
                <option value={3}>★★★☆☆ (3 / 5)</option>
                <option value={2}>★★☆☆☆ (2 / 5)</option>
                <option value={1}>★☆☆☆☆ (1 / 5)</option>
              </select>
            </div>

            <input
              placeholder={`Headline for ${current.name} (optional)`}
              value={reviewDraft.quote}
              onChange={(e) =>
                setReviewDraft({ ...reviewDraft, quote: e.target.value })
              }
            />

            <textarea
              required
              rows={3}
              placeholder="Write or update review comment... *"
              value={reviewDraft.body}
              onChange={(e) =>
                setReviewDraft({ ...reviewDraft, body: e.target.value })
              }
              style={{ resize: "vertical", padding: "10px 12px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="filter"
                onClick={() => {
                  setReviewFormOpen(false);
                  setEditingReviewId(null);
                }}
              >
                CANCEL
              </button>
              <button type="submit" className="filter active">
                {editingReviewId ? "SAVE TO BACKEND" : "PUBLISH TO BACKEND"}
              </button>
            </div>
          </form>
        )}

        <div className="calzare-reviews-grid">
          {productReviews.map((rev) => {
            const stars = Math.max(1, Math.min(5, Number(rev.rating) || 5));
            const isBackendReview = backendReviews.some(
              (item) => String(item.id) === String(rev.id)
            );

            return (
              <article className="calzare-review-card" key={rev.id}>
                <div className="calzare-stars" aria-hidden="true">
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                </div>
                <h3 className="calzare-review-quote">{rev.quote}</h3>
                <p className="calzare-review-body">{rev.body}</p>
                <div className="calzare-review-divider" />
                <div className="calzare-review-footer">
                  <div>
                    <strong className="calzare-reviewer-name">{rev.author}</strong>
                    <span className="calzare-reviewer-meta">{rev.meta}</span>
                    <span className="calzare-reviewer-loc">{rev.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span className="calzare-verified-badge">✓ Verified</span>
                    {canManageReviews && (
                      <>
                        <button
                          type="button"
                          aria-label="Edit review"
                          onClick={() => handleStartEditReview(rev)}
                          style={{
                            border: "1px solid rgba(0,0,0,0.14)",
                            background: "#FFFFFF",
                            borderRadius: "999px",
                            width: "28px",
                            height: "28px",
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer"
                          }}
                        >
                          <Edit3 size={12} />
                        </button>
                        {isBackendReview && (
                          <button
                            type="button"
                            aria-label="Delete review"
                            onClick={() => handleDeleteReview(rev.id)}
                            style={{
                              border: "1px solid rgba(0,0,0,0.14)",
                              background: "#FFFFFF",
                              borderRadius: "999px",
                              width: "28px",
                              height: "28px",
                              display: "grid",
                              placeItems: "center",
                              cursor: "pointer"
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="calzare-standard-block">
          <h2 className="calzare-standard-title">
            {pdpCfg.standardTitle || "THE CALZARE STANDARD"}
          </h2>
          <p className="calzare-standard-sub">
            {pdpCfg.standardSubtitle || "Built with science. Tested with life."}
          </p>

          <div className="calzare-standard-grid">
            {CALZARE_STANDARD_CARDS.map((item) => {
              const IconComp = item.icon;
              return (
                <div className="calzare-standard-card" key={item.id}>
                  <div className="calzare-standard-icon">
                    <IconComp size={20} />
                  </div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="pdp-guarantees-4col">
        <div className="pdp-guarantee-cell">
          <ShieldCheck size={22} />
          <strong>Secure payment</strong>
          <span>UPI, cards & partial COD available</span>
        </div>
        <div className="pdp-guarantee-cell">
          <Truck size={22} />
          <strong>Delivery</strong>
          <span>Ships within 24–48 hours across India</span>
        </div>
        <div className="pdp-guarantee-cell">
          <RefreshCw size={22} />
          <strong>Returns</strong>
          <span>7-day easy UK size exchange</span>
        </div>
        <div className="pdp-guarantee-cell">
          <Sparkles size={22} />
          <strong>Customer Service</strong>
          <span>Dedicated support for sizing & orders</span>
        </div>
      </div>

      {alsoBoughtItems.length > 0 && (
        <section className="shop-section section-pad">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COMPLETE THE EDIT</p>
              <h2>
                People <em>Also Bought.</em>
              </h2>
            </div>
          </div>

          <div className="product-grid" style={{ marginTop: "24px" }}>
            {alsoBoughtItems.map((item) => {
              const itemId = item.id || item._id;
              return (
                <article
                  key={itemId}
                  className="product-card clickable"
                  onClick={() => onSelectProduct?.(item)}
                >
                  <div className="product-image-wrap">
                    <img
                      src={safeImgSrc(item.image)}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                      }}
                    />
                  </div>
                  <div className="product-meta">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.color}</p>
                    </div>
                    <strong>{formatPrice(item.price)}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {isMobileView && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 80,
            background: "#FFFFFF",
            borderTop: "1px solid rgba(0,0,0,0.12)",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 -6px 20px rgba(0,0,0,0.08)"
          }}
        >
          <select
            aria-label="Select size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            style={{
              padding: "10px 8px",
              borderRadius: "8px",
              border: "1px solid rgba(0,0,0,0.2)",
              background: "#F8FAFC",
              fontSize: "12px",
              fontWeight: 700
            }}
          >
            {sizes.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="primary-cta-btn"
            onClick={handleAddSelection}
            style={{ flex: 1, margin: 0, padding: "12px 14px", borderRadius: "999px" }}
          >
            ADD TO CART — {formatPrice(priceNum * quantity)}
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [catalog, setCatalog] = useState(DEMO_CATALOG);
  const [selectedId, setSelectedId] = useState(DEMO_CATALOG[0].id);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const activeProduct =
    catalog.find((item) => (item.id || item._id) === selectedId) || catalog[0];

  function handleToggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleAddToCart(item, size, shouldOpenDrawer = true, qty = 1) {
    const count = Math.max(1, Number(qty) || 1);
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (entry) => entry.productId === item.id && entry.size === size
      );
      if (existingIdx > -1) {
        return prev.map((entry, idx) =>
          idx === existingIdx
            ? { ...entry, quantity: entry.quantity + count }
            : entry
        );
      }
      return [
        ...prev,
        {
          id: `${item.id}-${size}`,
          productId: item.id,
          name: item.name,
          size,
          price: Number(item.price) || 0,
          image: safeImgSrc(item.image),
          quantity: count
        }
      ];
    });

    if (shouldOpenDrawer) {
      setCartDrawerOpen(true);
    }
  }

  function handleUpdateCartQty(lineId, delta) {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.id === lineId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }

  function handleRemoveCartItem(lineId) {
    setCart((prev) => prev.filter((entry) => entry.id !== lineId));
  }

  function handleUpdateProduct(prodId, patch) {
    setCatalog((prev) =>
      prev.map((p) =>
        (p.id || p._id) === prodId ? { ...p, ...patch } : p
      )
    );
  }

  function handleAddVariant(prodId, variantObj) {
    setCatalog((prev) =>
      prev.map((p) => {
        if ((p.id || p._id) !== prodId) return p;
        const existing = Array.isArray(p.variants) ? p.variants : [];
        return { ...p, variants: [...existing, variantObj] };
      })
    );
  }

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <div
        style={{
          background: "#0F172A",
          color: "#FFFFFF",
          padding: "8px 18px",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>Cart items: {totalCount}</span>
        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          style={{
            background: "#FFFFFF",
            color: "#0F172A",
            border: 0,
            borderRadius: "999px",
            padding: "4px 12px",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          OPEN CART ({totalCount})
        </button>
      </div>

      <ProductPage
        product={activeProduct}
        products={catalog}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setCartDrawerOpen(true)}
        onSelectProduct={(p) => setSelectedId(p.id || p._id)}
        canManageReviews
        onUpdateProduct={handleUpdateProduct}
        onAddVariant={handleAddVariant}
      />

      {cartDrawerOpen && (
        <>
          <div
            onClick={() => setCartDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.55)",
              backdropFilter: "blur(2px)",
              zIndex: 140
            }}
          />
          <aside
            aria-label="Slide-over Cart Drawer"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(410px, 94vw)",
              background: "#FFFFFF",
              color: "#0F172A",
              zIndex: 150,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-12px 0 36px rgba(0, 0, 0, 0.22)",
              transform: "translateX(0)",
              transition: "transform 0.25s ease"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                borderBottom: "1px solid #E2E8F0"
              }}
            >
              <strong style={{ fontSize: "14px" }}>
                Your Cart ({totalCount})
              </strong>
              <button
                type="button"
                aria-label="Close cart drawer"
                onClick={() => setCartDrawerOpen(false)}
                style={{
                  border: "1px solid #CBD5E1",
                  background: "#F8FAFC",
                  borderRadius: "999px",
                  width: "32px",
                  height: "32px",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer"
                }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
              {cart.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#64748B" }}>
                  Your cart is currently empty.
                </p>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        padding: "10px",
                        border: "1px solid #E2E8F0",
                        borderRadius: "10px"
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "56px",
                          height: "56px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", fontSize: "13px" }}>
                          {item.name}
                        </strong>
                        <span style={{ fontSize: "11.5px", color: "#64748B" }}>
                          Size: {item.size} • ₹
                          {Number(item.price).toLocaleString("en-IN")}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "6px"
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.id, -1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: "1px solid #CBD5E1",
                              background: "#F8FAFC",
                              cursor: "pointer"
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "12px", fontWeight: 700 }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.id, 1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: "1px solid #CBD5E1",
                              background: "#F8FAFC",
                              cursor: "pointer"
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => handleRemoveCartItem(item.id)}
                        style={{
                          border: 0,
                          background: "transparent",
                          color: "#B91C1C",
                          cursor: "pointer"
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                padding: "16px 18px",
                borderTop: "1px solid #E2E8F0",
                background: "#F8FAFC"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "14px",
                  fontWeight: 700
                }}
              >
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <button
                type="button"
                className="primary-cta-btn"
                onClick={() => setCartDrawerOpen(false)}
                style={{ width: "100%", borderRadius: "999px" }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}