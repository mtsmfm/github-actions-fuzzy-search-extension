import { createRoot } from "react-dom/client";
import { App } from "./App";
import { loadWorkflows } from "./loadWorkflows";

const main = async () => {
  const original = document.querySelector<HTMLElement>(
    "actions-workflow-list nav-list-group"
  );

  if (original && original.parentElement) {
    const host = document.createElement("div");
    original.parentElement.prepend(host);
    original.style.display = "none";

    const appRoot = document.createElement("div");

    host.appendChild(appRoot);
    // Use shadow DOM?
    // const shadow = host.attachShadow({ mode: "open" });
    // shadow.appendChild(appRoot);

    const match = window.location.href.match(
      /https:\/\/github.com\/(.*?)\/(.*?)\/actions/
    );
    if (!match) {
      return;
    }
    const org = match[1];
    const repo = match[2];

    const workflows = await loadWorkflows({ org, repo });
    createRoot(appRoot).render(<App workflows={workflows} />);
  }
};

main();
