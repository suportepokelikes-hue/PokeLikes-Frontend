import { expect, type Page } from '@playwright/test';

import { getCheckoutServiceId } from './env';

export async function openCheckoutCandidate(page: Page) {
  const pinnedServiceId = getCheckoutServiceId();

  if (pinnedServiceId) {
    await page.goto(`/catalog/${pinnedServiceId}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    return;
  }

  await page.goto('/catalog');
  await expect(page.getByRole('heading', { name: /Servicos reais disponiveis no backend/i })).toBeVisible();

  const card = page.locator('.catalog-card').filter({ hasText: 'Compravel' }).first();
  await expect(card).toBeVisible();
  await card.click();
  await expect(page).toHaveURL(/\/catalog\/[^/]+$/);
}
