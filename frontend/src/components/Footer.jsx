import React from "react";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "MEN", href: "/men" },
  { label: "WOMEN", href: "/women" },
  { label: "UNISEX", href: "/unisex" },
  { label: "KIDS", href: "/kids" },
  { label: "OUR STORY", href: "/our-story" },
];

export default function Navbar({
  user,
  onOpenAuthModal,
  onOpenAccountMenu,
  onOpenControlCenter,
  onLogout,
}) {
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <a href="/" className="text-lg font-bold tracking-widest">
          CALZARE
        </a>

        {/* Desktop Nav Links (HOME first) */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-medium tracking-wider hover:underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions (Visible on both Mobile & Desktop) */}
        <div className="flex items-center gap-3">
          {!user ? (
            <button
              type="button"
              onClick={() => onOpenAuthModal("login")}
              className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-neutral-100"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAccountMenu}
                className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-neutral-100"
              >
                {user.name || user.email}
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenControlCenter}
                  className="rounded bg-black px-3 py-1.5 text-xs font-medium text-white"
                >
                  Control Center
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-neutral-600 hover:underline"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}