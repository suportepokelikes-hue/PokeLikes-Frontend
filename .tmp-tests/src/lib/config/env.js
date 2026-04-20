"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicEnv = getPublicEnv;
const env = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/v1',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Pokelike',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
function getPublicEnv() {
    return env;
}
