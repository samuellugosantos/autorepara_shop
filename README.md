# AutoRepara.es

AutoRepara.es is a web-based automotive maintenance and repair platform focused on European vehicles.  
The project combines technical vehicle documentation, step-by-step repair guides, a Supabase-powered shop, user authentication, personal vehicle profiles, repair tracking, ITV reminders, and dynamic kit recommendations.

The website is built as a static frontend that can be deployed on GitHub Pages while using Supabase as the backend for shop data, orders, authentication, user vehicles, repairs, and storage.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current Project Status](#current-project-status)
3. [Main Technologies](#main-technologies)
4. [Frontend Structure](#frontend-structure)
5. [Core Website Sections](#core-website-sections)
6. [Vehicle Profiles](#vehicle-profiles)
7. [Motor System Maps](#motor-system-maps)
8. [Repair Guides](#repair-guides)
9. [Shop System](#shop-system)
10. [Cart, Taxes, Shipping and Checkout](#cart-taxes-shipping-and-checkout)
11. [Recommended Kit Popup](#recommended-kit-popup)
12. [Vehicle-Based Shop Organization](#vehicle-based-shop-organization)
13. [Supabase Backend](#supabase-backend)
14. [Supabase Auth and User Profiles](#supabase-auth-and-user-profiles)
15. [Personal Garage](#personal-garage)
16. [Repair History and Guide Association](#repair-history-and-guide-association)
17. [ITV and Maintenance Reminders](#itv-and-maintenance-reminders)
18. [Vehicle Photos with Supabase Storage](#vehicle-photos-with-supabase-storage)
19. [SQL Setup Files](#sql-setup-files)
20. [Deployment with GitHub Pages](#deployment-with-github-pages)
21. [Testing Checklist](#testing-checklist)
22. [Known Limitations](#known-limitations)
23. [Future Improvements](#future-improvements)

---

## Project Overview

AutoRepara.es is designed to help vehicle owners understand, maintain and document repairs for their own cars.

The platform provides:

- vehicle technical profiles;
- engine system maps;
- detailed maintenance and repair guides;
- tools and materials linked to the shop;
- Supabase-based product catalog;
- cart and order system;
- kit recommendations;
- user authentication;
- personal vehicle garage;
- repair history;
- ITV expiration alerts;
- mileage-based maintenance warnings;
- vehicle photo uploads.

The goal is to create a practical and educational experience for users who want to perform basic vehicle maintenance or understand what a mechanic is doing.

---

## Current Project Status

Current implementation status:

```txt
Frontend: implemented
Refactored structure: implemented
Supabase product catalog: implemented
Supabase orders: implemented
Cart: implemented
VAT calculation: implemented
Shipping calculation: implemented
Recommended kits: implemented
Vehicle-based shop organization: implemented
Supabase Auth: implemented
User vehicle profiles: implemented
Vehicle repair history: implemented
Guide association with repairs: implemented
Vehicle photo upload: implemented
ITV reminders: implemented
Expanded repair guides: implemented
GitHub Pages deployment: supported
```

---

## Main Technologies

The project uses:

- HTML5;
- CSS3;
- JavaScript;
- Supabase JavaScript Client;
- Supabase Database;
- Supabase Auth;
- Supabase Storage;
- PostgreSQL functions and RLS policies;
- GitHub Pages;
- Font Awesome;
- Google Fonts.

No frontend framework is required.

---

## Frontend Structure

The project has been refactored to avoid a single extremely large HTML file.

Recommended structure:

```txt
autorepara/
├─ index.html
├─ README.md
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  ├─ inline-script-01.js
│  │  ├─ inline-script-02.js
│  │  ├─ supabase-auth-profile-script.js
│  │  ├─ vehicle-shop-catalog-script.js
│  │  ├─ kit-recomendado-popup-stable-script.js
│  │  └─ other-js-modules.js
│  └─ images/
│     └─ vehicles/
└─ supabase/
   └─ sql-files
```

The refactor separates:

- CSS into `assets/css/styles.css`;
- JavaScript into multiple files under `assets/js/`;
- vehicle images into `assets/images/vehicles/`;
- SQL setup files into a dedicated Supabase folder.

This makes the project easier to maintain and avoids a 10,000-line single HTML file.

---

## Core Website Sections

The website includes the following main sections:

### Home

The landing page introduces AutoRepara.es and includes:

- hero section;
- search bar;
- category shortcuts;
- featured vehicle card;
- navigation to the main platform sections.

### Vehicles

Shows documented European vehicles with technical information and repairability context.

### Motor Map

Displays the selected vehicle's engine system map.

### Guides

Contains maintenance and repair guides.

### Regulations

Explains legal and safety considerations around vehicle maintenance.

### Shop

Displays products from Supabase and allows users to add items to the cart.

### Profile

Allows users to register, log in, create vehicle profiles, add repairs, upload photos and see reminders.

---

## Vehicle Profiles

The platform includes technical profiles for common European vehicles.

Documented vehicles include:

- SEAT León / León 2005;
- Volkswagen Golf 1.5 TSI;
- Peugeot 308 PureTech;
- Renault Mégane TCe;
- Ford Focus EcoBoost;
- Toyota Corolla Hybrid;
- BMW 320d.

Each vehicle can include:

- brand and model;
- engine type;
- fuel type;
- technical data;
- maintenance risks;
- repairability score;
- recommended systems;
- related guides;
- shop recommendations.

---

## Motor System Maps

Each documented vehicle includes a specific engine system map.

Typical systems:

- intake;
- fuel;
- cooling;
- lubrication;
- exhaust and emissions;
- timing/distribution;
- ignition;
- electrical/diagnostic where applicable.

Each system shows:

- components;
- function;
- maintenance notes;
- related parts;
- related guides.

---

## Repair Guides

The guide system has been expanded and now includes a larger set of real guide entries inside the JavaScript data.

Current guide examples include:

1. Air filter replacement.
2. MAF sensor diagnosis.
3. Throttle body cleaning.
4. Cooling system bleeding.
5. Thermostat replacement.
6. Overheating diagnosis.
7. Oil and oil filter change.
8. Timing chain noise diagnosis.
9. When to replace the timing chain.
10. Cabin filter replacement.
11. Front brake pad replacement.
12. Front brake disc replacement.
13. 12V battery inspection and replacement.
14. Spark plug replacement on gasoline engines.
15. Diesel fuel filter replacement.
16. Wheel change and tyre inspection.
17. Pre-ITV inspection.
18. Windscreen wiper blade replacement.
19. AdBlue refill and SCR warnings.
20. Basic brake fluid check/change.

Guide features:

- guide cards;
- difficulty rating;
- estimated time;
- system category;
- tools;
- materials;
- videos;
- expandable steps;
- safety warnings;
- common mistakes;
- recommended checks;
- shop links for tools and materials.

The guides are stored in frontend JavaScript data and rendered dynamically.

---

## Shop System

The shop is connected to Supabase.

Products are loaded from the database instead of being hardcoded only in the HTML.

Product information can include:

- product name;
- category;
- description;
- price;
- image URL;
- stock;
- active status;
- variants;
- product family.

The shop supports:

- product search;
- category filters;
- stock filters;
- vehicle-based organization;
- recommended products;
- product cards;
- add-to-cart buttons;
- product summaries;
- verified product images through `image_url`.

If a product has no verified `image_url`, the UI avoids showing incorrect generated images.

---

## Product Summaries

Each product card includes a short summary that explains what the product does.

The summary logic prioritizes:

1. the real Supabase product description;
2. a product-specific fallback summary;
3. a safe generic summary only when no better data exists.

This avoids mismatched summaries such as brake descriptions appearing on oil products or filter descriptions appearing on tools.

---

## Cart, Taxes, Shipping and Checkout

The cart includes a more realistic price breakdown.

Implemented totals:

- products without VAT;
- VAT at 21%;
- products with VAT;
- shipping cost;
- final total to pay.

Current shipping rules:

```txt
Standard shipping: €4.90
Free shipping: from €60.00 in products including VAT
VAT: 21%
```

The cart also shows a message when the user is close to free shipping, encouraging them to add more products when it is financially convenient.

Example:

```txt
Add €8.50 more to get free shipping.
```

The final checkout summary reflects the tax and shipping breakdown.

---

## Recommended Kit Popup

When the user adds a product to the cart, the shop shows a recommended kit popup.

The popup includes:

- complementary products;
- small visual discounts;
- a “frequently bought together” style message;
- an option to add individual recommendations;
- an option to add the full kit and go to the cart.

The kit system has been refined to avoid incorrect duplicates.

Important kit rules:

- the base product added by the user must not appear again in the kit;
- equivalent generic versions of the same product must not appear;
- if the base product is oil, another oil must not be recommended;
- products are grouped by product family;
- the system prefers specific complementary products over general ones;
- general products are used only when specific ones are not available.

Example:

If the user buys:

```txt
VW 508/509 oil
```

The kit should not recommend:

```txt
VW 504/507 oil
```

Instead, it may recommend:

- oil filter;
- drain pan;
- funnel;
- gloves;
- cleaning product.

---

## Vehicle-Based Shop Organization

The shop can be organized by the selected vehicle.

The user can select:

- a documented vehicle;
- a vehicle created in their own profile.

The shop then reorganizes products according to the selected vehicle’s likely needs.

Categories include:

- oil;
- filters;
- brakes;
- cooling;
- diagnostic;
- ITV;
- tools;
- general maintenance.

The category chips are clickable, allowing automatic organization by category.

For custom user vehicles, the system can estimate compatibility based on:

- brand;
- model;
- year;
- engine keywords;
- notes;
- fuel type clues.

Detected keywords can include:

```txt
TDI
HDI
CDTI
TSI
TCe
EcoBoost
Hybrid
Diesel
Gasoline
```

Compatibility warnings are shown when recommendations are estimated instead of exact.

---

## Supabase Backend

Supabase is used as the backend for:

- product catalog;
- product variants;
- orders;
- order items;
- kit discount rules;
- user authentication;
- user vehicles;
- repair history;
- vehicle reminders;
- vehicle photos.

---

## Main Shop Database Tables

Typical shop tables:

```txt
products
product_variants
orders
order_items
kit_discount_rules
kit_discount_rule_items
```

### `products`

Stores shop products.

Expected fields can include:

```txt
id
name
slug
category
description
price
image_url
active
created_at
```

### `product_variants`

Stores variants or selectable product versions.

Expected fields can include:

```txt
id
product_id
label
price
stock
created_at
```

In the current project, `product_variants` may not include an `active` column, so availability can be controlled by stock.

### `orders`

Stores customer orders.

Expected fields:

```txt
id
customer_name
customer_email
customer_phone
customer_address
total
status
created_at
```

### `order_items`

Stores products inside orders.

Expected fields:

```txt
id
order_id
product_id
variant_id
product_name
variant_label
quantity
unit_price
line_total
created_at
kit_rule_id
kit_slug
kit_name
original_unit_price
discount_amount
added_as_kit_item
```

---

## Kit Discount SQL

The project includes SQL support for kit discounts.

The kit discount system adds:

```txt
kit_discount_rules
kit_discount_rule_items
```

It also adds kit metadata to `order_items`.

The SQL includes:

- product family detection;
- kit price calculation;
- recommended kit product lookup;
- RLS policies for reading active kit rules;
- seed rules for common repair types.

Kit rule examples:

- oil service kit;
- brake service kit;
- cooling service kit;
- diagnostic starter kit;
- ignition service kit;
- basic maintenance kit.

The SQL was adapted for the existing project database where:

- `products.id` is stored as `text`;
- `products.slug` may need to be added;
- `product_variants.active` may not exist.

---

## Supabase Auth and User Profiles

The project includes Supabase Auth integration for user accounts.

Auth features:

- register with email and password;
- log in;
- log out;
- detect current session;
- react to auth state changes;
- protect user data with RLS.

The profile is no longer intended to depend only on `localStorage`.

Authenticated profile data is stored in Supabase, allowing users to access their vehicle data from another browser or device after logging in.

---

## Personal Garage

Authenticated users can create personal vehicles.

A user vehicle can include:

- brand;
- model;
- license plate;
- year;
- mileage;
- ITV expiration date;
- notes;
- vehicle photo.

Vehicle data is linked to the authenticated user through `user_id`.

---

## Repair History and Guide Association

Users can register repairs for each vehicle.

Repair records can include:

- repair date;
- mileage;
- repair type;
- cost;
- notes;
- associated guide;
- associated tools;
- associated materials.

When the user enters a repair type, the system can suggest:

- a guide;
- required tools;
- materials;
- shop products.

Once saved, the guide remains associated with that repair record.

---

## ITV and Maintenance Reminders

The profile system can show reminders based on:

- ITV expiration date;
- current mileage;
- repair history;
- general maintenance intervals.

Examples:

- ITV expired;
- ITV expires soon;
- oil change due;
- brake check recommended;
- tyre inspection recommended;
- general service due.

Currently, reminders are calculated mainly in the frontend when the user opens the profile.

A future version could send emails with Supabase Edge Functions and an external email provider.

---

## Vehicle Photos with Supabase Storage

Vehicle photos can be uploaded through Supabase Storage.

Recommended bucket:

```txt
vehicle-photos
```

The image path or URL is stored in the vehicle record.

A recommended storage path format is:

```txt
user-id/timestamp-file-name
```

This keeps user files separated.

---

## SQL Setup Files

The project can include several SQL setup files:

```txt
01_schema.sql
02_seed_products.sql
03_vehicle_shop_catalog.sql
supabase_user_profile_auth.sql
supabase_kit_discounts.sql
supabase_kit_discounts_fixed.sql
supabase_kit_discounts_text_ids_no_variant_active.sql
```

These files may create or update:

- products;
- variants;
- orders;
- order items;
- user vehicles;
- repairs;
- reminders;
- storage policies;
- RLS policies;
- kit discount rules;
- kit rule items;
- helper functions.

---

## Row Level Security

RLS should be enabled for all user-owned data.

Important policies:

- users can only read their own vehicles;
- users can only insert their own vehicles;
- users can only update their own vehicles;
- users can only delete their own vehicles;
- users can only manage repairs linked to their own account;
- public users can read active products;
- public users can read active kit rules;
- users cannot modify product prices from the frontend.

Typical RLS condition:

```sql
auth.uid() = user_id
```

---

## Supabase Email Rate Limit Note

During development, Supabase Auth may return:

```txt
email rate limit exceeded
```

This happens when too many sign-up emails are triggered.

Recommended development actions:

1. Disable email confirmation temporarily.
2. Wait for the rate limit window to reset.
3. Create users manually from:

```txt
Authentication → Users → Add user
```

4. Use the login form instead of repeatedly creating accounts.

For production, configure a custom SMTP provider.

---

## Deployment with GitHub Pages

The project is compatible with GitHub Pages.

Important: because the project is refactored, upload the full folder structure, not only `index.html`.

The repository should include:

```txt
index.html
assets/
README.md
```

GitHub Pages configuration:

```txt
Settings → Pages
Source: Deploy from a branch
Branch: main
Folder: /root
```

---

## Supabase Frontend Configuration

The frontend needs:

```js
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-public-anon-or-publishable-key';
```

Only the public anon/publishable key should be used in frontend code.

Never expose the `service_role` key in the browser.

---

## Testing Checklist

### General Website

- Navigation works.
- Theme toggle works.
- Search works.
- Guides open correctly.
- Motor maps render correctly.
- Vehicle profiles render correctly.

### Guides

- All guides appear.
- Guide steps expand/collapse.
- Tools and materials appear.
- Related shop links work.
- Newly added guides appear in the guides grid.

### Shop

- Products load from Supabase.
- Product summaries are correct.
- Images only show when verified.
- Search works.
- Category filters work.
- Vehicle organization works.
- Category chips are clickable.
- Products can be added to cart.

### Cart

- Cart opens correctly.
- Items are added correctly.
- Quantities work.
- Product subtotal is correct.
- VAT is shown.
- Shipping is shown.
- Free shipping threshold works.
- Final total includes VAT and shipping.
- Checkout works.

### Recommended Kits

- Popup appears after adding a product.
- Base product is not repeated.
- Equivalent generic product is not repeated.
- Oil does not recommend another oil.
- Kit button adds all valid kit products.
- Kit button opens the cart.
- Discounts are visible.

### Auth/Profile

- User can register.
- User can log in.
- User can log out.
- Rate limit messages are handled.
- Vehicle can be created.
- Vehicle appears after reload.
- Vehicle appears after login on another device.
- Vehicle photo can be uploaded.
- Repairs can be created.
- Repairs stay linked to the vehicle.
- Guide association is saved.
- ITV alerts appear.

### Supabase

- Products exist.
- Variants exist.
- Orders are saved.
- Order items are saved.
- User vehicles are saved.
- Repairs are saved.
- RLS is enabled.
- Storage bucket exists.
- Kit rules exist.
- Kit rule items exist.

---

## Known Limitations

Current limitations:

- no real payment gateway;
- no admin dashboard;
- no automatic email reminders yet;
- vehicle compatibility is estimated unless exact catalog data exists;
- no professional parts catalog API;
- no shipping provider integration;
- no invoice generation;
- no product reviews;
- no order history page for users yet.

---

## Future Improvements

Possible next steps:

- add Stripe or PayPal payments;
- create an admin dashboard;
- add user order history;
- add email reminders for ITV and maintenance;
- add Supabase Edge Functions;
- connect a real parts compatibility API;
- add invoices and PDF reports;
- add product reviews;
- add favorite guides;
- add multilingual support;
- improve mobile UI;
- add professional product images;
- add real shipping calculation;
- add stock management dashboard.

---

## Final Summary

AutoRepara.es is a complete automotive maintenance and repair web prototype.

It includes:

- educational repair content;
- vehicle-specific documentation;
- expanded repair guides;
- Supabase-powered shop;
- cart and order system;
- tax and shipping calculation;
- kit recommendations;
- kit discounts;
- user authentication;
- personal vehicle garage;
- repair tracking;
- ITV reminders;
- vehicle photos;
- vehicle-based product organization.

The project is suitable as a strong full-stack web development portfolio project and can be extended into a more complete production platform with payments, admin tools, email automation and professional vehicle parts compatibility data.
