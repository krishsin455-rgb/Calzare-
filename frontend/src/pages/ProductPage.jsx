import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  Headphones,
  Heart,
  Maximize2,
  Minus,
  Play,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  Volume2,
  VolumeX,
  X
} from "lucide-react";

function resolveApiBase() {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
      return String(import.meta.env.VITE_API_URL);
    }
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

const BROKEN_IMAGE_IDS = [
  "photo-1614252369475-531506b0b9e9",
  "photo-1520256862855-9981c41d8ba0"
];

const DEFAULT_SIZES = ["Free Size"];

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    rating: 5,
    quote: '"GORGEOUS BANARASI ZARI FINISH & EFFORTLESS DRAPE"',
    body: "Wore this for my sister's sangeet and received so many compliments. The silk is lightweight, pleats stay neatly in place all evening, and the matching blouse piece is generous.",
    author: "Ananya Sharma",
    meta: "Verified Owner: Royal Banarasi Katan Silk Saree",
    location: "Jaipur • Verified Buyer"
  },
  {
    id: "rev-2",
    rating: 5,
    quote: '"RICH TEMPLE BORDER WITHOUT FEELING HEAVY"',
    body: "Usually Kanjivaram drapes feel stiff after a few hours, but this soft silk weave stayed comfortable through a full day of wedding rituals. Packaging was neat and dispatch was quick.",
    author: "Meenakshi Iyer",
    meta: "Verified Owner: Kanjivaram Zari Soft Silk Saree",
    location: "Chennai • Verified Buyer"
  },
  {
    id: "rev-3",
    rating: 5,
    quote: '"EXACTLY AS SHOWN — TRUE HEIRLOOM COLOR"',
    body: "The maroon shade and antique gold pallu look even better in person. Delivered in 3 days to Mumbai with zero creases. Will definitely order again for Diwali.",
    author: "Zoya Khan",
    meta: "Verified Owner: Festive Zari Silk Saree",
    location: "Mumbai • Verified Buyer"
  }
];

const BRAND_PROMISE_CARDS = [
  {
    id: "std-1",
    title: "Fast Dispatch",
    desc: "Shipped within 24–48 hours with live tracking across India.",
    icon: Truck
  },
  {
    id: "std-2",
    title: "48-Hour Easy Returns",
    desc: "Hassle-free returns and exchanges with original tags intact.",
    icon: RefreshCw
  },
  {
    id: "std-3",
    title: "Authentic Weaves",
    desc: "Hand-checked silk, zari finish, and matching blouse piece included.",
    icon: Sparkles
  },
  {
    id: "std-4",
    title: "Direct Support",
    desc: "Personal help for draping, styling, and order updates.",
    icon: Headphones
  }
];

function safeImgSrc(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
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
    return "";
  }
  return clean;
}

function safeVideoSrc(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
  const clean = url.trim();
  if (clean.includes("assets.mixkit.co")) return "";
  return clean;
}

