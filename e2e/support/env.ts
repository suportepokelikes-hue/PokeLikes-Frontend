type Role = 'customer' | 'admin';

type E2ECredentials = {
  email: string;
  password: string;
};

function readRequired(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required E2E environment variable: ${name}`);
  }

  return value;
}

export function getCredentials(role: Role): E2ECredentials {
  if (role === 'admin') {
    return {
      email: readRequired('E2E_ADMIN_EMAIL'),
      password: readRequired('E2E_ADMIN_PASSWORD'),
    };
  }

  return {
    email: readRequired('E2E_CUSTOMER_EMAIL'),
    password: readRequired('E2E_CUSTOMER_PASSWORD'),
  };
}

export function getPixAmount() {
  return process.env.E2E_PIX_AMOUNT?.trim() || '10.00';
}

export function getCheckoutLink() {
  return process.env.E2E_CHECKOUT_LINK?.trim() || 'https://instagram.com/likesuai_e2e';
}

export function getCheckoutServiceId() {
  const value = process.env.E2E_CHECKOUT_SERVICE_ID?.trim();

  return value || null;
}

export function getAdminAlertId() {
  const value = process.env.E2E_ADMIN_ALERT_ID?.trim();

  return value || null;
}

export function getAffiliateCode() {
  return process.env.E2E_AFFILIATE_CODE?.trim() || 'E2E-AFFILIATE';
}

export function getAdminRequestedPayoutId() {
  const value = process.env.E2E_ADMIN_REQUESTED_PAYOUT_ID?.trim();

  return value || null;
}
