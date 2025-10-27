import { Suspense, useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { WorkflowList } from "./WorkflowList";

export function App({
  org,
  repo,
  original,
}: {
  org: string;
  repo: string;
  original: HTMLElement;
}) {
  const [isOriginalVisible, setIsOriginalVisible] = useState(
    () => original.style.display !== "none"
  );

  useEffect(() => {
    original.style.display = isOriginalVisible ? "block" : "none";
  }, [isOriginalVisible]);

  return (
    <div>
      {!isOriginalVisible && (
        <Suspense fallback={<Spinner />}>
          <WorkflowList org={org} repo={repo} />
        </Suspense>
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