export function ProductPage({
  homepage,
  product,
  products = [],
  reels = [],
  favorites = [],
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  onGoBack,
  money
}) {
  const current = product || products[0] || null;
  const productId = current?.id || current?._id || "";
  const currentProductName = current?.name || "AL-ZEHRA SILK";

  const [selectedImageOverride, setSelectedImageOverride] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState("description");
  const [isMobileView, setIsMobileView] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );

  // PIP floats automatically whenever a PIP video is present
  const [pipFloatingOpen, setPipFloatingOpen] = useState(true);
  const [pipMuted, setPipMuted] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const addedTimerRef = useRef(null);

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
    return () => {
      window.removeEventListener("resize", onResize);
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
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

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "Free Size");
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedColorwayId, setSelectedColorwayId] = useState(productId);

  const [activeClipIndex, setActiveClipIndex] = useState(null);
  const [clipMuted, setClipMuted] = useState(false);
  const [failedClipIds, setFailedClipIds] = useState({});
  const [backendReviews, setBackendReviews] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const res = await fetch(`${API}/reviews`, { signal: controller.signal });
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
            meta: `Verified Owner: ${r.productName || currentProductName}`,
            location: `${r.location || "India"} • Verified Buyer`
          }))
        );
      } catch (err) {
        if (err?.name !== "AbortError") {
          // Keep existing reviews on transient error
        }
      }
    }

    loadReviews();
    window.addEventListener("alzehrasilk_store_updated", loadReviews);
    return () => {
      controller.abort();
      window.removeEventListener("alzehrasilk_store_updated", loadReviews);
    };
  }, [currentProductName]);

  useEffect(() => {
    const nextSizes = current?.sizes?.length ? current.sizes : DEFAULT_SIZES;
    const defaultSz = nextSizes[0] || "Free Size";
    setSelectedVariantIndex(0);
    setSelectedImageOverride("");
    setSelectedSize(defaultSz);
    setQuantity(1);
    setShowVideo(false);
    setActiveClipIndex(null);
    setFailedClipIds({});
    setSelectedColorwayId(productId);
    setActiveInfoTab("description");
    setPipFloatingOpen(true);
    setAddedFeedback(false);
  }, [productId, current?.sizes]);

  useEffect(() => {
    if (!sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0] || "Free Size");
    }
  }, [sizes, selectedSize]);

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

  const activePipVideo = safeVideoSrc(
    current?.pipVideoUrl || current?.videoUrl || ""
  );
  const pipVideoTitle =
    current?.pipVideoTitle || `${current?.name || "Saree"} Drape Video`;

  const productShortClips = useMemo(() => {
    if (!current || !productReelsEnabled) return [];
    const posterImg = currentImage;
    const clips = [];

    if (currentVideo) {
      clips.push({
        id: `${productId}-main-clip`,
        label: "Drape Preview",
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
        tag: r.tag || "DRAPE REEL",
        videoUrl: safeVideoSrc(r.videoUrl),
        poster: safeImgSrc(r.poster || posterImg)
      });
    });
    return clips.slice(0, 5);
  }, [current, productId, reels, productReelsEnabled, currentVideo, currentImage]);

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
    const list = Array.isArray(products) ? products : [];
    const sameGroup = list.filter(
      (p) =>
        p &&
        (p.category === current.category ||
          p.collection === current.collection)
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
    const sourceList = Array.isArray(products) ? products : [];
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
    : Number(current?.price) || 0;
  const oldPriceNum = activeVariant
    ? Number(activeVariant.oldPrice) || 0
    : Number(current?.oldPrice) || 0;
  const discountPct =
    oldPriceNum > priceNum && priceNum > 0
      ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
      : 0;

  const isFavorite = favorites.includes(productId);

  function buildCartProductPayload(qty = 1) {
    const variantSuffix =
      activeVariant && activeVariant.label ? ` — ${activeVariant.label}` : "";
    return {
      ...current,
      id: activeVariant ? `${productId}__${activeVariant.id}` : productId,
      baseProductId: productId,
      variantId: activeVariant?.id || null,
      name: `${current.name}${variantSuffix}`,
      color: activeColorLabel || current.color,
      price: priceNum,
      oldPrice: oldPriceNum || null,
      image: currentImage,
      videoUrl: currentVideo,
      quantity: qty
    };
  }

  function triggerAddedToast() {
    setAddedFeedback(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAddedFeedback(false), 1800);
  }

  function handleAddSelection() {
    const safeQty = Math.max(1, Number(quantity) || 1);
    const itemToAdd = buildCartProductPayload(safeQty);
    onAddToCart?.(itemToAdd, selectedSize, safeQty);
    triggerAddedToast();
  }

  function handleExpandMedia() {
    const el = document.querySelector(".pdp-stage");
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }

  const activeClip =
    productReelsEnabled &&
    activeClipIndex !== null &&
    productShortClips[activeClipIndex]
      ? productShortClips[activeClipIndex]
      : null;

  const galleryThumbnails = [
    baseVariantOrProductImage,
    ...(Array.isArray(current?.images) ? current.images.map(safeImgSrc) : [])
  ]
    .filter(Boolean)
    .filter((url, idx, arr) => arr.indexOf(url) === idx)
    .slice(0, 5);

  const sareeSpecs = [
    { label: "Fabric", value: current?.fabric },
    { label: "Weave", value: current?.weave },
    { label: "Occasion", value: current?.occasion },
    { label: "Saree Length", value: current?.sareeLength || "5.5m" },
    { label: "Blouse Piece", value: current?.blousePiece || "0.8m Unstitched" }
  ].filter((item) => item.value);

  if (!current) return null;

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
            {(current.collection || "BANARASI").replace(/-/g, " ").toUpperCase()} /{" "}
            {(current.category || "SAREES").replace(/-/g, " ").toUpperCase()} / {current.name}
          </span>
        </div>
      </div>

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
                  }}
                  style={{
                    width: isMobileView ? "60px" : "68px",
                    height: isMobileView ? "74px" : "84px",
                    padding: "3px",
                    borderRadius: "8px",
                    border: isThumbActive
                      ? "1.5px solid #7A1C24"
                      : "1px solid #E2E8F0",
                    background: "#FAF7F2",
                    boxShadow: "0 1px 4px rgba(15, 23, 42, 0.06)",
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
                      e.currentTarget.style.display = "none";
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "50% 20%",
                      display: "block",
                      borderRadius: "5px"
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
              background: "#FAF7F2",
              border: "0",
              boxShadow: "none",
              borderRadius: "0",
              overflow: "hidden",
              position: "relative",
              maxHeight: isMobileView
                ? undefined
                : `${Number(homepage?.productPage?.galleryMaxHeightPx) || 600}px`
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
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <img
                src={currentImage}
                alt={current.name}
                style={{
                  width: "100%",
                  height: isMobileView ? "auto" : "100%",
                  objectFit: current.imageFit === "contain" ? "contain" : "cover",
                  objectPosition: `${current.imagePosX ?? 50}% ${current.imagePosY ?? 20}%`,
                  transform: `scale(${Number(current.imageZoom) || 1})`,
                  transformOrigin: `${current.imagePosX ?? 50}% ${current.imagePosY ?? 20}%`
                }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
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
                  <Film size={11} /> DRAPE VIEW
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

          {sareeSpecs.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))",
                gap: "8px",
                padding: "10px 12px",
                marginBottom: "14px",
                borderRadius: "10px",
                background: "var(--surface, #F3ECE1)",
                border: "1px solid var(--line, rgba(0,0,0,0.08))"
              }}
            >
              {sareeSpecs.map((spec) => (
                <div key={spec.label}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--muted, #64748B)"
                    }}
                  >
                    {spec.label}
                  </span>
                  <strong style={{ fontSize: "12px", color: "var(--ink, #231917)" }}>
                    {spec.value}
                  </strong>
                </div>
              ))}
            </div>
          )}

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
                  <Play size={11} fill="currentColor" /> SEE THE DRAPE IN MOTION
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
                          ? "2px solid #7A1C24"
                          : "2px solid #A8323E",
                        padding: "2px",
                        background: "#1A1210",
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
                            e.currentTarget.style.display = "none";
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
                            color: "#231917",
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
              <strong>Festive Offers</strong>
              <span>Auto applies at checkout</span>
            </div>
            <div className="pdp-offer-cards">
              <div className="pdp-offer-card blue">
                <span className="pdp-offer-pill blue">
                  {pdpCfg.offer1Badge || "10% OFF"}
                </span>
                <span>{pdpCfg.offer1Text || "Buy 2 Sarees"}</span>
              </div>
              <div className="pdp-offer-card green">
                <span className="pdp-offer-pill green">
                  {pdpCfg.offer2Badge || "15% OFF"}
                </span>
                <span>{pdpCfg.offer2Text || "Buy 3 Sarees"}</span>
              </div>
            </div>
          </div>

          {activeColorLabel && (
            <div>
              <span className="size-label" style={{ marginBottom: "6px" }}>
                Shade:{" "}
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
                          e.currentTarget.style.display = "none";
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
              <span className="size-label">
                {sizes.length === 1 && sizes[0] === "Free Size"
                  ? "Size: Free Size (5.5m Saree + 0.8m Blouse)"
                  : "Select Size"}
              </span>
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
              {addedFeedback
                ? `ADDED (${quantity}) TO BAG ✓`
                : `ADD TO BAG — ${formatPrice(priceNum * quantity)}`}
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
              background: "var(--surface, #F3ECE1)",
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
              Partial COD • Ships in 24–48 hrs • 48-Hour Easy Returns
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
                { key: "features", label: "Weave & Care" },
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
                        ? "2px solid var(--ink, #231917)"
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
                  "Handpicked silk drape crafted for effortless pleating, rich zari finish, and timeless festive grace."}
              </p>
            )}

            {activeInfoTab === "features" && (
              <div style={{ display: "grid", gap: "10px" }}>
                <ul className="pdp-highlights" style={{ margin: 0 }}>
                  {(current.highlights?.length
                    ? current.highlights
                    : [
                        "5.5m Saree with 0.8m matching unstitched blouse piece",
                        "Lightweight, easy-to-pleat festive drape",
                        "Hand-checked zari & weave quality"
                      ]
                  ).map((item, idx) => (
                    <li key={idx}>
                      <Check size={14} /> {item}
                    </li>
                  ))}
                </ul>
                {current.careInstructions && (
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>
                    <strong>Care:</strong> {current.careInstructions}
                  </p>
                )}
              </div>
            )}

            {activeInfoTab === "shipping" && (
              <div style={{ fontSize: "12.5px", lineHeight: 1.7, color: "var(--muted)" }}>
                <p style={{ margin: "0 0 6px" }}>
                  <strong>Dispatch:</strong>{" "}
                  {current.dispatchNotice || "Orders dispatched within 24–48 business hours."}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Returns & Exchange:</strong>{" "}
                  {current.returnDetails ||
                    "48-hour easy return and exchange on unused, unwashed sarees with original tags intact."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating PIP Video Player */}
      {pipFloatingOpen && activePipVideo && (
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
              {pipVideoTitle}
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
            onError={() => setPipFloatingOpen(false)}
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
              <p className="eyebrow">RECOMMENDED FOR YOUR WARDROBE</p>
              <h2>
                Suggested <em>for you.</em>
              </h2>
            </div>
            <span className="product-count">CURATED WEAVES</span>
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
              const defaultSz = item.sizes?.[0] || "Free Size";
              return (
                <article key={itemId} className="product-card">
                  <div
                    className="product-image-wrap clickable"
                    onClick={() => onSelectProduct?.(item)}
                  >
                    <img
                      src={safeImgSrc(item.image)}
                      alt={item.name}
                      style={{ objectFit: "cover", objectPosition: "50% 20%" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
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
                        onAddToCart?.({ ...item, id: itemId, quantity: 1 }, defaultSz, 1);
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
                      <p>{item.fabric || item.color}</p>
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
                e.currentTarget.style.display = "none";
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
                        color: selectedSize === sz ? "#231917" : "#FFFFFF",
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
                    onAddToCart?.(buildCartProductPayload(1), selectedSize, 1);
                    setActiveClipIndex(null);
                    triggerAddedToast();
                  }}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    borderRadius: "999px",
                    border: 0,
                    background: "#FFFFFF",
                    color: "#231917",
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
            Honest reviews from women draping Al-Zehra Silk across weddings and celebrations.
          </p>
        </div>

        <div className="calzare-reviews-grid">
          {productReviews.map((rev) => {
            const stars = Math.max(1, Math.min(5, Number(rev.rating) || 5));

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
                  <span className="calzare-verified-badge">✓ Verified</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="calzare-standard-block">
          <h2 className="calzare-standard-title">
            {pdpCfg.standardTitle || "THE AL-ZEHRA SILK PROMISE"}
          </h2>
          <p className="calzare-standard-sub">
            {pdpCfg.standardSubtitle || "Authentic weaves. Hand-checked before dispatch."}
          </p>

          <div className="calzare-standard-grid">
            {BRAND_PROMISE_CARDS.map((item) => {
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
          <strong>Fast dispatch</strong>
          <span>Ships within 24–48 hours across India</span>
        </div>
        <div className="pdp-guarantee-cell">
          <RefreshCw size={22} />
          <strong>Easy returns</strong>
          <span>48-hour hassle-free return & exchange</span>
        </div>
        <div className="pdp-guarantee-cell">
          <Sparkles size={22} />
          <strong>Customer Support</strong>
          <span>Dedicated help for draping & orders</span>
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
                      style={{ objectFit: "cover", objectPosition: "50% 20%" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="product-meta">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.fabric || item.color}</p>
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
              background: "#FAF7F2",
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
            {addedFeedback
              ? `ADDED (${quantity}) TO BAG ✓`
              : `ADD TO BAG — ${formatPrice(priceNum * quantity)}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
