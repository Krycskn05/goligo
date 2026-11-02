"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectorsForRequest = connectorsForRequest;
const connector_contract_mjs_1 = require("./connector-contract.mjs");
const connector_context_1 = require("./connector-context");
/** Keep invocation context on this request; never cache it across visitors. */
function connectorsForRequest() {
    return (0, connector_contract_mjs_1.createConnectors)((0, connector_context_1.getConnectorBinding)());
}
