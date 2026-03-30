import { test, expect } from '@playwright/test';

import { loginAs } from './support/auth';
import { getAdminAlertId } from './support/env';

test.describe('admin operations', () => {
  test('admin resolves an open alert when one is available', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto('/admin/alerts?status=open');
    await expect(page.getByRole('heading', { name: 'Central de alertas operacionais.' })).toBeVisible();

    const alertId = getAdminAlertId();

    if (alertId) {
      const alertRow = page.locator('tr').filter({ hasText: alertId }).first();
      await expect(alertRow).toBeVisible();
      await alertRow.getByRole('button', { name: 'Resolver' }).click();
    } else {
      const resolveButton = page.getByRole('button', { name: 'Resolver' }).first();

      test.skip((await resolveButton.count()) === 0, 'Nenhum alerta aberto disponivel no ambiente E2E.');
      await resolveButton.click();
    }

    await expect(page.getByText('Alerta resolvido com sucesso.')).toBeVisible();
  });
});
