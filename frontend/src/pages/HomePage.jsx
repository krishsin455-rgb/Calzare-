import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
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

export default function HomePage({
  homepage,
  products,
  visibleProducts,
  reels,
  categories = ["sneakers", "formal", "slides"],
  allowedCollections = ["men", "women", "unisex", "kids"],
  category,
  setCategory,
  favorites,
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

  return (
    <>
      <section className="hero">
        <img
          className="hero-image"
          src={homepage.heroImage || SAFE_IMAGE_FALLBACK}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = SAFE_IMAGE_FALLBACK;
          }}
          alt={homepage.heroTitle || "Minimal footwear editorial"}
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow light">{homepage.heroEyebrow}</p>
          <h1>
            {homepage.heroTitle}
            <br />
            <em>{homepage.heroTitleEmphasis}</em>
          </h1>
          <p className="hero-sub">{homepage.heroDescription}</p>
          <div className="hero-cta-row">
            <a className="light-link" href="#shop">
              DISCOVER THE COLLECTION <ArrowUpRight size={16} />
            </a>
            {reels.length > 0 && (
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

      <section className="trust-strip" aria-label="Store highlights">
        <div className="trust-item">
          <Truck size={18} />
          <div>
            <strong>FREE SHIPPING ₹2,999+</strong>
            <span>Fast dispatch across India</span>
          </div>
        </div>
        <div className="trust-item">
          <RefreshCw size={18} />
          <div>
            <strong>7-DAY SIZE EXCHANGE</strong>
            <span>Hassle-free UK size swaps</span>
          </div>
        </div>
        <div className="trust-item">
          <Sparkles size={18} />
          <div>
            <strong>ZERO BREAK-IN COMFORT</strong>
            <span>Cushioned for long days</span>
          </div>
        </div>
        <div className="trust-item">
          <ShieldCheck size={18} />
          <div>
            <strong>PARTIAL COD & UPI</strong>
            <span>Flexible, secure checkout</span>
          </div>
        </div>
      </section>

      {visibleCollectionCards.length > 0 && (
        <section className="collections-strip section-pad">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CURATED DEPARTMENTS</p>
              <h2>
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
                onClick={() => onNavigateCollection?.(col.key)}
              >
                <img
                  src={col.image}
                  alt={col.label}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                  }}
                />
                <div className="collection-tile-scrim" />
                <div className="collection-tile-copy">
                  <strong>{col.label}</strong>
                  <span>{col.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {under999Section}

      {homepage.featuredProduct?.enabled !== false && (
        <section className="exclusive-spotlight section-pad">
          <div className="exclusive-card" onClick={onFeaturedClick}>
            <div className="exclusive-media">
              <span className="product-badge">
                {homepage.featuredProduct.sectionType || "EXCLUSIVE"}
              </span>
              <img
                src={homepage.featuredProduct.image}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                }}
                alt={homepage.featuredProduct.title}
              />
            </div>
            <div className="exclusive-info">
              <p className="eyebrow">FEATURED DROP</p>
              <h2>{homepage.featuredProduct.title}</h2>
              <p className="exclusive-price">{money(homepage.featuredProduct.price)}</p>
              <span className="dark-link">
                VIEW & SELECT SIZE <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="intro section-pad">
        <p className="eyebrow">LESS, BUT BETTER</p>
        <h2>
          Good design is felt
          <br />
          in <em>every step.</em>
        </h2>
        <p>
          We believe the things you wear every day should be considered, comfortable and made to last.
          Meet the new language of everyday footwear.
        </p>
      </section>

      <section className="shop-section section-pad" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CALZARE EDIT</p>
            <h2>
              Find your <em>form.</em>
            </h2>
          </div>
          <span className="product-count">
            {displayedProducts.length.toString().padStart(2, "0")} PRODUCTS
          </span>
        </div>

        <div className="filters">
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

      {reels.length > 0 && (
        <section className="reels-section section-pad" id="reels">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SHOPPABLE REELS</p>
              <h2>
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
                    <div className="reel-bottom">
                      <h3>{reel.title}</h3>
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
      )}

      <section className="campaign">
        <div className="campaign-image">
          {homepage.campaignVideoUrl && !campaignVideoFailed ? (
            <video
              src={homepage.campaignVideoUrl}
              poster={SAFE_IMAGE_FALLBACK}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setCampaignVideoFailed(true)}
            />
          ) : (
            <img
              src={SAFE_IMAGE_FALLBACK}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = SAFE_IMAGE_FALLBACK;
              }}
              alt="Footwear and everyday styling"
              loading="lazy"
            />
          )}
        </div>
        <div className="campaign-copy">
          <p className="eyebrow">A CALZARE STATE OF MIND</p>
          <h2>
            Made to move.
            <br />
            <em>Made to matter.</em>
          </h2>
          <p>From slow mornings to the long way home, find pieces that feel like you.</p>
          <a className="dark-link" href="#shop">
            SHOP THE EDIT <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="story section-pad" id="story">
        <p className="eyebrow">OUR PHILOSOPHY</p>
        <h2>
          Wear what
          <br />
          moves <em>you.</em>
        </h2>
        <p>
          CALZARE is built around a simple idea: everyday essentials deserve exceptional attention.
          We bring together considered silhouettes, versatile details and a point of view that never
          needs to shout.
        </p>
        <a className="dark-link" href="#journal">
          GET TO KNOW US <ArrowUpRight size={16} />
        </a>
      </section>

      <section className="journal section-pad" id="journal">
        <div>
          <p className="eyebrow">NOTES FROM CALZARE</p>
          <h2>
            The considered <em>life.</em>
          </h2>
        </div>
        <div className="journal-card">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
            alt="Minimal design studio"
            loading="lazy"
          />
          <div>
            <span>01 — THE JOURNAL</span>
            <h3>On choosing fewer, better things.</h3>
            <a href="#story">
              READ THE STORY <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <p className="eyebrow light">A NOTE, NOW AND THEN</p>
        <h2>
          Stay in the <em>know.</em>
        </h2>
        <p>New collections, thoughtful stories and a little inspiration for the everyday.</p>
        <form onSubmit={onSubscribe}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />

        </form>
      </section>
    </>
  );
}
