import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Film, Heart } from "lucide-react";

const COLLECTION_META = {
  men: {
    eyebrow: "MEN'S FOOTWEAR EDIT",
    title: "Men's Collection",
    subtitle: "Refined everyday silhouettes engineered for all-day comfort and clean versatility.",
    banner:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=2000&q=85"
  },
  women: {
    eyebrow: "WOMEN'S FOOTWEAR EDIT",
    title: "Women's Collection",
    subtitle:
      "Effortless proportions, supple finishes, and lightweight cushioning from morning to evening.",
    banner:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=2000&q=85"
  },
  unisex: {
    eyebrow: "GENDER-NEUTRAL ESSENTIALS",
    title: "Unisex Collection",
    subtitle: "Universal forms designed to move across every wardrobe and daily rotation.",
    banner:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2000&q=85"
  },
  kids: {
    eyebrow: "CALZARE JUNIOR",
    title: "Kids' Collection",
    subtitle: "Flexible soles, easy closures, and durable comfort built for active days.",
    banner:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=2000&q=85"
  }
};

const SAFE_IMAGE =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

export default function CollectionPage({
  collection,
  products,
  allowedCategories,
  allowedCollections,
  search,
  favorites,
  onToggleFavorite,
  onOpenProduct,
  onGoHome,
  money
}) {
  const [styleFilter, setStyleFilter] = useState("all");
  const cleanCol = ["men", "women", "unisex", "kids"].includes(
    String(collection || "").toLowerCase()
  )
    ? String(collection).toLowerCase()
    : "unisex";
  const meta = COLLECTION_META[cleanCol] || COLLECTION_META.unisex;

  const isCollectionAllowed = Array.isArray(allowedCollections)
    ? allowedCollections.includes(cleanCol)
    : true;

  const collectionProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter((p) => {
      if (!p || (p.status || "published") === "draft") return false;
      const col = String(p.collection || p.gender || "unisex").toLowerCase();
      return col === cleanCol;
    });
  }, [products, cleanCol]);

  const filterOptions = useMemo(() => {
    const productCats = collectionProducts
      .map((p) => String(p.category || "").toLowerCase())
      .filter(Boolean);

    const baseCats = Array.isArray(allowedCategories)
      ? allowedCategories.map((c) => String(c).toLowerCase())
      : Array.from(new Set(["sneakers", "formal", "slides", ...productCats]));

    const visibleCats = Array.isArray(allowedCategories)
      ? baseCats.filter((c) => productCats.includes(c) || ["sneakers", "formal", "slides"].includes(c))
      : baseCats;

    return ["all", ...Array.from(new Set(visibleCats))];
  }, [allowedCategories, collectionProducts]);

  useEffect(() => {
    if (styleFilter !== "all" && !filterOptions.includes(styleFilter)) {
      setStyleFilter("all");
    }
  }, [styleFilter, filterOptions]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return collectionProducts.filter((p) => {
      const cat = String(p.category || "").toLowerCase();
      const matchesStyle = styleFilter === "all" || cat === styleFilter;
      const matchesSearch =
        !term || `${p.name} ${p.color} ${p.description}`.toLowerCase().includes(term);

      return matchesStyle && matchesSearch;
    });
  }, [collectionProducts, styleFilter, search]);

  return (
    <>
      <section className="collection-hero">
        <img
          src={meta.banner}
          onError={(e) => {
            e.currentTarget.src = SAFE_IMAGE;
          }}
          alt={meta.title}
        />
        <div className="collection-hero-shade" />
        <div className="collection-hero-copy">
          <div className="breadcrumb">
            <button type="button" onClick={onGoHome}>
              HOME
            </button>
            <span>/</span>
            <span>{cleanCol.toUpperCase()}</span>
          </div>
          <p className="eyebrow light">{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
          <p>{meta.subtitle}</p>
        </div>
      </section>

      <section className="shop-section section-pad">
        {!isCollectionAllowed ? (
          <div className="empty-state">
            <p>The {cleanCol.toUpperCase()} collection is currently hidden on this page.</p>
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
                <p className="eyebrow">{cleanCol.toUpperCase()} CATALOGUE</p>
                <h2>
                  Explore <em>{cleanCol}.</em>
                </h2>
              </div>
              <span className="product-count">
                {filteredProducts.length.toString().padStart(2, "0")} PRODUCTS
              </span>
            </div>

            <div className="filters">
              {filterOptions.map((item) => (
                <button
                  key={item}
                  className={styleFilter === item ? "filter active" : "filter"}
                  onClick={() => setStyleFilter(item)}
                >
                  {item === "all" ? "ALL STYLES" : item.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div
                    className="product-image-wrap clickable"
                    onClick={() => onOpenProduct(product, false)}
                  >
                    <img
                      src={product.image}
                      onError={(e) => {
                        e.currentTarget.src = SAFE_IMAGE;
                      }}
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    {product.videoUrl && (
                      <button
                        type="button"
                        className="video-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProduct(product, true);
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
                        onOpenProduct(product, false);
                      }}
                    >
                      SELECT SIZE & VIEW <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="product-meta" onClick={() => onOpenProduct(product, false)}>
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.color}</p>
                    </div>
                    <strong>{money(product.price)}</strong>
                  </div>
                  {product.oldPrice && <p className="old-price">{money(product.oldPrice)}</p>}
                </article>
              ))}
            </div>

            {!filteredProducts.length && (
              <div className="empty-state">
                <p>No footwear listed in {cleanCol.toUpperCase()} yet.</p>
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