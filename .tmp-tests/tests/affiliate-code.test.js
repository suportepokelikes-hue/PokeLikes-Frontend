"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const affiliate_code_1 = require("../src/lib/affiliate-code");
(0, node_test_1.default)('normalizeAffiliateCode keeps only non-empty trimmed values', () => {
    strict_1.default.equal((0, affiliate_code_1.normalizeAffiliateCode)(' AFILIA30 '), 'AFILIA30');
    strict_1.default.equal((0, affiliate_code_1.normalizeAffiliateCode)('   '), undefined);
    strict_1.default.equal((0, affiliate_code_1.normalizeAffiliateCode)(undefined), undefined);
});
(0, node_test_1.default)('readAffiliateCodeFromSearchParams reads only the aff parameter', () => {
    const searchParams = new URLSearchParams('search=likes&aff=CODIGO123&ref=OUTRO');
    strict_1.default.equal((0, affiliate_code_1.readAffiliateCodeFromSearchParams)(searchParams), 'CODIGO123');
});
(0, node_test_1.default)('appendAffiliateCodeToPath appends or preserves the affiliate code safely', () => {
    strict_1.default.equal((0, affiliate_code_1.appendAffiliateCodeToPath)('/catalog/10', 'AFF10'), '/catalog/10?aff=AFF10');
    strict_1.default.equal((0, affiliate_code_1.appendAffiliateCodeToPath)('/catalog?search=likes', 'AFF10'), '/catalog?search=likes&aff=AFF10');
    strict_1.default.equal((0, affiliate_code_1.appendAffiliateCodeToPath)('/catalog?search=likes', '   '), '/catalog?search=likes');
});
(0, node_test_1.default)('persistAffiliateCode keeps the latest valid code and ignores blank replacements', () => {
    const storage = new Map();
    const target = globalThis;
    const originalWindow = target.window;
    const localStorageMock = {
        get length() {
            return storage.size;
        },
        clear() {
            storage.clear();
        },
        getItem(key) {
            return storage.has(key) ? storage.get(key) ?? null : null;
        },
        key(index) {
            return Array.from(storage.keys())[index] ?? null;
        },
        removeItem(key) {
            storage.delete(key);
        },
        setItem(key, value) {
            storage.set(key, value);
        },
    };
    target.window = { localStorage: localStorageMock };
    try {
        (0, affiliate_code_1.clearStoredAffiliateCode)();
        (0, affiliate_code_1.persistAffiliateCode)(' AFF01 ');
        strict_1.default.equal((0, affiliate_code_1.getStoredAffiliateCode)(), 'AFF01');
        (0, affiliate_code_1.persistAffiliateCode)(' AFF02 ');
        strict_1.default.equal((0, affiliate_code_1.getStoredAffiliateCode)(), 'AFF02');
        (0, affiliate_code_1.persistAffiliateCode)('   ');
        strict_1.default.equal((0, affiliate_code_1.getStoredAffiliateCode)(), 'AFF02');
    }
    finally {
        if (originalWindow) {
            target.window = originalWindow;
        }
        else {
            delete target.window;
        }
    }
});
