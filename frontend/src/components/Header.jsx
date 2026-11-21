import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

function toTitleCase(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default function Header({
  homepage,
  storeSettings,
  navItems = [],
  collection,
  storyPageOpen,
  trackPageOpen,
  menuOpen,
  setMenuOpen,
  search,
  setSearch,
  cartCount = 0,
  wishlistCount = 0,
  onOpenWishlist,
  setCartOpen,
  currentUser,
  openAccountModal,
  navigateCollection,
  openTrackOrderPage
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileCfg = homepage?.mobileUI || {};
  const navCfg = homepage?.navbar || {};

  const logoSize = isMobile
    ? Number(mobileCfg.logoSizePx) || 18
    : Number(navCfg.logoSizePx) || 22;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(e, item) {
    e.preventDefault();
    setMenuOpen?.(false);
    const raw = String(item.url || item.label || "").trim();
    if (raw.toLowerCase().includes("track")) {
      openTrackOrderPage?.();
    } else {
      navigateCollection?.(raw);
    }
  }

  return (
    <>
      <header
        className="header"
        style={{
          background: navCfg.bgColor || "#ffffff",
          color: navCfg.textColor || "#111111",
          minHeight: isMobile ? `${Number(mobileCfg.navHeightPx) || 58}px` : "68px",
          padding: isMobile ? "0 16px" : "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "none",
          boxShadow: "none",
          position: "relative",
          zIndex: 40
        }}
      >
        {/* Left: Mobile Menu + Brand Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            border: "none"
          }}
        >
          {isMobile && (
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen?.(true)}
              style={{
                border: "none",
                background: "transparent",
                color: "inherit",
                padding: "4px",
                display: "grid",
                placeItems: "center",
                cursor: "pointer"
              }}
            >
              <Menu size={20} />
            </button>
          )}

          <a
            href="#home"
            className="wordmark"
            onClick={(e) => {
              e.preventDefault();
              navigateCollection?.("home");
            }}
            style={{
              fontSize: `${logoSize}px`,
              fontWeight: 700,
              letterSpacing: isMobile
                ? `${mobileCfg.logoTracking ?? 2.2}px`
                : "3px",
              textDecoration: "none",
              color: "inherit",
              border: "none",
              display: "inline-flex",
              alignItems: "baseline",
              whiteSpace: "nowrap"
            }}
          >
            {storeSettings?.storeName || "CALZARE"}
            <sup style={{ fontSize: "0.45em", marginLeft: "2px", fontWeight: 500 }}>
              ®
            </sup>
          </a>
        </div>

        {/* Center: Clean Title Case Desktop Navigation */}
        {!isMobile && (
          <nav
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
              flex: "1 1 auto",
              margin: "0 24px"
            }}
          >
            {navItems.map((item, idx) => {
              const rawLabel = String(item.label || "").trim();
              const labelUpper = rawLabel.toUpperCase();
              const displayLabel = toTitleCase(rawLabel);
              const isActive =
                (labelUpper === "HOME" &&
                  collection === "all" &&
                  !storyPageOpen &&
                  !trackPageOpen) ||
                ((labelUpper === "OUR STORY" || labelUpper === "OUR. STORY") &&
                  storyPageOpen) ||
                (labelUpper === "TRACK ORDER" && trackPageOpen) ||
                labelUpper.toLowerCase() === String(collection || "").toLowerCase();

              return (
                <a
                  key={`${labelUpper}-${idx}`}
                  href={item.url || "#"}
                  onClick={(e) => handleNavClick(e, item)}
                  style={{
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: "0.01em",
                    textDecoration: isActive ? "underline" : "none",
                    textUnderlineOffset: "6px",
                    color: "inherit",
                    border: "none",
                    padding: "4px 0",
                    whiteSpace: "nowrap"
                  }}
                >
                  {displayLabel}
                </a>
              );
            })}
          </nav>
        )}

        {/* Right: Minimalist Icon Row (Search, Account, Wishlist, Bag) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "14px" : "18px",
            border: "none"
          }}
        >
          <button
            type="button"
            aria-label="Toggle search"
            onClick={() => setSearchOpen((prev) => !prev)}
            style={{
              border: "none",
              background: "transparent",
              color: "inherit",
              padding: "4px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} strokeWidth={1.8} />}
          </button>

          <button
            type="button"
            aria-label="Account"
            onClick={openAccountModal}
            style={{
              border: "none",
              background: "transparent",
              color: "inherit",
              padding: "4px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
            title={currentUser ? currentUser.name : "Account"}
          >
            <User size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Saved items"
            onClick={() => {
              if (onOpenWishlist) {
                onOpenWishlist();
              } else {
                navigateCollection?.("all");
              }
            }}
            style={{
              position: "relative",
              border: "none",
              background: "transparent",
              color: "inherit",
              padding: "4px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <Heart size={18} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-5px",
                  minWidth: "15px",
                  height: "15px",
                  borderRadius: "999px",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: "9.5px",
                  fontWeight: 700,
                  lineHeight: "15px",
                  textAlign: "center",
                  padding: "0 3px"
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Shopping bag"
            onClick={() => setCartOpen?.(true)}
            style={{
              position: "relative",
              border: "none",
              background: "transparent",
              color: "inherit",
              padding: "4px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            <span
              style={{
                position: "absolute",
                top: "-3px",
                right: "-6px",
                minWidth: "15px",
                height: "15px",
                borderRadius: "999px",
                background: "#dc2626",
                color: "#ffffff",
                fontSize: "9.5px",
                fontWeight: 700,
                lineHeight: "15px",
                textAlign: "center",
                padding: "0 3px"
              }}
            >
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* Clean Expandable Search Bar */}
      {searchOpen && (
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #ecebe6",
            padding: isMobile ? "10px 16px" : "12px 40px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <Search size={16} strokeWidth={1.8} />
          <input
            type="search"
            autoFocus
            placeholder="Search sneakers, slides, loafers..."
            value={search}
            onChange={(e) => setSearch?.(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#111111"
            }}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch?.("")}
              style={{
                border: "none",
                background: "transparent",
                color: "#555555",
                cursor: "pointer",
                padding: "4px"
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {/* Slide-Out Mobile Navigation Drawer */}
      {menuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMenuOpen?.(false)}
          role="presentation"
        >
          <aside
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile menu"
          >
            <div className="mobile-drawer-head">
              <strong style={{ letterSpacing: "2.5px", fontSize: "16px" }}>
                {storeSettings?.storeName || "CALZARE"}®
              </strong>
              <button
                type="button"
                onClick={() => setMenuOpen?.(false)}
                aria-label="Close menu"
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "6px",
                  cursor: "pointer"
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              {navItems.map((item, idx) => (
                <a
                  key={`mob-${item.label}-${idx}`}
                  href={item.url || "#"}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {toTitleCase(item.label)}
                </a>
              ))}
            </div>

            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="primary-cta-btn"
                onClick={() => {
                  setMenuOpen?.(false);
                  openAccountModal?.();
                }}
              >
                {currentUser ? `Account (${currentUser.name})` : "Sign In / Register"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}