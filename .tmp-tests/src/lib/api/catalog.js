"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCatalogServices = listCatalogServices;
exports.getCatalogService = getCatalogService;
const http_1 = require("@/lib/api/http");
function listCatalogServices(params = {}) {
    return (0, http_1.apiRequest)({
        path: `/catalog/services${buildQueryString(params)}`,
    });
}
function getCatalogService(serviceId) {
    return (0, http_1.apiRequest)({
        path: `/catalog/services/${serviceId}`,
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
