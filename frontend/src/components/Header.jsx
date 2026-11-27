import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

function toTitleCase(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default function Header({
  homepage = {},
  storeSettings = {},
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
  onOpenAuthModal,
  navigateCollection,
  openTrackOrderPage
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
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
  const headerCfg = storeSettings?.header || homepage?.header || {};

  const storeName =
    storeSettings?.storeName ||
    homepage?.storeName ||
    headerCfg.brandName ||
    "AL-ZEHRA SILK";

  const accentColor =
    storeSettings?.accentColor ||
    homepage?.accentColor ||
    headerCfg.badgeColor ||
    "#7A1C24";

  const searchPlaceholder =
    headerCfg.searchPlaceholder ||
    homepage?.searchPlaceholder ||
    "Search Banarasi, Kanjivaram, Soft Silk, Kalamkari...";

  const loginLabel =
    headerCfg.loginLabel || homepage?.auth?.loginLabel || "Login";

  const logoSrc =
    storeSettings?.logoUrl ||
    homepage?.logoUrl ||
    navCfg.logoUrl ||
    headerCfg.logoUrl ||
    "/logo.png";

  const logoHeight = isMobile
    ? Number(mobileCfg.logoHeightPx) || 38
    : Number(navCfg.logoHeightPx) || 46;

  const logoSize = isMobile
    ? Number(mobileCfg.logoSizePx) || 18
    : Number(navCfg.logoSizePx) || 22;

  useEffect(() => {
    setLogoError(false);
  }, [logoSrc]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleAccountTrigger() {
    if (!currentUser && typeof onOpenAuthModal === "function") {
      onOpenAuthModal("login");
      return;
    }
    openAccountModal?.();
  }

  function handleNavClick(e, item) {
    e.preventDefault();
    setMenuOpen?.(false);
    const raw = String(item.url || item.label || "").trim();
    const lower = raw.toLowerCase();
    if (lower.includes("login") || lower.includes("sign") || lower.includes("account")) {
      handleAccountTrigger();
    } else if (lower.includes("track")) {
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
          background: navCfg.bgColor || headerCfg.bgColor || "#ffffff",
          color: navCfg.textColor || headerCfg.textColor || "#231917",
          minHeight: isMobile
            ? `${Number(mobileCfg.navHeightPx) || 72}px`
            : `${Number(navCfg.heightPx) || 88}px`,
          padding: isMobile ? "0 16px" : "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
              className="header-menu-trigger"
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

          {!isMobile && (
            <label className="header-inline-search">
              <Search size={18} strokeWidth={1.7} />
              <input
                type="search"
                value={search || ""}
                onChange={(event) => setSearch?.(event.target.value)}
                placeholder="What are you looking for?"
                aria-label="Search products"
              />
            </label>
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
              display: "inline-flex",
              alignItems: "center",
              whiteSpace: "nowrap"
            }}
          >
            {!logoError && logoSrc ? (
              <img
                src={logoSrc}
                alt={storeName}
                onError={() => setLogoError(true)}
                style={{
                  height: `${logoHeight}px`,
                  width: "auto",
                  maxWidth: "170px",
                  borderRadius: "6px",
                  objectFit: "contain",
                  display: "block"
                }}
              />
            ) : (
              storeName
            )}
          </a>
        </div>

        {!isMobile && (
          <nav
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              flex: "1 1 auto",
              margin: "0 24px"
            }}
          >
            {navItems.map((item, idx) => {
              const rawLabel = String(item.label || "").trim();
              const labelUpper = rawLabel.toUpperCase();
              const displayLabel = toTitleCase(rawLabel);
              const slugFromItem = String(item.url || rawLabel)
                .replace(/^#/, "")
                .trim()
                .toLowerCase();
              const isActive =
                (labelUpper === "HOME" &&
                  collection === "all" &&
                  !storyPageOpen &&
                  !trackPageOpen) ||
                ((labelUpper === "OUR STORY" ||
                  labelUpper === "OUR CRAFT" ||
                  slugFromItem === "story") &&
                  storyPageOpen) ||
                (labelUpper === "TRACK ORDER" && trackPageOpen) ||
                slugFromItem === String(collection || "").toLowerCase();

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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "12px" : "14px"
          }}
        >
          <button
            type="button"
            className="header-search-toggle"
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
            className="header-account-trigger"
            aria-label={currentUser ? "Account" : loginLabel}
            onClick={handleAccountTrigger}
            style={{
              border: !currentUser && !isMobile ? "1px solid currentColor" : "none",
              borderRadius: "999px",
              background: "transparent",
              color: "inherit",
              padding: !currentUser && !isMobile ? "5px 12px" : "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
            title={currentUser ? currentUser.name : loginLabel}
          >
            <User size={17} strokeWidth={1.8} />
            {!isMobile && (
              <span>{currentUser ? currentUser.name || "Account" : loginLabel}</span>
            )}
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
                  background: accentColor,
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
                background: accentColor,
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
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch?.(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#231917"
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
              {!logoError && logoSrc ? (
                <img
                  src={logoSrc}
                  alt={storeName}
                  onError={() => setLogoError(true)}
                  style={{
                    height: "34px",
                    width: "auto",
                    borderRadius: "6px",
                    objectFit: "contain"
                  }}
                />
              ) : (
                <strong style={{ letterSpacing: "2.5px", fontSize: "16px" }}>
                  {storeName}
                </strong>
              )}
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
                style={{ background: accentColor }}
                onClick={() => {
                  setMenuOpen?.(false);
                  handleAccountTrigger();
                }}
              >
                {currentUser
                  ? `Account (${currentUser.name || "Member"})`
                  : `${loginLabel} / Register`}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
