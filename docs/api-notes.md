# API Notes For Frontend

## Primary Contract

- `docs/contracts/backend-openapi.yaml`

## High-Value Endpoints For Initial UI

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Customer

- `GET /me`
- `GET /me/wallet`
- `GET /me/wallet/transactions`
- `POST /me/payments/pix`
- `GET /me/payments`
- `GET /me/payments/:id`
- `GET /me/orders`
- `GET /me/orders/:id`
- `POST /me/orders`
- `POST /me/support/tickets`
- `GET /me/support/tickets`
- `GET /me/support/tickets/:ticketId`
- `POST /me/support/tickets/:ticketId/messages`

### Public Catalog

- `GET /catalog/services`
- `GET /catalog/services/:id`

### Admin

- `GET /admin/dashboard/summary`
- `GET /admin/users`
- `POST /admin/users`
- `PATCH /admin/users/:id`
- `GET /admin/catalog/services`
- `POST /admin/catalog/services`
- `PATCH /admin/catalog/services/:id`
- `GET /admin/payments`
- `GET /admin/payments/:id`
- `GET /admin/payments/summary`
- `POST /admin/payments/reconcile`
- `POST /admin/payments/:id/reconcile`
- `GET /admin/orders`
- `GET /admin/orders/:id`
- `POST /admin/orders/sync`
- `POST /admin/orders/:id/sync`
- `POST /admin/test-orders`
- `GET /admin/support/tickets`
- `GET /admin/support/tickets/:ticketId`
- `POST /admin/support/tickets/:ticketId/messages`
- `POST /admin/support/tickets/:ticketId/close`
- `GET /admin/supplier/providers`
- `POST /admin/supplier/providers/refresh`
- `GET /admin/supplier/services`
- `POST /admin/supplier/services/sync`
- `GET /admin/supplier/sync-logs`
- `GET /admin/alerts`
- `PATCH /admin/alerts/:alertId/resolve`
- `GET /admin/audits`
- `GET /admin/transactions`

## UI Behaviors To Respect

- pagamento PIX criado não significa pagamento confirmado
- serviço de catálogo pode estar indisponível por `availability`
- pedidos e pagamentos têm estados assíncronos e devem ser mostrados como tal
