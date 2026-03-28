import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAdminPath,
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
