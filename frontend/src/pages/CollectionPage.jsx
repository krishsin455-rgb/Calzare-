import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, Film, Heart, Home } from "lucide-react";

const COLLECTION_META = {
  banarasi: {
    eyebrow: "BANARASI SILK EDIT",
    title: "Banarasi Silk Collection",
    subtitle: "Heirloom zari borders, rich brocade motifs, and celebratory drapes.",
    banner: ""
  },
  kanjivaram: {
    eyebrow: "KANJIVARAM HERITAGE",
    title: "Kanjivaram Collection",
    subtitle: "Distinctive temple borders and lustrous weaves crafted for weddings.",
    banner: ""
  },
  "soft-silk": {
    eyebrow: "FEATHERLIGHT DRAPES",
    title: "Soft Silk Collection",
    subtitle: "Supple finishes and effortless pleating from festive mornings to evenings.",
    banner: ""
  },
  kalamkari: {
    eyebrow: "ARTISANAL MOTIFS",
    title: "Kalamkari Collection",
    subtitle: "Expressive heritage prints and hand-inspired storytelling on silk.",
    banner: ""
  },
  festive: {
    eyebrow: "CELEBRATION EDIT",
    title: "Festive & Wedding Collection",
    subtitle: "Curated bridal, puja, and evening sarees designed to stand out.",
    banner: ""
  }
};

const VALID_COLLECTIONS = Object.keys(COLLECTION_META);
const DEFAULT_SIZES = ["Free Size"];

