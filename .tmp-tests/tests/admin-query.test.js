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
