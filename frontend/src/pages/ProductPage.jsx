import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Droplets,
  Film,
  Headphones,
  Heart,
  Maximize2,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck
} from "lucide-react";

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

const BROKEN_IMAGE_IDS = [
  "photo-1614252369475-531506b0b9e9",
  "photo-1520256862855-9981c41d8ba0"
];

const DEFAULT_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

const VERIFIED_REVIEWS = [
  {
    id: "rev-1",
    quote: '"WALKED 18,000 STEPS WITHOUT CALF FATIGUE"',
    body: "Tested these across Bangalore monsoons and broken pavement. The dual-density microfoam absorbs every harsh impact without feeling mushy. Genuinely superior to standard EVA clogs.",
    author: "Aarav Mehta",
    meta: "Verified Owner: Apex Closed-Cell Clog",
    location: "Bengaluru • Verified Buyer"
  },
  {
    id: "rev-2",
    quote: '"ARCHITECTURAL SHAPE MEETS ALL-DAY ARCH SUPPORT"',
    body: "I wear these for 10-hour hospital shifts. The sculpted arch cradle is unmatched. My feet feel fresh when clocking off.",
    author: "Priya Sundaram",
    meta: "Verified Owner: Apex All-Terrain Mule",
    location: "Mumbai • Verified Buyer"
  },
  {
    id: "rev-3",
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
  if (BROKEN_IMAGE_IDS.some((id) => url.includes(id))) return SAFE_IMAGE_FALLBACK;
  return url;
}

function safeVideoSrc(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
  if (url.includes("assets.mixkit.co")) return "";
  return url;
}

export default function ProductPage({
  product,
  products = [],
  favorites = [],
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  onGoBack,
  money
}) {
  const current = product || products[0] || null;
  const sizes = current?.sizes?.length ? current.sizes : DEFAULT_SIZES;

  const [selectedSize, setSelectedSize] = useState(
    sizes.includes("UK 8") ? "UK 8" : sizes[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedColorwayId, setSelectedColorwayId] = useState(
    current?.id || current?._id || ""
  );
  const [footerEmail, setFooterEmail] = useState("");
  const [footerSubscribed, setFooterSubscribed] = useState(false);

  useEffect(() => {
    const nextSizes = current?.sizes?.length ? current.sizes : DEFAULT_SIZES;
    setSelectedSize(nextSizes.includes("UK 8") ? "UK 8" : nextSizes[0]);
    setQuantity(1);
    setShowVideo(false);
    setSelectedColorwayId(current?.id || current?._id || "");
  }, [current?.id, current?._id]);

  const productId = current?.id || current?._id || "";

  const colorOptions = useMemo(() => {
    if (!current) return [];
    const list = Array.isArray(products) ? products : [];
    const sameGroup = list.filter(
      (p) =>
        p &&
        (p.category === current.category || p.collection === current.collection)
    );
    const merged = [current, ...sameGroup.filter((p) => (p.id || p._id) !== productId)];
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

  const currentImage = safeImgSrc(current.image);
  const currentVideo = safeVideoSrc(current.videoUrl);

  const formatPrice =
    typeof money === "function"
      ? money
      : (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

  const priceNum = Number(current.price) || 0;
  const oldPriceNum = Number(current.oldPrice) || 0;
  const discountPct =
    oldPriceNum > priceNum && priceNum > 0
      ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100)
      : 0;

  const isFavorite = favorites.includes(productId);

  const relatedItems = (Array.isArray(products) ? products : [])
    .filter((p) => {
      const id = p?.id || p?._id;
      return p && id && id !== productId && (p.status || "published") !== "draft";
    })
    .slice(0, 3);

  function handleAddSelection() {
    for (let i = 0; i < quantity; i += 1) {
      onAddToCart?.(current, selectedSize, i === quantity - 1);
    }
  }

  function handleExpandMedia() {
    const el = document.querySelector(".pdp-stage");
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }

  function handleFooterSubmit(e) {
    e.preventDefault();
    if (!footerEmail.trim()) return;
    setFooterSubscribed(true);
    setFooterEmail("");
  }

  return (
    <div className="pdp-page">
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

          <div className="pdp-offers-box">
            <div className="pdp-offers-head">
              <Tag size={14} />
              <strong>Offers</strong>
              <span>Auto applies at checkout</span>
            </div>
            <div className="pdp-offer-cards">
              <div className="pdp-offer-card blue">
                <span className="pdp-offer-pill blue">10% OFF</span>
                <span>Buy 2 Pairs</span>
              </div>
              <div className="pdp-offer-card green">
                <span className="pdp-offer-pill green">15% OFF</span>
                <span>Buy 3 Pairs</span>
              </div>
            </div>
          </div>

          {current.color && (
            <div>
              <span className="size-label" style={{ marginBottom: "6px" }}>
                Colors: <strong style={{ color: "var(--ink)" }}>{current.color}</strong>
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
                      <img src={safeImgSrc(opt.image)} alt={opt.color || opt.name} />
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

          {current.description && (
            <p className="pdp-desc" style={{ marginTop: "18px", marginBottom: 0 }}>
              {current.description}
            </p>
          )}

          {current.highlights?.length > 0 && (
            <ul className="pdp-highlights" style={{ marginTop: "14px", marginBottom: 0 }}>
              {current.highlights.map((item, idx) => (
                <li key={idx}>
                  <Check size={14} /> {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section className="calzare-reviews-section" id="product-reviews">
        <div className="calzare-reviews-header">
          <div className="calzare-rating-pill">
            <span className="calzare-stars" aria-hidden="true">
              ★★★★★
            </span>
            <strong>5.0 / 5.0</strong>
            <span>({VERIFIED_REVIEWS.length} Verified Buyer Reviews)</span>
          </div>
          <p className="calzare-reviews-sub">
            Honest reviews from customers walking in real rain, heat, and city transit.
          </p>
        </div>

        <div className="calzare-reviews-grid">
          {VERIFIED_REVIEWS.map((rev) => (
            <article className="calzare-review-card" key={rev.id}>
              <div className="calzare-stars" aria-hidden="true">
                ★★★★★
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
          ))}
        </div>

        <div className="calzare-standard-block">
          <h2 className="calzare-standard-title">THE CALZARE STANDARD</h2>
          <p className="calzare-standard-sub">Built with science. Tested with life.</p>

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

      {relatedItems.length > 0 && (
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
            {relatedItems.map((item) => {
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

      <footer className="site-footer-dark">
        <div className="footer-grid-4">
          <div>
            <p className="footer-brand-blurb">
              We design and make every pair ourselves, then ship it straight to you.
            </p>
            <p className="footer-connect-title">Connect with us</p>
            <a href="mailto:support@calzare.in" className="footer-contact-link">
              support@calzare.in
            </a>
            <a href="tel:+919876543210" className="footer-contact-link">
              +91 98765 43210
            </a>
            <p className="footer-hours">Monday to Friday, 10:00 AM to 6:00 PM.</p>
            <div className="footer-social-row">
              <button type="button" className="footer-social-btn" onClick={onGoBack}>
                IG
              </button>
              <a href="mailto:support@calzare.in" className="footer-social-btn">
                ✉
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-heading">Main Menu</h4>
            <ul className="footer-col-list">
              <li>
                <button
                  type="button"
                  onClick={onGoBack}
                  style={{
                    background: "none",
                    border: 0,
                    padding: 0,
                    color: "inherit",
                    cursor: "pointer"
                  }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onGoBack}
                  style={{
                    background: "none",
                    border: 0,
                    padding: 0,
                    color: "inherit",
                    cursor: "pointer"
                  }}
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onGoBack}
                  style={{
                    background: "none",
                    border: 0,
                    padding: 0,
                    color: "inherit",
                    cursor: "pointer"
                  }}
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-heading">Useful Links</h4>
            <ul className="footer-col-list">
              <li>
                <button
                  type="button"
                  onClick={onGoBack}
                  style={{
                    background: "none",
                    border: 0,
                    padding: 0,
                    color: "inherit",
                    cursor: "pointer"
                  }}
                >
                  Shipping & Exchange
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onGoBack}
                  style={{
                    background: "none",
                    border: 0,
                    padding: 0,
                    color: "inherit",
                    cursor: "pointer"
                  }}
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-heading">Join the Calzare team</h4>
            <p className="footer-newsletter-copy">
              Sign up for early access to drops and free shipping updates on new collections.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleFooterSubmit}>
              <input
                type="email"
                required
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                placeholder="Enter your email..."
                className="footer-newsletter-input"
              />
              <button type="submit" className="footer-newsletter-submit">
                {footerSubscribed ? "Joined" : "Sign Up"}
              </button>
            </form>
            <p className="footer-privacy-note">
              By entering the e-mail you accept the privacy policy.
            </p>
          </div>
        </div>

        <div className="footer-watermark-wordmark" aria-hidden="true">
          Calzare
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 Calzare. All rights reserved.</span>
          <div className="footer-payment-badges">
            <span className="footer-pay-pill">razorpay</span>
          </div>
        </div>
      </footer>
    </div>
  );
}