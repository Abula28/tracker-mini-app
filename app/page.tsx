import { parseIssues } from "@/lib/parseIssues";
import Image from "next/image";

export default function Home() {
  const issues = parseIssues();

  return (
    <div className="flex flex-col gap-10 bg-ui-light-background dark:bg-ui-dark-background">
      {issues.map((issue) => (
        <div key={issue.id}>
          <h1>{issue.title}</h1>
          <p>{issue.description}</p>
        </div>
      ))}
    </div>
  );
}
