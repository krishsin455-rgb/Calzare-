import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

const STATUS_STEPS = [
  { key: "Confirmed", label: "Order Confirmed", desc: "Payment & order verified" },
  { key: "Packed", label: "Packed at Studio", desc: "Quality-checked & boxed" },
  { key: "Shipped", label: "Dispatched", desc: "In transit with courier partner" },
  { key: "Delivered", label: "Delivered", desc: "Handed over at doorstep" }
];

export default function TrackOrderPage({
  initialOrderId = "",
  initialPhone = "",
  onGoHome,
  money
}) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [phoneInput, setPhoneInput] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matchedOrders, setMatchedOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  const formatPrice =
    typeof money === "function"
      ? money
      : (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

  async function lookupOrders(orderQuery = orderIdInput, phoneQuery = phoneInput) {
    const cleanId = String(orderQuery || "").trim().toUpperCase();
    const cleanPhone = String(phoneQuery || "").trim();

    if (!cleanId && !cleanPhone) {
      setError("Please enter your Order ID or registered Mobile Number.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    let found = [];

    try {
      const params = new URLSearchParams();
      if (cleanId) params.set("orderId", cleanId);
      if (cleanPhone) params.set("phone", cleanPhone);

      const res = await fetch(`${API}/auth/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data)
          ? data
          : data?.order
          ? [data.order]
          : [];
        found = list;
      }
    } catch {
      // Fall back to local recent orders
    }

    try {
      const localOrders = JSON.parse(
        localStorage.getItem("calzare_recent_orders") || "[]"
      );
      if (Array.isArray(localOrders) && localOrders.length > 0) {
        const combined = [...found];
        localOrders.forEach((lo) => {
          if (!combined.some((x) => x.orderId === lo.orderId)) {
            combined.push(lo);
          }
        });
        found = combined;
      }
    } catch {}

    const filtered = found.filter((ord) => {
      const ordId = String(ord.orderId || ord.id || "").toUpperCase();
      const ordPhone = String(ord.customer?.phone || ord.phone || "").replace(
        /\s+/g,
        ""
      );
      const qPhone = cleanPhone.replace(/\s+/g, "");

      const idMatch = !cleanId || ordId.includes(cleanId);
      const phoneMatch = !qPhone || ordPhone.endsWith(qPhone.slice(-10));
      return idMatch && phoneMatch;
    });

    setMatchedOrders(filtered);
    if (filtered.length === 0) {
      setError(
        "No matching order found. Double-check your Order ID (e.g. CLZ-1024) or mobile number."
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (initialOrderId || initialPhone) {
      lookupOrders(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone]);

  function getStepIndex(status) {
    const normalized = String(status || "Confirmed").toLowerCase();
    if (normalized === "cancelled") return -1;
    const idx = STATUS_STEPS.findIndex(
      (s) => s.key.toLowerCase() === normalized
    );
    return idx >= 0 ? idx : 0;
  }

  return (
    <section
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "40px 20px 80px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px"
        }}
      >
        <button type="button" className="pdp-back-btn" onClick={onGoHome}>
          <ArrowLeft size={14} /> BACK TO STORE
        </button>
        <span className="eyebrow" style={{ margin: 0 }}>
          CALZARE LOGISTICS
        </span>
      </div>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <p className="eyebrow">REAL-TIME SHIPMENT STATUS</p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 500,
            margin: "0 0 10px"
          }}
        >
          Track your <em>order.</em>
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
          Enter your Order ID or the mobile number used at checkout to check live
          dispatch and delivery updates.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookupOrders();
        }}
        style={{
          background: "var(--surface, #f2f1eb)",
          border: "1px solid var(--line, #deded6)",
          borderRadius: "16px",
          padding: "22px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "12px",
          alignItems: "end",
          marginBottom: "28px"
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "var(--muted)",
              marginBottom: "6px"
            }}
          >
            ORDER ID
          </label>
          <input
            placeholder="e.g. CLZ-1024"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "13px"
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "var(--muted)",
              marginBottom: "6px"
            }}
          >
            MOBILE NUMBER
          </label>
          <input
            placeholder="e.g. 9876543210"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              background: "#fff",
              fontSize: "13px"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="primary-cta-btn"
          style={{ borderRadius: "8px", height: "44px" }}
        >
          <Search size={15} /> {loading ? "CHECKING..." : "TRACK ORDER"}
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "10px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#991B1B",
            fontSize: "13px",
            marginBottom: "24px"
          }}
        >
          {error}
        </div>
      )}

      {matchedOrders.map((ord) => {
        const isCancelled =
          String(ord.status || "").toLowerCase() === "cancelled";
        const currentStep = getStepIndex(ord.status);

        return (
          <div
            key={ord.orderId}
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--line, #deded6)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.03)"
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                paddingBottom: "16px",
                borderBottom: "1px solid var(--line)"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1.4px",
                    color: "var(--muted)"
                  }}
                >
                  ORDER REFERENCE
                </span>
                <h2 style={{ margin: "2px 0 0", fontSize: "20px" }}>
                  {ord.orderId}
                </h2>
                {ord.createdAt && (
                  <span style={{ fontSize: "11.5px", color: "var(--muted)" }}>
                    Placed on{" "}
                    {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    background: isCancelled ? "#FEE2E2" : "#DCFCE7",
                    color: isCancelled ? "#991B1B" : "#166534"
                  }}
                >
                  {(ord.status || "CONFIRMED").toUpperCase()}
                </span>
                <div style={{ marginTop: "6px", fontWeight: 700, fontSize: "15px" }}>
                  {formatPrice(ord.total)}
                </div>
              </div>
            </div>

            {!isCancelled ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "12px",
                  padding: "22px 0",
                  borderBottom: "1px solid var(--line)"
                }}
              >
                {STATUS_STEPS.map((st, idx) => {
                  const done = idx <= currentStep;
                  const active = idx === currentStep;
                  return (
                    <div
                      key={st.key}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: active
                          ? "1.5px solid #166534"
                          : "1px solid var(--line)",
                        background: done ? "#F0FDF4" : "var(--surface)",
                        opacity: done ? 1 : 0.55
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: done ? "#166534" : "var(--ink)"
                        }}
                      >
                        {done ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                        <span>{st.label}</span>
                      </div>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "11px",
                          color: "var(--muted)"
                        }}
                      >
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: "16px",
                  margin: "16px 0",
                  borderRadius: "10px",
                  background: "#FEF2F2",
                  color: "#991B1B",
                  fontSize: "13px"
                }}
              >
                This order was cancelled. If any prepaid amount was charged, it is
                refunded within 5–7 business days.
              </div>
            )}

            {(ord.trackingNumber || ord.trackingUrl || ord.courierName) && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12.5px"
                }}
              >
                <div>
                  <strong>Courier:</strong> {ord.courierName || "Express Partner"}{" "}
                  {ord.trackingNumber && (
                    <>
                      • <strong>AWB:</strong> {ord.trackingNumber}
                    </>
                  )}
                </div>
                {ord.trackingUrl && (
                  <a
                    href={ord.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#1D4ED8",
                      fontWeight: 700,
                      textDecoration: "underline"
                    }}
                  >
                    Open Courier Live Map →
                  </a>
                )}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
                paddingTop: "18px"
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1.2px",
                    color: "var(--muted)",
                    marginBottom: "8px"
                  }}
                >
                  ITEMS IN SHIPMENT
                </div>
                <div style={{ display: "grid", gap: "8px" }}>
                  {(ord.items || []).map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12.5px",
                        padding: "8px 10px",
                        background: "var(--surface)",
                        borderRadius: "8px"
                      }}
                    >
                      <span>
                        <strong>{item.name}</strong> ({item.size}) × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {ord.customer && (
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "1.2px",
                      color: "var(--muted)",
                      marginBottom: "8px"
                    }}
                  >
                    DELIVERY DESTINATION
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      lineHeight: 1.6,
                      padding: "10px 12px",
                      background: "var(--surface)",
                      borderRadius: "8px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={14} />
                      <strong>{ord.customer.name}</strong>
                    </div>
                    <div>{ord.customer.address}</div>
                    <div>
                      {ord.customer.city} {ord.customer.pincode}
                    </div>
                    <div style={{ color: "var(--muted)", marginTop: "4px" }}>
                      Phone: {ord.customer.phone} • {ord.paymentMethod}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {!searched && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginTop: "12px"
          }}
        >
          <div
            style={{
              padding: "16px",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              background: "#fff"
            }}
          >
            <Package size={18} />
            <strong style={{ display: "block", fontSize: "13px", marginTop: "8px" }}>
              24–48 Hr Dispatch
            </strong>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              Orders are packed and handed to courier partners within 1–2 business days.
            </span>
          </div>
          <div
            style={{
              padding: "16px",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              background: "#fff"
            }}
          >
            <Truck size={18} />
            <strong style={{ display: "block", fontSize: "13px", marginTop: "8px" }}>
              3–7 Day Delivery
            </strong>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              Live SMS & email tracking updates sent automatically once shipped.
            </span>
          </div>
          <div
            style={{
              padding: "16px",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              background: "#fff"
            }}
          >
            <ShieldCheck size={18} />
            <strong style={{ display: "block", fontSize: "13px", marginTop: "8px" }}>
              Need Help?
            </strong>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              Reach us at Admin@calzareheels.com with your Order ID.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}