import { ArrowLeft, ArrowUpRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

const PILLARS = [
  {
    icon: Sparkles,
    title: "Authentic Loom & Zari",
    description:
      "Every Banarasi, Kanjivaram, Soft Silk, and Kalamkari saree is chosen for drape flow, weave balance, and rich border detail."
  },
  {
    icon: ShieldCheck,
    title: "Hand-Checked Before Dispatch",
    description:
      "Each piece is inspected for weave integrity, color consistency, and unstitched blouse yardage before leaving our studio."
  },
  {
    icon: Truck,
    title: "Careful Packaging Across India",
    description:
      "Folded neatly in protective wrapping with transparent shipping, partial COD options, and a 48-hour return window."
  }
];

export default function OurStory({
  storeSettings = {},
  onGoHome,
  onNavigateCollection
}) {
  const storyBlocks = Array.isArray(storeSettings?.storySections)
    ? storeSettings.storySections.filter(
        (s) => s && (s.eyebrow || s.heading || s.body)
      )
    : [];

  const leadBlock = storyBlocks[0] || {
    eyebrow: "OUR CRAFT & HERITAGE",
    heading: "Woven for moments that stay.",
    body: "Al-Zehra Silk celebrates timeless Indian textiles made accessible for festive gatherings, weddings, and everyday elegance. We focus on silhouettes that pleat cleanly, feel comfortable for hours, and carry lasting character."
  };

  const extraBlocks = storyBlocks.slice(1);

  return (
    <section
      style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "40px 24px 80px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px"
        }}
      >
        {onGoHome ? (
          <button type="button" className="pdp-back-btn" onClick={onGoHome}>
            <ArrowLeft size={14} /> BACK TO STORE
          </button>
        ) : (
          <span />
        )}
        <span className="eyebrow" style={{ margin: 0 }}>
          AL-ZEHRA SILK
        </span>
      </div>

      <div style={{ maxWidth: "700px", marginBottom: "44px" }}>
        <p className="eyebrow">{leadBlock.eyebrow}</p>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 500,
            lineHeight: 1.12,
            margin: "0 0 16px"
          }}
        >
          {leadBlock.heading}
        </h1>
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.75,
            color: "var(--muted, #475569)",
            margin: 0
          }}
        >
          {leadBlock.body}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "44px"
        }}
      >
        {PILLARS.map((pillar) => {
          const IconComp = pillar.icon;
          return (
            <div
              key={pillar.title}
              style={{
                padding: "22px",
                borderRadius: "14px",
                background: "var(--surface, #F3ECE1)",
                border: "1px solid var(--line, rgba(0,0,0,0.08))"
              }}
            >
              <IconComp size={20} />
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: "12px 0 6px"
                }}
              >
                {pillar.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "var(--muted, #475569)"
                }}
              >
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {extraBlocks.length > 0 && (
        <div style={{ display: "grid", gap: "20px", marginBottom: "40px" }}>
          {extraBlocks.map((sec, idx) => (
            <div
              key={sec.id || idx}
              style={{
                padding: "22px",
                borderRadius: "14px",
                border: "1px solid var(--line, rgba(0,0,0,0.1))",
                background: "#FFFFFF"
              }}
            >
              {sec.eyebrow && (
                <p className="eyebrow" style={{ marginBottom: "6px" }}>
                  {sec.eyebrow}
                </p>
              )}
              {sec.heading && (
                <h2 style={{ fontSize: "20px", margin: "0 0 8px" }}>
                  {sec.heading}
                </h2>
              )}
              {sec.body && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "var(--muted, #475569)"
                  }}
                >
                  {sec.body}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {onNavigateCollection && (
        <button
          type="button"
          className="dark-link"
          style={{
            background: "none",
            border: 0,
            borderBottom: "1px solid currentColor",
            cursor: "pointer"
          }}
          onClick={() => onNavigateCollection("banarasi")}
        >
          EXPLORE BANARASI WEAVES <ArrowUpRight size={15} />
        </button>
      )}
    </section>
  );
}