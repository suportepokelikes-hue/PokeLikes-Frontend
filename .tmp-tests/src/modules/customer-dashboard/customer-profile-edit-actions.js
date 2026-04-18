'use server';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerProfileAction = updateCustomerProfileAction;
const cache_1 = require("next/cache");
const navigation_1 = require("next/navigation");
const customer_1 = require("@/lib/api/customer");
const cookies_1 = require("@/lib/auth/cookies");
const navigation_2 = require("@/lib/auth/navigation");
const server_cookies_1 = require("@/lib/auth/server-cookies");
const customer_profile_edit_1 = require("./customer-profile-edit");
async function updateCustomerProfileAction(_, formData) {
    const session = await (0, cookies_1.getServerSession)();
    if (session.status !== 'authenticated' || session.user.role !== 'customer') {
        (0, navigation_1.redirect)((0, navigation_2.getLoginPath)({ reason: 'required', returnTo: '/app/profile?edit=1' }));
    }
    const parsed = (0, customer_profile_edit_1.parseCustomerProfileEditDraft)(formData);
    if ('error' in parsed) {
        return parsed.error;
    }
    try {
        const updatedProfile = await (0, customer_1.updateCustomerProfile)({ accessToken: session.accessToken }, parsed.value);
        await (0, server_cookies_1.writeServerUserCookie)(updatedProfile);
    }
    catch (error) {
        return (0, customer_profile_edit_1.mapCustomerProfileEditError)(error);
    }
    (0, cache_1.revalidatePath)('/app');
    (0, cache_1.revalidatePath)('/app/profile');
    (0, navigation_1.redirect)('/app/profile?updated=1');
}
