import test from 'node:test';
import assert from 'node:assert/strict';

import { getCatalogAlternativePath, getCatalogAvailabilityView } from '../src/modules/catalog/availability-view';

test('getCatalogAvailabilityView distinguishes healthy, degraded and blocked catalog states', () => {
  const healthy = getCatalogAvailabilityView({
    availability: {
      providerStatus: 'healthy',
      isPurchasable: true,
      reason: 'provider_healthy',
    },
  });

  assert.equal(healthy.state, 'healthy');
  assert.equal(healthy.badgeLabel, 'Disponivel');
  assert.equal(healthy.purchaseLabel, 'Liberada');
  assert.equal(healthy.hasInlineNotice, false);

  const degraded = getCatalogAvailabilityView({
    availability: {
      providerStatus: 'degraded_low_balance',
      isPurchasable: true,
      reason: 'provider_low_balance',
    },
  });

  assert.equal(degraded.state, 'degraded');
  assert.equal(degraded.badgeTone, 'warning');
  assert.equal(degraded.badgeLabel, 'Com atencao');
  assert.match(degraded.detailDescription, /continua disponivel/i);

  const blocked = getCatalogAvailabilityView({
    availability: {
      providerStatus: 'unavailable',
      isPurchasable: false,
      reason: 'provider_unavailable',
    },
  });

  assert.equal(blocked.state, 'blocked');
  assert.equal(blocked.badgeTone, 'danger');
  assert.equal(blocked.cardCtaLabel, 'Ver alternativas');
  assert.match(blocked.nextStep, /catalogo/i);
});

test('getCatalogAvailabilityView keeps blocked low-balance and unknown states readable for the user', () => {
  const blockedLowBalance = getCatalogAvailabilityView({
    availability: {
      providerStatus: 'degraded_low_balance',
      isPurchasable: false,
      reason: 'provider_low_balance',
    },
  });

  assert.equal(blockedLowBalance.badgeLabel, 'Compra pausada');
  assert.match(blockedLowBalance.detailHeadline, /evitar falha/i);

  const unknown = getCatalogAvailabilityView({
    availability: {
      providerStatus: 'unknown',
      isPurchasable: false,
      reason: 'provider_status_unknown',
    },
  });

  assert.equal(unknown.badgeTone, 'info');
  assert.equal(unknown.purchaseLabel, 'Aguardando checagem');
});

test('getCatalogAlternativePath narrows the fallback catalog route to the same network and category', () => {
  assert.equal(
    getCatalogAlternativePath({
      socialNetwork: 'Instagram',
      category: 'Curtidas',
    }),
    '/catalog?socialNetwork=Instagram&category=Curtidas',
  );
});
