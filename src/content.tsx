import { createRoot } from "react-dom/client";
import { App } from "./App";

const renderApp = async (
  original: HTMLElement & { parentElement: HTMLElement }
) => {
  if (original.dataset._github_actions_fuzzy_search_extension) {
    return;
  }

  original.dataset._github_actions_fuzzy_search_extension = "true";

  const match = window.location.href.match(
    /https:\/\/github.com\/(.*?)\/(.*?)\/actions/
  );
  if (!match) {
    return;
  }
  const org = match[1];
  const repo = match[2];

  const host = document.createElement("div");
  original.parentElement.append(host);
  original.style.display = "none";

  const appRoot = document.createElement("div");

  host.appendChild(appRoot);

  createRoot(appRoot).render(<App original={original} org={org} repo={repo} />);
};

const SELECTOR = "actions-workflow-list nav-list-group";

const main = async () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const elem = node.matches(SELECTOR)
              ? node
              : node.querySelector(SELECTOR);
            if (elem && elem.parentElement) {
              renderApp(elem as HTMLElement & { parentElement: HTMLElement });
            }
          }
        });
      }
    });
  });

  const original = document.querySelector<HTMLElement>(
    "actions-workflow-list nav-list-group"
  );
  if (original && original.parentElement) {
    renderApp(original as HTMLElement & { parentElement: HTMLElement });
  }
  observer.observe(document.body, { childList: true, subtree: true });
};

main();
