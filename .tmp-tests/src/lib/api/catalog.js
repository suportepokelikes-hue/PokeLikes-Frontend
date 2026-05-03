"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCatalogServices = listCatalogServices;
exports.listCatalogServicesForOrderForm = listCatalogServicesForOrderForm;
exports.getCatalogService = getCatalogService;
const http_1 = require("@/lib/api/http");
function listCatalogServices(params = {}, { accessToken } = {}) {
    return (0, http_1.apiRequest)({
        path: `/catalog/services${buildQueryString(params)}`,
        accessToken,
    });
}
async function listCatalogServicesForOrderForm({ accessToken } = {}) {
    const firstPage = await listCatalogServices({
        page: 1,
        pageSize: 100,
        sortOrder: 'asc',
    }, { accessToken });
    if (firstPage.totalPages <= 1) {
        return firstPage.items;
    }
    const remainingPages = await Promise.all(Array.from({ length: firstPage.totalPages - 1 }, (_, index) => listCatalogServices({
        page: index + 2,
        pageSize: 100,
        sortOrder: 'asc',
    }, { accessToken })));
    return [firstPage, ...remainingPages].flatMap((page) => page.items);
}
function getCatalogService(serviceId, { accessToken } = {}) {
    return (0, http_1.apiRequest)({
        path: `/catalog/services/${serviceId}`,
        accessToken,
    });
}
function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    }
    const query = searchParams.toString();
    return query ? `?${query}` : '';
}
