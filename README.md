# AutoRepara.es — Website and Supabase Store Documentation

AutoRepara.es is a web project designed as a technical knowledge platform for European car owners who want to understand, diagnose and perform basic mechanical maintenance tasks. The site combines educational repair guides, vehicle technical profiles, a motor-system map, a tool store, and a Supabase-powered product/order backend.

The project is mainly built with:

- HTML
- CSS
- JavaScript
- Supabase as database/backend
- GitHub Pages as static hosting

---

## 1. General Website Overview

The website is structured as a single-page application using plain HTML, CSS and JavaScript. Instead of loading separate pages, the site switches between internal sections using JavaScript navigation.

Main sections include:

- Home page
- Vehicle profile section
- Engine system map
- Repair guides
- European vehicle examples
- Store
- Regulations / legal information
- Footer and support modals

The design uses a dark technical interface with orange accent colors, card-based layouts, responsive grids, and interactive elements such as tabs, modals, accordions and dynamic search.

---

## 2. Home Page

The home page introduces AutoRepara.es as a mechanical knowledge platform for car owners.

Main features:

- Hero section with project introduction.
- Global search bar.
- Category chips for quick access to common mechanical topics.
- Featured vehicle card.
- Statistics banner.
- Navigation to repair guides, vehicle systems and store.

The home page is intended to act as the main entry point for users who want either to search for a repair guide or access the store quickly.

---

## 3. Navigation System

The website uses JavaScript-based navigation. Each main section is stored in the same HTML file and shown or hidden dynamically.

The navigation system:

- Adds the `active` class to the selected section.
- Updates the breadcrumb text.
- Scrolls the page to the top when changing sections.
- Works with desktop navigation and mobile navigation.
- Connects internal buttons, guide links, store links and vehicle links.

This avoids page reloads and keeps the project simple enough to host on GitHub Pages.

---

## 4. Global Search

The global search bar allows users to search across major website content.

It can surface results such as:

- Repair guides
- Vehicle sections
- Engine system topics
- Store-related content
- Common maintenance topics

The search dropdown displays matching results and sends the user to the appropriate section when clicked.

---

## 5. Vehicle Profiles

The website includes vehicle profile pages inspired by the original SEAT León format.

Each vehicle profile may include:

- Vehicle name and generation.
- Engine reference.
- Technical specifications.
- Repairability score.
- Strengths.
- Common weak points.
- Maintenance notes.
- Vehicle image.
- Links to its engine system map.

Vehicle profiles are intended to help users understand the mechanical layout and maintenance complexity of common European cars.

---

## 6. European Vehicle Examples

The website includes several common vehicles from the European market.

Examples include:

- SEAT León
- Volkswagen Golf
- Peugeot 308
- Renault Mégane
- Ford Focus
- Toyota Corolla Hybrid
- BMW 320d

Each vehicle is presented as a card with key information, repairability notes and access to a detailed profile or motor-system map.

---

## 7. Engine System Map

The engine system map explains the main mechanical systems of a selected vehicle.

Typical systems include:

- Intake system
- Fuel system
- Cooling system
- Lubrication system
- Exhaust and emissions system
- Timing/distribution system

The system map uses tabs so the user can switch between different mechanical areas. Each tab includes component tables, explanations and related guides.

The goal is to help users understand how different engine systems interact with each other.

---

## 8. Repair Guides

The repair guide section contains step-by-step mechanical tutorials.

The guides include:

- Title
- Difficulty level
- Estimated time
- Related system
- Required materials
- Tools
- Safety warnings
- Step-by-step instructions
- Related videos
- Recommended store products

The guides have been expanded with longer explanations so users can better understand not only what to do, but why each step matters.

---

## 9. Expandable Guide Steps

Guide steps are implemented as expandable accordion sections.

Each step can include:

- Main instruction
- Detailed explanation
- Recommended checks
- Common mistakes to avoid
- Safety notes
- Quality checks
- Tool list

This keeps long guides readable. Users can open only the step they are working on instead of scrolling through a very long page.

Accessibility improvements include:

- Expand/collapse buttons.
- `aria-expanded` states.
- Keyboard-friendly interaction.
- Structured step content.

---

## 10. Guide Tools Linked to the Store

Tools mentioned inside repair guides are linked to the store when possible.

For example, if a guide mentions an OBD-II reader, torque wrench or basic repair kit, the user can access related products from the store.

This creates a connection between educational content and the e-commerce section without requiring the user to manually search for each tool.

---

## 11. Store Overview

The store is designed as a simple and intuitive tool shop for repair and maintenance products.

Store features include:

