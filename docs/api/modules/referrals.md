# Referrals Module

## Purpose

Expose the authenticated user's referral identity and current referral-program summary.

## Status

- in_progress

## Routes

### `GET /v1/me/referral`

Purpose:

- return the current user's referral code, referral link, reward rules, and current summary

Current implementation:

- requires bearer auth
- returns:
  - `referralCode`
  - `referralLink`
  - `emailVerified`
  - `rewardRules`
  - `rewardStatus`
  - `ownReferralReward`
  - `summary`

Current `rewardStatus` values:

- `not_referred`
- `pending_email_verification`
- `pending_first_qualifying_topup`
- `rewarded`

Current summary behavior:

- `invitedUsers` counts users who registered with the current user's referral code
- `rewardedUsers` counts invited users that already generated the bilateral reward
- `earnedAmount` sums the current user's referrer-side bonus earnings

## Frontend Notes

- the frontend can use this route as the main source for referral cards and dashboards
- `referralLink` uses `FRONTEND_APP_URL` and falls back to `http://localhost:3000`
- referral qualification now depends on the token-based email verification flow from the auth module
- `rewardStatus` should drive eligibility messaging in the frontend
- the auth module now supports SMTP delivery for verification email when configured
