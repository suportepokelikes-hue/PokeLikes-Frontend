"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const availability_view_1 = require("../src/modules/catalog/availability-view");
(0, node_test_1.default)('getCatalogAvailabilityView distinguishes healthy, degraded and blocked catalog states', () => {
    const healthy = (0, availability_view_1.getCatalogAvailabilityView)({
        availability: {
            providerStatus: 'healthy',
            isPurchasable: true,
            reason: 'provider_healthy',
        },
    });
    strict_1.default.equal(healthy.state, 'healthy');
    strict_1.default.equal(healthy.badgeLabel, 'Disponivel');
    strict_1.default.equal(healthy.purchaseLabel, 'Liberada');
    strict_1.default.equal(healthy.hasInlineNotice, false);
    const degraded = (0, availability_view_1.getCatalogAvailabilityView)({
        availability: {
            providerStatus: 'degraded_low_balance',
            isPurchasable: true,
            reason: 'provider_low_balance',
        },
    });
    strict_1.default.equal(degraded.state, 'degraded');
    strict_1.default.equal(degraded.badgeTone, 'warning');
    strict_1.default.equal(degraded.badgeLabel, 'Com atencao');
    strict_1.default.match(degraded.detailDescription, /continua disponivel/i);
    const blocked = (0, availability_view_1.getCatalogAvailabilityView)({
        availability: {
            providerStatus: 'unavailable',
            isPurchasable: false,
            reason: 'provider_unavailable',
        },
    });
    strict_1.default.equal(blocked.state, 'blocked');
    strict_1.default.equal(blocked.badgeTone, 'danger');
    strict_1.default.equal(blocked.cardCtaLabel, 'Ver alternativas');
    strict_1.default.match(blocked.nextStep, /catalogo/i);
});
(0, node_test_1.default)('getCatalogAvailabilityView keeps blocked low-balance and unknown states readable for the user', () => {
    const blockedLowBalance = (0, availability_view_1.getCatalogAvailabilityView)({
        availability: {
            providerStatus: 'degraded_low_balance',
            isPurchasable: false,
            reason: 'provider_low_balance',
        },
    });
    strict_1.default.equal(blockedLowBalance.badgeLabel, 'Compra pausada');
    strict_1.default.match(blockedLowBalance.detailHeadline, /evitar falha/i);
    const unknown = (0, availability_view_1.getCatalogAvailabilityView)({
        availability: {
            providerStatus: 'unknown',
            isPurchasable: false,
            reason: 'provider_status_unknown',
        },
    });
    strict_1.default.equal(unknown.badgeTone, 'info');
    strict_1.default.equal(unknown.purchaseLabel, 'Aguardando checagem');
});
(0, node_test_1.default)('getCatalogAlternativePath narrows the fallback catalog route to the same network and category', () => {
    strict_1.default.equal((0, availability_view_1.getCatalogAlternativePath)({
        socialNetwork: 'Instagram',
        category: 'Curtidas',
    }), '/catalog?socialNetwork=Instagram&category=Curtidas');
});
