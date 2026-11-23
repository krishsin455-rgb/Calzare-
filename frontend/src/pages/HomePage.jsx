import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
  Heart,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck
} from "lucide-react";

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

const HOMEPAGE_STORAGE_KEY = "calzare_homepage_v1";
const DEFAULT_SIZES = ["UK 7", "UK 8", "UK 9", "UK 10"];

const COLLECTIONS_STRIP = [
  {
    key: "men",
    label: "MEN",
    subtitle: "Structured formals & daily pairs",
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80"
  },
  {
    key: "women",
    label: "WOMEN",
    subtitle: "Versatile lows & relaxed slides",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80"
  },
  {
    key: "unisex",
    label: "UNISEX",
    subtitle: "Clean courts & everyday runners",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80"
  },
  {
    key: "kids",
    label: "KIDS",
    subtitle: "Easy-strap playground staples",
    image:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80"
  }
];

const DEFAULT_EDITORIAL_SLIDES = [
  {
    id: "ed-1",
    title: "Forma Court",
    subtitle: "Minimal architectural court silhouette built for long city days.",
    ctaLabel: "Buy Now",
    ctaAlign: "left",
    ctaBottomPx: 14,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=85",
    imageFit: "cover",
    imagePosX: 50,
    imagePosY: 50,
    imageZoom: 1,
    productId: "c-001",
    redirectUrl: "#product/c-001"
  },
  {
    id: "ed-2",
    title: "Everyday Rotation",
    subtitle: "Featherweight cushioning with zero break-in from day one.",
    ctaLabel: "Shop Now",
    ctaAlign: "left",
    ctaBottomPx: 14,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85",
    imageFit: "cover",
    imagePosX: 50,
    imagePosY: 50,
    imageZoom: 1,
    productId: "",
    redirectUrl: "#unisex"
  }
];

const DEFAULT_SECTION_ORDER = [
  "hero_main",
  "trust_strip",
  "collections_strip",
  "affordable_store",
  "editorial_slider",
  "featured_product",
  "intro_statement",
  "shop_grid",
  "reels_motion",
  "campaign_banner",
  "our_philosophy",
  "journal_notes",
  "newsletter"
];

function getBlockAlignStyle(align = "left") {
  const norm = align === "centre" ? "center" : align || "left";
  if (norm === "center") {
    return {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "auto",
      marginRight: "auto"
    };
  }
  if (norm === "right") {
    return {
      textAlign: "right",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      marginLeft: "auto",
      marginRight: "0"
    };
  }
  return {
    textAlign: "left",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: "0",
    marginRight: "auto"
  };
}

