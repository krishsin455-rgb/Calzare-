import { useEffect, useMemo, useState } from "react";
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
  Play,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Volume2,
  VolumeX,
  X
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

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

function safeImgSrc(url) {
  if (!url || typeof url !== "string" || !url.trim()) return SAFE_IMAGE_FALLBACK;
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
    return SAFE_IMAGE_FALLBACK;
  }
  return clean;
}

function safeVideoSrc(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
  if (url.includes("assets.mixkit.co")) return "";
  return url;
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

export default function ProductPage({
  homepage,
  product,
  products = [],
  reels = [],
  favorites = [],
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  onGoBack,
  money,
  canManageReviews = false
}) {
  const current = product || products[0] || null;
  const productId = current?.id || current?._id || "";

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

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState("description");
  const [isMobileView, setIsMobileView] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );

  useEffect(() => {
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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

  // Short Video Player State inside Product Page
  const [activeClipIndex, setActiveClipIndex] = useState(null);
  const [clipMuted, setClipMuted] = useState(false);
  const [failedClipIds, setFailedClipIds] = useState({});

  // Backend-Driven Reviews State
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

  const productReelsEnabled = homepage?.productReelsEnabled !== false;

  const currentImage = activeVariant ? activeVariant.image : safeImgSrc(current?.image);
  const currentVideo = activeVariant
    ? activeVariant.videoUrl
    : safeVideoSrc(current?.videoUrl);
  const activeColorLabel = activeVariant ? activeVariant.color : current?.color || "";

  const productShortClips = useMemo(() => {
    if (!current || !productReelsEnabled) return [];
    const posterImg = currentImage;
    const clips = [];

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
        (p.category === current.category || p.collection === current.collection)
    );
    const merged = [
      current,
      ...sameGroup.filter((p) => (p.id || p._id) !== productId)
    ];
    const seen = new Set();
    return merged
      .filter((item) => {
        const id = item.id || item._id;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 4);
  }, [products, current, productId]);

  const { suggestedItems, alsoBoughtItems } = useMemo(() => {
    const list = (Array.isArray(products) ? products : []).filter((p) => {
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

  if (!current) {
    return (
      <section className="pdp-page section-pad">
        <p className="empty-state">Product not found.</p>
        <button type="button" className="primary-cta-btn" onClick={onGoBack}>
          <ArrowLeft size={15} /> BACK TO STORE
        </button>
      </section>
    );
  }

  const pdpCfg = homepage?.productPage || {};

  const formatPrice =
    typeof money === "function"
      ? money
      : (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

  const priceNum = activeVariant ? Number(activeVariant.price) || 0 : Number(current.price) || 0;
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

  function handleAddSelection() {
    const itemToAdd = buildCartProductPayload();
    for (let i = 0; i < quantity; i += 1) {
      onAddToCart?.(itemToAdd, selectedSize, i === quantity - 1);
    }
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

  return (
    <div className="pdp-page" style={{ paddingBottom: isMobileView ? "76px" : 0 }}>
      <div className="pdp-topbar">
        <button type="button" className="pdp-back-btn" onClick={onGoBack}>
          <ArrowLeft size={14} /> BACK TO COLLECTION
        </button>
        <span className="pdp-crumb">
          {(current.collection || "UNISEX").toUpperCase()} /{" "}
          {(current.category || "FOOTWEAR").toUpperCase()} / {current.name}
        </span>
      </div>

      <div className="pdp-main-grid">
        <div className="pdp-stage">
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
            />
          ) : (
            <img
              src={currentImage}
              alt={current.name}
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

          {/* PAYMENT & TRUST STRIP */}
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

          {/* TABBED PRODUCT DETAILS */}
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

      {/* SUGGESTED PRODUCTS FOR YOU */}
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
                        onAddToCart?.(item, defaultSz, true);
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

      {/* FULL-SCREEN VERTICAL SHORT VIDEO MODAL */}
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
                    onAddToCart?.(buildCartProductPayload(), selectedSize, true);
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

      {/* CUSTOMER REVIEWS SECTION */}
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

      {/* STICKY MOBILE ADD-TO-CART BAR */}
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