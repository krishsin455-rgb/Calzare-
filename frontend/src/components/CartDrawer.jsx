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

const COUPONS_STORAGE_KEY = "calzare_coupons_v1";
const HOMEPAGE_STORAGE_KEY = "calzare_homepage_v1";

function readCartRewardBannerCfg() {
  try {
    const saved = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null");
    if (saved?.cartRewardBanner && typeof saved.cartRewardBanner === "object") {
      return {
        b2g1UnlockedTemplate:
          saved.cartRewardBanner.b2g1UnlockedTemplate ||
          "1 PAIR FREE unlocked ({freeItemName})!",
        emptyHeadline:
          saved.cartRewardBanner.emptyHeadline ||
          "Buy 2 pairs for 10% OFF • Buy 3 pairs & get 1 PAIR FREE!",
        onePairHeadline:
          saved.cartRewardBanner.onePairHeadline ||
          "Add 1 more pair to unlock 10% OFF on your order!",
        twoPairHeadline:
          saved.cartRewardBanner.twoPairHeadline ||
          "10% OFF unlocked! Add 1 more pair to get 1 PAIR FREE!"
      };
    }
  } catch (_) {}

  return {
    b2g1UnlockedTemplate: "1 PAIR FREE unlocked ({freeItemName})!",
    emptyHeadline: "Buy 2 pairs for 10% OFF • Buy 3 pairs & get 1 PAIR FREE!",
    onePairHeadline: "Add 1 more pair to unlock 10% OFF on your order!",
    twoPairHeadline: "10% OFF unlocked! Add 1 more pair to get 1 PAIR FREE!"
  };
}

function safeDrawerImg(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";
  const clean = url.trim();
  if (clean.startsWith("file://") || clean.startsWith("/Users/")) {
    return "";
  }
  return clean;
}

export function readStoredCoupons() {
  try {
    const raw = JSON.parse(localStorage.getItem(COUPONS_STORAGE_KEY) || "null");
    return Array.isArray(raw) ? raw : [];
  } catch (_) {
    return [];
  }
}

