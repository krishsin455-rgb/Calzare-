import { useEffect } from "react";

const SHIPPING_POLICY = {
  title: "Shipping Policy",
  meta: "Brand: AL-ZEHRA SILK • Website: alzehrasilk.in",
  intro:
    "At Al-Zehra Silk, every saree is carefully quality-checked, neatly folded, and securely packed before dispatch. Please read our Shipping Policy to understand how your saree orders are processed and delivered across India.",
  sections: [
    {
      heading: "1. Order Processing & Dispatch",
      items: [
        "All saree orders are quality-checked, packed, and dispatched within 24–48 business hours after order confirmation.",
        "Orders placed on Sundays or public holidays are processed on the next working day.",
        "Once dispatched, tracking details are shared via SMS, WhatsApp, or email."
      ]
    },
    {
      heading: "2. Delivery Timeline",
      items: [
        "Metro cities: 3–5 business days after dispatch.",
        "Rest of India: 5–7 business days after dispatch.",
        "Remote or non-metro PIN codes may take slightly longer depending on courier serviceability.",
        "Delays caused by weather, festivals, or courier disruptions are outside our direct control, though our team will assist you until delivery."
      ]
    },
    {
      heading: "3. Shipping Charges",
      items: [
        "Free shipping applies across India on prepaid orders above ₹999.",
        "Any applicable shipping fee for orders below ₹999 is displayed clearly at checkout before payment."
      ]
    },
    {
      heading: "4. Cash on Delivery (COD) & Partial COD",
      items: [
        "COD and Partial COD (₹199 advance) are available on eligible orders and serviceable Indian PIN codes.",
        "For Partial COD, the advance amount and the remaining balance payable at delivery are shown clearly at checkout."
      ]
    },
    {
      heading: "5. Damaged or Tampered Packages at Delivery",
      items: [
        "If the outer parcel looks torn, opened, wet, or tampered with at the time of delivery, please do not accept it or record a clear video before opening.",
        "For any damage or missing-item claim after delivery, a continuous 360-degree unboxing video is mandatory (see our Return & Exchange Policy)."
      ]
    }
  ],
  footerNote:
    "This Shipping Policy should be read together with our Saree Return, Refund & Exchange Policy."
};

const REFUND_POLICY = {
  title: "Return, Refund & Exchange Policy",
  meta: "Last Updated: November 2026 • Brand: AL-ZEHRA SILK • Website: alzehrasilk.in",
  intro:
    "At Al-Zehra Silk, we take pride in the craftsmanship of our Banarasi, Kanjivaram, Soft Silk, and Kalamkari sarees. Every piece is inspected by hand before dispatch. Please read our saree return and damage-claim rules carefully before ordering.",
  sections: [
    {
      heading: "1. Mandatory Unboxing Video for Damaged / Defective / Wrong Sarees",
      items: [
        "To claim a return, replacement, or refund for a damaged, torn, stained, defective, missing, or wrong saree, customers MUST record a continuous, unedited 360-degree unboxing video while opening the parcel.",
        "The video must start BEFORE the outer sealed courier bag/box is opened, clearly showing the intact shipping label (Order ID & AWB number) on the parcel.",
        "The saree must be opened and shown completely in the same continuous video, clearly highlighting the damage, defect, or wrong item.",
        "Edited, paused, cut, or re-packed videos, or photos sent without an unboxing video, will NOT be accepted for damage or missing-item claims.",
        "The unboxing video must be shared with our support team within 48 hours of delivery."
      ]
    },
    {
      heading: "2. 48-Hour Return & Exchange Window",
      items: [
        "Damaged, Defective, or Wrong Saree: Report within 48 hours of delivery with your Order ID and the mandatory unboxing video. Once verified, we will arrange a free replacement, exchange, or full refund.",
        "All return or exchange requests must be raised within 48 hours of delivery. Requests received after 48 hours will not be eligible."
      ]
    },
    {
      heading: "3. Saree Return Eligibility Conditions",
      items: [
        "The saree must be completely unused, unwashed, unworn, and in its original folding.",
        "All original tags, labels, and packaging must be intact.",
        "The attached unstitched blouse piece must NOT be cut, detached, or stitched.",
        "Sarees with fall/pico done, alterations, iron marks, perfume/deodorant smell, or makeup/wear stains are strictly NOT eligible for return or exchange."
      ]
    },
    {
      heading: "4. Handloom, Weave & Color Variation Disclaimer",
      items: [
        "Slight variations in color or zari sheen may occur due to studio lighting, photography, and mobile/screen display settings. Minor shade differences are not considered defects.",
        "Small thread slubs, minor weave irregularities, or slight zari texture variations are natural hallmarks of woven silk and handloom-inspired sarees, not manufacturing defects."
      ]
    },
    {
      heading: "5. How to Raise a Return or Damage Claim",
      items: [
        "1. Email us at care@alzehrasilk.in or message our WhatsApp support within 48 hours of delivery.",
        "2. Share your Order ID, registered phone number, and the continuous unboxing video showing the shipping label and the saree.",
        "3. Our quality team will review the video within 24–48 business hours and confirm approval.",
        "4. Once approved, we will arrange a reverse pickup (or share return shipping instructions for non-serviceable PIN codes).",
        "5. Do not ship any saree back without confirmation from our support team."
      ]
    },
    {
      heading: "6. Refunds & Processing Time",
      items: [
        "Refunds are initiated only after the returned saree reaches our studio and passes quality inspection.",
        "Prepaid orders: Refunded to the original payment method within 5–7 business days after inspection.",
        "COD orders: Refunded via UPI or bank transfer within 5–7 business days after you share your payout details."
      ]
    },
    {
      heading: "7. Order Cancellations & Partial COD / RTO",
      items: [
        "Orders can only be cancelled before dispatch by contacting support with your Order ID.",
        "For Partial COD orders, if delivery is refused at the doorstep or fails due to an incorrect address/unavailability resulting in Return to Origin (RTO), the ₹199 advance covers forward and return shipping costs and is non-refundable."
      ]
    }
  ],
  footerNote:
    "By placing an order on alzehrasilk.in, you agree to the mandatory unboxing video requirement and saree return conditions outlined above."
};

