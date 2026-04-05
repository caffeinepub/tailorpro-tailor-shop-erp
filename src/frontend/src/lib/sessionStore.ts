// Persistent session storage using IndexedDB
// localStorage clears on browser data wipe; IndexedDB persists much longer

const DB_NAME = "ali_tailor_session";
const STORE_NAME = "sessions";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function sessionSet(key: string, value: string): Promise<void> {
  // Write to both IndexedDB and localStorage as fallback
  try {
    localStorage.setItem(key, value);
  } catch {}
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Silently fail if IndexedDB not available
  }
}

export async function sessionGet(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        const val = req.result as string | undefined;
        if (val) {
          resolve(val);
        } else {
          // Fallback to localStorage
          resolve(localStorage.getItem(key));
        }
      };
      req.onerror = () => {
        resolve(localStorage.getItem(key));
      };
    });
  } catch {
    return localStorage.getItem(key);
  }
}

export async function sessionRemove(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch {}
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // Silently fail
  }
}
