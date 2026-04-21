import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAdminPath,
  parseAdminCatalogCreateSupplierServiceId,
  parseAdminAffiliateCommissionsParams,
  parseAdminAffiliatePayoutsParams,
  parseAdminAffiliatesParams,
  parseAdminTransactionsParams,
  parseSupplierServicesParams,
} from '../src/modules/admin-shell/query';

test('buildAdminPath omits empty params and keeps meaningful values', () => {
  const path = buildAdminPath('/admin/transactions', {
    search: 'wallet',
    page: 2,
    pageSize: 20,
    userId: '',
    type: undefined,
  });

  assert.equal(path, '/admin/transactions?search=wallet&page=2&pageSize=20');
});

test('parseAdminTransactionsParams keeps only valid filter values', () => {
  const params = parseAdminTransactionsParams({
    page: '3',
    pageSize: '25',
    search: '  pix  ',
    direction: 'credit',
    sortOrder: 'desc',
    userId: ['42'],
    dateFrom: '',
  });

  assert.deepEqual(params, {
    page: 3,
    pageSize: 25,
    search: 'pix',
    direction: 'credit',
    sortOrder: 'desc',
    userId: '42',
    type: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: undefined,
  });
});

test('parseSupplierServicesParams isolates supplier paging namespace', () => {
  const params = parseSupplierServicesParams({
    page: '9',
    servicesPage: '2',
    servicesPageSize: '50',
    search: 'ignored',
    servicesSearch: 'followers',
    isActiveAtSupplier: 'true',
  });

  assert.deepEqual(params, {
    page: 2,
    pageSize: 50,
    search: 'followers',
    supplierName: undefined,
    category: undefined,
    type: undefined,
    isActiveAtSupplier: 'true',
  });
});

test('parseAdminCatalogCreateSupplierServiceId keeps the catalog drawer target stable from query params', () => {
  assert.equal(
    parseAdminCatalogCreateSupplierServiceId({
      createSupplierServiceId: '123',
      createName: 'Ignored in production routing',
      createType: '',
    }),
    123,
  );

  assert.equal(
    parseAdminCatalogCreateSupplierServiceId({
      createSupplierServiceId: '0',
    }),
    undefined,
  );
});

test('parseAdminAffiliatesParams keeps only supported affiliate filters', () => {
  const params = parseAdminAffiliatesParams({
    page: '2',
    pageSize: '20',
    status: 'pending',
    sortOrder: 'asc',
    sortBy: 'createdAt',
  });

  assert.deepEqual(params, {
    page: 2,
    pageSize: 20,
    status: 'pending',
    sortOrder: 'asc',
  });
});

test('parseAdminAffiliateCommissionsParams keeps only supported commission filters', () => {
  const params = parseAdminAffiliateCommissionsParams({
    page: '3',
    pageSize: '50',
    status: 'approved',
    affiliateProfileId: 'aff-1',
    sortOrder: 'desc',
    userId: '42',
    dateFrom: '2026-04-20T10:00:00.000Z',
  });

  assert.deepEqual(params, {
    page: 3,
    pageSize: 50,
    status: 'approved',
    affiliateProfileId: 'aff-1',
    sortOrder: 'desc',
    userId: '42',
    dateFrom: '2026-04-20T10:00:00.000Z',
    dateTo: undefined,
  });
});

test('parseAdminAffiliatePayoutsParams keeps only supported payout filters', () => {
  const params = parseAdminAffiliatePayoutsParams({
    page: '1',
    pageSize: '10',
    status: 'paid',
    affiliateProfileId: 'aff-2',
    sortOrder: 'asc',
    dateFrom: '2026-04-20T00:00:00.000Z',
    userId: '84',
  });

  assert.deepEqual(params, {
    page: 1,
    pageSize: 10,
    status: 'paid',
    affiliateProfileId: 'aff-2',
    sortOrder: 'asc',
    userId: '84',
    dateFrom: '2026-04-20T00:00:00.000Z',
    dateTo: undefined,
  });
});
