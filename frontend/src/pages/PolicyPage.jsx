import React, { useEffect } from "react";

const SHIPPING_POLICY = {
  title: "Shipping Policy",
  meta: "Brand: CALZARE™ • Company: Calzare Heels Private Limited • Website: calzare.in",
  intro:
    "At CALZARE™, operated by Calzare Heels Private Limited, we aim to deliver your footwear safely and efficiently across India. Please read our Shipping Policy to understand how orders are processed, dispatched, and delivered.",
  sections: [
    {
      heading: "1. Order Processing Time",
      items: [
        "Orders are generally processed within 1–2 business days after order confirmation and successful payment, where applicable.",
        "Orders placed on Sundays or public holidays will be processed on the next working day.",
        "Once your order is dispatched, you will receive shipping confirmation and tracking details via SMS, email, or WhatsApp, where available."
      ]
    },
    {
      heading: "2. Shipping Time & Delivery",
      items: [
        "The estimated delivery time is 3–7 business days after dispatch, depending on your delivery location and courier service.",
        "Deliveries to remote locations may take longer.",
        "Delivery timelines are estimates only and are not guaranteed.",
        "Delays may occur due to weather conditions, courier disruptions, public holidays, or other circumstances beyond our reasonable control."
      ]
    },
    {
      heading: "3. Shipping Charges",
      items: [
        "Applicable shipping charges, if any, will be displayed at checkout before you place your order.",
        "Promotional free-shipping offers will be subject to the terms and conditions specified at the time of the offer.",
        "Any shipping offer may be subject to minimum order values or location-based restrictions, where disclosed."
      ]
    },
    {
      heading: "4. Shipping Locations",
      items: [
        "CALZARE™ currently aims to deliver orders across serviceable locations in India.",
        "Delivery availability depends on courier serviceability for the PIN code provided at checkout.",
        "International shipping is not available unless specifically announced on our website."
      ]
    },
    {
      heading: "5. Order Tracking",
      items: [
        "Once your order has been dispatched, we will share the tracking details through the contact information provided during checkout, where supported by the courier partner.",
        "You can use the tracking number or tracking link to monitor your shipment until delivery."
      ]
    },
    {
      heading: "6. Delayed or Lost Shipments",
      items: [
        "If your order is significantly delayed or appears to be lost in transit, please contact our customer support team.",
        "We will coordinate with the relevant courier partner to investigate the shipment and assist you with the next steps.",
        "Delivery delays caused by courier partners or circumstances beyond our reasonable control may be outside our direct control; however, we will make reasonable efforts to help resolve the issue."
      ]
    },
    {
      heading: "7. Incorrect Address or Failed Delivery",
      items: [
        "Please ensure that your shipping address, PIN code, phone number, and other delivery details are accurate at checkout. CALZARE™ cannot guarantee successful delivery if incorrect or incomplete information is provided.",
        "If a shipment is returned because of an incorrect address, an unavailable recipient, or repeated unsuccessful delivery attempts, we may contact you to arrange the next steps.",
        "Any additional shipping charges, where applicable (including applicable re-shipment or return-to-origin terms under our Refund, Return & Exchange Policy), will be communicated to you before a re-shipment is arranged."
      ]
    },
    {
      heading: "8. Cash on Delivery (COD)",
      items: [
        "Cash on Delivery (COD) is available only for eligible orders and serviceable PIN codes.",
        "COD availability may depend on the order value, delivery location, courier partner, and verification requirements.",
        "We may contact customers to confirm COD orders before dispatch and reserve the right to restrict COD for certain orders or locations where permitted by applicable law."
      ]
    },
    {
      heading: "9. Partial COD and Order Confirmation",
      items: [
        "Where a partial payment or advance payment option is offered at checkout, the applicable amount and remaining balance will be displayed before order confirmation.",
        "Any advance payment will be processed according to the terms disclosed at checkout.",
        "If a customer refuses delivery or an order is returned undelivered, any refund or handling of the advance payment will be handled in accordance with our Refund, Return & Exchange Policy and applicable law.",
        "Any applicable deductions must be lawful, reasonable, and disclosed to the customer before purchase."
      ]
    },
    {
      heading: "10. Damaged Packages During Transit",
      items: [
        "If your package appears visibly damaged at the time of delivery, document the damage with photographs or videos before opening the package where possible.",
        "If the package is severely damaged or appears tampered with, report the issue to the delivery personnel and contact our customer support team promptly.",
        "Please notify us within 48 hours of delivery with your order number and supporting photographs or videos, and retain the original packaging until resolved."
      ]
    }
  ],
  footerNote:
    "This policy should be read together with our Terms and Conditions and our Refund, Return & Exchange Policy."
};

