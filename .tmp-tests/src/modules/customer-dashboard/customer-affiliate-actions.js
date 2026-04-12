'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyToAffiliateProgramAction = applyToAffiliateProgramAction;
const cache_1 = require("next/cache");
const navigation_1 = require("next/navigation");
const customer_1 = require("@/lib/api/customer");
const http_1 = require("@/lib/api/http");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
async function applyToAffiliateProgramAction(_, _formData) {
    const session = await (0, cookies_1.getServerSession)();
    if (session.status !== 'authenticated' || session.user.role !== 'customer') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo: '/app/affiliate' }));
    }
    try {
        await (0, customer_1.applyToAffiliateProgram)({ accessToken: session.accessToken });
    }
    catch (error) {
        return {
            status: 'error',
            message: error instanceof http_1.ApiClientError
                ? error.message
                : 'Nao foi possivel solicitar sua entrada no programa de afiliados agora.',
        };
    }
    (0, cache_1.revalidatePath)('/app/affiliate');
    (0, navigation_1.redirect)('/app/affiliate');
}
