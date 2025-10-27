import { useEffect, useMemo, useState } from "react";
import { Workflow } from "./loadWorkflows";
import Fuse from "fuse.js";

export function App({
  workflows,
  original,
}: {
  workflows: Workflow[];
  original: HTMLElement;
}) {
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

  const [isOriginalVisible, setIsOriginalVisible] = useState(
    () => original.style.display !== "none"
  );

  useEffect(() => {
    original.style.display = isOriginalVisible ? "block" : "none";
  }, [isOriginalVisible]);

  return (
    <div>
      {!isOriginalVisible && (
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
                style={{ listStyle: "none", padding: "2px 0px" }}
              >
                <a href={workflow.url}>{workflow.name}</a>
              </li>
            ))}
          </ul>
        </>
      )}

      <div
        style={{
          fontSize: 10,
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setIsOriginalVisible(!isOriginalVisible);
        }}
      >
        {isOriginalVisible ? "Show better UI" : "Show original"}
      </div>
    </div>
  );
}
