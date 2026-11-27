import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Gift,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X
} from "lucide-react";

const COUPONS_STORAGE_KEY = "alzehrasilk_coupons_v1";
const HOMEPAGE_STORAGE_KEY = "alzehrasilk_homepage_v1";

const DEFAULT_REWARD_CFG = {
  b2g1UnlockedTemplate: "1 SAREE FREE unlocked ({freeItemName})!",
  emptyHeadline: "Buy 2 sarees for 10% OFF • Buy 3 sarees & get 1 SAREE FREE!",
  onePairHeadline: "Add 1 more saree to unlock 10% OFF on your order!",
  twoPairHeadline: "10% OFF unlocked! Add 1 more saree to get 1 SAREE FREE!",
  b2g1SavingsLabel: "Buy 3 Get 1 FREE Savings",
  b2g10SavingsLabel: "Buy 2 Get 10% OFF",
  milestone1Label: "FREE PREPAID SHIP",
  milestone2Label: "2 SAREES: 10% OFF",
  milestone3Label: "3 SAREES: 1 FREE"
};

function readCartRewardBannerCfg(backendCfg) {
  if (backendCfg && typeof backendCfg === "object") {
    return { ...DEFAULT_REWARD_CFG, ...backendCfg };
  }
  try {
    const saved = JSON.parse(
      localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null"
    );
    if (saved?.cartRewardBanner && typeof saved.cartRewardBanner === "object") {
      return { ...DEFAULT_REWARD_CFG, ...saved.cartRewardBanner };
    }
  } catch (_) {}
  return DEFAULT_REWARD_CFG;
}

function safeDrawerImg(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
  const clean = url.trim();
  if (clean.startsWith("file://") || clean.startsWith("/Users/")) {
    return "";
  }
  return clean;
}

export function readStoredCoupons(backendCoupons) {
  if (Array.isArray(backendCoupons)) return backendCoupons;
  try {
    const raw = JSON.parse(localStorage.getItem(COUPONS_STORAGE_KEY) || "null");
    return Array.isArray(raw) ? raw : [];
  } catch (_) {
    return [];
  }
}

export function readPromoBoxConfig(backendPromoCfg) {
  if (backendPromoCfg && typeof backendPromoCfg === "object") {
    return {
      enabled: backendPromoCfg.enabled !== false,
      position:
        backendPromoCfg.position === "inside-scroll" ? "inside-scroll" : "top",
      title: backendPromoCfg.title || "Have a promo code?",
      placeholder: backendPromoCfg.placeholder || "Enter coupon code",
      applyLabel: backendPromoCfg.applyLabel || "APPLY"
    };
  }
  try {
    const hp = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null");
    if (hp?.cartPromoBox && typeof hp.cartPromoBox === "object") {
      return {
        enabled: hp.cartPromoBox.enabled !== false,
        position:
          hp.cartPromoBox.position === "inside-scroll" ? "inside-scroll" : "top",
        title: hp.cartPromoBox.title || "Have a promo code?",
        placeholder: hp.cartPromoBox.placeholder || "Enter coupon code",
        applyLabel: hp.cartPromoBox.applyLabel || "APPLY"
      };
    }
  } catch (_) {}
  return {
    enabled: true,
    position: "top",
    title: "Have a promo code?",
    placeholder: "Enter coupon code",
    applyLabel: "APPLY"
  };
}

export function isCouponActive(cp) {
  if (!cp) return false;
  if (cp.active === false || cp.isActive === false) return false;
  const st = String(cp.status || "").toLowerCase();
  if (st === "paused" || st === "inactive") return false;
  return true;
}

export function computeCouponDiscount(cp, postBundleSubtotal) {
  if (!cp || !isCouponActive(cp)) return 0;
  const amt = Math.max(0, Number(postBundleSubtotal) || 0);
  const minVal = Math.max(0, Number(cp.minOrderValue) || 0);
  if (minVal > 0 && amt < minVal) return 0;

  const isPercent = cp.type === "percent" || cp.discountType === "percentage";
  const rawVal = Number(cp.value ?? cp.discountValue) || 0;
  let disc = isPercent ? Math.round((amt * rawVal) / 100) : rawVal;
  const cap = Number(cp.maxDiscountCap) || 0;
  if (isPercent && cap > 0) {
    disc = Math.min(disc, cap);
  }
  return Math.max(0, Math.min(disc, amt));
}

