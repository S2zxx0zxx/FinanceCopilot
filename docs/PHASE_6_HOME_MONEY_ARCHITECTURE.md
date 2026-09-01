# Phase 6 Architecture: Home & Money

## Overview
The Phase 6 architecture strictly adheres to a Backend-for-Frontend (BFF) pattern serving a lightweight Vanilla JS Single Page Application. There is ZERO financial calculation performed on the client. The frontend is exclusively responsible for routing, state mapping, and currency formatting.

## Key Components
- **Router**: `app.js`
- **Views**: `home.js`, `money.js`, `transactions.js`
- **API**: `financial.controller.js`, `transactions.controller.js`
