import type { Note } from "../../types/note";
import "./NoteCard.css";

interface Props {
  note: Note;
  onDelete: (id: string) => void;
  onEdit?: (id: string, updates: Partial<Note>) => void;
  onTogglePin?: (id: string, pinned: boolean) => void;
}

const categoryColors: Record<string, string> = {
  "Shopping list": "#e8f4f8",
  "Lecture notes": "#fce4ec",
  "Grocery list": "#fff8e1",
  Work: "#e8eaf6",
  Personal: "#e8f5e9",
  Ideas: "#fff3e0",
};

export default function NoteCard({ note, onDelete, onTogglePin }: Props) {
  const bg = categoryColors[note.category] || "#f3f4f6";

  return (
    <div className="note-card" style={{ backgroundColor: bg }}>
      <div className="card-header">
        <h3>{note.title || "Untitled"}</h3>
        <div className="card-actions">
          {onTogglePin && (
            <button
              className={`pin-btn ${note.pinned ? "active" : ""}`}
              onClick={() => onTogglePin(note.id, note.pinned || false)}
            >
              📌
            </button>
          )}
          <button className="delete-btn" onClick={() => onDelete(note.id)}>
            ×
          </button>
        </div>
      </div>

      <div className="card-content">
        {note.content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <div className="card-category">
        <span className="category-badge">{note.category}</span>
      </div>
    </div>
  );
}
