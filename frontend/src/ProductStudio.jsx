import { useState } from "react";
import { Check, Film, Plus, Search, Trash2, Upload } from "lucide-react";

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

const BROKEN_IMAGE_IDS = [
  "photo-1614252369475-531506b0b9e9",
  "photo-1520256862855-9981c41d8ba0"
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

export const ADULT_SIZE_ROWS = [
  { uk: "UK 6", eu: "EU 40", us: "US 7", cm: "25.0 cm" },
  { uk: "UK 7", eu: "EU 41", us: "US 8", cm: "25.8 cm" },
  { uk: "UK 8", eu: "EU 42", us: "US 9", cm: "26.6 cm" },
  { uk: "UK 9", eu: "EU 43", us: "US 10", cm: "27.4 cm" },
  { uk: "UK 10", eu: "EU 44", us: "US 11", cm: "28.2 cm" }
];

export const KIDS_SIZE_ROWS = [
  { uk: "UK 1", eu: "EU 33", us: "US 2Y", cm: "19.8 cm" },
  { uk: "UK 2", eu: "EU 34", us: "US 3Y", cm: "20.6 cm" },
  { uk: "UK 3", eu: "EU 35.5", us: "US 4Y", cm: "21.5 cm" },
  { uk: "UK 4", eu: "EU 37", us: "US 5Y", cm: "22.3 cm" },
  { uk: "UK 5", eu: "EU 38", us: "US 6Y", cm: "23.2 cm" }
];

const INITIAL_FORM = {
  id: "",
  sku: "",
  brand: "CALZARE",
  name: "",
  slug: "",
  status: "published",
  category: "sneakers",
  collection: "unisex",
  price: 1499,
  oldPrice: 2499,
  tagline: "",
  listingSummary: "",
  description: "",
  badge: "NEW ARRIVAL",
  isBestseller: false,
  isNewArrival: true,
  featuredOnHome: false,
  titleOverride: "",
  hookSubtitle: "",
  shortSellingStatement: "",
  offerHeading: "SPECIAL DROP DISCOUNT",
  offerPromoCopy: "Apply code CALZARE100 at checkout for instant savings",
  addToBagText: "ADD TO BAG",
  buyNowText: "BUY IT NOW",
  outOfStockText: "SOLD OUT",
  lowStockThreshold: 5,
  lowStockNotice: "Hurry! High demand in this size.",
  storyBlocks: [
    {
      visible: true,
      heading: "ENGINEERED FOR THE CONCRETE WILD",
      subheading: "Closed-Cell Microfoam Technology",
      copy: "Every contour of the silhouette is pressure-mapped against human biomechanics to absorb shock and distribute bodyweight evenly across your stride.",
      layout: "Image on Right",
      image: ""
    }
  ],
  featureCards: [
    {
      title: "100% Waterproof & Hydrophobic",
      desc: "Closed-cell EVA matrix resists water, mud, and stains. Rinses clean and dries in under 10 minutes.",
      visible: true
    },
    {
      title: "Featherweight Ergonomics",
      desc: "Weighs under 280g per shoe, preventing foot fatigue during 12-hour city commutes.",
      visible: true
    },
    {
      title: "Deep Lug Anti-Slip Outsole",
      desc: "Deep diamond channels provide immediate traction on slick wet surfaces.",
      visible: true
    },
    {
      title: "Antimicrobial Odor Barrier",
      desc: "Zero bacterial absorption prevents unwanted odor even during intense daily wear.",
      visible: true
    }
  ],
  materials: "100% High-Density Closed-Cell EVA Foam Compound",
  moldingMethod: "Monolithic Injection-Molded Ergonomic Shell",
  fitRecommendation: "True to UK size. Roomy toe box for natural splay.",
  careInstructions: "Hand wash with mild soap and cool water. Air dry in a shaded area.",
  warrantyGuarantee:
    "6-Month Manufacturer Guarantee against sole separation and material defects.",
  specsTable: [
    { label: "Upper", value: "Waterproof Closed-Cell EVA Foam" },
    { label: "Outsole", value: "Dual-Density Anti-Slip Rubberized Lug Sole" },
    { label: "Weight", value: "280g (Single Shoe UK 7)" },
    { label: "Origin", value: "Designed in Bengaluru, India" }
  ],
  sizeGuideTitle: "Measurement Guide",
  sizeGuideUnit: "Centimeters (cm)",
  sizeGuideNote:
    "Place your foot on a blank sheet of paper with heel against the wall. Mark the tip of your longest toe and measure in centimeters.",
  sizeChartRows: ADULT_SIZE_ROWS,
  color: "Oat Beige",
  colorHex: "#D9CFBE",
  sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
  stockBySize: { "UK 6": 20, "UK 7": 20, "UK 8": 19, "UK 9": 10, "UK 10": 10 },
  image: "",
  videoUrl: "",
  comparisonMode: "default",
  shippingAccordionHeading: "Default: Shipping & Delivery",
  dispatchNotice: "Orders processed within 1–2 business days.",
  returnAccordionHeading: "Default: Refund, Return & Exchange Policy",
  returnDetails: "Size exchange requests must be submitted within 7 days of delivery.",
  faqs: [
    { q: "Are these true to size?", a: "Yes! CALZARE silhouettes are designed with a relaxed street fit." },
    { q: "How do I clean my CALZARE shoes?", a: "Rinse under cool tap water with mild soap and air dry in the shade." },
    {
      q: "What is the return and exchange policy?",
      a: "Easy 7-day doorstep return or size exchange from delivery."
    }
  ],
  relatedTitle: "YOU MIGHT ALSO LIKE",
  relatedSubtitle: "Explore complementary silhouettes from our collection",
  relatedIds: [],
  seoTitle: "",
  seoDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: ""
};

const GROUPS = [
  "1. Basic Info",
  "2. Page Copy",
  "3. Storytelling",
  "4. Key Features",
  "5. Materials & Care",
  "6. Size Guide",
  "7. Colours & Sizes",
  "8. Brand Comparison",
  "9. Shipping & FAQs",
  "10. Related Items",
  "11. SEO & Social"
];

export default function ProductStudio({
  products = [],
  onSaveProduct,
  onDeleteProduct,
  onUploadMedia,
  uploading,
  money
}) {
  const catalog = Array.isArray(products) ? products : [];
  const formatMoney =
    typeof money === "function"
      ? money
      : (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

  const [mode, setMode] = useState("list");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [group, setGroup] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [dirty, setDirty] = useState(false);

  const patch = (obj) => {
    setForm((p) => ({ ...p, ...obj }));
    setDirty(true);
  };

  function openNew() {
    setForm({
      ...INITIAL_FORM,
      id: `c-${Date.now().toString().slice(-4)}`,
      status: "published"
    });
    setGroup(1);
    setDirty(false);
    setMode("editor");
  }

  function openEdit(p) {
    setForm({
      ...INITIAL_FORM,
      ...p,
      image: safeImgSrc(p.image),
      videoUrl: safeVideoSrc(p.videoUrl),
      sizeChartRows: p.sizeChartRows?.length
        ? p.sizeChartRows
        : p.collection === "kids"
        ? KIDS_SIZE_ROWS
        : ADULT_SIZE_ROWS,
      storyBlocks: p.storyBlocks?.length ? p.storyBlocks : INITIAL_FORM.storyBlocks,
      featureCards: p.featureCards?.length ? p.featureCards : INITIAL_FORM.featureCards,
      specsTable: p.specsTable?.length ? p.specsTable : INITIAL_FORM.specsTable,
      faqs: p.faqs?.length ? p.faqs : INITIAL_FORM.faqs
    });
    setGroup(1);
    setDirty(false);
    setMode("editor");
  }

  async function submit(statusOverride) {
    if (!form.name.trim()) {
      alert("Please enter a Product Name in 1. Basic Info.");
      setGroup(1);
      return;
    }
    const cleanImage = safeImgSrc(form.image);
    const cleanVideo = safeVideoSrc(form.videoUrl);
    const rows = form.sizeChartRows?.length ? form.sizeChartRows : ADULT_SIZE_ROWS;
    const derivedSizes = rows.map((r) => r.uk.trim()).filter(Boolean);
    const slug =
      form.slug.trim() ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    await onSaveProduct?.({
      ...form,
      slug,
      image: cleanImage,
      videoUrl: cleanVideo,
      status: statusOverride || form.status || "published",
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      sizeChartRows: rows,
      sizes: derivedSizes,
      highlights: (form.featureCards || []).filter((f) => f.visible).map((f) => f.title)
    });
    setDirty(false);
    setMode("list");
  }

  const activeRows = form.sizeChartRows?.length ? form.sizeChartRows : ADULT_SIZE_ROWS;
  const savingsPct =
    Number(form.oldPrice) > Number(form.price)
      ? Math.round(((form.oldPrice - form.price) / form.oldPrice) * 100)
      : 0;

  const filtered = catalog.filter((p) => {
    const mCat = catFilter === "all" || p.category === catFilter;
    const mTerm =
      !search.trim() ||
      `${p.name} ${p.sku} ${p.category} ${p.color}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return mCat && mTerm;
  });

  if (mode === "list") {
    return (
      <div style={{ display: "grid", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <div>
            <h1 style={h1}>PRODUCTS & CATALOG</h1>
            <p style={sub}>
              Manage footwear models, multi-color galleries, SKUs, and UK size stock matrices.
            </p>
          </div>
          <button type="button" onClick={openNew} style={blueBtn}>
            <Plus size={15} /> Register New Silhouette
          </button>
        </div>

        <div style={{ ...card, display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search
              size={15}
              color="#94A3B8"
              style={{ position: "absolute", left: "12px", top: "11px" }}
            />
            <input
              placeholder="Search by product title, SKU prefix, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inp, paddingLeft: "36px" }}
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{ ...inp, width: "170px" }}
          >
            <option value="all">All Categories</option>
            <option value="sneakers">Sneakers</option>
            <option value="formal">Formal</option>
            <option value="slides">Slides & Clogs</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
            gap: "16px"
          }}
        >
          {filtered.map((p) => {
            const vid = safeVideoSrc(p.videoUrl);
            return (
              <div key={p.id} style={card}>
                <div
                  style={{
                    position: "relative",
                    height: "180px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#F1F5F9",
                    marginBottom: "12px"
                  }}
                >
                  <img
                    src={safeImgSrc(p.image)}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: p.status === "draft" ? "#D97706" : "#059669",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "99px",
                      textTransform: "uppercase"
                    }}
                  >
                    {p.status || "published"}
                  </span>
                  {vid && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        background: "#2563EB",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Film size={11} /> MOTION
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748B" }}>
                  {p.sku || p.id} • {(p.collection || "unisex").toUpperCase()}
                </div>
                <h3 style={{ margin: "4px 0", fontSize: "15px" }}>{p.name}</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px"
                  }}
                >
                  <strong style={{ fontSize: "15px" }}>{formatMoney(p.price)}</strong>
                  {p.oldPrice && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94A3B8",
                        textDecoration: "line-through"
                      }}
                    >
                      {formatMoney(p.oldPrice)}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    style={{ ...ghostBtn, flex: 1, justifyContent: "center" }}
                  >
                    Edit Silhouette
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProduct?.(p.id)}
                    style={{ ...ghostBtn, color: "#DC2626" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const previewVideo = safeVideoSrc(form.videoUrl);

  return (
    <div style={{ display: "grid", gap: "16px", paddingBottom: "76px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px"
        }}
      >
        <div>
          <button
            type="button"
            onClick={() => setMode("list")}
            style={{
              background: "none",
              border: 0,
              color: "#2563EB",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              marginBottom: "4px"
            }}
          >
            ← Back to Products & Catalog
          </button>
          <h1 style={h1}>REGISTER NEW FOOTWEAR SILHOUETTE</h1>
          <p style={sub}>Create complete product catalog entry</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" onClick={() => submit("draft")} style={ghostBtn}>
            Save as Draft
          </button>
          <button type="button" onClick={() => submit("published")} style={blueBtn}>
            Publish Product
          </button>
        </div>
      </div>

      {/* 11-GROUP PILLS */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {GROUPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setGroup(i + 1)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: group === i + 1 ? "1px solid #0F172A" : "1px solid #CBD5E1",
              background: group === i + 1 ? "#0F172A" : "#fff",
              color: group === i + 1 ? "#fff" : "#334155",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              cursor: "pointer"
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* GROUP 1: BASIC INFO + DIRECT MEDIA UPLOAD */}
      {group === 1 && (
        <div style={card}>
          <h3 style={gTitle}>GROUP 1: BASIC CATALOG & PRICING INFORMATION</h3>
          <div style={{ display: "grid", gap: "14px" }}>
            <div style={grid3}>
              <div>
                <label style={lbl}>Product Name *</label>
                <input
                  placeholder="e.g. Apex Hydro Clog"
                  value={form.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Stock Keeping Unit (SKU) *</label>
                <input
                  placeholder="e.g. CLZ-APX-01"
                  value={form.sku}
                  onChange={(e) => patch({ sku: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Brand / Line</label>
                <input
                  value={form.brand}
                  onChange={(e) => patch({ brand: e.target.value })}
                  style={inp}
                />
              </div>
            </div>

            <div style={grid2}>
              <div>
                <label style={lbl}>Footwear Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => patch({ category: e.target.value })}
                  style={inp}
                >
                  <option value="sneakers">Sneakers</option>
                  <option value="formal">Formal</option>
                  <option value="slides">Slides & Clogs</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Target Audience (Auto-loads Kids UK 1–5 Sizes)</label>
                <select
                  value={form.collection}
                  onChange={(e) => {
                    const col = e.target.value;
                    const rows = col === "kids" ? KIDS_SIZE_ROWS : ADULT_SIZE_ROWS;
                    patch({
                      collection: col,
                      sizeChartRows: rows,
                      sizes: rows.map((r) => r.uk),
                      stockBySize: Object.fromEntries(rows.map((r) => [r.uk, 15]))
                    });
                  }}
                  style={inp}
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids (Junior UK 1–5)</option>
                </select>
              </div>
            </div>

            <div style={grid3}>
              <div>
                <label style={lbl}>Selling Price (INR) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => patch({ price: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Comparison / MRP Price (₹)</label>
                <input
                  type="number"
                  value={form.oldPrice || ""}
                  onChange={(e) => patch({ oldPrice: e.target.value })}
                  style={inp}
                />
              </div>
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <span style={{ fontSize: "10px", color: "#059669", fontWeight: 700 }}>
                  Calculated Discount
                </span>
                <strong style={{ fontSize: "16px", color: "#059669" }}>
                  {savingsPct > 0 ? `${savingsPct}% SAVINGS` : "0%"}
                </strong>
              </div>
            </div>

            <div
              style={{
                ...grid2,
                borderTop: "1px solid #E2E8F0",
                paddingTop: "14px"
              }}
            >
              <div>
                <label style={lbl}>Primary Product Photo (URL or Upload) *</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    placeholder="https://... or upload"
                    value={form.image}
                    onChange={(e) => patch({ image: e.target.value })}
                    style={inp}
                  />
                  <label style={blueBtn}>
                    <Upload size={14} /> {uploading === "bImg" ? "..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        onUploadMedia?.(e.target.files?.[0], "bImg", (url) =>
                          patch({ image: url })
                        )
                      }
                    />
                  </label>
                </div>
                {form.image && (
                  <img
                    src={safeImgSrc(form.image)}
                    alt="Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                    }}
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginTop: "8px",
                      border: "1px solid #E2E8F0"
                    }}
                  />
                )}
              </div>

              <div>
                <label style={lbl}>Hover Motion & Fit Video MP4 (Optional)</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    placeholder="https://...mp4 or upload"
                    value={form.videoUrl}
                    onChange={(e) => patch({ videoUrl: e.target.value })}
                    style={inp}
                  />
                  <label style={blueBtn}>
                    <Upload size={14} /> {uploading === "bVid" ? "..." : "Upload MP4"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      hidden
                      onChange={(e) =>
                        onUploadMedia?.(e.target.files?.[0], "bVid", (url) =>
                          patch({ videoUrl: url })
                        )
                      }
                    />
                  </label>
                </div>
                {previewVideo && (
                  <video
                    src={previewVideo}
                    muted
                    loop
                    autoPlay
                    playsInline
                    onError={() => patch({ videoUrl: "" })}
                    style={{
                      width: "110px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginTop: "8px"
                    }}
                  />
                )}
              </div>
            </div>

            <div>
              <label style={lbl}>Short Product Tagline</label>
              <input
                value={form.tagline}
                onChange={(e) => patch({ tagline: e.target.value })}
                style={inp}
              />
            </div>
            <div>
              <label style={lbl}>Full Product Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => patch({ description: e.target.value })}
                style={inp}
              />
            </div>
          </div>
        </div>
      )}

      {/* GROUP 2: PAGE COPY */}
      {group === 2 && (
        <div style={card}>
          <h3 style={gTitle}>GROUP 2: PRODUCT PAGE COPY & ACTION MICROCOPY</h3>
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={grid2}>
              <div>
                <label style={lbl}>Subtitle / Hook Statement</label>
                <input
                  value={form.hookSubtitle}
                  onChange={(e) => patch({ hookSubtitle: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Short Selling Statement</label>
                <input
                  value={form.shortSellingStatement}
                  onChange={(e) => patch({ shortSellingStatement: e.target.value })}
                  style={inp}
                />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={lbl}>Offer Heading</label>
                <input
                  value={form.offerHeading}
                  onChange={(e) => patch({ offerHeading: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Offer Description & Promo Code</label>
                <input
                  value={form.offerPromoCopy}
                  onChange={(e) => patch({ offerPromoCopy: e.target.value })}
                  style={inp}
                />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={lbl}>Add to Bag Button Text</label>
                <input
                  value={form.addToBagText}
                  onChange={(e) => patch({ addToBagText: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Buy Now Button Text</label>
                <input
                  value={form.buyNowText}
                  onChange={(e) => patch({ buyNowText: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Out of Stock Text</label>
                <input
                  value={form.outOfStockText}
                  onChange={(e) => patch({ outOfStockText: e.target.value })}
                  style={inp}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GROUP 3: STORYTELLING */}
      {group === 3 && (
        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}
          >
            <h3 style={{ ...gTitle, margin: 0 }}>GROUP 3: PRODUCT STORYTELLING BLOCKS</h3>
            <button
              type="button"
              onClick={() =>
                patch({
                  storyBlocks: [
                    ...form.storyBlocks,
                    {
                      visible: true,
                      heading: "NEW STORY BLOCK",
                      subheading: "",
                      copy: "",
                      layout: "Image on Left",
                      image: ""
                    }
                  ]
                })
              }
              style={ghostBtn}
            >
              <Plus size={14} /> Add Story Block
            </button>
          </div>
          {form.storyBlocks.map((blk, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "12px",
                display: "grid",
                gap: "10px"
              }}
            >
              <div style={grid2}>
                <div>
                  <label style={lbl}>Headline / Chapter Title</label>
                  <input
                    value={blk.heading}
                    onChange={(e) =>
                      patch({
                        storyBlocks: form.storyBlocks.map((b, idx) =>
                          idx === i ? { ...b, heading: e.target.value } : b
                        )
                      })
                    }
                    style={inp}
                  />
                </div>
                <div>
                  <label style={lbl}>Layout Arrangement</label>
                  <select
                    value={blk.layout}
                    onChange={(e) =>
                      patch({
                        storyBlocks: form.storyBlocks.map((b, idx) =>
                          idx === i ? { ...b, layout: e.target.value } : b
                        )
                      })
                    }
                    style={inp}
                  >
                    <option>Image on Right</option>
                    <option>Image on Left</option>
                    <option>Full Bleed Center</option>
                  </select>
                </div>
              </div>
              <textarea
                rows={2}
                value={blk.copy}
                onChange={(e) =>
                  patch({
                    storyBlocks: form.storyBlocks.map((b, idx) =>
                      idx === i ? { ...b, copy: e.target.value } : b
                    )
                  })
                }
                style={inp}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  placeholder="Story Editorial Photo URL"
                  value={blk.image || ""}
                  onChange={(e) =>
                    patch({
                      storyBlocks: form.storyBlocks.map((b, idx) =>
                        idx === i ? { ...b, image: e.target.value } : b
                      )
                    })
                  }
                  style={inp}
                />
                <label style={blueBtn}>
                  <Upload size={14} /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      onUploadMedia?.(e.target.files?.[0], `st_${i}`, (url) =>
                        patch({
                          storyBlocks: form.storyBlocks.map((b, idx) =>
                            idx === i ? { ...b, image: url } : b
                          )
                        })
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GROUP 4: KEY FEATURES */}
      {group === 4 && (
        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}
          >
            <h3 style={{ ...gTitle, margin: 0 }}>
              GROUP 4: KEY FOOTWEAR HIGHLIGHTS & FEATURES
            </h3>
            <button
              type="button"
              onClick={() =>
                patch({
                  featureCards: [
                    ...form.featureCards,
                    { title: "New Feature", desc: "", visible: true }
                  ]
                })
              }
              style={ghostBtn}
            >
              <Plus size={14} /> Add Feature
            </button>
          </div>
          <div style={grid2}>
            {form.featureCards.map((fc, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "12px",
                  display: "grid",
                  gap: "8px"
                }}
              >
                <input
                  value={fc.title}
                  onChange={(e) =>
                    patch({
                      featureCards: form.featureCards.map((f, idx) =>
                        idx === i ? { ...f, title: e.target.value } : f
                      )
                    })
                  }
                  style={inp}
                />
                <textarea
                  rows={2}
                  value={fc.desc}
                  onChange={(e) =>
                    patch({
                      featureCards: form.featureCards.map((f, idx) =>
                        idx === i ? { ...f, desc: e.target.value } : f
                      )
                    })
                  }
                  style={inp}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GROUP 5: MATERIALS & CARE */}
      {group === 5 && (
        <div style={card}>
          <h3 style={gTitle}>GROUP 5: MATERIALS, FIT ADVICE, CARE & SPECIFICATIONS</h3>
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={grid2}>
              <div>
                <label style={lbl}>Material</label>
                <input
                  value={form.materials}
                  onChange={(e) => patch({ materials: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Molding / Construction Method</label>
                <input
                  value={form.moldingMethod}
                  onChange={(e) => patch({ moldingMethod: e.target.value })}
                  style={inp}
                />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={lbl}>Fit Recommendation</label>
                <textarea
                  rows={2}
                  value={form.fitRecommendation}
                  onChange={(e) => patch({ fitRecommendation: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Washing & Care Instructions</label>
                <textarea
                  rows={2}
                  value={form.careInstructions}
                  onChange={(e) => patch({ careInstructions: e.target.value })}
                  style={inp}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px"
                }}
              >
                <label style={lbl}>Specifications Table</label>
                <button
                  type="button"
                  onClick={() =>
                    patch({ specsTable: [...form.specsTable, { label: "Spec", value: "" }] })
                  }
                  style={ghostBtn}
                >
                  <Plus size={13} /> Add Specification Row
                </button>
              </div>
              {form.specsTable.map((sp, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr auto",
                    gap: "8px",
                    marginBottom: "8px"
                  }}
                >
                  <input
                    value={sp.label}
                    onChange={(e) =>
                      patch({
                        specsTable: form.specsTable.map((r, idx) =>
                          idx === i ? { ...r, label: e.target.value } : r
                        )
                      })
                    }
                    style={inp}
                  />
                  <input
                    value={sp.value}
                    onChange={(e) =>
                      patch({
                        specsTable: form.specsTable.map((r, idx) =>
                          idx === i ? { ...r, value: e.target.value } : r
                        )
                      })
                    }
                    style={inp}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch({ specsTable: form.specsTable.filter((_, idx) => idx !== i) })
                    }
                    style={{ ...ghostBtn, color: "#DC2626" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GROUP 6: EDITABLE SIZE GUIDE */}
      {group === 6 && (
        <div style={card}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px"
            }}
          >
            <h3 style={{ ...gTitle, margin: 0 }}>GROUP 6: SIZE CHART & MEASUREMENT GUIDE</h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => patch({ sizeChartRows: ADULT_SIZE_ROWS })}
                style={ghostBtn}
              >
                Adult (UK 6–10)
              </button>
              <button
                type="button"
                onClick={() => patch({ sizeChartRows: KIDS_SIZE_ROWS })}
                style={ghostBtn}
              >
                Kids (UK 1–5)
              </button>
              <select
                value={form.sizeGuideUnit}
                onChange={(e) => patch({ sizeGuideUnit: e.target.value })}
                style={{ ...inp, width: "170px" }}
              >
                <option value="Centimeters (cm)">Centimeters (cm)</option>
                <option value="Inches (in)">Inches (in)</option>
              </select>
              <button
                type="button"
                onClick={() =>
                  patch({
                    sizeChartRows: [...activeRows, { uk: "", eu: "", us: "", cm: "" }]
                  })
                }
                style={blueBtn}
              >
                <Plus size={14} /> Add Size Row
              </button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
            <thead>
              <tr style={{ background: "#F1F5F9", textAlign: "left" }}>
                <th style={{ padding: "8px" }}>UK / INDIA</th>
                <th style={{ padding: "8px" }}>EU SIZE</th>
                <th style={{ padding: "8px" }}>US SIZE</th>
                <th style={{ padding: "8px" }}>FOOT LENGTH</th>
                <th style={{ padding: "8px", width: "44px" }}></th>
              </tr>
            </thead>
            <tbody>
              {activeRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0" }}>
                  {["uk", "eu", "us", "cm"].map((f) => (
                    <td key={f} style={{ padding: "6px" }}>
                      <input
                        value={row[f] || ""}
                        onChange={(e) =>
                          patch({
                            sizeChartRows: activeRows.map((r, i) =>
                              i === idx ? { ...r, [f]: e.target.value } : r
                            )
                          })
                        }
                        style={inp}
                      />
                    </td>
                  ))}
                  <td style={{ padding: "6px" }}>
                    <button
                      type="button"
                      onClick={() =>
                        patch({ sizeChartRows: activeRows.filter((_, i) => i !== idx) })
                      }
                      style={{ ...ghostBtn, color: "#DC2626", padding: "6px 8px" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GROUP 7: COLOURS & SIZES MATRIX */}
      {group === 7 && (
        <div style={card}>
          <h3 style={gTitle}>GROUP 7: COLOURWAYS, GALLERY & INVENTORY MATRIX</h3>
          <div style={{ display: "grid", gap: "14px" }}>
            <div style={grid3}>
              <div>
                <label style={lbl}>Colour Name</label>
                <input
                  value={form.color}
                  onChange={(e) => patch({ color: e.target.value })}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Hex Swatch</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="color"
                    value={form.colorHex}
                    onChange={(e) => patch({ colorHex: e.target.value })}
                    style={{
                      width: "44px",
                      height: "38px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "6px"
                    }}
                  />
                  <input
                    value={form.colorHex}
                    onChange={(e) => patch({ colorHex: e.target.value })}
                    style={inp}
                  />
                </div>
              </div>
              <div>
                <label style={lbl}>Sale Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => patch({ price: e.target.value })}
                  style={inp}
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                gap: "10px"
              }}
            >
              {activeRows.map((r) => {
                const sz = r.uk || "UK 8";
                return (
                  <div
                    key={sz}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center"
                    }}
                  >
                    <strong style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>
                      {sz}
                    </strong>
                    <input
                      type="number"
                      value={form.stockBySize?.[sz] ?? 20}
                      onChange={(e) =>
                        patch({
                          stockBySize: {
                            ...(form.stockBySize || {}),
                            [sz]: Number(e.target.value)
                          }
                        })
                      }
                      style={{ ...inp, textAlign: "center" }}
                    />
                    <span style={{ fontSize: "10px", color: "#059669" }}>in stock</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GROUP 8: BRAND COMPARISON */}
      {group === 8 && (
        <div style={card}>
          <h3 style={gTitle}>
            GROUP 8: BRAND COMPARISON ("SEE THE DIFFERENCE") OVERRIDES
          </h3>
          <div style={grid2}>
            <div
              onClick={() => patch({ comparisonMode: "default" })}
              style={{
                border:
                  form.comparisonMode === "default"
                    ? "2px solid #2563EB"
                    : "1px solid #CBD5E1",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer"
              }}
            >
              <strong>Use Global Default (Recommended)</strong>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0" }}>
                Automatically inherit the comparison configured on global Store Settings.
              </p>
            </div>
            <div
              onClick={() => patch({ comparisonMode: "custom" })}
              style={{
                border:
                  form.comparisonMode === "custom"
                    ? "2px solid #2563EB"
                    : "1px solid #CBD5E1",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer"
              }}
            >
              <strong>Custom Override for this Silhouette</strong>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0" }}>
                Specify custom graphic assets and copy tailored to this product.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GROUP 9: SHIPPING & FAQS */}
      {group === 9 && (
        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}
          >
            <h3 style={{ ...gTitle, margin: 0 }}>
              GROUP 9: SHIPPING, RETURN INFORMATION & PRODUCT FAQS
            </h3>
            <button
              type="button"
              onClick={() => patch({ faqs: [...form.faqs, { q: "", a: "" }] })}
              style={ghostBtn}
            >
              <Plus size={14} /> Add FAQ Question
            </button>
          </div>
          {form.faqs.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "10px",
                display: "grid",
                gap: "8px"
              }}
            >
              <input
                placeholder="Question"
                value={item.q}
                onChange={(e) =>
                  patch({
                    faqs: form.faqs.map((f, i) =>
                      i === idx ? { ...f, q: e.target.value } : f
                    )
                  })
                }
                style={inp}
              />
              <textarea
                rows={2}
                placeholder="Answer"
                value={item.a}
                onChange={(e) =>
                  patch({
                    faqs: form.faqs.map((f, i) =>
                      i === idx ? { ...f, a: e.target.value } : f
                    )
                  })
                }
                style={inp}
              />
            </div>
          ))}
        </div>
      )}

      {/* GROUP 10: RELATED ITEMS */}
      {group === 10 && (
        <div style={card}>
          <h3 style={gTitle}>GROUP 10: CURATED RELATED PRODUCTS & CROSS-SELLS</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "10px"
            }}
          >
            {catalog
              .filter((p) => p.id !== form.id)
              .map((p) => (
                <label
                  key={p.id}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={(form.relatedIds || []).includes(p.id)}
                    onChange={(e) =>
                      patch({
                        relatedIds: e.target.checked
                          ? [...(form.relatedIds || []), p.id]
                          : (form.relatedIds || []).filter((id) => id !== p.id)
                      })
                    }
                  />
                  <span style={{ fontSize: "12.5px", fontWeight: 600 }}>{p.name}</span>
                </label>
              ))}
          </div>
        </div>
      )}

      {/* GROUP 11: SEO & SOCIAL */}
      {group === 11 && (
        <div style={card}>
          <h3 style={gTitle}>GROUP 11: SEARCH ENGINE OPTIMIZATION & SOCIAL GRAPH</h3>
          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <label style={lbl}>SEO Meta Title (Recommended: &lt; 60 chars)</label>
              <input
                value={form.seoTitle}
                onChange={(e) => patch({ seoTitle: e.target.value })}
                style={inp}
              />
            </div>
            <div>
              <label style={lbl}>SEO Meta Description (Recommended: 120–160 chars)</label>
              <textarea
                rows={2}
                value={form.seoDescription}
                onChange={(e) => patch({ seoDescription: e.target.value })}
                style={inp}
              />
            </div>
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                padding: "14px"
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>
                GOOGLE SEARCH RESULT PREVIEW
              </span>
              <div
                style={{
                  color: "#1A0DAB",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginTop: "6px"
                }}
              >
                {form.seoTitle || `${form.name || "Silhouette"} — CALZARE`}
              </div>
              <div style={{ color: "#006621", fontSize: "12px" }}>
                https://calzare.in/product/{form.slug || "product-slug"}
              </div>
              <div style={{ color: "#4D5156", fontSize: "12.5px", marginTop: "2px" }}>
                {form.seoDescription ||
                  form.description ||
                  "High-density waterproof closed-cell EVA foam footwear."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM DRAFT / PUBLISH BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 30
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: dirty ? "#D97706" : "#64748B",
            fontWeight: 600
          }}
        >
          {dirty ? "Unsaved changes in product draft" : "All changes synced"}
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" onClick={() => submit("draft")} style={ghostBtn}>
            Save as Draft
          </button>
          <button type="button" onClick={() => submit("published")} style={blueBtn}>
            <Check size={14} /> Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}

const h1 = { margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" };
const sub = { margin: "4px 0 0", fontSize: "12.5px", color: "#64748B" };
const gTitle = {
  margin: "0 0 14px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.8px",
  color: "#334155"
};
const card = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "12px",
  padding: "18px"
};
const lbl = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "4px"
};
const inp = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid #CBD5E1",
  fontSize: "13px",
  boxSizing: "border-box",
  fontFamily: "inherit"
};
const blueBtn = {
  background: "#2563EB",
  color: "#FFFFFF",
  border: 0,
  borderRadius: "8px",
  padding: "9px 14px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  whiteSpace: "nowrap"
};
const ghostBtn = {
  background: "#FFFFFF",
  color: "#0F172A",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px"
};
const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px"
};
const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "12px"
};