export function readPromoBoxConfig() {
  try {
    const hp = JSON.parse(localStorage.getItem(HOMEPAGE_STORAGE_KEY) || "null");
    if (hp?.cartPromoBox && typeof hp.cartPromoBox === "object") {
      return {
        enabled: hp.cartPromoBox.enabled !== false,
        position:
          hp.cartPromoBox.position === "inside-scroll" ? "inside-scroll" : "top"
      };
    }
  } catch (_) {}
  return { enabled: true, position: "top" };
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
  rewardBannerSetting
}) {
  const [upsellSizes, setUpsellSizes] = useState({});
  const [localCoupons, setLocalCoupons] = useState(() => readStoredCoupons());
  const [localPromoCfg, setLocalPromoCfg] = useState(() => readPromoBoxConfig());
  const [localRewardCfg, setLocalRewardCfg] = useState(() =>
    readCartRewardBannerCfg()
  );
  const [localInput, setLocalInput] = useState("");
  const [localApplied, setLocalApplied] = useState(null);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const sync = () => {
      setLocalCoupons(readStoredCoupons());
      setLocalPromoCfg(readPromoBoxConfig());
      setLocalRewardCfg(readCartRewardBannerCfg());
    };
    window.addEventListener("calzare_store_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("calzare_store_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

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

  const activePromoCfg = promoBoxSetting || localPromoCfg;
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
      setLocalError("Please enter a coupon code.");
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

  const activeRewardCfg = {
    ...localRewardCfg,
    ...(rewardBannerSetting || {})
  };

  const rewardProgress = useMemo(() => {
    if (cartCount === 0) {
      return {
        percent: 10,
        headline:
          activeRewardCfg.emptyHeadline ||
          "Buy 2 pairs for 10% OFF • Buy 3 pairs & get 1 PAIR FREE!"
      };
    }
    if (cartCount === 1) {
      return {
        percent: 48,
        headline:
          activeRewardCfg.onePairHeadline ||
          "Add 1 more pair to unlock 10% OFF on your order!"
      };
    }
    if (cartCount === 2) {
      return {
        percent: 78,
        headline:
          activeRewardCfg.twoPairHeadline ||
          "10% OFF unlocked! Add 1 more pair to get 1 PAIR FREE!"
      };
    }
    const rawTemplate =
      activeRewardCfg.b2g1UnlockedTemplate !== undefined &&
      activeRewardCfg.b2g1UnlockedTemplate !== ""
        ? activeRewardCfg.b2g1UnlockedTemplate
        : "1 PAIR FREE unlocked ({freeItemName})!";

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
        border: "1px dashed #CBD5E1",
        background: "#F8FAFC"
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
          color: "#0F172A"
        }}
      >
        <Tag size={13} /> Have a promo code?
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
            Remove
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={activeInput}
            onChange={(e) =>
              handleInputChange?.(e.target.value.toUpperCase())
            }
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
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
              background: "#111827",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer"
            }}
          >
            APPLY
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
          background: "rgba(15, 23, 42, 0.52)",
          backdropFilter: "blur(3px)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease"
        }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(440px, 100vw)",
          background: "#FFFFFF",
          color: "#111827",
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
            borderBottom: "1px solid #E5E7EB",
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
              Shopping Cart ({cartCount})
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
            aria-label="Close cart"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "999px",
              border: "1px solid #E5E7EB",
              background: "#F9FAFB",
              color: "#111827",
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
                  background: ["#03226B", "#10B981", "#F59E0B", "#2563EB"][i % 4]
                }}
              />
            ))}
          </div>
        )}

        <div
          style={{
            padding: "12px 20px",
            background: "#F4F6FA",
            borderBottom: "1px solid #E5E7EB",
            flexShrink: 0
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#0F172A",
              textAlign: "center"
            }}
          >
            {rewardProgress.headline}
          </p>

          <div
            style={{
              height: "6px",
              borderRadius: "999px",
              background: "#DCE3F0",
              overflow: "hidden",
              marginBottom: "8px"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${rewardProgress.percent}%`,
                background: "linear-gradient(90deg, #03226B 0%, #16A34A 100%)",
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
              color: "#64748B"
            }}
          >
            <span style={{ color: cartCount >= 1 ? "#15803D" : "#64748B" }}>
              {cartCount >= 1 ? "✓ " : ""}FREE PREPAID SHIP
            </span>
            <span style={{ color: cartCount >= 2 ? "#15803D" : "#64748B" }}>
              {cartCount >= 2 ? "✓ " : ""}2 PAIRS: 10% OFF
            </span>
            <span style={{ color: cartCount >= 3 ? "#15803D" : "#64748B" }}>
              {cartCount >= 3 ? "✓ " : ""}3 PAIRS: 1 FREE
            </span>
          </div>
        </div>

        {cart.length > 0 && promoAtTop && promoBoxElement && (
          <div
            style={{
              padding: "10px 20px",
              borderBottom: "1px solid #E5E7EB",
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
                        : "1px solid #E5E7EB",
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
                        height: "76px",
                        borderRadius: "10px",
                        objectFit: "cover",
                        background: "#F5F5F5",
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

                      <p style={{ margin: "3px 0 6px", fontSize: "11px", color: "#6B7280" }}>
                        Size: <strong>{item.size}</strong>
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
                          <Gift size={11} /> 1 PAIR FREE APPLIED
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
                            border: "1px solid #D1D5DB",
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
                      color: "#334155"
                    }}
                  >
                    Pairs Well With
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
                      const sizes = u.sizes?.length
                        ? u.sizes
                        : ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];
                      const chosenSz = upsellSizes[u.id] || sizes[2] || sizes[0];
                      return (
                        <div
                          key={u.id}
                          style={{
                            flex: "0 0 152px",
                            border: "1px solid #E5E7EB",
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
                              height: "86px",
                              objectFit: "cover",
                              borderRadius: "7px",
                              background: "#F5F5F5"
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
                                border: "1px solid #D1D5DB",
                                fontSize: "10px",
                                fontWeight: 600,
                                background: "#F9FAFB"
                              }}
                            >
                              {sizes.map((sz) => (
                                <option key={sz} value={sz}>
                                  {sz}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => onAddUpsell?.(u, chosenSz, 1, true)}
                              style={{
                                flex: 1,
                                padding: "5px 8px",
                                borderRadius: "6px",
                                border: 0,
                                background: "#111827",
                                color: "#FFFFFF",
                                fontSize: "10px",
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              + ADD
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
                borderTop: "1px solid #E5E7EB",
                background: "#FAFAFA",
                padding: "14px 20px 18px",
                flexShrink: 0
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10.5px",
                  color: "#4B5563",
                  marginBottom: "10px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #E5E7EB"
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Truck size={12} /> Free Prepaid Ship
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <RefreshCw size={12} /> Easy Exchange
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={12} /> Partial COD
                </span>
              </div>

              <div style={{ display: "grid", gap: "5px", fontSize: "12.5px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#4B5563" }}>
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
                        ? "Buy 3 Get 1 FREE Savings"
                        : "Buy 2 Get 10% OFF"}
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

                <div style={{ display: "flex", justifyContent: "space-between", color: "#4B5563" }}>
                  <span>Shipping</span>
                  <span
                    style={{
                      color: shippingFee === 0 ? "#15803D" : "#111827",
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
                    borderTop: "1px solid #E5E7EB",
                    fontSize: "15px"
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Estimated Total</span>
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
                  <Sparkles size={13} /> You are saving {formatMoney(totalSavings)} on this order!
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
                  background: "#111827",
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
                PROCEED TO CHECKOUT • {formatMoney(displayFinalTotal)} <ArrowRight size={16} />
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
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#111827" }}>
              Your shopping bag is empty.
            </p>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#6B7280", maxWidth: "260px" }}>
              Add 2 pairs to unlock 10% OFF or 3 pairs to get 1 PAIR FREE.
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop: "8px",
                padding: "11px 24px",
                borderRadius: "999px",
                border: 0,
                background: "#111827",
                color: "#FFFFFF",
                fontSize: "11.5px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: "pointer"
              }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;