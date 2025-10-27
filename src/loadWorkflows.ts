export type Workflow = {
  name: string;
  url: string;
  disabled: boolean;
};

export const loadWorkflows = async ({
  org,
  repo,
}: {
  org: string;
  repo: string;
}): Promise<Workflow[]> => {
  return withCache(
    `workflows-${org}-${repo}`,
    () => _loadWorkflows({ org, repo }),
    1000 * 60 * 5
  ); // 5 minutes
};

const _loadWorkflows = async ({
  org,
  repo,
}: {
  org: string;
  repo: string;
}): Promise<Workflow[]> => {
  let page = 1;

  const allResults: Workflow[] = [];

  while (true) {
    const res = await fetch(
      `https://github.com/${org}/${repo}/actions/workflows_partial?query=&page=${page}`
    );
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const results = [...doc.querySelectorAll<HTMLElement>("li")]
      .map((li) => ({
        name: li.querySelector<HTMLElement>("tool-tip")?.innerText,
        url: li.querySelector<HTMLAnchorElement>("a")?.href,
        disabled:
          li.querySelector<HTMLSpanElement>(".color-fg-muted")?.innerText ===
          "Disabled",
      }))
      .filter((item) => item.name && item.url)
      .map((item) => ({
        name: item.name!,
        url: item.url!,
        disabled: item.disabled,
      }));

    if (results.length === 0) {
      break;
    }

    allResults.push(...results);
    page++;
  }

  return allResults;
};

let ongoingFetches: { [key: string]: Promise<any> } = {};

const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  maxAge: number
): Promise<T> => {
  const cache: { data: T; timestamp: number } = (
    await chrome.storage.local.get(key)
  )[key];
  const now = Date.now();

  if (cache && now - cache.timestamp < maxAge) {
    return cache.data;
  }

  const fetchAndUpdateCache = async () => {
    const data = await fetcher();
    const cache = { data, timestamp: now };
    await chrome.storage.local.set({ [key]: cache });
    return data;
  };

  if (cache) {
    if (!ongoingFetches[key]) {
      ongoingFetches[key] = fetchAndUpdateCache().finally(() => {
        delete ongoingFetches[key];
      });
    }
    return cache.data;
  }

  return await fetchAndUpdateCache();
};
