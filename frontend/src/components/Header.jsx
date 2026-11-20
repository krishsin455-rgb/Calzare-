import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

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
  setCartOpen,
  currentUser,
  openAccountModal,
  navigateCollection,
  openTrackOrderPage
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const mobileCfg = homepage?.mobileUI || {};
  const navCfg = homepage?.navbar || {};
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const logoSize = isMobile
    ? Number(mobileCfg.logoSizePx) || 17
    : Number(navCfg.logoSizePx) || 22;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(e, item) {
    e.preventDefault();
    setMenuOpen(false);
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
          background: navCfg.bgColor || "var(--paper)",
          color: navCfg.textColor || "var(--ink)",
          height: isMobile ? `${Number(mobileCfg.navHeightPx) || 58}px` : undefined
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <button
            type="button"
            className="icon-button mobile-menu"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={19} />
          </button>

          <a
            href="#home"
            className="wordmark"
            onClick={(e) => {
              e.preventDefault();
              navigateCollection?.("home");
            }}
            style={{
              fontSize: `${logoSize}px`,
              letterSpacing: isMobile
                ? `${mobileCfg.logoTracking ?? 2.4}px`
                : "3.5px"
            }}
          >
            {storeSettings?.storeName || "CALZARE"}
            <sup style={{ fontSize: "0.5em", marginLeft: "1px" }}>®</sup>
          </a>
        </div>

        {/* Desktop Links */}
        <nav className="header-links" aria-label="Main navigation">
          {navItems.map((item, idx) => {
            const label = String(item.label || "").toUpperCase();
            const isActive =
              (label === "HOME" &&
                collection === "all" &&
                !storyPageOpen &&
                !trackPageOpen) ||
              (label === "OUR STORY" && storyPageOpen) ||
              (label === "TRACK ORDER" && trackPageOpen) ||
              label.toLowerCase() === String(collection || "").toLowerCase();

            return (
              <a
                key={`${label}-${idx}`}
                href={item.url || "#"}
                onClick={(e) => handleNavClick(e, item)}
                style={{ fontWeight: isActive ? 700 : 400 }}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          {/* Desktop Search Box */}
          <div className="search-box desktop-search-only">
            <Search size={14} />
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            type="button"
            className="icon-button mobile-only-btn"
            aria-label="Search"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
          >
            <Search size={17} />
          </button>

          <button
            type="button"
            className="icon-button"
            aria-label="Shopping bag"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={17} />
            <span className="count">{cartCount}</span>
          </button>

          <button
            type="button"
            className="icon-button"
            aria-label="Account"
            onClick={openAccountModal}
          >
            <User size={17} />
            <span className="desktop-sign-label">
              {currentUser ? currentUser.name.split(" ")[0].toUpperCase() : "SIGN"}
            </span>
          </button>
        </div>
      </header>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="mobile-search-dropdown">
          <Search size={15} />
          <input
            type="search"
            autoFocus
            placeholder="Search sneakers, slides, loafers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{ border: 0, background: "none", cursor: "pointer" }}
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
          onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  border: 0,
                  background: "none",
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
                  {String(item.label || "").toUpperCase()}
                </a>
              ))}
            </div>

            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="primary-cta-btn"
                onClick={() => {
                  setMenuOpen(false);
                  openAccountModal?.();
                }}
              >
                {currentUser ? `ACCOUNT (${currentUser.name})` : "SIGN IN / REGISTER"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}