export default function PolicyPage({
  policyKey = "shipping-policy",
  storeSettings = {},
  onSwitchPolicy,
  onGoHome
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [policyKey]);

  const isRefund = policyKey === "refund-policy";
  const doc = isRefund ? REFUND_POLICY : SHIPPING_POLICY;

  const customPolicy = Array.isArray(storeSettings?.policies)
    ? storeSettings.policies.find((p) =>
        isRefund
          ? p.key === "refund" || p.key === "exchange"
          : p.key === "shipping"
      )
    : null;

  const supportEmail =
    storeSettings?.supportEmail ||
    storeSettings?.contactItems?.find((c) => c.type === "Email")?.value ||
    "care@alzehrasilk.in";

  const displayTitle = customPolicy?.title || doc.title;
  const displayIntro = customPolicy?.content || doc.intro;

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "48px 24px 72px",
        lineHeight: 1.7
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "24px"
        }}
      >
        <button
          type="button"
          onClick={() => onSwitchPolicy?.("shipping-policy")}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "1px solid currentColor",
            background: !isRefund
              ? "var(--accent, #7A1C24)"
              : "transparent",
            color: !isRefund ? "var(--accent-ink, #FAF7F2)" : "inherit",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer"
          }}
        >
          SHIPPING POLICY
        </button>
        <button
          type="button"
          onClick={() => onSwitchPolicy?.("refund-policy")}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "1px solid currentColor",
            background: isRefund ? "var(--accent, #7A1C24)" : "transparent",
            color: isRefund ? "var(--accent-ink, #FAF7F2)" : "inherit",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer"
          }}
        >
          RETURN, REFUND & EXCHANGE
        </button>
        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              border: 0,
              background: "transparent",
              textDecoration: "underline",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Back to Store
          </button>
        )}
      </div>

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 500,
          margin: "0 0 8px"
        }}
      >
        {displayTitle}
      </h1>
      <p style={{ fontSize: "12px", opacity: 0.72, margin: "0 0 20px" }}>
        {doc.meta}
      </p>

      {isRefund && (
        <div
          style={{
            padding: "14px 16px",
            marginBottom: "24px",
            borderRadius: "10px",
            background: "var(--surface, #F3ECE1)",
            border: "1px solid var(--accent, #7A1C24)",
            color: "var(--accent, #7A1C24)",
            fontSize: "13.5px",
            fontWeight: 600
          }}
        >
          Important: A continuous, unedited unboxing video from before opening
          the sealed parcel (showing the shipping label and the saree clearly)
          is mandatory for all damaged, defective, or wrong-product return claims.
        </div>
      )}

      <p style={{ margin: "0 0 28px" }}>{displayIntro}</p>

      <div style={{ display: "grid", gap: "24px" }}>
        {doc.sections.map((sec) => (
          <div key={sec.heading}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>
              {sec.heading}
            </h2>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                display: "grid",
                gap: "6px"
              }}
            >
              {sec.items.map((text, idx) => (
                <li key={idx}>{text}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "36px",
          paddingTop: "24px",
          borderTop: "1px solid var(--line, rgba(0,0,0,0.12))",
          fontSize: "14px"
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>
          Contact Us
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          <strong>Brand:</strong> AL-ZEHRA SILK
          <br />
          <strong>Website:</strong> alzehrasilk.in
          <br />
          <strong>Email:</strong>{" "}
          <a href={`mailto:${supportEmail}`} style={{ textDecoration: "underline" }}>
            {supportEmail}
          </a>
        </p>
        <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>{doc.footerNote}</p>
      </div>
    </section>
  );
}