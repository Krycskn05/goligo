import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import { accessGate } from "../lib/access-gate";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    // Production: Cloudflare Access replaces the ChatGPT Sites dispatch layer.
    // Client-sent identity headers are always discarded; only a verified Access
    // token signs a user in. Without Access settings the site stays closed.
    // Local development keeps the mock sign-in from build/sites-vite-plugin.ts.
    if (!import.meta.env.DEV) {
      const gated = await accessGate(request, env);
      if (gated instanceof Response) return gated;
      request = gated;
    }
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
};
