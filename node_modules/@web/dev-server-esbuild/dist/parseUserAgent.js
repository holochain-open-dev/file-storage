"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserAgent = void 0;
const ua_parser_js_1 = require("ua-parser-js");
function parseUserAgent(userAgent) {
    const parser = new ua_parser_js_1.UAParser(userAgent);
    const browser = parser.getBrowser();
    return {
        name: browser.name,
        version: browser.version != null ? String(browser.version) : undefined,
    };
}
exports.parseUserAgent = parseUserAgent;
//# sourceMappingURL=parseUserAgent.js.map