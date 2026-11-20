import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StorefrontContext = createContext(null);

const FALLBACK_PRODUCTS = [
  {
    _id: 'p1',
    name: 'Calzare Pulse Runner',
    category: 'Sneakers',
    price: 1499,
    mrp: 2499,
    tag: 'Bestseller',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    _id: 'p2',
    name: 'Calzare Cloud Clog',
    category: 'Clogs',
    price: 999,
    mrp: 1599,
    tag: 'At ₹999',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80',
  },
  {
    _id: 'p3',
    name: 'Calzare Drift Slide',
    category: 'Slides',
    price: 799,
    mrp: 1299,
    tag: 'At ₹999',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80',
  },
  {
    _id: 'p4',
    name: 'Calzare Apex Loafer',
    category: 'Formal',
    price: 1899,
    mrp: 2999,
    tag: 'New Drop',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80',
  },
];

export function StorefrontProvider({ children }) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All Pieces');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('calzare_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('calzare_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Sync with your backend API if available, falling back cleanly to local items
  useEffect(() => {
    let active = true;
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const list = Array.isArray(data) ? data : data.products;
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calzare_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('calzare_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const at999Products = useMemo(
    () => products.filter((p) => Number(p.price) <= 999),
    [products]
  );

  const addToCart = (product, size) => {
    const id = product._id || product.id;
    const chosenSize = size || (product.sizes && product.sizes[1]) || 'UK 8';

    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => (item.product._id || item.product.id) === id && item.size === chosenSize
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { product, size: chosenSize, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (index, delta) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * item.qty,
    0
  );
  const discountRate = totalItems >= 3 ? 0.15 : totalItems === 2 ? 0.1 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const finalTotal = subtotal - discountAmount;

  return (
    <StorefrontContext.Provider
      value={{
        products,
        at999Products,
        selectedCategory,
        setSelectedCategory,
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQty,
        removeFromCart,
        wishlist,
        toggleWishlist,
        totalItems,
        subtotal,
        discountRate,
        discountAmount,
        finalTotal,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export const useStorefront = () => useContext(StorefrontContext);