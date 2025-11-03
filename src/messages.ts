import { loadWorkflows, Workflow } from "./loadWorkflows";

interface Messages {
  LOAD_WORKFLOWS: (payload: { org: string; repo: string }) => Workflow[];
}

type Response<T extends keyof Messages = keyof Messages> = ReturnType<
  Messages[T]
>;

export const contentToBackground = async <T extends keyof Messages>(
  type: T,
  payload: Parameters<Messages[T]>[0]
): Promise<Response<T>> => {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage(
      {
        type,
        payload,
      },
      (response: Response<T>) => {
        resolve(response);
      }
    )
  );
};

const ongoingPromises: Map<string, Promise<unknown>> = new Map();
const withOngoingPromise = async <T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> => {
  if (ongoingPromises.has(key)) {
    return (await ongoingPromises.get(key)) as T;
  }

  const promise = (async () => {
    try {
      return await fn();
    } finally {
      ongoingPromises.delete(key);
    }
  })();

  ongoingPromises.set(key, promise);

  return (await promise) as T;
};

const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  maxAge: number
): Promise<T> => {
  const localStorageResult = await chrome.storage.local.get(key);
  const cache: { data: T; timestamp: number } = localStorageResult[key];
  const now = Date.now();

  if (cache && now - cache.timestamp < maxAge) {
    return cache.data;
  }

  const data = await fetcher();
  const updatedCache = { data, timestamp: Date.now() };
  await chrome.storage.local.set({ [key]: updatedCache });
  return data;
};

export const messageHandler = {
  LOAD_WORKFLOWS: async (payload) => {
    const key = `loadWorkflows-${payload.org}-${payload.repo}`;

    const workflows = await withOngoingPromise(
      key,
      async () =>
        await withCache(key, () => loadWorkflows(payload), 1000 * 60 * 5)
    );

    return workflows;
  },
} satisfies {
  [K in keyof Messages]: (
    payload: Parameters<Messages[K]>[0]
  ) => Promise<Response<K>>;
};
