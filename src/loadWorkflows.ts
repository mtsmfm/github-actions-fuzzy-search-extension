import { load } from "cheerio";

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
  let page = 1;

  const allResults: Workflow[] = [];

  while (true) {
    const res = await fetch(
      `https://github.com/${org}/${repo}/actions/workflows_partial?query=&page=${page}`
    );
    const text = await res.text();
    const $ = load(text);
    const results = $("li")
      .toArray()
      .map((li) => ({
        name: $(li).find("tool-tip").text(),
        url: $(li).find("a").attr("href"),
        disabled: $(li).find(".color-fg-muted").text() === "Disabled",
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