const REFUND_POLICY = {
  title: "Refund, Return & Exchange Policy",
  meta: "Last Updated: 22 October 2026 • Brand: CALZARE™ • Company: Calzare Heels Private Limited • Website: calzare.in",
  intro:
    "At CALZARE™, operated by Calzare Heels Private Limited, we are committed to delivering quality footwear and providing a transparent shopping experience. Please read this policy carefully before placing an order on calzare.in.",
  sections: [
    {
      heading: "1. Unboxing Video Requirement",
      items: [
        "We recommend recording a continuous, unedited unboxing video for every order, starting before the package is opened and clearly showing the shipping label, packaging, and product.",
        "An unboxing video helps us verify claims involving damaged, defective, missing, or incorrect products.",
        "Please retain the original packaging until your complaint has been resolved.",
        "If you do not have an unboxing video, you may submit photographs and other available evidence. The absence of a video will not automatically remove rights available under applicable law."
      ]
    },
    {
      heading: "2. Returns and Exchanges",
      items: [
        "Damaged, Defective, or Incorrect Products: Contact us within 48 hours of delivery, preferably with photographs or an unboxing video. After verification, we will arrange a replacement, exchange, or refund as applicable, with no return or replacement shipping fee where attributable to CALZARE™.",
        "Size or Fit Issues: Size exchange requests must be submitted within 3 days of delivery. Items must be unused, unworn outdoors, and returned with original packaging, tags, and accessories, subject to stock availability. A disclosed exchange fee of ₹149 may apply for customer-requested size exchanges (waived if attributable to CALZARE™).",
        "Change of Mind: Returns or exchanges requested solely due to preference change are accepted only where expressly offered for the product. Final-sale items follow product-page conditions without limiting statutory rights."
      ]
    },
    {
      heading: "3. Return Eligibility",
      items: [
        "Submit the request within the applicable return window.",
        "Keep the footwear unused and in resalable condition.",
        "Include the original box, tags, accessories, and packaging, where supplied.",
        "Provide the order number and any requested supporting information. Products showing outdoor wear, customer-caused damage, or alterations may be ineligible for change-of-mind returns or size exchanges."
      ]
    },
    {
      heading: "4. How to Request a Return or Exchange",
      items: [
        "1. Contact our customer support team using the details published on our website.",
        "2. Provide your order number and registered phone number or email address.",
        "3. Explain the reason for your request and provide photographs or an unboxing video where available.",
        "4. Our team will review the request and confirm the next steps.",
        "5. If approved, we will arrange a pickup or provide return instructions depending on serviceability.",
        "6. Once received and inspected, we will notify you of the outcome and resolution. Do not send items to an unconfirmed address."
      ]
    },
    {
      heading: "5. Refund Method and Processing Time",
      items: [
        "Prepaid orders are generally refunded to the original payment method; for COD orders, we may request bank account or payment details needed to refund securely.",
        "We aim to initiate approved refunds within 7–10 business days after the refund decision or completion of required inspection, as applicable.",
        "Final reflection time depends on your bank or payment provider and applicable law."
      ]
    },
    {
      heading: "6. Exchange Fees",
      items: [
        "For eligible customer-requested size or preference-based exchanges, an exchange fee of ₹149 may apply to help cover shipping and logistics costs.",
        "The fee is disclosed before confirmation and does not apply to replacements or exchanges required to correct a damaged, defective, or incorrect product attributable to CALZARE™."
      ]
    },
    {
      heading: "7. Order Cancellations",
      items: [
        "Customers may request cancellation before dispatch by contacting us as soon as possible.",
        "Once dispatched, standard cancellation may no longer be available; contact us to check available options.",
        "Approved cancellations of prepaid orders are refunded to the original payment method subject to applicable law, and partial COD advance payments follow checkout terms and applicable law."
      ]
    },
    {
      heading: "8. Cash on Delivery (COD) and Partial COD",
      items: [
        "COD and Partial COD may be available for eligible orders and serviceable PIN codes.",
        "For Partial COD orders, if a customer refuses delivery at the doorstep or fails to accept delivery after applicable attempts resulting in Return to Origin (RTO), the advance payment collected at checkout is intended to cover shipping, return-logistics, and order-handling costs and may be non-refundable where permitted by applicable law and disclosed terms.",
        "Advance payments are not treated as non-refundable where the product is defective/incorrect, delivery failure is attributable to CALZARE™, or a refund is required by law.",
        "If re-shipment is requested after an RTO, a re-shipment charge of ₹300 may apply where lawful and communicated before re-dispatch."
      ]
    },
    {
      heading: "9. Return to Origin (RTO), Re-shipment and Cancellation After Dispatch",
      items: [
        "A shipment may be returned to origin if the customer is unavailable, unreachable, provides an incorrect/incomplete address, refuses delivery, or cannot receive the package after applicable delivery attempts.",
        "Re-shipment After RTO: A ₹300 re-shipment charge may apply where the customer is responsible for failed delivery and the charge is lawful and disclosed beforehand (no charge if caused by CALZARE™).",
        "Fully Prepaid Orders Refused at the Doorstep: If refused for reasons attributable to the customer resulting in RTO, ₹300 may be deducted from the refund toward shipping and return-logistics costs where disclosed and legally permissible (not an additional penalty, and waived if attributable to CALZARE™).",
        "Partial COD Orders Returned to Origin: Handled per Section 8; advance payment and the ₹300 re-shipment charge are assessed separately rather than stacked automatically without regard to circumstances, disclosed terms, and applicable law."
      ]
    },
    {
      heading: "10. Final Sale and Clearance Products",
      items: [
        "Products marked final sale or clearance may be ineligible for returns or exchanges based on size or preference, as disclosed on the product page, without excluding statutory remedies for defective, damaged, incorrect, or misrepresented products."
      ]
    },
    {
      heading: "11. Gift Cards and Store Credit",
      items: [
        "If store credit or a gift card is offered as a resolution, its value, validity, and redemption conditions are communicated before acceptance.",
        "Store credit does not replace a refund where a refund is required by applicable law."
      ]
    }
  ],
  footerNote:
    "We aim to review customer requests promptly and communicate the next steps clearly. This policy should be read together with our Shipping Policy, Terms and Conditions, and Privacy Policy."
};

