# 🏗️ Craftory POS System Architecture & Data Flow

Ye document **Craftory POS** ke sabhi sections, unki functionality, aur data integration (kahan se data aa raha hai) ko detail mein explain karta hai.

---

## 🚀 1. Core Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS.
- **Backend:** Next.js API Routes (Serverless).
- **Database:** PostgreSQL with **Prisma ORM**.
- **Authentication:** NextAuth.js (Credentials & Google OAuth).
- **Icons:** Lucide React.

---

## 📦 2. Admin Panel Sections Overview

### 📊 Dashboard (`/app/dashboard`)
- **Kaam:** Business ki health (Daily Sales, Monthly Revenue, Customer Growth) dikhana.
- **Data Source:** `GET /api/reports` & `GET /api/sales/summary`.
- **Logic:** Sales aur Purchase data ko aggregate karke charts (Recharts) mein convert kiya jata hai.

### 💳 POS Billing (`/app/pos`)
- **Kaam:** Quick billing, cart management, aur sales generator.
- **Integration:**
  - **Products:** `GET /api/products` (Search bars and quick picks).
  - **Customers:** `GET /api/customers` (Link walk-in or existing users).
  - **Sale Creation:** `POST /api/sales` (Final transaction processing).
- **Speciality:** Real-time stock calculation aur automatic invoice number generation.

### 📦 Inventory Management
1. **Products (`/app/products`):**
   - **Data Source:** `GET/POST/PUT/DELETE /api/products`.
   - **Fields:** Barcode, Price, Cost, Stock, Category.
2. **Categories (`/app/categories`):**
   - **Data Source:** `GET/POST /api/categories`.
   - **Feature:** Industry-wise seeding (Kirana, Pharmacy, etc.) from `src/lib/data/categories.json`.
3. **Adjustments (`/app/inventory/adjustments`):**
   - **Data Source:** `GET /api/inventory/logs`.
   - **Kaam:** Stock increase/decrease audit trail rakhna.

### 🧾 Invoices (`/app/invoices`)
- **Kaam:** History check karna aur bills manage karna.
- **Data Source:** `GET /api/sales` (Fetch all invoices).
- **Features:** WhatsApp Share link, Thermal Printer (Standard 80mm), PDF Download.

### 🤝 Customers & Suppliers
- **Customers (`/app/customers`):** API: `/api/customers`. Loyalty tracking aur total spending record.
- **Suppliers (`/app/suppliers`):** API: `/api/suppliers`. Vendors contact aur payment details.
- **Purchase Orders (`/app/purchase-orders`):** API: `/api/purchase-orders`. Stock buy karne ka track.

### 👥 Staff & Roles
- **Staff Page:** API: `/api/staff`.
- **Roles:** 
  - `ADMIN`: Full Access.
  - `MANAGER`: Reports & Settings access (Limited).
  - `CASHIER`: Only POS & Invoices.

---

## 🔄 3. Key Data Flows

### A. Onboarding Flow (The First Step)
1. User Signup -> Shop Creation.
2. Step 1-5: Business Profile, GST, Contact settings.
3. **Step 6 (Magic Step):** `POST /api/onboarding` 
   - `categories.json` se matched `businessType` uthata hai.
   - Database mein automatic default categories create karta hai.
   - User ko ready-to-use system milta hai.

### B. Sale & Inventory Sync
1. Sale complete hoti hai (`/api/sales`).
2. Database mein **SaleItem** banta hai.
3. Product table mein **stockQuantity** automatically ghat jati hai (-).
4. `inventory_logs` table mein ek log generate hota hai (ChangeType: SALE).

---

## 🛠️ 4. Specialized Tool Integrations

1. **Barcode Scanner:** `BarcodeScanner.tsx` component (Using `@zxing/browser`). Device camera se barcode scan karke POS search bar mein item auto-fill karta hai.
2. **Thermal Receipt:** Standard browser `window.print()` logic with `@media print` CSS rules.
3. **WhatsApp Sharing:** Pre-formatted `wa.me` links jo client side par generate hote hain.

---

## 💾 5. Database Schema (Prisma)
- **Shops Table:** Master table for business info.
- **Users Table:** Auth and roles.
- **Products & Categories:** Inventory core.
- **Sales & SaleItems:** Transaction history.
- **Suppliers & PurchaseOrders:** B2B tracking.

---

> [!NOTE]
> System current architecture ke hisaab se **Multi-Tenant** hai, yani har user ka data `shopId` se isolated hai.
