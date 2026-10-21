import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import { siteGate } from "../lib/site-gate";
import { siteAddressMove } from "../lib/storage-move";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    // The site's own address (lib/storage-move.ts): www.goliqo.com and the old workers.dev address go to the same
    // page on goliqo.com, carrying the browser's saved settings along once.
    const moved = siteAddressMove(request);
    if (moved) return moved;
    // Membership gate (lib/site-gate.ts), in production and locally alike.
    // Client-sent identity headers are always discarded; a user is signed in only
    // by a member session verified in D1 (or, during the move away from Cloudflare
    // Access, by a verified Access token). Local development additionally keeps the
    // mock sign-in from build/sites-vite-plugin.ts; production builds never trust it.
    const gated = await siteGate(request, env, { devIdentity: import.meta.env.DEV });
    if (gated instanceof Response) return gated;
    request = gated;
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
