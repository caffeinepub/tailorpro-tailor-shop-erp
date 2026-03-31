import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

let cachedStorageClient: StorageClient | null = null;

export function useStorageClient() {
  const [storageClient, setStorageClient] = useState<StorageClient | null>(
    cachedStorageClient,
  );

  useEffect(() => {
    if (cachedStorageClient) {
      setStorageClient(cachedStorageClient);
      return;
    }
    let cancelled = false;
    loadConfig()
      .then((config) => {
        if (cancelled) return;
        const agent = new HttpAgent({ host: config.backend_host });
        if (config.backend_host?.includes("localhost")) {
          agent.fetchRootKey().catch(() => {});
        }
        const client = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        cachedStorageClient = client;
        setStorageClient(client);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return storageClient;
}
