import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85";

export default function StoryPage({
  homepage,
  storeSettings,
  onGoHome,
  onExploreShop
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sections =
    Array.isArray(storeSettings?.storySections) &&
    storeSettings.storySections.length > 0
      ? storeSettings.storySections
      : [
          {
            eyebrow: "OUR PHILOSOPHY",
            heading: "Wear what moves you.",
            body:
              homepage?.heroDescription ||
              "CALZARE is built around a simple idea: everyday essentials deserve exceptional attention.",
            image: ""
          }
        ];

  return (
    <section id="story-page" className="story section-pad">
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {onGoHome && (
          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <button type="button" onClick={onGoHome} className="pdp-back-btn">
              <ArrowLeft size={14} /> BACK TO HOME
            </button>
          </div>
        )}

        {sections.map((st, idx) => (
          <div
            key={idx}
            style={{ marginBottom: idx < sections.length - 1 ? "56px" : 0 }}
          >
            <p className="eyebrow">{st.eyebrow || "OUR STORY"}</p>
            <h2>{st.heading || "Wear what moves you."}</h2>
            <p>{st.body}</p>
            {st.image && (
              <div
                style={{
                  maxWidth: "760px",
                  margin: "24px auto 0",
                  borderRadius: "16px",
                  overflow: "hidden"
                }}
              >
                <img
                  src={st.image}
                  alt={st.heading || "Calzare Story"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = SAFE_IMAGE_FALLBACK;
                  }}
                  style={{
                    width: "100%",
                    maxHeight: "440px",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {onExploreShop && (
          <div style={{ marginTop: "36px" }}>
            <button
              type="button"
              className="primary-cta-btn"
              style={{ maxWidth: "240px", margin: "0 auto" }}
              onClick={onExploreShop}
            >
              EXPLORE FOOTWEAR <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}