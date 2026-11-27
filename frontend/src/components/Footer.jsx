export default function Footer({
  homepage = {},
  storeSettings = {},
  email = "",
  setEmail,
  onSubscribe,
  onNavigateCollection,
  onOpenPolicy,
  onOpenTrackOrder,
  onOpenLogin,
  onOpenContact,
  onScrollToShop
}) {
  const footerCfg = storeSettings?.footer || homepage?.footer || {};
  const storeName =
    storeSettings?.storeName || homepage?.storeName || "AL-ZEHRA SILK";
  const supportEmail =
    storeSettings?.supportEmail ||
    footerCfg.contactItems?.find((c) => c.type === "Email")?.value ||
    "care@alzehrasilk.in";
  const supportPhone =
    storeSettings?.supportPhone ||
    footerCfg.contactItems?.find((c) => c.type === "Phone")?.value ||
    "+91 98765 43210";

  const paymentBadges =
    Array.isArray(storeSettings?.paymentMethods) && storeSettings.paymentMethods.length
      ? storeSettings.paymentMethods
      : ["VISA", "MASTERCARD", "RuPay", "UPI"];

  return (
    <footer className="site-footer-dark">
      <div className="footer-grid-4">
        <div>
          <img
            src={storeSettings?.logoUrl || footerCfg.logo || "/logo.jpeg"}
            alt={storeName}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            style={{
              height: "56px",
              width: "auto",
              borderRadius: "8px",
              objectFit: "contain",
              display: "block",
              marginBottom: "14px"
            }}
          />
          <p className="footer-brand-blurb">
            {footerCfg.tagline ||
              "Timeless Indian weaves crafted for weddings, festivities, and everyday grace."}
          </p>
          {footerCfg.showContact !== false && (
            <>
              <p className="footer-connect-title">Connect with us</p>
              {supportEmail && (
                <a href={`mailto:${supportEmail}`} className="footer-contact-link">
                  {supportEmail}
                </a>
              )}
              {supportPhone && (
                <a
                  href={`tel:${String(supportPhone).replace(/\s+/g, "")}`}
                  className="footer-contact-link"
                >
                  {supportPhone}
                </a>
              )}
              <p className="footer-hours">
                {footerCfg.hours || "Monday to Saturday, 10:00 AM to 7:00 PM."}
              </p>
            </>
          )}
        </div>

        <div>
          <h4 className="footer-col-heading">Main Menu</h4>
          <ul className="footer-col-list">
            <li>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCollection?.("home");
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToShop?.();
                }}
              >
                Shop All Sarees
              </a>
            </li>
            <li>
              <a
                href="#track-order"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenTrackOrder?.();
                }}
              >
                Track Order
              </a>
            </li>
            <li>
              <a
                href="#story"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCollection?.("story");
                }}
              >
                Our Craft
              </a>
            </li>
            <li>
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLogin?.("login");
                }}
              >
                Login / Account
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenContact?.();
                }}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-heading">Shop by Weave</h4>
          <ul className="footer-col-list">
            <li>
              <a
                href="#banarasi"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCollection?.("banarasi");
                }}
              >
                Banarasi Silk
              </a>
            </li>
            <li>
              <a
                href="#kanjivaram"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCollection?.("kanjivaram");
                }}
              >
                Kanjivaram
              </a>
            </li>
            <li>
              <a
                href="#soft-silk"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCollection?.("soft-silk");
                }}
              >
                Soft Silk
              </a>
            </li>
            <li>
              <a
                href="#kalamkari"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateCollection?.("kalamkari");
                }}
              >
                Kalamkari
              </a>
            </li>
            <li>
              <a
                href="#shipping-policy"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPolicy?.("shipping-policy");
                }}
              >
                Shipping Policy
              </a>
            </li>
            <li>
              <a
                href="#refund-policy"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPolicy?.("refund-policy");
                }}
              >
                Return & Exchange Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-heading">
            {footerCfg.newsletterHeading || `Join the ${storeName} studio`}
          </h4>
          <p className="footer-newsletter-copy">
            {footerCfg.newsletterCopy ||
              "Sign up for early access to festive silk drops and exclusive weave editions."}
          </p>
          <form className="footer-newsletter-form" onSubmit={onSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail?.(e.target.value)}
              placeholder="Enter your email..."
              className="footer-newsletter-input"
            />
            <button type="submit" className="footer-newsletter-submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <div className="footer-watermark-wordmark" aria-hidden="true">
        {storeName}
      </div>

      <div className="footer-bottom-bar">
        <span>
          {footerCfg.copyright ||
            `© 2026 ${storeName}. All rights reserved.`}
        </span>
        <div className="footer-payment-badges">
          {paymentBadges.map((badge) => (
            <span key={badge} className="footer-pay-pill">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
