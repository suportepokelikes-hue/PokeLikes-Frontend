"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoney = formatMoney;
exports.formatDateTime = formatDateTime;
exports.formatNumber = formatNumber;
exports.formatCompactNumber = formatCompactNumber;
function formatMoney(money) {
    if (!money) {
        return '-';
    }
    const amount = Number(money.amount);
    if (Number.isNaN(amount)) {
        return `${money.currency} ${money.amount}`;
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: money.currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
function formatDateTime(value) {
    if (!value) {
        return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}
function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}
function formatCompactNumber(value) {
    return new Intl.NumberFormat('pt-BR', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}
