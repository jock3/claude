"use client";

import { useState } from "react";
import type { TodoTask } from "@/lib/types";
import StatusPill from "./StatusPill";
import PriorityPill from "./PriorityPill";

interface Props {
  task: TodoTask;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<TodoTask>) => void;
  onDelete: (id: string) => void;
}

export default function TaskRow({ task, selected, onSelect, onUpdate, onDelete }: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);

  const today = new Date().toISOString().split("T")[0];
  const isOverdue = task.due_date && task.due_date < today && !task.completed;
  const isToday = task.due_date === today;

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (title.trim() && title.trim() !== task.title) {
      onUpdate(task.id, { title: title.trim() });
    } else {
      setTitle(task.title);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("sv-SE", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={`group grid grid-cols-[32px_minmax(0,1fr)_140px_100px_120px_32px] items-center gap-2 px-4 py-2 border-b border-gray-100 transition-colors cursor-pointer ${
        selected ? "bg-milou-50" : "hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => {
          e.stopPropagation();
          onUpdate(task.id, {
            completed: e.target.checked,
            completed_at: e.target.checked ? new Date().toISOString() : null,
            status: e.target.checked ? "klar" : task.status,
          });
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-milou-500"
      />

      {/* Title */}
      <div className="min-w-0 flex items-center gap-1.5">
        <span className="opacity-0 group-hover:opacity-30 text-gray-400 cursor-grab select-none text-sm shrink-0">⠿</span>
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleBlur();
              if (e.key === "Escape") { setTitle(task.title); setEditingTitle(false); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-sm bg-transparent border-b border-milou-300 outline-none"
          />
        ) : (
          <span
            onDoubleClick={(e) => { e.stopPropagation(); setEditingTitle(true); }}
            className={`text-sm truncate ${
              task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Status */}
      <div onClick={(e) => e.stopPropagation()}>
        <StatusPill status={task.status} onChange={(status) => onUpdate(task.id, { status })} />
      </div>

      {/* Priority */}
      <div onClick={(e) => e.stopPropagation()}>
        <PriorityPill priority={task.priority} onChange={(priority) => onUpdate(task.id, { priority })} />
      </div>

      {/* Due date */}
      <div>
        {task.due_date ? (
          <span className={`text-xs font-medium ${isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-gray-400"}`}>
            {formatDate(task.due_date)}
          </span>
        ) : (
          <span className="text-xs text-gray-200 opacity-0 group-hover:opacity-100">—</span>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg leading-none flex items-center justify-center w-6 h-6 rounded"
      >
        ×
      </button>
    </div>
  );
}
