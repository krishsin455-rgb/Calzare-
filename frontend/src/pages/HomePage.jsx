import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Video
} from "lucide-react";

const OCCASIONS = [
  { key: "dussehra-durga", title: "DUSSEHRA & DURGA POOJA", weave: "festive", caption: "A little something unforgettable" },
  { key: "engagement", title: "ENGAGEMENT", weave: "banarasi", caption: "For the beginning of forever" },
  { key: "wedding", title: "WEDDING", weave: "kanjivaram", caption: "Make every gathering special" },
  { key: "festival", title: "FESTIVAL", weave: "kalamkari", caption: "Wear the joy of the moment" }
];

const HOUSE_EDIT = [
  { key: "soft-silk", label: "DRESSES", subtitle: "COLLECTIONS" },
  { key: "kanjivaram", label: "SAREES", subtitle: "COLLECTIONS" },
  { key: "festive", label: "LEHENGA", subtitle: "COLLECTIONS" },
  { key: "kalamkari", label: "SCARF", subtitle: "COLLECTIONS" }
];

function getImage(product) {
  const image = product?.image || product?.images?.[0] || product?.thumbnail || "";
  if (typeof image !== "string" || !image.trim()) return "";
  if (/^(file:|\/Users\/)/i.test(image)) return "";
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && image.includes("localhost")) return "";
  return image;
}

function getCollection(product) {
  return String(product?.collection || product?.weave || "banarasi")
    .toLowerCase().trim().replace(/\s+/g, "-");
}

function priceLabel(product, money) {
  return money?.(product?.price) || `₹${Number(product?.price || 0).toLocaleString("en-IN")}`;
}

function Ornament() {
  return <div className="ornament-divider" aria-hidden="true" />;
}

