export type Issue = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "closed" | "";
  updatedAt: string | null;
  description: string;
};
