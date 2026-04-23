export type Category =
  | "All"
  | "Shopping list"
  | "Lecture notes"
  | "Grocery list"
  | "Work"
  | "Personal"
  | "Ideas";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Exclude<Category, "All">;
  pinned?: boolean;
  createdAt: any;
  date?: string;
}

export interface FilterState {
  search: string;
  category: Category;
  selectedDate: Date;
}
