/**
 * Tiny observer: repositories call `notifyDataChanged()` after every write,
 * and view-model hooks (useQuery) re-read the database when notified.
 * This keeps every screen in sync without a global state library.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let version = 0;

export function notifyDataChanged(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeToDataChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDataVersion(): number {
  return version;
}
