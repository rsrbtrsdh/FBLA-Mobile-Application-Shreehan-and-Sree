import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import { subscribeToDataChanges } from '@/data/change-events';

export type QueryState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: undefined; error: Error };

/**
 * Runs a read against the local database and re-runs it whenever any
 * repository reports a write, so every screen shows the latest saved data.
 *
 * `key` identifies the query: change it (e.g. a different trip id) to refetch.
 */
export function useQuery<T>(key: string, read: (db: SQLiteDatabase) => Promise<T>): QueryState<T> {
  const db = useSQLiteContext();
  const [state, setState] = useState<QueryState<T>>({ status: 'loading', data: undefined, error: undefined });
  const [version, setVersion] = useState(0);

  useEffect(() => subscribeToDataChanges(() => setVersion((v) => v + 1)), []);

  useEffect(() => {
    let cancelled = false;
    read(db)
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: undefined });
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setState({
            status: 'error',
            data: undefined,
            error: error instanceof Error ? error : new Error(String(error)),
          });
      });
    return () => {
      cancelled = true;
    };
    // `read` is recreated each render; `key` + `version` decide when to refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, key, version]);

  return state;
}