export default function PolicyPage({
  policyKey = "shipping-policy",
  onSwitchPolicy,
  onGoHome
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [policyKey]);

  const isRefund = policyKey === "refund-policy";
  const doc = isRefund ? REFUND_POLICY : SHIPPING_POLICY;

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
            background: !isRefund ? "var(--accent, #252a22)" : "transparent",
            color: !isRefund ? "var(--accent-ink, #f7f6f2)" : "inherit",
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
            background: isRefund ? "var(--accent, #252a22)" : "transparent",
            color: isRefund ? "var(--accent-ink, #f7f6f2)" : "inherit",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer"
          }}
        >
          REFUND, RETURN & EXCHANGE
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
        {doc.title}
      </h1>
      <p style={{ fontSize: "12px", opacity: 0.72, margin: "0 0 20px" }}>{doc.meta}</p>
      <p style={{ margin: "0 0 28px" }}>{doc.intro}</p>

      <div style={{ display: "grid", gap: "24px" }}>
        {doc.sections.map((sec) => (
          <div key={sec.heading}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>
              {sec.heading}
            </h2>
            <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "6px" }}>
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
          borderTop: "1px solid rgba(0,0,0,0.12)",
          fontSize: "14px"
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>
          {isRefund ? "12. Contact Us" : "11. Contact Us"}
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          <strong>Brand:</strong> CALZARE™
          <br />
          <strong>Company:</strong> Calzare Heels Private Limited
          <br />
          <strong>Website:</strong> calzare.in
          <br />
          <strong>Email:</strong>{" "}
          <a href="mailto:Admin@calzareheels.com" style={{ textDecoration: "underline" }}>
            Admin@calzareheels.com
          </a>
        </p>
        <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>{doc.footerNote}</p>
      </div>
    </section>
  );
}