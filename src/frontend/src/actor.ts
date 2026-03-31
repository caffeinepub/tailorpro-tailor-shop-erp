import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import { loadConfig } from "./config";
import { idlFactory } from "./declarations/backend.did";
import { localBackend } from "./local-backend";
import type { TailorBackend } from "./tailor-types";

let _backend: TailorBackend | null = null;
let _initPromise: Promise<TailorBackend> | null = null;

async function initCloudBackend(): Promise<TailorBackend> {
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: config.backend_canister_id,
  });
  return actor as unknown as TailorBackend;
}

export function getBackend(): Promise<TailorBackend> {
  if (_backend) return Promise.resolve(_backend);
  if (!_initPromise) {
    _initPromise = initCloudBackend()
      .then((b) => {
        _backend = b;
        return b;
      })
      .catch((err) => {
        console.error("Cloud backend init failed, using local fallback:", err);
        _backend = localBackend;
        return localBackend;
      });
  }
  return _initPromise;
}

// Lazy proxy: all calls are forwarded to the cloud backend once initialized.
// Since every TailorBackend method returns a Promise, the extra async wrapper is transparent.
export const backend: TailorBackend = new Proxy({} as TailorBackend, {
  get(_target, prop: string) {
    return (...args: unknown[]) =>
      getBackend().then((b) =>
        (b as unknown as Record<string, (...a: unknown[]) => unknown>)[prop](
          ...args,
        ),
      );
  },
});
