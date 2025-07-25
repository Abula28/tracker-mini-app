import { Issue } from "@/types";
import fs from "fs";
import path from "path";

export function parseIssues(): Issue[] {
  const filePath = path.join(process.cwd(), "public", "issues.dat");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const lines = rawData.trim().split("\n");

  const seenIds = new Set<string>();
  const issues: Issue[] = [];

  for (const line of lines) {
    const [id, title, status, updatedAt, description] = line.split("|");

    // Skip lines with missing required fields
    if (!id || !title) continue;

    if (seenIds.has(id)) continue;
    seenIds.add(id);

    issues.push({
      id,
      title: title.trim(),
      status: (status || "").trim() as Issue["status"],
      updatedAt: updatedAt?.trim() || null,
      description: description?.trim() || "",
    });
  }

  return issues;
}