function ProductCard({ product, money, favorites, onToggleFavorite, onOpenProduct, onQuickView, onAdd }) {
  const [size, setSize] = useState(product.sizes?.[0] || "Free Size");
  const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes : ["Free Size"];
  const id = product.id || product._id;
  const image = getImage(product);

  return (
    <article className="product-card home-rail-card">
      <div className="product-image-wrap clickable" onClick={() => onOpenProduct?.(product)}>
        {image ? <img src={image} alt={product.name || "Al-Zehra Silk saree"} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="home-product-placeholder"><span>AL-ZEHRA SILK</span></div>}
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button type="button" className={`favorite ${favorites.includes(id) ? "selected" : ""}`} aria-label="Save saree" onClick={(event) => { event.stopPropagation(); onToggleFavorite?.(id); }}>
          <Heart size={17} fill={favorites.includes(id) ? "currentColor" : "none"} />
        </button>
        {product.videoUrl && <button className="video-pill" type="button" onClick={(event) => { event.stopPropagation(); onQuickView?.(product, true); }}><Play size={11} fill="currentColor" /> DRAPE VIDEO</button>}
        {onAdd && <div className="home-product-actions" onClick={(event) => event.stopPropagation()}>
          <select aria-label={`Choose size for ${product.name}`} value={sizes.includes(size) ? size : sizes[0]} onChange={(event) => setSize(event.target.value)}>{sizes.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <button type="button" onClick={() => onAdd(product, size)}>ADD TO BAG</button>
        </div>}
      </div>
      <button type="button" className="product-meta home-product-meta" onClick={() => onOpenProduct?.(product)}>
        <span><strong>{product.name || "Handpicked Silk Saree"}</strong><small>{[product.fabric, product.color || product.occasion].filter(Boolean).join(" · ") || "Silk · Festive"}</small></span>
        <b>{priceLabel(product, money)}</b>
      </button>
      {product.oldPrice > product.price && <p className="home-old-price"><s>{priceLabel({ price: product.oldPrice }, money)}</s>{product.discount && <span>{product.discount}% off</span>}</p>}
    </article>
  );
}

function ProductRail({ id, title, eyebrow, products, money, favorites, onToggleFavorite, onOpenProduct, onQuickView, onAdd, onViewAll }) {
  const railId = `rail-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const move = (direction) => document.getElementById(railId)?.scrollBy({ left: direction * 420, behavior: "smooth" });
  return (
    <section className="home-products-section section-pad" id={id}>
      <div className="home-rail-heading">
        <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
        <div className="home-rail-controls">
          {onViewAll && <button type="button" className="home-view-all-link" onClick={onViewAll}>View all <ArrowUpRight size={15} /></button>}
          <button type="button" aria-label={`Previous ${title}`} onClick={() => move(-1)}><ChevronLeft size={19} /></button>
          <button type="button" aria-label={`Next ${title}`} onClick={() => move(1)}><ChevronRight size={19} /></button>
        </div>
      </div>
      {products.length ? <div className="home-product-rail" id={railId}>
        {products.map((product) => <ProductCard key={product.id || product._id} product={product} money={money} favorites={favorites} onToggleFavorite={onToggleFavorite} onOpenProduct={onOpenProduct} onQuickView={onQuickView} onAdd={onAdd} />)}
      </div> : <div className="home-empty-products">The next Al-Zehra edit is being prepared. Please check back soon.</div>}
    </section>
  );
}

export default function HomePage({
  homepage = {}, storeSettings = {}, products = [], visibleProducts = [], reels = [], categories = [],
  allowedCollections = [], favorites = [], onToggleFavorite, onOpenProductPage, onOpenQuickView,
  onDirectAddToCart, onOpenReel, onFeaturedClick, onNavigateCollection, under999Section,
  email = "", setEmail, onSubscribe, money
}) {
  const [campaignFailed, setCampaignFailed] = useState(false);
  const published = useMemo(() => (products || []).filter((product) => product && (product.status || "published") !== "draft"), [products]);
  const displayProducts = useMemo(() => visibleProducts?.length ? visibleProducts : published, [visibleProducts, published]);
  const newArrivals = useMemo(() => displayProducts.slice(0, 10), [displayProducts]);
  const trending = useMemo(() => {
    const marked = displayProducts.filter((product) => /trend|best|popular/i.test(`${product.badge || ""} ${product.tags || ""}`));
    return (marked.length >= 4 ? marked : displayProducts.slice(2)).slice(0, 10);
  }, [displayProducts]);
  const handpicked = displayProducts.slice(4, 14).length ? displayProducts.slice(4, 14) : displayProducts;
  const imagesForWeave = (weave) => published.filter((product) => getCollection(product) === weave && getImage(product));
  const bannerImage = (weave, fallbackIndex = 0) => storeSettings.collectionImages?.[weave] || getImage(imagesForWeave(weave)[0]) || getImage(published[fallbackIndex]);
  const campaignVideo = homepage.heroVideoUrl || homepage.campaignVideoUrl || "";
  const heroPoster = homepage.heroImage || homepage.campaignImage || getImage(published[0]);
  const activeCollections = allowedCollections.length ? allowedCollections : ["banarasi", "kanjivaram", "soft-silk", "kalamkari", "festive"];
  const visibleHouseEdit = HOUSE_EDIT.filter((item) => activeCollections.includes(item.key));
  const searchableCategories = Array.isArray(categories) ? categories : [];
  const displayReels = reels.length ? reels : published.filter((product) => product.videoUrl).map((product, index) => ({
    id: `product-reel-${product.id || product._id || index}`,
    productId: product.id || product._id,
    title: product.name || "A saree in motion",
    tag: "DRAPE & DETAIL",
    videoUrl: product.videoUrl,
    poster: getImage(product)
  }));
  const supportPhone = String(storeSettings.supportPhone || "").replace(/\D/g, "");
  const serviceHref = supportPhone
    ? `https://wa.me/${supportPhone}`
    : `mailto:${storeSettings.supportEmail || "care@alzehrasilk.in"}`;

  return (
    <div className="home-reference-page">
      <section className="home-split-hero">
        <div className="home-split-copy">
          <h1>{homepage.heroTitle || "Craftsmanship"}<br />{homepage.heroTitleEmphasis || "You Can Feel In Every Fold!"}</h1>
          <p>{homepage.heroDescription || "Handcrafted sarees, thoughtfully chosen for modern Indian women. Discover a softer side of tradition."}</p>
          <button type="button" className="home-brown-button" onClick={() => onNavigateCollection?.("all")}>{homepage.heroCtaLabel || "Shop now"} <ArrowRight size={16} /></button>
        </div>
        <div className="home-split-media">
          {campaignVideo && !campaignFailed ? <video src={campaignVideo} poster={heroPoster || undefined} autoPlay muted loop playsInline onError={() => setCampaignFailed(true)} /> : heroPoster ? <img src={heroPoster} alt="Crafted silk saree from Al-Zehra Silk" /> : <div className="home-craft-placeholder"><span>WOVEN WITH CARE</span></div>}
        </div>
      </section>
      <Ornament />

      <ProductRail id="shop" title="New Arrivals" eyebrow="JUST WOVEN · JUST ARRIVED" products={newArrivals} money={money} favorites={favorites} onToggleFavorite={onToggleFavorite} onOpenProduct={onOpenProductPage} onQuickView={onOpenQuickView} onAdd={onDirectAddToCart} onViewAll={() => onNavigateCollection?.("all")} />

      <section className="home-promo-pair section-pad">
        {[{ title: "BEST SELLER", subtitle: "Join the trendsetters!", weave: "banarasi", link: "banarasi" }, { title: "OUR EXCLUSIVE COLLECTIONS", subtitle: "Discover tradition in every drape", weave: "kanjivaram", link: "kanjivaram" }].map((item, index) => (
          <button type="button" className="home-promo-card" key={item.title} onClick={() => onNavigateCollection?.(item.link)}>
            {bannerImage(item.weave, index) ? <img src={bannerImage(item.weave, index)} alt="" loading="lazy" /> : <span className={`home-promo-placeholder promo-${index}`} />}
            <span className="home-promo-illustration" aria-hidden="true" />
            <span className="home-promo-copy"><strong>{item.title}</strong><small>{item.subtitle}</small><i>SHOP NOW</i></span>
          </button>
        ))}
      </section>
      <Ornament />

      {under999Section}

      {displayReels.length > 0 && <section className="home-watch-section section-pad">
        <div className="home-rail-heading"><div><p className="eyebrow">SEE IT. LOVE IT. MAKE IT YOURS.</p><h2>Watch &amp; Shop</h2></div><button type="button" className="home-view-all-link" onClick={() => onOpenReel?.(reels[0])}>View all <ArrowUpRight size={15} /></button></div>
        <div className="home-watch-rail">{displayReels.slice(0, 8).map((reel, index) => {
          const linked = published.find((product) => String(product.id || product._id) === String(reel.productId));
          return <button type="button" className="home-watch-card" key={reel.id || reel._id || index} onClick={() => onOpenReel?.(reel)}>
            {reel.poster || getImage(linked) ? <img src={reel.poster || getImage(linked)} alt={reel.title || linked?.name || "Saree draping video"} loading="lazy" /> : <span className="home-watch-placeholder" />}
            <span className="home-watch-play"><Play size={17} fill="currentColor" /></span>
            <span className="home-watch-copy"><small>{reel.tag || "WATCH & SHOP"}</small><strong>{reel.title || linked?.name || "A saree in motion"}</strong><i>{linked?.price ? priceLabel(linked, money) : "VIEW SAREE"}</i></span>
          </button>;
        })}</div>
      </section>}

      <Ornament />
      <ProductRail title="Trending Now" eyebrow="THE PIECES EVERYONE LOVES" products={trending} money={money} favorites={favorites} onToggleFavorite={onToggleFavorite} onOpenProduct={onOpenProductPage} onQuickView={onOpenQuickView} onAdd={onDirectAddToCart} onViewAll={() => onNavigateCollection?.("all")} />

      <section className="home-occasion-section section-pad">
        <div className="home-center-heading"><p className="eyebrow">MADE FOR YOUR MOMENTS</p><h2>Shop by Occasion</h2><p>Styled for every moment.</p></div>
        <div className="home-occasion-grid">{OCCASIONS.map((item, index) => {
          const source = imagesForWeave(item.weave);
          const image = storeSettings.categoryImages?.[item.key] || getImage(source[index % Math.max(source.length, 1)]) || bannerImage(item.weave, index);
          return <button type="button" className="home-occasion-card" key={item.key} onClick={() => onNavigateCollection?.(item.weave)}>{image ? <img src={image} alt={`${item.title.toLowerCase()} saree edit`} loading="lazy" /> : <span className={`home-occasion-placeholder occasion-${index}`} />}<span className="home-occasion-scrim" /><span className="home-occasion-copy"><strong>{item.title}</strong><small>COLLECTIONS</small><i>SHOP NOW</i></span></button>;
        })}</div>
      </section>

      <section className="home-house-section section-pad">
        <div className="home-center-heading"><h2>The House Edit</h2><span className="home-heading-rule" /></div>
        <div className="home-house-grid">{visibleHouseEdit.map((item, index) => {
          const image = bannerImage(item.key, index);
          return <button type="button" className="home-house-card" key={item.key} onClick={() => onNavigateCollection?.(item.key)}>
            {image ? <img src={image} alt={`${item.label.toLowerCase()} collection`} loading="lazy" /> : <span className={`home-house-placeholder house-${index}`} />}
            <span className="home-house-frame"><strong>{item.label}</strong><small>{item.subtitle}</small><i>✦</i></span>
          </button>;
        })}</div>
      </section>

      <section className="home-video-call">
        <div className="home-video-call-copy"><p className="eyebrow">A PERSONAL STYLING EXPERIENCE</p><h2>Shop Via Video Call</h2><p>Experience the warmth of our studio from wherever you are. Our team can help you find a saree for your next special occasion.</p><a className="home-brown-button" href={serviceHref} target="_blank" rel="noreferrer"><Video size={16} /> BOOK A VIDEO CALL <ArrowUpRight size={15} /></a></div>
        <div className="home-video-call-art">{bannerImage("soft-silk", 2) ? <img src={bannerImage("soft-silk", 2)} alt="Explore silk sarees with a personal stylist" loading="lazy" /> : <span className="home-craft-placeholder"><span>YOUR STUDIO, WHEREVER YOU ARE</span></span>}</div>
      </section>
      <Ornament />

      <ProductRail title="Handpicked Sarees" eyebrow="CHOSEN BY AL-ZEHRA" products={handpicked} money={money} favorites={favorites} onToggleFavorite={onToggleFavorite} onOpenProduct={onOpenProductPage} onQuickView={onOpenQuickView} onAdd={onDirectAddToCart} onViewAll={() => onNavigateCollection?.("all")} />

      {searchableCategories.filter((item) => /kurta|lehenga|dress/i.test(item)).map((item) => <ProductRail key={item} title={String(item).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())} eyebrow="MORE FROM THE AL-ZEHRA EDIT" products={published.filter((product) => String(product.category || "").toLowerCase() === String(item).toLowerCase()).slice(0, 10)} money={money} favorites={favorites} onToggleFavorite={onToggleFavorite} onOpenProduct={onOpenProductPage} onQuickView={onOpenQuickView} onAdd={onDirectAddToCart} onViewAll={() => onNavigateCollection?.("all")} />)}

      <section className="home-newsletter section-pad">
        <p className="eyebrow">A NOTE FROM OUR STUDIO</p><h2>A little silk in your inbox.</h2><p>Be first to hear about new arrivals and thoughtful offers.</p>
        <form className="home-newsletter-form" onSubmit={onSubscribe}><label className="sr-only" htmlFor="home-email">Email address</label><input id="home-email" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail?.(event.target.value)} /><button type="submit">JOIN US <ArrowUpRight size={14} /></button></form>
        <div className="home-newsletter-note"><Check size={13} /> Only thoughtful updates from our studio.</div>
      </section>
    </div>
  );
}
