import { test, expect, type Locator, type Page } from '@playwright/test';

import { loginAs } from './support/auth';
import { openCheckoutCandidate } from './support/catalog';
import { getAdminRequestedPayoutId, getAffiliateCode } from './support/env';

test.describe('affiliate operational flows', () => {
  test('catalog captures ?aff= and reuses it in checkout', async ({ page }) => {
    const affiliateCode = getAffiliateCode();

    await loginAs(page, 'customer');
    await expect(page).toHaveURL(/\/app$/);

    await page.goto(`/catalog?aff=${encodeURIComponent(affiliateCode)}`);
    await expect(page.getByText('Codigo de afiliado ativo')).toBeVisible();
    await expect(page.getByText(affiliateCode)).toBeVisible();

    await page.goto('/catalog');
    await expect(page.getByText('Codigo de afiliado ativo')).toBeVisible();
    await expect(page.getByText(affiliateCode)).toBeVisible();

    await openCheckoutCandidate(page);
    await expect(page.getByText('Codigo de afiliado aplicado')).toBeVisible();
    await expect(page.getByText(affiliateCode)).toBeVisible();
    await expect(page.locator('input[name="affiliateCode"]')).toHaveValue(affiliateCode);
  });

  test('customer affiliate page reads profile and PIX payout key area', async ({ page }) => {
    await loginAs(page, 'customer');
    await expect(page).toHaveURL(/\/app$/);

    await page.goto('/app/affiliate');
    await expect(page.getByRole('heading', { name: /Minha area de afiliado|Programa de afiliados/ })).toBeVisible();

    const activeArea = page.getByRole('heading', { name: 'Minha area de afiliado' });
    test.skip((await activeArea.count()) === 0, 'Cliente E2E ainda nao possui perfil de afiliado.');

    await expect(activeArea).toBeVisible();
    await expect(page.getByText('Codigo publico')).toBeVisible();
    await expect(page.getByText('Comissao sobre venda')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Chave PIX de payout' })).toBeVisible();
    await expect(page.getByLabel('Tipo da chave')).toBeVisible();
    await expect(page.getByLabel('Chave PIX')).toBeVisible();
  });

  test('admin starts the guided payout flow from approved commissions', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto('/admin/affiliate-commissions?status=approved&pageSize=50');
    await expect(page.getByRole('heading', { name: 'Comissoes afiliados' })).toBeVisible();

    const selectableCommission = page.getByRole('link', { name: 'Selecionar' }).first();
    test.skip((await selectableCommission.count()) === 0, 'Nenhuma comissao aprovada sem payout disponivel no ambiente E2E.');

    await selectableCommission.click();
    await expect(page.getByText('Selecao para payout')).toBeVisible();

    await page.getByRole('link', { name: 'Iniciar payout' }).click();
    await expect(page).toHaveURL(/\/admin\/affiliate-payouts\?.*create=1/);
    await expect(page.getByRole('heading', { name: 'Registrar payout afiliado' })).toBeVisible();
    await expect(page.getByLabel('ID do perfil')).not.toHaveValue('');
    await expect(page.getByLabel('IDs de comissoes aprovadas')).not.toHaveValue('');
  });

  test('admin payout processing action and manual refresh remain visible', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).toHaveURL(/\/admin$/);

    const requestedPayoutId = getAdminRequestedPayoutId();

    if (requestedPayoutId) {
      await page.goto('/admin/affiliate-payouts?status=requested&pageSize=50');
      await expect(page.getByRole('heading', { name: 'Payouts afiliados' })).toBeVisible();

      const requestedRow = findTableRow(page, requestedPayoutId);
      await expect(requestedRow).toBeVisible();
      await requestedRow.getByRole('button', { name: 'Processar PIX' }).click();
      await expect(page.getByText(new RegExp(`Payout ${escapeRegExp(requestedPayoutId)} atualizado para processing\\.`))).toBeVisible();

      await page.goto('/admin/affiliate-payouts?status=processing&pageSize=50');
      const processingRow = findTableRow(page, requestedPayoutId);
      await expect(processingRow).toBeVisible();
      await expect(processingRow.getByRole('button', { name: 'Atualizar Asaas' })).toBeVisible();
      return;
    }

    await page.goto('/admin/affiliate-payouts?status=processing&pageSize=50');
    await expect(page.getByRole('heading', { name: 'Payouts afiliados' })).toBeVisible();

    const refreshButton = page.getByRole('button', { name: 'Atualizar Asaas' }).first();
    test.skip((await refreshButton.count()) === 0, 'Nenhum payout em processing disponivel para validar refresh manual.');

    await expect(refreshButton).toBeVisible();
  });
});

function findTableRow(page: Page, text: string): Locator {
  return page.locator('tr').filter({ hasText: text }).first();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
