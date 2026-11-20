import { Menu, Search, ShoppingBag, User } from "lucide-react";

const VALID_COLLECTIONS = ["men", "women", "unisex", "kids"];

function normalizeSlug(value) {
  const raw = String(value || "").trim().toLowerCase();
  const withoutHash = raw.replace(/^#/, "");
  const pathPart = withoutHash.startsWith("http")
    ? new URL(withoutHash).pathname
    : withoutHash;
  const clean = pathPart.replace(/^\/+|\/+$/g, "").split("/").pop() || "";
  if (clean === "kid") return "kids";
  if (clean === "our-story" || clean === "our_story" || clean === "about") return "story";
  if (clean === "track" || clean === "track-order" || clean === "track_order")
    return "track-order";
  return clean;
}

export default function Header({
  homepage = {},
  storeSettings = {},
  navItems = [],
  collection = "all",
  storyPageOpen = false,
  trackPageOpen = false,
  policyPageKey = null,
  productPageId = null,
  menuOpen = false,
  setMenuOpen,
  search = "",
  setSearch,
  cartCount = 0,
  setCartOpen,
  currentUser = null,
  openAccountModal,
  navigateCollection,
  openTrackOrderPage
}) {
  return (
    <header
      className="header"
      style={{
        background: homepage.navbar?.bgColor || undefined,
        color: homepage.navbar?.textColor || undefined
      }}
    >
      <a
        className="wordmark"
        href="#home"
        style={{
          fontSize: homepage.navbar?.logoSizePx
            ? `${homepage.navbar.logoSizePx}px`
            : undefined
        }}
        onClick={(e) => {
          e.preventDefault();
          navigateCollection?.("home");
        }}
      >
        {(storeSettings.storeName || "CALZARE").toUpperCase()}
        <span>®</span>
      </a>

      <nav className={`header-links ${menuOpen ? "open" : ""}`}>
        {navItems.map((nav) => {
          const slug = normalizeSlug(nav.url || nav.label);
          const isHome = slug === "home";
          const isCollection = VALID_COLLECTIONS.includes(slug);
          const isTrack = slug === "track-order";
          const isStory =
            slug === "story" ||
            String(nav.label || "").toLowerCase().includes("story");

          const isActive = isTrack
            ? trackPageOpen
            : isStory
            ? storyPageOpen
            : isHome
            ? !storyPageOpen &&
              !trackPageOpen &&
              !policyPageKey &&
              !productPageId &&
              collection === "all"
            : !storyPageOpen &&
              !trackPageOpen &&
              !policyPageKey &&
              !productPageId &&
              collection === slug;

          return (
            <a
              key={`${nav.label}-${nav.url}`}
              href={nav.url || `#${slug}`}
              className={isActive ? "active-nav" : ""}
              onClick={(e) => {
                e.preventDefault();
                if (isHome) {
                  navigateCollection?.("home");
                } else if (isCollection) {
                  navigateCollection?.(slug);
                } else if (isStory) {
                  navigateCollection?.("story");
                } else if (isTrack) {
                  openTrackOrderPage?.();
                } else {
                  setMenuOpen?.(false);
                }
              }}
            >
              {String(nav.label || "").toUpperCase()}
            </a>
          );
        })}
      </nav>

      <div className="header-actions">
        <label className="search-box">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch?.(e.target.value)}
            placeholder="Search"
          />
        </label>

        <button
          type="button"
          className="icon-button"
          onClick={() => setCartOpen?.(true)}
          aria-label="Open shopping bag"
        >
          <ShoppingBag size={19} />
          <span className="count">{cartCount}</span>
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={openAccountModal}
          aria-label="Account sign in"
          title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In"}
        >
          <User size={18} />
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "1px",
              fontWeight: 600
            }}
          >
            {currentUser
              ? currentUser.name.split(" ")[0].toUpperCase()
              : "SIGN IN"}
          </span>
        </button>

        <button
          type="button"
          className="icon-button mobile-menu"
          onClick={() => setMenuOpen?.(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}