export default function CollectionPage({
  collection,
  products,
  storeSettings = {},
  allowedCategories,
  allowedCollections,
  search = "",
  favorites = [],
  homeIconSize = 16,
  onToggleFavorite,
  onOpenProduct,
  onGoHome,
  money
}) {
  const [styleFilter, setStyleFilter] = useState("all");

  const cleanCol = useMemo(() => {
    const raw = String(collection || "").toLowerCase();
    return VALID_COLLECTIONS.includes(raw) ? raw : "banarasi";
  }, [collection]);

  const meta = COLLECTION_META[cleanCol] || COLLECTION_META.banarasi;

  const isCollectionAllowed = Array.isArray(allowedCollections)
    ? allowedCollections.includes(cleanCol)
    : true;

  const pageStyle = storeSettings?.pageStyles?.[cleanCol] || {};
  const bannerHeightPx = Number(pageStyle.bannerHeightPx) || 320;
  const imageFit = pageStyle.imageFit || "cover";
  const posX = pageStyle.imagePosX ?? 50;
  const posY = pageStyle.imagePosY ?? 20;
  const imageZoom = Number(pageStyle.imageZoom) || 1;

  const collectionProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter((p) => {
      if (!p || (p.status || "published") === "draft") return false;
      const col = String(p.collection || p.weave || "banarasi").toLowerCase();
      return col === cleanCol;
    });
  }, [products, cleanCol]);

  const filterOptions = useMemo(() => {
    const productCats = collectionProducts
      .map((p) => String(p.category || "").toLowerCase())
      .filter(Boolean);

    const baseCats = Array.isArray(allowedCategories)
      ? allowedCategories.map((c) => String(c).toLowerCase())
      : Array.from(new Set(["sarees", "silk-sarees", "organza", ...productCats]));

    const visibleCats = Array.isArray(allowedCategories)
      ? baseCats.filter(
          (c) =>
            productCats.includes(c) ||
            ["sarees", "silk-sarees", "organza"].includes(c)
        )
      : baseCats;

    return ["all", ...Array.from(new Set(visibleCats))];
  }, [allowedCategories, collectionProducts]);

  useEffect(() => {
    if (styleFilter !== "all" && !filterOptions.includes(styleFilter)) {
      setStyleFilter("all");
    }
  }, [styleFilter, filterOptions]);

  const filteredProducts = useMemo(() => {
    const term = String(search || "").trim().toLowerCase();

    return collectionProducts.filter((p) => {
      const cat = String(p.category || "").toLowerCase();
      const matchesStyle = styleFilter === "all" || cat === styleFilter;
      const searchable = `${p.name || ""} ${p.color || ""} ${p.fabric || ""} ${
        p.occasion || ""
      } ${p.description || ""}`.toLowerCase();
      const matchesSearch = !term || searchable.includes(term);

      return matchesStyle && matchesSearch;
    });
  }, [collectionProducts, styleFilter, search]);

  const activeBanner =
    storeSettings?.collectionImages?.[cleanCol] ||
    (styleFilter !== "all" ? storeSettings?.categoryImages?.[styleFilter] : "") ||
    meta.banner ||
    "";

  const formatMoney =
    typeof money === "function"
      ? money
      : (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 24px",
          fontSize: "12px",
          color: "var(--muted, #64748B)",
          borderBottom: "1px solid var(--line, rgba(0,0,0,0.08))"
        }}
      >
        <button
          type="button"
          onClick={onGoHome}
          aria-label="Home"
          style={{
            background: "none",
            border: 0,
            padding: 0,
            color: "inherit",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer"
          }}
        >
          <Home size={homeIconSize} strokeWidth={1.85} />
        </button>
        <ChevronRight size={13} style={{ opacity: 0.55 }} />
        <span style={{ fontWeight: 600, color: "var(--ink, #0F172A)" }}>
          {meta.title}
        </span>
      </nav>

      <section
        className="collection-hero"
        style={{
          position: "relative",
          height: `${bannerHeightPx}px`,
          maxHeight: `${bannerHeightPx}px`,
          overflow: "hidden"
        }}
      >
        {activeBanner ? (
          <img
            src={activeBanner}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            alt={meta.title}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: imageFit,
              objectPosition: `${posX}% ${posY}%`,
              transform: `scale(${imageZoom})`,
              transformOrigin: `${posX}% ${posY}%`
            }}
          />
        ) : null}
        <div className="collection-hero-shade" />
        <div className="collection-hero-copy">
          <p className="eyebrow light">{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </section>

      <section className="shop-section section-pad">
        {!isCollectionAllowed ? (
          <div className="empty-state">
            <p>
              The {cleanCol.replace(/-/g, " ").toUpperCase()} collection is currently
              hidden on this page.
            </p>
            <button
              type="button"
              className="dark-link"
              style={{
                background: "none",
                border: 0,
                borderBottom: "1px solid currentColor",
                cursor: "pointer",
                marginTop: "12px"
              }}
              onClick={onGoHome}
            >
              RETURN TO HOME <ArrowUpRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  {cleanCol.replace(/-/g, " ").toUpperCase()} CATALOGUE
                </p>
                <h2>
                  Explore <em>{cleanCol.replace(/-/g, " ")}.</em>
                </h2>
              </div>
              <span className="product-count">
                {filteredProducts.length.toString().padStart(2, "0")} SAREES
              </span>
            </div>

            <div className="filters">
              {filterOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={styleFilter === item ? "filter active" : "filter"}
                  onClick={() => setStyleFilter(item)}
                >
                  {item === "all"
                    ? "ALL STYLES"
                    : item.replace(/-/g, " ").toUpperCase()}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => {
                const prodId = product.id || product._id;
                const isFav = favorites.includes(prodId);
                const sizes =
                  Array.isArray(product.sizes) && product.sizes.length > 0
                    ? product.sizes
                    : DEFAULT_SIZES;

                return (
                  <article className="product-card" key={prodId}>
                    <div
                      className="product-image-wrap clickable"
                      onClick={() => onOpenProduct?.(product, false)}
                    >
                      <img
                        src={product.image || undefined}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        alt={product.name}
                        style={{
                          objectFit:
                            product.imageFit === "contain" ? "contain" : "cover",
                          objectPosition: `${product.imagePosX ?? 50}% ${
                            product.imagePosY ?? 20
                          }%`,
                          transform: `scale(${Number(product.imageZoom) || 1})`,
                          transformOrigin: `${product.imagePosX ?? 50}% ${
                            product.imagePosY ?? 20
                          }%`
                        }}
                        loading="lazy"
                      />

                      {product.videoUrl && (
                        <button
                          type="button"
                          className="video-pill"
                          title="Watch drape preview"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProduct?.(product, true);
                          }}
                        >
                          <Film size={12} /> DRAPE
                        </button>
                      )}

                      {typeof onToggleFavorite === "function" && (
                        <button
                          type="button"
                          className={`favorite ${isFav ? "selected" : ""}`}
                          aria-label="Add to wishlist"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(prodId);
                          }}
                        >
                          <Heart
                            size={18}
                            fill={isFav ? "currentColor" : "none"}
                          />
                        </button>
                      )}
                    </div>

                    <div
                      className="product-meta"
                      onClick={() => onOpenProduct?.(product, false)}
                    >
                      <div>
                        <h3>{product.name}</h3>
                        <p>
                          {[product.fabric, product.color || sizes[0]]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <strong>{formatMoney(product.price)}</strong>
                    </div>
                    {product.oldPrice && (
                      <p className="old-price">{formatMoney(product.oldPrice)}</p>
                    )}
                  </article>
                );
              })}
            </div>

            {!filteredProducts.length && (
              <div className="empty-state">
                <p>
                  No sarees listed in {cleanCol.replace(/-/g, " ").toUpperCase()}{" "}
                  yet.
                </p>
                <button
                  type="button"
                  className="dark-link"
                  style={{
                    background: "none",
                    border: 0,
                    borderBottom: "1px solid currentColor",
                    cursor: "pointer",
                    marginTop: "12px"
                  }}
                  onClick={onGoHome}
                >
                  RETURN TO HOME <ArrowUpRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
