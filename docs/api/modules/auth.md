# Auth Module

## Purpose

Authentication and session management for customers and admins.

## Status

- in_progress

## Responsibilities

- public registration
- login with email and password
- token refresh
- logout
- current session identity

## Planned Routes

### `POST /v1/auth/register`

Purpose:

- create a customer account

Expected request fields:

- `name`
- `email`
- `password`
- `phone`
- `referralCode` optional

### `POST /v1/auth/login`

Purpose:

- authenticate customer or admin

Expected request fields:

- `email`
- `password`

Expected result:

- access token
- refresh token
- authenticated user profile summary

### `POST /v1/auth/refresh`

Purpose:

- rotate refresh token and issue new access token

Current implementation:

- accepts `refreshToken` in JSON body
- revokes the previous refresh token on successful rotation

### `POST /v1/auth/logout`

Purpose:

- revoke current refresh token/session

Current implementation:

- accepts `refreshToken` in JSON body
- revokes the token if it exists
- returns `204`

### `GET /v1/auth/me`

Purpose:

- return current authenticated profile and role

## Frontend Notes

- The frontend should treat `role` as the primary switch between customer and admin navigation.
- Token refresh should be centralized in the frontend API layer.
- Login failure must not leak whether the email exists.

## Open Decisions

- whether admin accounts are seeded manually or created through admin flows
- password recovery flow for V1

## Implemented Slice

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `GET /v1/auth/me`
- `POST /v1/auth/email-verification/request`
- `POST /v1/auth/email-verification/confirm`

Current register behavior:

- registration returns tokens immediately
- customer wallet is created together with the account
- every new user now receives a unique `referralCode`
- register may optionally accept a valid `referralCode` to persist the referral link
- auth session responses now expose `referralCode` and `emailVerified`

### `POST /v1/auth/email-verification/request`

Purpose:

- request a verification token for the authenticated user's email

Current implementation:

- requires bearer auth
- invalidates previous unconsumed email verification tokens for the same user
- sends a real verification email when SMTP is configured
- returns a generic delivery shape
- outside production, also returns a `previewToken` so local development and tests can confirm the email without an SMTP provider
- in production, if SMTP is not configured, the route returns `503 SERVICE_UNAVAILABLE`

### `POST /v1/auth/email-verification/confirm`

Purpose:

- confirm an email verification token and mark the account email as verified

Expected request fields:

- `token`

Current implementation:

- public route
- validates token hash, expiration, and one-time use
- marks the matched user `emailVerifiedAt`
- invalidates any other outstanding verification tokens for the same user
- returns the same `UserSummary` shape exposed by `GET /v1/auth/me`
