import { test, expect } from '@playwright/test';

import { loginAs, logoutFromShell } from './support/auth';

test.describe('auth flows', () => {
  test('customer returns to the original protected route after login', async ({ page }) => {
    await page.goto('/app/orders');
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    await expect(page.getByText('Acesso necessario')).toBeVisible();

    await page.getByLabel('Email').fill(process.env.E2E_CUSTOMER_EMAIL ?? '');
    await page.getByLabel('Senha').fill(process.env.E2E_CUSTOMER_PASSWORD ?? '');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/app\/orders$/);
    await expect(page.getByRole('heading', { name: 'Pedidos do cliente.' })).toBeVisible();

    await logoutFromShell(page);
  });

  test('admin returns to the dashboard after login and can logout', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
    await expect(page.getByText('Acesso necessario')).toBeVisible();

    await loginAs(page, 'admin');

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole('heading', { name: 'Resumo operacional em tempo real.' })).toBeVisible();

    await logoutFromShell(page);
  });
});
