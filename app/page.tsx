import { parseIssues } from "@/lib/parseIssues";
import Image from "next/image";

export default function Home() {
  const issues = parseIssues();

  console.log(issues)

  return (
    <div className="flex flex-col gap-10">
      {issues.map((issue) => (
        <div key={issue.id}>
          <h1>{issue.title}</h1>
          <p>{issue.description}</p>
        </div>
      ))}
    </div>
  );
}
