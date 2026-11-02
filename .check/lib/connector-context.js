"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWithConnectorBinding = runWithConnectorBinding;
exports.getConnectorBinding = getConnectorBinding;
const node_async_hooks_1 = require("node:async_hooks");
// Capture the trusted capability before Vinext derives its revalidation context,
// which does not retain custom execution-context props. Never share across requests.
const bindings = new node_async_hooks_1.AsyncLocalStorage();
function runWithConnectorBinding(binding, run) {
    return bindings.run(binding, run);
}
function getConnectorBinding() {
    return bindings.getStore();
}
