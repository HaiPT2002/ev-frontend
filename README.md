# EV Management - Frontend (Vite + React + TypeScript)

This folder contains a lightweight scaffold for an EV Management frontend using Vite + React + TypeScript.

Summary (Tóm tắt ngắn): based on domain (electric vehicles, dealers, test drives, sale contracts, users, payments via VNPAY), proposed minimal set of screens for MVP and extensions (routes included).

MVP (14 screens)
1. Login — /login
2. Dashboard — /dashboard
3. Vehicles List — /vehicles
4. Vehicle Detail — /vehicles/:id
5. Sale Contracts List — /contracts
6. Contract Detail/Edit — /contracts/:id
7. Customers List & Detail — /customers, /customers/:phone
8. Test Drives (list/calendar) & create — /testdrives, /testdrives/create
9. Users & roles — /users, /users/:id
10. Dealers — /dealers, /dealers/:id
11. Create Payment — /payments/create
12. Payments List — /payments
13. Payment Return/Result — /payments/return (VNPAY redirect)
14. Settings (VNPAY config) — /settings

Extensions (3–4)
- Payment Methods — /payment-methods
- Reports — /reports
- Dev VNPAY Debug (dev only) — /dev/vnpay-debug

Roles & access
- ADMIN: all pages
- EVM_STAFF: Dashboard, Vehicles, Contracts, Customers, Payments, TestDrives
- DEALER_MANAGER / DEALER_STAFF: dealer-scoped views only

Sprint suggestion
- Sprint 1 (core): Login, Dashboard, Vehicles list/detail, Contracts list/detail, Create payment + Payment return.
- Sprint 2: Customers, Test drives calendar, Users, Dealers.
- Sprint 3: Reports, Payment methods, Settings, Debug tools.

UI/UX notes
- Backend returns paymentUrl → frontend redirects browser to VNPAY.
- Payment return page should call backend to verify signature before showing final result.
- Protect debug/settings pages to ADMIN only.

How to run
1. cd into this folder: `ev-frontend`
2. Install deps: `npm install`
3. Run dev server: `npm run dev` (default port 5173)

What I scaffolded
- Vite + TS config, React entry
- AuthProvider with role simulation (localStorage)
- Layout with top navigation and conditional links
- Route file with all MVP + extension routes and skeleton pages
- Payment return page includes a placeholder axios call to `/api/payments/verify`

Next steps (optional)
- Hook components to real backend endpoints
- Add form validation, UI library (AntD/MUI), charts for reports
- Implement dealer scoping and backend RBAC enforcement

