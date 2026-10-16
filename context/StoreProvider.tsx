"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import type { OfferSettings } from "@/lib/format";
import type { AccountUser, CartItem, Customer, Order } from "@/lib/shop-types";

export type { AccountUser, CartItem, Customer, Order, OrderLine } from "@/lib/shop-types";

type StoreValue = {
  ready: boolean;
  cart: CartItem[];
  wishlist: string[];
  user: AccountUser | null;
  orders: Order[];
  code: string;
  catalog: Product[];
  settings: OfferSettings;
  cartCount: number;
  wishCount: number;
  addToCart: (item: CartItem) => void;
  setQty: (item: CartItem, qty: number) => void;
  removeFromCart: (item: CartItem) => void;
  toggleWish: (slug: string) => void;
  wished: (slug: string) => boolean;
  applyCode: (code: string) => string;
  clearCode: () => void;
  signup: (input: { name: string; email: string; phone: string; password: string }) => Promise<string>;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  placeOrder: (customer: Customer, payment: string) => Promise<{ id?: string; error?: string }>;
};

const StoreContext = createContext<StoreValue | null>(null);

const keys = {
  cart: "sthree-cart",
  wish: "sthree-wish",
  orders: "sthree-orders",
  code: "sthree-code",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function sameLine(a: CartItem, b: CartItem) {
  return a.slug === b.slug && a.size === b.size && a.color === b.color;
}

export function StoreProvider({ children, catalog, settings }: { children: React.ReactNode; catalog: Product[]; settings: OfferSettings }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [code, setCode] = useState("");
  const [toast, setToast] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let ignore = false;
    setCart(read(keys.cart, []));
    setWishlist(read(keys.wish, []));
    setCode(read(keys.code, ""));
    (async () => {
      const me = await fetch("/api/auth/me");
      if (ignore) return;
      if (me.ok) {
        const body = await me.json();
        setUser(body.user);
        const list = await fetch("/api/orders");
        if (list.ok) setOrders(await list.json());
      } else {
        setOrders(read(keys.orders, []));
      }
      if (!ignore) setReady(true);
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(keys.cart, JSON.stringify(cart));
    localStorage.setItem(keys.wish, JSON.stringify(wishlist));
    localStorage.setItem(keys.orders, JSON.stringify(orders));
    localStorage.setItem(keys.code, JSON.stringify(code));
  }, [ready, cart, wishlist, orders, code]);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((current) => {
      const existing = current.find((line) => sameLine(line, item));
      if (!existing) return [...current, { ...item, qty: Math.min(5, item.qty) }];
      return current.map((line) =>
        sameLine(line, item) ? { ...line, qty: Math.min(5, line.qty + item.qty) } : line
      );
    });
    notify("Added to bag");
  }, [notify]);

  const setQty = useCallback((item: CartItem, qty: number) => {
    setCart((current) =>
      current.flatMap((line) => {
        if (!sameLine(line, item)) return [line];
        if (qty <= 0) return [];
        return [{ ...line, qty: Math.min(5, qty) }];
      })
    );
  }, []);

  const removeFromCart = useCallback((item: CartItem) => {
    setCart((current) => current.filter((line) => !sameLine(line, item)));
  }, []);

  const toggleWish = useCallback((slug: string) => {
    setWishlist((current) => {
      if (current.includes(slug)) {
        notify("Removed from wishlist");
        return current.filter((item) => item !== slug);
      }
      notify("Saved to wishlist");
      return [...current, slug];
    });
  }, [notify]);

  const wished = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const applyCode = useCallback((next: string) => {
    const clean = next.trim().toUpperCase();
    if (!settings.promoOn || clean !== settings.promoCode.trim().toUpperCase()) return "That code is not active.";
    setCode(clean);
    notify(`Code ${settings.promoCode} applied`);
    return "";
  }, [notify, settings.promoCode, settings.promoOn]);

  const clearCode = useCallback(() => setCode(""), []);

  const loadOrders = useCallback(async () => {
    const list = await fetch("/api/orders");
    if (list.ok) setOrders(await list.json());
  }, []);

  const signup = useCallback(async (input: { name: string; email: string; phone: string; password: string }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return body.error || "Could not create the account.";
    setUser(body.user);
    await loadOrders();
    notify("Welcome to Sthree");
    return "";
  }, [loadOrders, notify]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return body.error || "Email or password does not match.";
    setUser(body.user);
    await loadOrders();
    notify(`Hello, ${body.user.name.split(" ")[0]}`);
    return "";
  }, [loadOrders, notify]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
    notify("Signed out");
  }, [notify]);

  const placeOrder = useCallback(async (customer: Customer, payment: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, payment, code, lines: cart }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { error: body.error || "The order could not be saved." };
    const order = body as Order;
    setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)]);
    setCart([]);
    setCode("");
    notify("Order confirmed");
    return { id: order.id };
  }, [cart, code, notify]);

  const value = useMemo<StoreValue>(() => ({
    ready,
    cart,
    wishlist,
    user,
    orders,
    code,
    catalog,
    settings,
    cartCount: cart.reduce((sum, item) => sum + item.qty, 0),
    wishCount: wishlist.length,
    addToCart,
    setQty,
    removeFromCart,
    toggleWish,
    wished,
    applyCode,
    clearCode,
    signup,
    login,
    logout,
    placeOrder,
  }), [ready, cart, wishlist, user, orders, code, catalog, settings, addToCart, setQty, removeFromCart, toggleWish, wished, applyCode, clearCode, signup, login, logout, placeOrder]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
