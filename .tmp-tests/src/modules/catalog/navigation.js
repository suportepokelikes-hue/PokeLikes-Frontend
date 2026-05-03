"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCatalogDetailPath = buildCatalogDetailPath;
exports.buildCustomerNewOrderPath = buildCustomerNewOrderPath;
exports.buildCustomerNewOrderPathFromService = buildCustomerNewOrderPathFromService;
function buildCatalogDetailPath(basePath, serviceId) {
    return `${basePath}/${serviceId}`;
}
function buildCustomerNewOrderPath({ serviceId, category, affiliateCode, search, }) {
    const searchParams = new URLSearchParams();
    searchParams.set('serviceId', serviceId);
    if (category) {
        searchParams.set('category', category);
    }
    if (search) {
        searchParams.set('search', search);
    }
    if (affiliateCode) {
        searchParams.set('aff', affiliateCode);
    }
    return `/app/new-order?${searchParams.toString()}`;
}
function buildCustomerNewOrderPathFromService(service, affiliateCode) {
    return buildCustomerNewOrderPath({
        serviceId: service.id,
        category: service.category,
        affiliateCode,
    });
}