export function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  cartCount = 0,
  cartSubtotal = 0,
  mrpSubtotal = 0,
  bundleTier = { mode: "none", discountAmount: 0, freeItemName: "" },
  couponInput = "",
  setCouponInput,
  appliedCoupon = null,
  couponDiscount = 0,
  couponError = "",
  onApplyCoupon,
  onRemoveCoupon,
  shippingFee = 0,
  cartFinalTotal = 0,
  showConfetti = false,
  upsellProducts = [],
  onChangeQuantity,
  onRemoveItem,
  onAddUpsell,
  onCheckout,
  money,
  promoBoxSetting,
  rewardBannerSetting,
  storeSettings = {},
  homepage = {}
}) {
  const [upsellSizes, setUpsellSizes] = useState({});
  const backendCoupons = storeSettings?.coupons;
  const backendPromo =
    promoBoxSetting || storeSettings?.cartPromoBox || homepage?.cartPromoBox;
  const backendReward =
    rewardBannerSetting ||
    storeSettings?.cartRewardBanner ||
    homepage?.cartRewardBanner;

  const [localCoupons, setLocalCoupons] = useState(() =>
    readStoredCoupons(backendCoupons)
  );
  const [localPromoCfg, setLocalPromoCfg] = useState(() =>
    readPromoBoxConfig(backendPromo)
  );
  const [localRewardCfg, setLocalRewardCfg] = useState(() =>
    readCartRewardBannerCfg(backendReward)
  );
  const [localInput, setLocalInput] = useState("");
  const [localApplied, setLocalApplied] = useState(null);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setLocalCoupons(readStoredCoupons(backendCoupons));
  }, [backendCoupons]);

  useEffect(() => {
    setLocalPromoCfg(readPromoBoxConfig(backendPromo));
  }, [backendPromo]);

  useEffect(() => {
    setLocalRewardCfg(readCartRewardBannerCfg(backendReward));
  }, [backendReward]);

  useEffect(() => {
    const sync = () => {
      if (!Array.isArray(backendCoupons)) {
        setLocalCoupons(readStoredCoupons());
      }
      if (!backendPromo) {
        setLocalPromoCfg(readPromoBoxConfig());
      }
      if (!backendReward) {
        setLocalRewardCfg(readCartRewardBannerCfg());
      }
    };
    window.addEventListener("alzehrasilk_store_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("alzehrasilk_store_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [backendCoupons, backendPromo, backendReward]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const formatMoney =
    typeof money === "function"
      ? money
      : (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

  const cartCopy = storeSettings?.cartCopy || homepage?.cartCopy || {};
  const accentColor =
    storeSettings?.accentColor || homepage?.accentColor || "#7A1C24";

  const activePromoCfg = localPromoCfg;
  const showPromoBox = activePromoCfg?.enabled !== false;
  const promoAtTop = (activePromoCfg?.position || "top") === "top";

  const postBundleSubtotal = Math.max(
    0,
    (Number(cartSubtotal) || 0) - (Number(bundleTier?.discountAmount) || 0)
  );

  const activeInput = setCouponInput ? couponInput : localInput;
  const handleInputChange = setCouponInput || setLocalInput;
  const activeCoupon = onApplyCoupon ? appliedCoupon : localApplied;
  const activeError = onApplyCoupon ? couponError : localError;

  const computedLocalDiscount = useMemo(() => {
    if (onApplyCoupon || !localApplied) return 0;
    const fresh =
      localCoupons.find(
        (c) =>
          String(c?.code || "").trim().toUpperCase() ===
          String(localApplied.code || "").trim().toUpperCase()
      ) || localApplied;
    return computeCouponDiscount(fresh, postBundleSubtotal);
  }, [onApplyCoupon, localApplied, localCoupons, postBundleSubtotal]);

  const activeCouponDiscount = onApplyCoupon ? couponDiscount : computedLocalDiscount;
  const computedFinalTotal = Math.max(
    0,
    postBundleSubtotal - activeCouponDiscount + (Number(shippingFee) || 0)
  );
  const displayFinalTotal = onApplyCoupon ? cartFinalTotal : computedFinalTotal;

  function triggerApply() {
    if (onApplyCoupon) return onApplyCoupon();
    const code = String(localInput || "").trim().toUpperCase();
    if (!code) {
      setLocalError(cartCopy.emptyCouponError || "Please enter a coupon code.");
      return;
    }
    const found = localCoupons.find(
      (c) => String(c?.code || "").trim().toUpperCase() === code
    );
    if (!found) {
      setLocalApplied(null);
      setLocalError(`Coupon "${code}" not found.`);
      return;
    }
    if (!isCouponActive(found)) {
      setLocalApplied(null);
      setLocalError(`Coupon "${code}" is paused or inactive.`);
      return;
    }
    const minVal = Number(found.minOrderValue) || 0;
    if (minVal > 0 && postBundleSubtotal < minVal) {
      setLocalApplied(null);
      setLocalError(`Minimum order of ${formatMoney(minVal)} required.`);
      return;
    }
    setLocalError("");
    setLocalApplied(found);
  }

  function triggerRemove() {
    if (onRemoveCoupon) return onRemoveCoupon();
    setLocalApplied(null);
    setLocalError("");
  }

  const activeRewardCfg = localRewardCfg;

  const rewardProgress = useMemo(() => {
    if (cartCount === 0) {
      return { percent: 10, headline: activeRewardCfg.emptyHeadline };
    }
    if (cartCount === 1) {
      return { percent: 48, headline: activeRewardCfg.onePairHeadline };
    }
    if (cartCount === 2) {
      return { percent: 78, headline: activeRewardCfg.twoPairHeadline };
    }
    const rawTemplate =
      activeRewardCfg.b2g1UnlockedTemplate !== undefined &&
      activeRewardCfg.b2g1UnlockedTemplate !== ""
        ? activeRewardCfg.b2g1UnlockedTemplate
        : DEFAULT_REWARD_CFG.b2g1UnlockedTemplate;

    return {
      percent: 100,
      headline: rawTemplate.replace("{freeItemName}", bundleTier.freeItemName || "")
    };
  }, [cartCount, bundleTier.freeItemName, activeRewardCfg]);

  const mrpSavings = Math.max(
    0,
    (Number(mrpSubtotal) || 0) - (Number(cartSubtotal) || 0)
  );
  const totalSavings =
    mrpSavings +
    (Number(bundleTier?.discountAmount) || 0) +
    (Number(activeCouponDiscount) || 0);

  const promoBoxElement = showPromoBox && (
    <div
      style={{
        padding: "12px",
        borderRadius: "12px",
        border: "1px dashed #D6C7B8",
        background: "#FAF7F2"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "11.5px",
          fontWeight: 700,
          marginBottom: "8px",
          color: "#231917"
        }}
      >
        <Tag size={13} /> {activePromoCfg.title}
      </div>

      {activeCoupon ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#DCFCE7",
            color: "#166534",
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <Check size={14} /> {activeCoupon.code} applied (−
            {formatMoney(activeCouponDiscount)})
          </span>
          <button
            type="button"
            onClick={triggerRemove}
            style={{
              border: 0,
              background: "transparent",
              color: "#166534",
              textDecoration: "underline",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {cartCopy.removeCouponLabel || "Remove"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            placeholder={activePromoCfg.placeholder}
            value={activeInput}
            onChange={(e) => handleInputChange?.(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #D6C7B8",
              fontSize: "12px",
              background: "#FFFFFF"
            }}
          />
          <button
            type="button"
            onClick={triggerApply}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: 0,
              background: accentColor,
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer"
            }}
          >
            {activePromoCfg.applyLabel}
          </button>
        </div>
      )}

      {activeError && (
        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#DC2626" }}>
          {activeError}
        </p>
      )}
    </div>
  );

  return (
    <div
      aria-hidden={!isOpen}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 110,
        visibility: isOpen ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none"
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(35, 25, 23, 0.52)",
          backdropFilter: "blur(3px)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease"
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={cartCopy.drawerTitle || "Shopping Bag"}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(440px, 100vw)",
          background: "#FFFFFF",
          color: "#231917",
          boxShadow: "-16px 0 48px rgba(0, 0, 0, 0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.36s cubic-bezier(0.22, 1, 0.36, 1)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #E8DFD5",
            background: "#FFFFFF",
            flexShrink: 0
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase"
              }}
            >
              {cartCopy.drawerTitle || "Shopping Bag"} ({cartCount})
            </h2>
            {totalSavings > 0 && (
              <span
                style={{
                  background: "#DCFCE7",
                  color: "#166534",
                  fontSize: "10.5px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "999px"
                }}
              >
                Saving {formatMoney(totalSavings)}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label="Close bag"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "999px",
              border: "1px solid #E8DFD5",
              background: "#FAF7F2",
              color: "#231917",
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {showConfetti && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
              zIndex: 25
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: `${(i * 5) % 96}%`,
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: [accentColor, "#C9A66B", "#10B981", "#F59E0B"][i % 4]
                }}
              />
            ))}
          </div>
        )}

        <div
          style={{
            padding: "12px 20px",
            background: "#FAF7F2",
            borderBottom: "1px solid #E8DFD5",
            flexShrink: 0
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#231917",
              textAlign: "center"
            }}
          >
            {rewardProgress.headline}
          </p>

          <div
            style={{
              height: "6px",
              borderRadius: "999px",
              background: "#E8DFD5",
              overflow: "hidden",
              marginBottom: "8px"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${rewardProgress.percent}%`,
                background: `linear-gradient(90deg, ${accentColor} 0%, #16A34A 100%)`,
                borderRadius: "999px",
                transition: "width 0.35s ease"
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: "#6B5E57"
            }}
          >
            <span style={{ color: cartCount >= 1 ? "#15803D" : "#6B5E57" }}>
              {cartCount >= 1 ? "✓ " : ""}
              {activeRewardCfg.milestone1Label}
            </span>
            <span style={{ color: cartCount >= 2 ? "#15803D" : "#6B5E57" }}>
              {cartCount >= 2 ? "✓ " : ""}
              {activeRewardCfg.milestone2Label}
            </span>
            <span style={{ color: cartCount >= 3 ? "#15803D" : "#6B5E57" }}>
              {cartCount >= 3 ? "✓ " : ""}
              {activeRewardCfg.milestone3Label}
            </span>
          </div>
        </div>

        {cart.length > 0 && promoAtTop && promoBoxElement && (
          <div
            style={{
              padding: "10px 20px",
              borderBottom: "1px solid #E8DFD5",
              background: "#FFFFFF",
              flexShrink: 0
            }}
          >
            {promoBoxElement}
          </div>
        )}

        {cart.length > 0 ? (
          <>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              {cart.map((item) => {
                const isFreeGiftItem =
                  bundleTier.mode === "b2g1" &&
                  bundleTier.freeCartKey === item.cartKey;

                return (
                  <div
                    key={item.cartKey}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "12px",
                      border: isFreeGiftItem
                        ? "1.5px solid #86EFAC"
                        : "1px solid #E8DFD5",
                      background: isFreeGiftItem ? "#F0FDF4" : "#FFFFFF"
                    }}
                  >
                    <img
                      src={safeDrawerImg(item.image) || undefined}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                      style={{
                        width: "76px",
                        height: "92px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        objectPosition: "50% 20%",
                        background: "#FAF7F2",
                        flexShrink: 0
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "8px"
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 700 }}>
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() =>
                            onRemoveItem
                              ? onRemoveItem(item.cartKey)
                              : onChangeQuantity?.(item.cartKey, -item.quantity)
                          }
                          style={{
                            border: 0,
                            background: "transparent",
                            color: "#9CA3AF",
                            cursor: "pointer",
                            padding: "2px"
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <p
                        style={{
                          margin: "3px 0 6px",
                          fontSize: "11px",
                          color: "#6B5E57"
                        }}
                      >
                        Size: <strong>{item.size || "Free Size"}</strong>
                        {item.color ? ` • ${item.color}` : ""}
                      </p>

                      {isFreeGiftItem && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            background: "#16A34A",
                            color: "#FFFFFF",
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            marginBottom: "6px"
                          }}
                        >
                          <Gift size={11} />{" "}
                          {cartCopy.freeBadgeLabel || "1 SAREE FREE APPLIED"}
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          marginTop: "4px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                          <strong style={{ fontSize: "14px" }}>
                            {formatMoney(item.price)}
                          </strong>
                          {Number(item.oldPrice) > Number(item.price) && (
                            <span
                              style={{
                                fontSize: "11.5px",
                                color: "#9CA3AF",
                                textDecoration: "line-through"
                              }}
                            >
                              {formatMoney(item.oldPrice)}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            border: "1px solid #D6C7B8",
                            borderRadius: "999px",
                            overflow: "hidden",
                            background: "#FFFFFF"
                          }}
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => onChangeQuantity?.(item.cartKey, -1)}
                            style={{
                              width: "26px",
                              height: "24px",
                              border: 0,
                              background: "transparent",
                              cursor: "pointer",
                              fontWeight: 700
                            }}
                          >
                            −
                          </button>
                          <span
                            style={{
                              minWidth: "22px",
                              textAlign: "center",
                              fontSize: "12px",
                              fontWeight: 700
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => onChangeQuantity?.(item.cartKey, 1)}
                            style={{
                              width: "26px",
                              height: "24px",
                              border: 0,
                              background: "transparent",
                              cursor: "pointer",
                              fontWeight: 700
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!promoAtTop && promoBoxElement}

              {upsellProducts.length > 0 && (
                <div style={{ marginTop: "4px" }}>
                  <span
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#6B5E57"
                    }}
                  >
                    {cartCopy.upsellHeading || "Style It With"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      overflowX: "auto",
                      paddingBottom: "4px"
                    }}
                  >
                    {upsellProducts.map((u) => {
                      const sizes = u.sizes?.length ? u.sizes : ["Free Size"];
                      const chosenSz = upsellSizes[u.id] || sizes[0];
                      return (
                        <div
                          key={u.id}
                          style={{
                            flex: "0 0 152px",
                            border: "1px solid #E8DFD5",
                            borderRadius: "10px",
                            padding: "8px",
                            background: "#FFFFFF",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px"
                          }}
                        >
                          <img
                            src={safeDrawerImg(u.image) || undefined}
                            alt={u.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                            }}
                            style={{
                              width: "100%",
                              height: "96px",
                              objectFit: "cover",
                              objectPosition: "50% 20%",
                              borderRadius: "7px",
                              background: "#FAF7F2"
                            }}
                          />
                          <strong
                            style={{
                              fontSize: "11.5px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {u.name}
                          </strong>
                          <span style={{ fontSize: "12px", fontWeight: 700 }}>
                            {formatMoney(u.price)}
                          </span>
                          <div style={{ display: "flex", gap: "4px", marginTop: "auto" }}>
                            {sizes.length > 1 && (
                              <select
                                aria-label={`Select size for ${u.name}`}
                                value={chosenSz}
                                onChange={(e) =>
                                  setUpsellSizes((prev) => ({
                                    ...prev,
                                    [u.id]: e.target.value
                                  }))
                                }
                                style={{
                                  width: "64px",
                                  padding: "5px 4px",
                                  borderRadius: "6px",
                                  border: "1px solid #D6C7B8",
                                  fontSize: "10px",
                                  fontWeight: 600,
                                  background: "#FAF7F2"
                                }}
                              >
                                {sizes.map((sz) => (
                                  <option key={sz} value={sz}>
                                    {sz}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              type="button"
                              onClick={() => onAddUpsell?.(u, chosenSz, 1, true)}
                              style={{
                                flex: 1,
                                padding: "6px 8px",
                                borderRadius: "6px",
                                border: 0,
                                background: accentColor,
                                color: "#FFFFFF",
                                fontSize: "10px",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              {cartCopy.upsellAddLabel || "+ ADD"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid #E8DFD5",
                background: "#FAF7F2",
                padding: "14px 20px 18px",
                flexShrink: 0
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10.5px",
                  color: "#6B5E57",
                  marginBottom: "10px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #E8DFD5"
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Truck size={12} /> {cartCopy.trustShipping || "Free Ship ₹999+"}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <RefreshCw size={12} /> {cartCopy.trustReturns || "48-Hr Returns"}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={12} /> {cartCopy.trustCod || "Partial COD"}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "5px",
                  fontSize: "12.5px",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6B5E57"
                  }}
                >
                  <span>Subtotal</span>
                  <span>{formatMoney(cartSubtotal)}</span>
                </div>

                {Number(bundleTier?.discountAmount) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#15803D",
                      fontWeight: 600
                    }}
                  >
                    <span>
                      {bundleTier.mode === "b2g1"
                        ? activeRewardCfg.b2g1SavingsLabel
                        : activeRewardCfg.b2g10SavingsLabel}
                    </span>
                    <span>−{formatMoney(bundleTier.discountAmount)}</span>
                  </div>
                )}

                {activeCouponDiscount > 0 && activeCoupon && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#15803D",
                      fontWeight: 600
                    }}
                  >
                    <span>Coupon ({activeCoupon.code})</span>
                    <span>−{formatMoney(activeCouponDiscount)}</span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6B5E57"
                  }}
                >
                  <span>Shipping</span>
                  <span
                    style={{
                      color: shippingFee === 0 ? "#15803D" : "#231917",
                      fontWeight: 600
                    }}
                  >
                    {shippingFee === 0 ? "FREE" : formatMoney(shippingFee)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "8px",
                    marginTop: "4px",
                    borderTop: "1px solid #E8DFD5",
                    fontSize: "15px"
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {cartCopy.totalLabel || "Estimated Total"}
                  </span>
                  <strong style={{ fontSize: "17px" }}>{formatMoney(displayFinalTotal)}</strong>
                </div>
              </div>

              {totalSavings > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    background: "#DCFCE7",
                    color: "#166534",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    padding: "6px 10px",
                    borderRadius: "8px",
                    marginBottom: "10px"
                  }}
                >
                  <Sparkles size={13} /> You are saving {formatMoney(totalSavings)}{" "}
                  on this order!
                </div>
              )}

              <button
                type="button"
                onClick={onCheckout}
                style={{
                  width: "100%",
                  padding: "13px 18px",
                  borderRadius: "999px",
                  border: 0,
                  background: accentColor,
                  color: "#FFFFFF",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer"
                }}
              >
                {cartCopy.checkoutCta || "PROCEED TO CHECKOUT"} •{" "}
                {formatMoney(displayFinalTotal)} <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 24px",
              textAlign: "center",
              gap: "12px"
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 600,
                color: "#231917"
              }}
            >
              {cartCopy.emptyTitle || "Your shopping bag is empty."}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12.5px",
                color: "#6B5E57",
                maxWidth: "260px"
              }}
            >
              {cartCopy.emptySubtitle ||
                "Add 2 sarees to unlock 10% OFF or 3 sarees to get 1 SAREE FREE."}
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop: "8px",
                padding: "11px 24px",
                borderRadius: "999px",
                border: 0,
                background: accentColor,
                color: "#FFFFFF",
                fontSize: "11.5px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer"
              }}
            >
              {cartCopy.continueShoppingLabel || "CONTINUE SHOPPING"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