- Product cards.
- Product categories.
- Product variants or sizes.
- Price display.
- Stock display.
- Product descriptions.
- Add-to-cart buttons.
- Product search.
- Product filters.
- Sorting options.
- Product detail modal.
- Side cart.
- Order form.

The store is connected to Supabase, so product data is no longer hardcoded only in the HTML.

---

## 12. Product Search and Filtering

The store includes frontend filtering tools that do not require database changes.

Users can:

- Search by product name.
- Search by description.
- Filter by category.
- Filter by stock availability.
- Sort by price.
- Sort by stock.
- Sort by relevance/default order.

The product data is loaded from Supabase and then filtered in JavaScript on the client side.

---

## 13. Product Detail Modal

Each product can be opened in a more detailed modal view.

The modal can show:

- Product name.
- Category.
- Long description.
- Available variants.
- Price.
- Stock.
- Key features.
- Add-to-cart action.

This improves the shopping experience without requiring a separate product page.

---

## 14. Side Cart

The cart has been improved into a side drawer/cart panel.

The side cart includes:

- List of selected products.
- Selected variant.
- Quantity.
- Unit price.
- Line subtotal.
- Cart total.
- Remove item option.
- Quantity update controls.
- Checkout button.

The cart is stored in `localStorage`, meaning it remains available after refreshing the page on the same browser.

---

## 15. Basic Order Flow

The order flow works as follows:

1. The user loads products from Supabase.
2. The user adds one or more products to the cart.
3. The cart stores selected products and variants in the browser.
4. The user opens the checkout/order form.
5. The user enters basic customer information.
6. JavaScript sends the order to Supabase.
7. Supabase creates the order and order items.
8. Stock is reduced for the purchased variants.
9. The website displays an order confirmation.

The order confirmation includes a more complete summary with the order ID and selected products.

---

## 16. Supabase Backend Overview

Supabase is used as the backend and database layer for the store.

Supabase provides:

- PostgreSQL database.
- Public API access through the Supabase JavaScript client.
- Row Level Security policies.
- SQL functions.
- Product storage.
- Variant storage.
- Order storage.
- Order item storage.

The website uses the Supabase client directly from JavaScript, which allows the static GitHub Pages site to communicate with the database.

---

## 17. Supabase Configuration in the HTML

The HTML contains the Supabase project configuration:

```js
const SUPABASE_URL = 'https://akvixlkljvtqmhkqxmpj.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY';
```

Only the public anon/publishable key should be used in frontend code.

Never place the Supabase `service_role` key inside the HTML. The `service_role` key bypasses Row Level Security and must only be used on a secure server.

---

## 18. Database Tables

The Supabase database uses these main tables:

### `products`

Stores general product information.

Typical fields:

- `id`
- `slug`
- `name`
- `category`
- `description`
- `price`
- `image_url`
- `active`
- `created_at`

### `product_variants`

Stores product sizes, measures or versions.

Typical fields:

- `id`
- `product_id`
- `label`
- `price`
- `stock`
- `active`
- `created_at`

### `orders`

Stores customer orders.

Typical fields:

- `id`
- `customer_name`
- `customer_email`
- `customer_phone`
- `customer_address`
- `total`
- `status`
- `created_at`

### `order_items`

Stores each product line inside an order.

Typical fields:

- `id`
- `order_id`
- `product_id`
- `variant_id`
- `product_name`
- `variant_label`
- `quantity`
- `unit_price`
- `line_total`
- `created_at`

---

## 19. Product Loading from Supabase

Products are loaded from Supabase using JavaScript.

The frontend requests active products and their variants, then renders them inside the store grid.

The process is:

1. Connect to Supabase using the project URL and public key.
2. Query `products` where `active = true`.
3. Join or load related `product_variants`.
4. Store the result in a frontend array.
5. Render product cards.
6. Apply filters and sorting locally.

This allows the store to update when products are changed in Supabase.

---

## 20. Stock Handling

Stock is stored in `product_variants`.

When a user buys a product variant:

- The order is created.
- The order items are inserted.
- The selected variant stock is reduced.

The frontend should never be trusted as the only source of truth for stock or prices. The database should validate important operations.

---

## 21. Row Level Security

Row Level Security protects the database from unauthorized actions.

Recommended policy behavior:

- Public users can read active products.
- Public users can read active variants.
- Public users can create orders through the allowed order flow.
- Public users should not update product prices.
- Public users should not manually change stock.
- Public users should not delete products or orders.

This is important because the website is hosted publicly and uses a frontend Supabase key.

---

## 22. SQL Order Function

