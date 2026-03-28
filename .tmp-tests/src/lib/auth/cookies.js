"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSession = getServerSession;
const headers_1 = require("next/headers");
const session_1 = require("@/lib/auth/session");
async function getServerSession() {
    const cookieStore = await (0, headers_1.cookies)();
    return (0, session_1.readSession)(cookieStore);
}