function EditorialShowcaseSlider({
  slides,
  products,
  titleAlign = "center",
  onOpenProductPage,
  onNavigateCollection
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  const list =
    Array.isArray(slides) && slides.length > 0 ? slides : DEFAULT_EDITORIAL_SLIDES;
  const safeIndex = Math.min(activeIndex, list.length - 1);
  const current = list[safeIndex];
  const alignStyle = getBlockAlignStyle(titleAlign);
  const ctaAlignStyle = getBlockAlignStyle(current.ctaAlign || "left");

  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % list.length);

  const handleSlideAction = (slide) => {
    if (slide.productId) {
      const found = (products || []).find(
        (p) => String(p.id) === String(slide.productId)
      );
      if (found) {
        onOpenProductPage?.(found);
        return;
      }
      window.location.hash = `#product/${encodeURIComponent(String(slide.productId))}`;
      return;
    }

    const url = (slide.redirectUrl || "").trim();
    if (!url) return;

    if (url.toLowerCase().startsWith("#product/")) {
      const prodId = decodeURIComponent(url.slice("#product/".length)).trim();
      const found = (products || []).find((p) => String(p.id) === String(prodId));
      if (found) {
        onOpenProductPage?.(found);
      } else {
        window.location.hash = url;
      }
      return;
    }

    if (["#men", "#women", "#unisex", "#kids", "#story"].includes(url.toLowerCase())) {
      onNavigateCollection?.(url.replace("#", "").toLowerCase());
      return;
    }

    if (url.startsWith("#")) {
      window.location.hash = url;
      try {
        const target = document.querySelector(url);
        target?.scrollIntoView({ behavior: "smooth" });
      } catch (_) {}
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="editorial-showcase-slider"
      aria-label="Editorial showcase"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#0B0D10",
        margin: "24px 0"
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX || 0;
      }}
      onTouchEnd={(e) => {
        const delta = (e.changedTouches[0]?.clientX || 0) - touchStartX.current;
        if (Math.abs(delta) > 45) {
          if (delta < 0) handleNext();
          else handlePrev();
        }
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: current.slideHeightPx
            ? `${Number(current.slideHeightPx)}px`
            : "clamp(420px, 68vh, 640px)",
          overflow: "hidden"
        }}
      >
        <img
          src={current.image || SAFE_IMAGE_FALLBACK}
          alt={current.title || "Calzare Showcase"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = SAFE_IMAGE_FALLBACK;
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: current.imageFit || "cover",
            objectPosition: `${current.imagePosX ?? 50}% ${current.imagePosY ?? 50}%`,
            transform: `scale(${Number(current.imageZoom) || 1})`,
            transformOrigin: `${current.imagePosX ?? 50}% ${current.imagePosY ?? 50}%`,
            display: "block"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.58) 100%)"
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: alignStyle.alignItems,
            justifyContent: "center",
            textAlign: alignStyle.textAlign,
            padding: "24px clamp(24px, 6vw, 72px) 96px",
            color: "#FFFFFF",
            pointerEvents: "none"
          }}
        >
          {current.title && (
            <h2
              style={{
                margin: "0 0 10px",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(32px, 5vw, 58px)",
                fontWeight: 500,
                lineHeight: 1.08,
                color: "#FFFFFF",
                textAlign: alignStyle.textAlign
              }}
            >
              {current.title}
            </h2>
          )}
          {current.subtitle && (
            <p
              style={{
                margin: 0,
                maxWidth: "540px",
                fontSize: "clamp(13px, 1.4vw, 16px)",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.9)",
                textAlign: alignStyle.textAlign
              }}
            >
              {current.subtitle}
            </p>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: `${(Number(current.ctaBottomPx) || 14) + (list.length > 1 ? 26 : 0)}px`,
            padding: "0 clamp(24px, 6vw, 72px)",
            display: "flex",
            justifyContent: ctaAlignStyle.justifyContent,
            zIndex: 3
          }}
        >
          <button
            type="button"
            onClick={() => handleSlideAction(current)}
            style={{
              padding: "12px 28px",
              borderRadius: "999px",
              border: "1px solid #FFFFFF",
              background: "#FFFFFF",
              color: "#0F172A",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            {current.ctaLabel || "Buy Now"}
          </button>
        </div>

        {list.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={handlePrev}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(0,0,0,0.42)",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                zIndex: 4
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={handleNext}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(0,0,0,0.42)",
                color: "#FFFFFF",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                zIndex: 4
              }}
            >
              <ChevronRight size={18} />
            </button>

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "14px",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                zIndex: 4
              }}
            >
              {list.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: idx === safeIndex ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    border: 0,
                    padding: 0,
                    background:
                      idx === safeIndex ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function HomePage({
  homepage = {},
  storeSettings = {},
  products = [],
  visibleProducts = [],
  reels = [],
  categories = ["sneakers", "formal", "slides"],
  allowedCollections = ["men", "women", "unisex", "kids"],
  category,
  setCategory,
  favorites = [],
  onToggleFavorite,
  onOpenProductPage,
  onOpenQuickView,
  onDirectAddToCart,
  onOpenReel,
  onFeaturedClick,
  onNavigateCollection,
  under999Section,
  email,
  setEmail,
  onSubscribe,
  money
}) {
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [campaignVideoFailed, setCampaignVideoFailed] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [localAlignMap, setLocalAlignMap] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null");
      const map = {};
      (raw?.sections || []).forEach((s) => {
        if (s?.key && s?.titleAlign) map[s.key] = s.titleAlign;
      });
      return map;
    } catch (_) {
      return {};
    }
  });

  useEffect(() => {
    const syncAlign = () => {
      try {
        const raw = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null");
        const map = {};
        (raw?.sections || []).forEach((s) => {
          if (s?.key && s?.titleAlign) map[s.key] = s.titleAlign;
        });
        setLocalAlignMap(map);
      } catch (_) {}
    };
    window.addEventListener("calzare_store_updated", syncAlign);
    window.addEventListener("storage", syncAlign);
    return () => {
      window.removeEventListener("calzare_store_updated", syncAlign);
      window.removeEventListener("storage", syncAlign);
    };
  }, []);

  const displayedProducts = visibleProducts || [];

  const visibleCollectionCards = COLLECTIONS_STRIP.filter((col) =>
    Array.isArray(allowedCollections) ? allowedCollections.includes(col.key) : true
  );

  const categoryFilterPills = [
    { key: "all", label: "ALL PIECES" },
    ...(Array.isArray(categories) ? categories : []).map((cat) => ({
      key: String(cat).toLowerCase(),
      label: String(cat).toUpperCase()
    }))
  ];

  const trustLayoutClass =
    homepage?.mobileUI?.trustLayout === "stack" ? "" : "mobile-swipe-mode";

  const customStoryBlocks = Array.isArray(storeSettings?.storySections)
    ? storeSettings.storySections.filter(
        (s) => s && (s.eyebrow || s.heading || s.body)
      )
    : [];

  const cmsSections = Array.isArray(homepage?.sections) ? homepage.sections : [];
  const sectionMap = Object.fromEntries(cmsSections.map((s) => [s.key, s]));

  const getAlign = (key, fallback = "left") =>
    sectionMap[key]?.titleAlign || localAlignMap[key] || fallback;

  const isVisible = (key) => {
    if (sectionMap[key] && sectionMap[key].visible === false) return false;
    return true;
  };

  const orderedKeys = (() => {
    const knownCmsKeys = cmsSections
      .map((s) => s.key)
      .filter((k) => DEFAULT_SECTION_ORDER.includes(k));
    const missing = DEFAULT_SECTION_ORDER.filter((k) => !knownCmsKeys.includes(k));
    return [...knownCmsKeys, ...missing];
  })();

  const sectionRenderers = {
    hero_main: () => {
      const a = getBlockAlignStyle(getAlign("hero_main", "left"));
      return (
        <section className="hero" key="hero_main">
          <img
            className="hero-image"
            src={
              homepage?.heroImage ||
              sectionMap.hero_main?.image ||
              SAFE_IMAGE_FALLBACK
            }
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = SAFE_IMAGE_FALLBACK;
            }}
            alt={homepage?.heroTitle || "Minimal footwear editorial"}
          />
          <div className="hero-shade" />
          <div
            className="hero-copy"
            style={{
              textAlign: a.textAlign,
              alignItems: a.alignItems,
              width: "100%",
              maxWidth: "1360px",
              margin: "0 auto"
            }}
          >
            <p className="eyebrow light" style={{ textAlign: a.textAlign }}>
              {homepage?.heroEyebrow}
            </p>
            <h1 style={{ textAlign: a.textAlign }}>
              {homepage?.heroTitle}
              <br />
              <em>{homepage?.heroTitleEmphasis}</em>
            </h1>
            <p
              className="hero-sub"
              style={{
                textAlign: a.textAlign,
                marginLeft: a.marginLeft,
                marginRight: a.marginRight
              }}
            >
              {homepage?.heroDescription}
            </p>
            <div className="hero-cta-row" style={{ justifyContent: a.justifyContent }}>
              <a className="light-link" href="#shop">
                DISCOVER THE COLLECTION <ArrowUpRight size={16} />
              </a>
              {homepage?.reelsEnabled !== false &&
                isVisible("reels_motion") &&
                reels.length > 0 && (
                  <a className="light-link" href="#reels">
                    WATCH IN MOTION <Play size={14} />
                  </a>
                )}
            </div>
          </div>

          <a className="scroll-cue" href="#shop">
            <ArrowDown size={15} /> SCROLL TO EXPLORE
          </a>
        </section>
      );
    },

    trust_strip: () => {
      const a = getBlockAlignStyle(getAlign("trust_strip", "left"));
      return (
        <section
          key="trust_strip"
          className={`trust-strip ${trustLayoutClass}`}
          style={{ textAlign: a.textAlign, justifyContent: a.justifyContent }}
          aria-label="Store highlights"
        >
          <div className="trust-item">
            <Truck size={18} />
            <div style={{ textAlign: a.textAlign }}>
              <strong>FREE SHIPPING ₹2,999+</strong>
              <span>Fast dispatch across India</span>
            </div>
          </div>
          <div className="trust-item">
            <RefreshCw size={18} />
            <div style={{ textAlign: a.textAlign }}>
              <strong>7-DAY SIZE EXCHANGE</strong>
              <span>Hassle-free UK size swaps</span>
            </div>
          </div>
          <div className="trust-item">
            <Sparkles size={18} />
            <div style={{ textAlign: a.textAlign }}>
              <strong>ZERO BREAK-IN COMFORT</strong>
              <span>Cushioned for long days</span>
            </div>
          </div>
          <div className="trust-item">
            <ShieldCheck size={18} />
            <div style={{ textAlign: a.textAlign }}>
              <strong>PARTIAL COD & UPI</strong>
              <span>Flexible, secure checkout</span>
            </div>
          </div>
        </section>
      );
    },

    collections_strip: () => {
      const a = getBlockAlignStyle(getAlign("collections_strip", "left"));
      return visibleCollectionCards.length > 0 ? (
        <section
          className="collections-strip section-pad"
          id="collections"
          key="collections_strip"
        >
          <div
            className="section-heading"
            style={{
              flexDirection: a.textAlign === "right" ? "row-reverse" : "row",
              textAlign: a.textAlign
            }}
          >
            <div
              style={{
                textAlign: a.textAlign,
                marginLeft: a.marginLeft,
                marginRight: a.marginRight
              }}
            >
              <p className="eyebrow" style={{ textAlign: a.textAlign }}>
                CURATED DEPARTMENTS
              </p>
              <h2 style={{ textAlign: a.textAlign }}>
                Shop by <em>collection.</em>
              </h2>
            </div>
            <button
              type="button"
              className="product-count"
              style={{ background: "none", border: 0, cursor: "pointer" }}
              onClick={() => onNavigateCollection?.("all")}
            >
              EXPLORE ALL
            </button>
          </div>

          <div className="collection-cards-grid">
            {visibleCollectionCards.map((col) => (
              <button
                type="button"
                key={col.key}
                className="collection-tile"
                style={{ textAlign: a.textAlign }}
                onClick={() => onNavigateCollection?.(col.key)}
              >
                <img
                  src={storeSettings?.collectionImages?.[col.key] || col.image}
                  alt={col.label}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                  }}
                />
                <div className="collection-tile-scrim" />
                <div
                  className="collection-tile-copy"
                  style={{ textAlign: a.textAlign, alignItems: a.alignItems }}
                >
                  <strong style={{ textAlign: a.textAlign }}>{col.label}</strong>
                  <span style={{ textAlign: a.textAlign }}>{col.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null;
    },

    affordable_store: () => {
      const a = getBlockAlignStyle(getAlign("affordable_store", "left"));
      return homepage?.affordableStore?.enabled !== false ? (
        <div
          key="affordable_store"
          style={{
            textAlign: a.textAlign,
            display: "flex",
            flexDirection: "column",
            alignItems: a.alignItems
          }}
        >
          {under999Section}
        </div>
      ) : null;
    },

    editorial_slider: () =>
      homepage?.editorialSlider?.enabled !== false ? (
        <EditorialShowcaseSlider
          key="editorial_slider"
          slides={homepage?.editorialSlider?.slides}
          products={products}
          titleAlign={getAlign("editorial_slider", "center")}
          onOpenProductPage={onOpenProductPage}
          onNavigateCollection={onNavigateCollection}
        />
      ) : null,

    featured_product: () => {
      const a = getBlockAlignStyle(getAlign("featured_product", "left"));
      return homepage?.featuredProduct?.enabled !== false && homepage?.featuredProduct ? (
        <section className="exclusive-spotlight section-pad" key="featured_product">
          <div className="exclusive-card" onClick={onFeaturedClick}>
            <div className="exclusive-media">
              <span className="product-badge">
                {homepage.featuredProduct.sectionType || "EXCLUSIVE"}
              </span>
              <img
                src={homepage.featuredProduct.image || SAFE_IMAGE_FALLBACK}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                }}
                alt={homepage.featuredProduct.title}
              />
            </div>
            <div
              className="exclusive-info"
              style={{
                textAlign: a.textAlign,
                alignItems: a.alignItems,
                marginLeft: a.marginLeft,
                marginRight: a.marginRight
              }}
            >
              <p className="eyebrow" style={{ textAlign: a.textAlign }}>
                FEATURED DROP
              </p>
              <h2 style={{ textAlign: a.textAlign }}>{homepage.featuredProduct.title}</h2>
              <p className="exclusive-price" style={{ textAlign: a.textAlign }}>
                {money(homepage.featuredProduct.price)}
              </p>
              <span className="dark-link" style={{ justifyContent: a.justifyContent }}>
                VIEW & SELECT SIZE <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </section>
      ) : null;
    },

    intro_statement: () => {
      const a = getBlockAlignStyle(getAlign("intro_statement", "center"));
      return (
        <section
          className="intro section-pad"
          key="intro_statement"
          style={{
            textAlign: a.textAlign,
            display: "flex",
            flexDirection: "column",
            alignItems: a.alignItems
          }}
        >
          <p className="eyebrow" style={{ textAlign: a.textAlign }}>
            LESS, BUT BETTER
          </p>
          <h2 style={{ textAlign: a.textAlign }}>
            Good design is felt
            <br />
            in <em>every step.</em>
          </h2>
          <p
            style={{
              textAlign: a.textAlign,
              marginLeft: a.marginLeft,
              marginRight: a.marginRight
            }}
          >
            We believe the things you wear every day should be considered, comfortable and made to
            last. Meet the new language of everyday footwear.
          </p>
        </section>
      );
    },

    shop_grid: () => {
      const a = getBlockAlignStyle(getAlign("shop_grid", "left"));
      return (
        <section className="shop-section section-pad" id="shop" key="shop_grid">
          <div
            className="section-heading"
            style={{
              flexDirection: a.textAlign === "right" ? "row-reverse" : "row",
              textAlign: a.textAlign
            }}
          >
            <div
              style={{
                textAlign: a.textAlign,
                marginLeft: a.marginLeft,
                marginRight: a.marginRight
              }}
            >
              <p className="eyebrow" style={{ textAlign: a.textAlign }}>
                THE CALZARE EDIT
              </p>
              <h2 style={{ textAlign: a.textAlign }}>
                Find your <em>form.</em>
              </h2>
            </div>
            <span className="product-count">
              {displayedProducts.length.toString().padStart(2, "0")} PRODUCTS
            </span>
          </div>

          <div className="filters" style={{ justifyContent: a.justifyContent }}>
            {categoryFilterPills.map((item) => (
              <button
                type="button"
                key={item.key}
                className={category === item.key ? "filter active" : "filter"}
                onClick={() => setCategory(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {displayedProducts.map((product) => {
              const sizes =
                Array.isArray(product.sizes) && product.sizes.length > 0
                  ? product.sizes
                  : DEFAULT_SIZES;
              const activeSize = selectedSizes[product.id] || sizes[1] || sizes[0];

              return (
                <article
                  className="product-card"
                  key={product.id}
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <div
                    className="product-image-wrap clickable"
                    onClick={() => onOpenProductPage(product)}
                  >
                    {hoveredProductId === product.id && product.videoUrl ? (
                      <video
                        src={product.videoUrl}
                        poster={product.image || SAFE_IMAGE_FALLBACK}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="card-hover-video"
                      />
                    ) : (
                      <img
                        src={product.image || SAFE_IMAGE_FALLBACK}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                        }}
                        alt={product.name}
                        loading="lazy"
                      />
                    )}
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}

                    {product.videoUrl && (
                      <button
                        type="button"
                        className="video-pill"
                        title="Watch product video"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQuickView(product, true);
                        }}
                      >
                        <Film size={12} /> VIDEO
                      </button>
                    )}

                    <button
                      type="button"
                      className={`favorite ${favorites.includes(product.id) ? "selected" : ""}`}
                      aria-label="Add to wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product.id);
                      }}
                    >
                      <Heart
                        size={18}
                        fill={favorites.includes(product.id) ? "currentColor" : "none"}
                      />
                    </button>

                    <button
                      type="button"
                      className="quick-add"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDirectAddToCart) {
                          onDirectAddToCart(product, activeSize);
                        } else {
                          onOpenQuickView(product, false);
                        }
                      }}
                    >
                      QUICK ADD ({activeSize}) <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="product-meta" onClick={() => onOpenProductPage(product)}>
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.color}</p>
                    </div>
                    <strong>{money(product.price)}</strong>
                  </div>
                  {product.oldPrice && <p className="old-price">{money(product.oldPrice)}</p>}

                  <div
                    className="card-size-row"
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sizes.map((sz) => (
                      <button
                        type="button"
                        key={sz}
                        className={activeSize === sz ? "size-pill active" : "size-pill"}
                        style={{ padding: "4px 8px", fontSize: "10px" }}
                        onClick={() =>
                          setSelectedSizes((prev) => ({ ...prev, [product.id]: sz }))
                        }
                      >
                        {sz.replace("UK ", "")}
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          {!displayedProducts.length && (
            <p className="empty-state">No pieces found. Try another category or search.</p>
          )}
        </section>
      );
    },

    reels_motion: () => {
      const a = getBlockAlignStyle(getAlign("reels_motion", "left"));
      return homepage?.reelsEnabled !== false && reels.length > 0 ? (
        <section className="reels-section section-pad" id="reels" key="reels_motion">
          <div
            className="section-heading"
            style={{
              flexDirection: a.textAlign === "right" ? "row-reverse" : "row",
              textAlign: a.textAlign
            }}
          >
            <div
              style={{
                textAlign: a.textAlign,
                marginLeft: a.marginLeft,
                marginRight: a.marginRight
              }}
            >
              <p className="eyebrow" style={{ textAlign: a.textAlign }}>
                SHOPPABLE REELS
              </p>
              <h2 style={{ textAlign: a.textAlign }}>
                Calzare in <em>motion.</em>
              </h2>
            </div>
            <span className="product-count">TAP ANY REEL TO SHOP</span>
          </div>

          <div className="reels-grid">
            {reels.map((reel) => {
              const linkedProduct =
                products.find((p) => p.id === reel.productId) || products[0];
              return (
                <div className="reel-card" key={reel.id} onClick={() => onOpenReel(reel)}>
                  {reel.videoUrl ? (
                    <video
                      src={reel.videoUrl}
                      poster={reel.poster || SAFE_IMAGE_FALLBACK}
                      muted
                      loop
                      playsInline
                      autoPlay
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={reel.poster || SAFE_IMAGE_FALLBACK}
                      alt={reel.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                  <div className="reel-overlay">
                    <span className="reel-tag">{reel.tag}</span>
                    <div
                      className="reel-bottom"
                      style={{ textAlign: a.textAlign, alignItems: a.alignItems }}
                    >
                      <h3 style={{ textAlign: a.textAlign }}>{reel.title}</h3>
                      {linkedProduct && (
                        <div className="reel-product-chip">
                          <img
                            src={linkedProduct.image || SAFE_IMAGE_FALLBACK}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                            }}
                            alt={linkedProduct.name}
                          />
                          <div>
                            <strong>{linkedProduct.name}</strong>
                            <span>{money(linkedProduct.price)}</span>
                          </div>
                          <ArrowUpRight size={15} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null;
    },

    campaign_banner: () => {
      const a = getBlockAlignStyle(getAlign("campaign_banner", "left"));
      return (
        <section className="campaign" key="campaign_banner">
          <div className="campaign-image">
            {homepage?.campaignVideoUrl && !campaignVideoFailed ? (
              <video
                src={homepage.campaignVideoUrl}
                poster={sectionMap.campaign_banner?.image || SAFE_IMAGE_FALLBACK}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setCampaignVideoFailed(true)}
              />
            ) : (
              <img
                src={sectionMap.campaign_banner?.image || SAFE_IMAGE_FALLBACK}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                }}
                alt="Footwear and everyday styling"
                loading="lazy"
              />
            )}
          </div>
          <div
            className="campaign-copy"
            style={{
              textAlign: a.textAlign,
              alignItems: a.alignItems
            }}
          >
            <p className="eyebrow" style={{ textAlign: a.textAlign }}>
              A CALZARE STATE OF MIND
            </p>
            <h2 style={{ textAlign: a.textAlign }}>
              Made to move.
              <br />
              <em>Made to matter.</em>
            </h2>
            <p style={{ textAlign: a.textAlign }}>
              From slow mornings to the long way home, find pieces that feel like you.
            </p>
            <a
              className="dark-link"
              href="#collections"
              style={{ justifyContent: a.justifyContent }}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("collections")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              SHOP THE EDIT <ArrowRight size={16} />
            </a>
          </div>
        </section>
      );
    },

    our_philosophy: () => {
      const a = getBlockAlignStyle(getAlign("our_philosophy", "center"));
      return (
        <section
          className="story section-pad"
          id="story"
          key="our_philosophy"
          style={{
            textAlign: a.textAlign,
            display: "flex",
            flexDirection: "column",
            alignItems: a.alignItems
          }}
        >
          <p className="eyebrow" style={{ textAlign: a.textAlign }}>
            {customStoryBlocks[0]?.eyebrow || "OUR PHILOSOPHY"}
          </p>
          <h2 style={{ textAlign: a.textAlign }}>
            {customStoryBlocks[0]?.heading || (
              <>
                Wear what
                <br />
                moves <em>you.</em>
              </>
            )}
          </h2>
          <p
            style={{
              textAlign: a.textAlign,
              marginLeft: a.marginLeft,
              marginRight: a.marginRight
            }}
          >
            {customStoryBlocks[0]?.body ||
              "CALZARE is built around a simple idea: everyday essentials deserve exceptional attention. We bring together considered silhouettes, versatile details and a point of view that never needs to shout."}
          </p>
          <button
            type="button"
            className="dark-link"
            style={{
              background: "none",
              border: 0,
              borderBottom: "1px solid currentColor",
              cursor: "pointer",
              justifyContent: a.justifyContent
            }}
            onClick={() => onNavigateCollection?.("story")}
          >
            GET TO KNOW US <ArrowUpRight size={16} />
          </button>
        </section>
      );
    },

    journal_notes: () => {
      const a = getBlockAlignStyle(getAlign("journal_notes", "left"));
      return (
        <section
          className="journal section-pad"
          id="journal"
          key="journal_notes"
          style={{
            textAlign: a.textAlign,
            display: "flex",
            flexDirection: "column",
            alignItems: a.alignItems
          }}
        >
          <div style={{ textAlign: a.textAlign, width: "100%" }}>
            <p className="eyebrow" style={{ textAlign: a.textAlign }}>
              NOTES FROM CALZARE
            </p>
            <h2 style={{ textAlign: a.textAlign }}>
              The considered <em>life.</em>
            </h2>
          </div>
          <div className="journal-card" style={{ width: "100%" }}>
            <img
              src={
                sectionMap.journal_notes?.image ||
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
              }
              alt="Minimal design studio"
              loading="lazy"
            />
            <div
              style={{
                textAlign: a.textAlign,
                display: "flex",
                flexDirection: "column",
                alignItems: a.alignItems
              }}
            >
              <span>01 — THE JOURNAL</span>
              <h3 style={{ textAlign: a.textAlign }}>On choosing fewer, better things.</h3>
              <a href="#story" style={{ justifyContent: a.justifyContent }}>
                READ THE STORY <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>
      );
    },

    newsletter: () => {
      const a = getBlockAlignStyle(getAlign("newsletter", "center"));
      return (
        <section
          className="newsletter"
          key="newsletter"
          style={{
            textAlign: a.textAlign,
            display: "flex",
            flexDirection: "column",
            alignItems: a.alignItems
          }}
        >
          <p className="eyebrow light" style={{ textAlign: a.textAlign }}>
            A NOTE, NOW AND THEN
          </p>
          <h2 style={{ textAlign: a.textAlign }}>
            Stay in the <em>know.</em>
          </h2>
          <p
            style={{
              textAlign: a.textAlign,
              marginLeft: a.marginLeft,
              marginRight: a.marginRight
            }}
          >
            New collections, thoughtful stories and a little inspiration for the everyday.
          </p>
          <form onSubmit={onSubscribe} style={{ justifyContent: a.justifyContent }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              style={{ textAlign: a.textAlign }}
            />
          </form>
        </section>
      );
    }
  };

  return (
    <>
      {orderedKeys.map((key) =>
        isVisible(key) && sectionRenderers[key] ? sectionRenderers[key]() : null
      )}
    </>
  );
}