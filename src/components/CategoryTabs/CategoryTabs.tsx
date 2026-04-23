import type { Category } from "../../types/note";
import "./CategoryTabs.css";

const categories: Category[] = [
  "All",
  "Shopping list",
  "Lecture notes",
  "Grocery list",
  "Work",
  "Personal",
  "Ideas",
];

interface Props {
  active: Category;
  setActive: (category: Category) => void;
}

export default function CategoryTabs({ active, setActive }: Props) {
  return (
    <div className="category-tabs">
      {categories.map((c) => (
        <button
          key={c}
          className={`tab ${active === c ? "active" : ""}`}
          onClick={() => setActive(c)}
        >
          {c === "Shopping list"
            ? "🛒 Shopping"
            : c === "Lecture notes"
              ? "📚 Lectures"
              : c === "Grocery list"
                ? "🥬 Grocery"
                : c}
        </button>
      ))}
    </div>
  );
}
