import { expect, type Page } from '@playwright/test';

import { getCredentials } from './env';

export async function loginAs(page: Page, role: 'customer' | 'admin', options?: { returnTo?: string }) {
  const credentials = getCredentials(role);
  const target = options?.returnTo ? `/login?reason=required&returnTo=${encodeURIComponent(options.returnTo)}` : '/login';

  await page.goto(target);
  await expect(page.getByRole('heading', { name: /Entre para continuar/i })).toBeVisible();
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Senha').fill(credentials.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

export async function logoutFromShell(page: Page) {
  await page.getByRole('button', { name: /Encerrar sessao|Sair/i }).click();
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
  await expect(page.getByText('Logout concluido')).toBeVisible();
}
