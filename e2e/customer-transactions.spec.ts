import { test, expect } from '@playwright/test';

import { loginAs } from './support/auth';
import { openCheckoutCandidate } from './support/catalog';
import { getCheckoutLink, getPixAmount } from './support/env';

test.describe('customer transactional flows', () => {
  test('customer creates a PIX charge and lands on payment detail', async ({ page }) => {
    await loginAs(page, 'customer');
    await expect(page).toHaveURL(/\/app$/);

    await page.goto('/app/payments');
    await expect(page.getByRole('heading', { name: 'Pagamentos PIX do cliente.' })).toBeVisible();

    await page.getByLabel('Valor').fill(getPixAmount());
    await page.getByRole('button', { name: 'Criar PIX' }).click();

    await expect(page).toHaveURL(/\/app\/payments\/[^/]+$/);
    await expect(page.getByRole('heading', { name: /Pagamento / })).toBeVisible();
    await expect(page.getByText('Estado PIX')).toBeVisible();
  });

  test('customer creates an order from the catalog and lands on order detail', async ({ page }) => {
    await loginAs(page, 'customer');
    await expect(page).toHaveURL(/\/app$/);

    await openCheckoutCandidate(page);

    const quantityField = page.getByLabel('Quantidade');
    const minQuantity = await quantityField.getAttribute('min');

    await quantityField.fill(minQuantity || '1');
    await page.getByLabel('Link do destino').fill(getCheckoutLink());
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();

    await expect(page).toHaveURL(/\/app\/orders\/[^/]+$/);
    await expect(page.getByRole('heading', { name: /Pedido / })).toBeVisible();
    await expect(page.getByText('Estado tecnico')).toBeVisible();
  });
});
