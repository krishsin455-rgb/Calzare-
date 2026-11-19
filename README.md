# CALZARE — Upgraded Storefront (Video Reels, PiP Player, PDP Modal & Tiered Cart)

An upgraded React + Vite + Express storefront for **CALZARE**, preserving the signature minimalist editorial design while adding interactive video commerce and conversion features.

## What's New & Fixed
1. **Shoppable Video Reels ("CALZARE IN MOTION")**: Vertical lifestyle/product reels with auto-playing muted previews, mute/unmute controls, and a full-screen **Shoppable Reel Modal** with UK size selection and direct Add-to-Bag.
2. **Floating Picture-in-Picture (PiP) Video Player**: Dismissible corner video widget with sound toggle and one-click "Shop Featured" jump.
3. **Product Detail Modal & UK Size Selector**: Clicking any product opens a detailed view with UK sizing (`UK 6`–`UK 11`), video/photo toggle, and craftsmanship notes.
4. **Tiered Progress-Bar Slide-Out Bag & Checkout**: Live progress bar unlocking **Free Shipping (₹2,999+)**, **10% Off (2+ Pairs)**, and **15% Off (3+ Pairs)**, plus in-cart upsells and a working checkout flow (`POST /api/orders`).
5. **Resilient Fallback & Image Protection**: Loads live data from `/api/products`, `/api/homepage`, and `/api/reels`, with built-in fallback data and broken-image recovery so the storefront never renders blank.

## Quick Start

### 1. Start the Backend
```bash
cd CALZARE-Upgraded/backend
npm install
npm run dev
```
Runs at `http://localhost:5003`.

### 2. Start the Frontend
```bash
cd CALZARE-Upgraded/frontend
npm install
npm run dev
```
Open the local URL printed by Vite (typically `http://localhost:5173`).
# Calzare-
