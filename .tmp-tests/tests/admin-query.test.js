"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const query_1 = require("../src/modules/admin-shell/query");
(0, node_test_1.default)('buildAdminPath omits empty params and keeps meaningful values', () => {
    const path = (0, query_1.buildAdminPath)('/admin/transactions', {
        search: 'wallet',
        page: 2,
        pageSize: 20,
        userId: '',
        type: undefined,
    });
    strict_1.default.equal(path, '/admin/transactions?search=wallet&page=2&pageSize=20');
});
(0, node_test_1.default)('parseAdminTransactionsParams keeps only valid filter values', () => {
    const params = (0, query_1.parseAdminTransactionsParams)({
        page: '3',
        pageSize: '25',
        search: '  pix  ',
        direction: 'credit',
        sortOrder: 'desc',
        userId: ['42'],
        dateFrom: '',
    });
    strict_1.default.deepEqual(params, {
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
(0, node_test_1.default)('parseSupplierServicesParams isolates supplier paging namespace', () => {
    const params = (0, query_1.parseSupplierServicesParams)({
        page: '9',
        servicesPage: '2',
        servicesPageSize: '50',
        search: 'ignored',
        servicesSearch: 'followers',
        isActiveAtSupplier: 'true',
    });
    strict_1.default.deepEqual(params, {
        page: 2,
        pageSize: 50,
        search: 'followers',
        supplierName: undefined,
        category: undefined,
        type: undefined,
        isActiveAtSupplier: 'true',
    });
});
(0, node_test_1.default)('parseAdminCatalogCreateSupplierServiceId keeps the catalog drawer target stable from query params', () => {
    strict_1.default.equal((0, query_1.parseAdminCatalogCreateSupplierServiceId)({
        createSupplierServiceId: '123',
        createName: 'Ignored in production routing',
        createType: '',
    }), 123);
    strict_1.default.equal((0, query_1.parseAdminCatalogCreateSupplierServiceId)({
        createSupplierServiceId: '0',
    }), undefined);
});
(0, node_test_1.default)('parseAdminAffiliatesParams keeps only supported affiliate filters', () => {
    const params = (0, query_1.parseAdminAffiliatesParams)({
        page: '2',
        pageSize: '20',
        status: 'pending',
        sortOrder: 'asc',
        sortBy: 'createdAt',
    });
    strict_1.default.deepEqual(params, {
        page: 2,
        pageSize: 20,
        status: 'pending',
        sortOrder: 'asc',
    });
});
(0, node_test_1.default)('parseAdminAffiliateCommissionsParams keeps only supported commission filters', () => {
    const params = (0, query_1.parseAdminAffiliateCommissionsParams)({
        page: '3',
        pageSize: '50',
        status: 'approved',
        affiliateProfileId: 'aff-1',
        sortOrder: 'desc',
        userId: '42',
        dateFrom: '2026-04-20T10:00:00.000Z',
    });
    strict_1.default.deepEqual(params, {
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
(0, node_test_1.default)('parseAdminAffiliatePayoutsParams keeps only supported payout filters', () => {
    const params = (0, query_1.parseAdminAffiliatePayoutsParams)({
        page: '1',
        pageSize: '10',
        status: 'paid',
        affiliateProfileId: 'aff-2',
        sortOrder: 'asc',
        dateFrom: '2026-04-20T00:00:00.000Z',
        userId: '84',
    });
    strict_1.default.deepEqual(params, {
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
