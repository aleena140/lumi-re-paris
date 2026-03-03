# Luxe Perfume

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing hero section with brand tagline and call-to-action
- Featured perfume collection grid with product cards (name, description, price, scent notes)
- Individual product detail view (modal or page) with scent notes, ingredients, and add-to-cart button
- Shopping cart with item list, quantity controls, and order summary
- About/brand story section
- Contact/newsletter signup section
- Navigation bar with logo and cart icon

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Define data types for Product (id, name, description, price, scentNotes, category, imageUrl), CartItem, and Order. Implement queries to list products and get product by id. Implement update calls to add/remove cart items and place orders.
2. Frontend: Build multi-section landing page with hero, featured products grid, product detail modal, cart drawer, about section, and footer. Wire to backend APIs.
