import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCatalogDetailPath, buildCustomerNewOrderPath, buildCustomerNewOrderPathFromService } from '../src/modules/catalog/navigation';

test('buildCatalogDetailPath keeps the service route shape', () => {
  assert.equal(buildCatalogDetailPath('/catalog', 'svc-10'), '/catalog/svc-10');
});

test('buildCustomerNewOrderPath includes only the meaningful query params', () => {
  assert.equal(
    buildCustomerNewOrderPath({
      serviceId: 'svc-10',
      category: 'Instagram',
      search: 'likes premium',
      affiliateCode: 'AFF10',
    }),
    '/app/new-order?serviceId=svc-10&category=Instagram&search=likes+premium&aff=AFF10',
  );

  assert.equal(
    buildCustomerNewOrderPath({
      serviceId: 'svc-10',
    }),
    '/app/new-order?serviceId=svc-10',
  );
});

test('buildCustomerNewOrderPathFromService reuses the service category when available', () => {
  assert.equal(
    buildCustomerNewOrderPathFromService({ id: 'svc-10', category: 'Instagram' }, 'AFF10'),
    '/app/new-order?serviceId=svc-10&category=Instagram&aff=AFF10',
  );
});
