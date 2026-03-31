const DB_NAME = "ali-tailor-db";
const DB_VERSION = 1;
const STORES = ["kv", "photos"] as const;

type StoreName = (typeof STORES)[number];

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "key" });
        }
      }
    };
    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result;
      resolve(_db);
    };
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
}

export async function idbGet(store: StoreName, key: string): Promise<unknown> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result?.value ?? undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function idbSet(
  store: StoreName,
  key: string,
  value: unknown,
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).put({ key, value });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetAll(
  store: StoreName,
): Promise<{ key: string; value: unknown }[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => reject(req.error);
  });
}

export async function idbDelete(store: StoreName, key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * For each key: if IDB has no entry AND localStorage has data,
 * copies localStorage data to IDB then removes it from localStorage.
 */
export async function migrateFromLocalStorage(keys: string[]): Promise<void> {
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const existing = await idbGet("kv", key);
    if (existing !== undefined) {
      // IDB already has data — just remove from localStorage
      localStorage.removeItem(key);
      continue;
    }
    await idbSet("kv", key, raw);
    localStorage.removeItem(key);
  }
}
