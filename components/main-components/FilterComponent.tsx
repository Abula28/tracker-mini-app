"use client";
import React from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

type FilterComponentProps = {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  sortDesc: boolean;
  setSortDesc: (v: boolean) => void;
  onNewIssue: () => void;
};

const FilterComponent = ({
  search,
  setSearch,
  status,
  setStatus,
  sortDesc,
  setSortDesc,
  onNewIssue,
}: FilterComponentProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
      <h1 className="text-2xl font-bold flex-1">Issues</h1>
      <div className="flex gap-2 flex-1 max-w-xl">
        <input
          type="search"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search issues"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border border-gray-300 dark:border-gray-700 px-2 py-2 bg-white dark:bg-gray-800 focus:outline-none"
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="rounded border border-gray-300 dark:border-gray-700 px-2 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          aria-label={`Sort by updated date (${sortDesc ? "desc" : "asc"})`}
          title="Toggle sort order"
        >
          <span className="inline-block align-middle mr-1">Sort</span>
          <svg
            className={`inline w-4 h-4 transition-transform ${
              sortDesc ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <button
        className="ml-auto rounded bg-blue-600 text-white px-4 py-2 font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Create new issue"
        tabIndex={0}
        onClick={onNewIssue}
      >
        New Issue
      </button>
    </header>
  );
};

export default FilterComponent;
