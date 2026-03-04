export async function register() {
  if (typeof window === 'undefined') {
    const storage = new Map<string, string>();
    (global as unknown as Record<string, unknown>).localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value); },
      removeItem: (key: string) => { storage.delete(key); },
      clear: () => { storage.clear(); },
      get length() { return storage.size; },
      key: (index: number) => Array.from(storage.keys())[index] ?? null,
    } as Storage;
  }
}
