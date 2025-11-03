import { use, useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { contentToBackground } from "./messages";

const loadWorkflows = ({ org, repo }: { org: string; repo: string }) => {
  return contentToBackground("LOAD_WORKFLOWS", { org, repo });
};

const promises = new Map<string, ReturnType<typeof loadWorkflows>>();

export function WorkflowList({ org, repo }: { org: string; repo: string }) {
  const key = `${org}/${repo}`;
  const promise =
    promises.get(key) ??
    promises.set(key, loadWorkflows({ org, repo })).get(key)!;

  const workflows = use(promise);
  const [filter, setFilter] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(workflows, {
        keys: ["name"],
        useExtendedSearch: true,
        threshold: 0.4,
      }),
    [workflows]
  );

  useEffect(() => {
    return () => {
      promises.clear();
    };
  }, []);

  const filteredWorkflows = useMemo(
    () =>
      filter ? fuse.search(filter).map((result) => result.item) : workflows,
    [filter, fuse, workflows]
  );

  return (
    <>
      <input
        type="text"
        placeholder="Filter workflows..."
        style={{ margin: "8px 0px", padding: "4px", width: "100%" }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {filteredWorkflows.map((workflow) => (
          <li
            key={workflow.url}
            style={{
              listStyle: "none",
              padding: "2px 0px",
              textDecoration: workflow.disabled ? "line-through" : "none",
            }}
          >
            <a href={workflow.url}>{workflow.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
