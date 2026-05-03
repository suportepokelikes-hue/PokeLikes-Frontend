"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const navigation_1 = require("../src/modules/catalog/navigation");
(0, node_test_1.default)('buildCatalogDetailPath keeps the service route shape', () => {
    strict_1.default.equal((0, navigation_1.buildCatalogDetailPath)('/catalog', 'svc-10'), '/catalog/svc-10');
});
(0, node_test_1.default)('buildCustomerNewOrderPath includes only the meaningful query params', () => {
    strict_1.default.equal((0, navigation_1.buildCustomerNewOrderPath)({
        serviceId: 'svc-10',
        category: 'Instagram',
        search: 'likes premium',
        affiliateCode: 'AFF10',
    }), '/app/new-order?serviceId=svc-10&category=Instagram&search=likes+premium&aff=AFF10');
    strict_1.default.equal((0, navigation_1.buildCustomerNewOrderPath)({
        serviceId: 'svc-10',
    }), '/app/new-order?serviceId=svc-10');
});
(0, node_test_1.default)('buildCustomerNewOrderPathFromService reuses the service category when available', () => {
    strict_1.default.equal((0, navigation_1.buildCustomerNewOrderPathFromService)({ id: 'svc-10', category: 'Instagram' }, 'AFF10'), '/app/new-order?serviceId=svc-10&category=Instagram&aff=AFF10');
});