The project can use a SQL function such as `create_order()` to handle order creation safely.

The function should:

- Receive customer data and cart items.
- Validate product and variant IDs.
- Read prices from the database.
- Calculate totals server-side.
- Check stock availability.
- Insert the order.
- Insert order items.
- Reduce stock.
- Return the created order ID.

This prevents users from modifying prices directly in the browser.

---

## 23. Cart Storage

The cart is stored in the browser using `localStorage`.

Benefits:

- The cart survives page reloads.
- No login is required.
- The implementation remains simple.
- It works well for a basic store.

Limitations:

- The cart is only stored on the current browser/device.
- It is not shared between devices.
- It is not linked to a user account.

---

## 24. Recommended Products in Guides

The guides can display related store products based on the guide content.

For example:

- Oil change guides can recommend oil filter tools, drain pans or basic repair kits.
- Diagnostic guides can recommend OBD-II readers.
- Cooling system guides can recommend funnels, clamps or coolant tools.
- Timing or chain guides can recommend torque tools and inspection tools.

This is handled in JavaScript by matching guide keywords with product names, descriptions or categories.

No extra database tables are required.

---

## 25. Trust Blocks in the Store

The store includes trust-building UI blocks.

Examples:

- Technical support.
- Carefully selected tools.
- Competitive prices.
- Stock visibility.
- Secure order request.
- Repair-focused product selection.

These blocks improve user confidence without requiring backend changes.

---

## 26. Order Confirmation

After a successful order, the website shows a confirmation message.

The confirmation can include:

- Order ID.
- Customer name.
- Product summary.
- Total amount.
- Next steps.
- Message explaining that the order will be reviewed or confirmed.

The order ID comes from Supabase.

---

## 27. GitHub Pages Deployment

The website can be hosted on GitHub Pages because it is a static frontend.

Deployment steps:

1. Rename the final HTML file to `index.html`.
2. Upload it to the root of the GitHub repository.
3. Go to repository settings.
4. Open the Pages section.
5. Select deployment from the `main` branch and `/root` folder.
6. Save the configuration.
7. Wait for GitHub Pages to publish the site.

The final URL usually follows this structure:

```txt
https://your-username.github.io/your-repository-name/
```

---

## 28. Supabase Setup Steps

Basic Supabase setup:

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `schema.sql` to create tables, policies and functions.
4. Run `seed_products.sql` to insert initial products.
5. Check products using SQL queries.
6. Copy the project URL.
7. Copy the anon/publishable key.
8. Paste both values into the HTML Supabase configuration.
9. Upload the HTML to GitHub Pages.
10. Test product loading, cart and order creation.

---

## 29. Useful SQL Checks

Check tables:

```sql
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Check products:

```sql
select * from public.products;
```

Check variants:

```sql
select * from public.product_variants;
```

Check orders:

```sql
select *
from public.orders
order by created_at desc;
```

Check order items:

```sql
select *
from public.order_items
order by created_at desc;
```

Check products with stock:

```sql
select
  p.name,
  v.label,
  v.price,
  v.stock
from public.products p
join public.product_variants v on v.product_id = p.id
order by p.name, v.label;
```

---

## 30. Current Limitations

The current version is suitable for a basic store, but it is not yet a complete commercial e-commerce system.

Current limitations:

- No real payment gateway.
- No user accounts.
- No admin panel inside the website.
- No invoice generation.
- No shipping carrier integration.
- No email automation.
- No advanced order status workflow.

These can be added later.

---

## 31. Future Improvements

Recommended future improvements:

- Payment integration.
- Admin dashboard.
- Product image upload through Supabase Storage.
- User accounts.
- Order status tracking.
- Email confirmation.
- PDF invoice generation.
- Discount codes.
- Related product system stored in database.
- Analytics dashboard.
- Stock alert system.

---

## 32. Security Notes

Important security rules:

- Never expose the Supabase `service_role` key in frontend code.
- Keep Row Level Security enabled.
- Do not trust prices sent from the browser.
- Validate stock and totals in the database or secure backend.
- Restrict write policies carefully.
- Use HTTPS hosting.
- Clean test orders before production.

---

## 33. Project Summary

AutoRepara.es is now more than a static educational website. It includes:

- Repair education.
- Vehicle technical profiles.
- Engine system explanations.
- Expandable detailed guides.
- A Supabase-connected store.
- Dynamic product loading.
- Product variants.
- Stock control.
- Cart functionality.
- Basic order creation.
- GitHub Pages deployment compatibility.

The project remains lightweight because it uses a static frontend and Supabase as backend, avoiding the need for a traditional custom server during the first production stage.
