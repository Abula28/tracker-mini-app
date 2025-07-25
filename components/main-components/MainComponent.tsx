"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import FilterComponent from "./FilterComponent";
import { MainComponentProps } from "./MainComponentT";
import { statusFormatter } from "@/lib/formatFuncs";
import { formatDistanceToNow, parseISO } from "date-fns";
import { IssueT } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import Drawer from "../common/Drawer";

const LOCAL_KEY = "tracker-issues-edits";

const statusBadge = (status: string) => {
  let color = "bg-gray-300 text-gray-700";
  let label = "Unknown";
  if (status === "open") {
    color = "bg-green-100 text-green-800";
    label = statusFormatter("open");
  } else if (status === "in_progress") {
    color = "bg-yellow-100 text-yellow-800";
    label = statusFormatter("in_progress");
  } else if (status === "closed") {
    color = "bg-gray-400 text-gray-900";
    label = statusFormatter("closed");
  }
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${color}`}
      style={{ minWidth: 60, textAlign: "center" }}
      aria-label={label}
    >
      {label}
    </span>
  );
};

function mergeIssues(server: IssueT[], local: IssueT[]): IssueT[] {
  const byId = new Map(server.map((i) => [i.id, i]));
  for (const localIssue of local) {
    byId.set(localIssue.id, { ...byId.get(localIssue.id), ...localIssue });
  }
  return Array.from(byId.values());
}

const MainComponent: React.FC<MainComponentProps> = ({ data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for issues (merged)
  const [issues, setIssues] = useState<IssueT[]>(data);
  // State for filter/sort/search
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<IssueT | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const listRef = useRef<HTMLTableSectionElement>(null);
  const [lastFocusedRow, setLastFocusedRow] = useState<number | null>(null);

  // Drawer edit state
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editError, setEditError] = useState("");

  // On mount: merge localStorage edits/creations
  useEffect(() => {
    const localRaw = localStorage.getItem(LOCAL_KEY);
    let local: IssueT[] = [];
    if (localRaw) {
      try {
        local = JSON.parse(localRaw);
      } catch {}
    }
    setIssues(mergeIssues(data, local));
  }, [data]);

  // On mount: initialize filter/sort/search from URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const st = searchParams.get("status") || "";
    const sort = searchParams.get("sort") || "desc";
    setSearch(q);
    setStatus(st);
    setSortDesc(sort !== "asc");
    // eslint-disable-next-line
  }, []);

  // On filter/sort/search change: update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (status) params.set("status", status);
    params.set("sort", sortDesc ? "desc" : "asc");
    router.replace("?" + params.toString(), { scroll: false });
    // eslint-disable-next-line
  }, [search, status, sortDesc]);

  // When opening drawer, sync edit fields
  useEffect(() => {
    if (selectedIssue) {
      setEditTitle(selectedIssue.title);
      setEditStatus(selectedIssue.status);
      setEditDesc(selectedIssue.description);
      setEditError("");
    }
  }, [selectedIssue]);

  // Save handler for drawer
  const handleDrawerSave = () => {
    if (!editTitle.trim() || editTitle.trim().length < 3) {
      setEditError("Title is required (min 3 chars)");
      return;
    }
    if (!selectedIssue) return;
    const updated: IssueT = {
      ...selectedIssue,
      title: editTitle.trim(),
      status: editStatus as IssueT["status"],
      description: editDesc,
    };
    // Update in issues state
    setIssues((prev) => {
      const next = prev.map((i) => (i.id === updated.id ? updated : i));
      // Persist to localStorage
      localStorage.setItem(
        LOCAL_KEY,
        JSON.stringify(
          next.filter(
            (i) =>
              !data.find((d) => d.id === i.id) ||
              JSON.stringify(i) !==
                JSON.stringify(data.find((d) => d.id === i.id))
          )
        )
      );
      return next;
    });
    setSelectedIssue(null);
    // Restore focus
    if (lastFocusedRow !== null && listRef.current) {
      const row =
        listRef.current.querySelectorAll<HTMLTableRowElement>("tr")[
          lastFocusedRow
        ];
      row?.focus();
    }
  };

  // Filtering, searching, sorting
  const filteredIssues = useMemo(() => {
    let filtered = issues;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    if (status) {
      filtered = filtered.filter((i) => i.status === status);
    }
    filtered = [...filtered].sort((a, b) => {
      if (!a.updatedAt && !b.updatedAt) return 0;
      if (!a.updatedAt) return 1;
      if (!b.updatedAt) return -1;
      return sortDesc
        ? b.updatedAt.localeCompare(a.updatedAt)
        : a.updatedAt.localeCompare(b.updatedAt);
    });
    return filtered;
  }, [search, status, sortDesc, issues]);

  // Handlers for opening/closing detail and modal
  const handleRowClick = (idx: number) => {
    setSelectedIssue(filteredIssues[idx]);
    setLastFocusedRow(idx);
  };
  const handleCloseDetail = () => {
    setSelectedIssue(null);
    // Restore focus to row
    if (lastFocusedRow !== null && listRef.current) {
      const row =
        listRef.current.querySelectorAll<HTMLTableRowElement>("tr")[
          lastFocusedRow
        ];
      row?.focus();
    }
  };
  const handleOpenNew = () => setNewModalOpen(true);
  const handleCloseNew = () => setNewModalOpen(false);

  return (
    <div className="flex flex-col gap-10 lg:pt-24 pt-20  px-4">
      <FilterComponent
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
        onNewIssue={handleOpenNew}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Updated
              </th>
            </tr>
          </thead>
          <tbody
            ref={listRef}
            className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
          >
            {filteredIssues.map((issue, idx) => (
              <tr
                key={issue.id}
                tabIndex={0}
                onClick={() => handleRowClick(idx)}
                onFocus={() => setLastFocusedRow(idx)}
                className="cursor-pointer focus:ring-2 focus:ring-blue-400"
              >
                <td
                  className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-semibold break-words max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl align-top"
                  style={{ wordBreak: "break-word" }}
                >
                  {issue.title}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm align-top">
                  {statusBadge(issue.status)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-right align-top min-w-[120px]">
                  {issue.updatedAt ? (
                    formatDistanceToNow(parseISO(issue.updatedAt), {
                      addSuffix: true,
                    })
                  ) : (
                    <span className="italic text-gray-400">No date</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Detail Slide-Over */}
      <Drawer
        open={!!selectedIssue}
        onClose={handleCloseDetail}
        title="Edit Issue"
        width={400}
      >
        {selectedIssue && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                minLength={3}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
            {editError && (
              <div className="text-red-500 text-sm mb-2">{editError}</div>
            )}
            <button
              className="mt-auto rounded bg-blue-600 text-white px-4 py-2 font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleDrawerSave}
            >
              Save
            </button>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default MainComponent;
