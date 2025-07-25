export const statusFormatter = (status: "open" | "closed" | "in_progress") => {
  switch (status) {
    case "open":
      return "Open";
    case "closed":
      return "Closed";
    case "in_progress":
      return "In Progress";
    default:
      return status;
  }
};
