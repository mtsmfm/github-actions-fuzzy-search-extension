import { useMemo, useState } from "react";
import { Workflow } from "./loadWorkflows";
import Fuse from "fuse.js";

export function App({ workflows }: { workflows: Workflow[] }) {
  const [filter, setFilter] = useState("");
  const fuse = useMemo(
    () =>
      new Fuse(workflows, {
        keys: ["name"],
        useExtendedSearch: true,
      }),
    [workflows]
  );

  const filteredWorkflows = useMemo(
    () =>
      filter ? fuse.search(filter).map((result) => result.item) : workflows,
    [filter, fuse, workflows]
  );

  return (
    <div>
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
            style={{ listStyle: "none", padding: "2px 0px" }}
          >
            <a href={workflow.url}>{workflow.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
