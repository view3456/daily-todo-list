/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, Edit3, Save, X, Clock } from 'lucide-react';
import { Todo, CATEGORIES, Priority } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEditTodo: (id: string, text: string, categoryId: string, priority: Priority, time?: string) => void;
  onDeleteTodo: (id: string) => void;
}

export default function TodoItem({ todo, onToggleComplete, onEditTodo, onDeleteTodo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.categoryId);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editTime, setEditTime] = useState(todo.time || '');

  // Find the current category configuration object
  const category = CATEGORIES.find((cat) => cat.id === todo.categoryId) || CATEGORIES[0];

  // Save changes
  const handleSave = () => {
    if (!editText.trim()) return;
    onEditTodo(todo.id, editText.trim(), editCategory, editPriority, editTime.trim() || undefined);
    setIsEditing(false);
  };

  const priorityLabels: Record<Priority, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
    high: { label: 'ด่วนมาก', dotClass: 'bg-white', textClass: 'text-white', bgClass: 'bg-vibrant-coral border-2 border-vibrant-dark' },
    medium: { label: 'ปานกลาง', dotClass: 'bg-vibrant-dark', textClass: 'text-vibrant-dark', bgClass: 'bg-vibrant-yellow border-2 border-vibrant-dark' },
    low: { label: 'ทั่วไป', dotClass: 'bg-white', textClass: 'text-white', bgClass: 'bg-vibrant-teal border-2 border-vibrant-dark' },
  };

  const prioMeta = priorityLabels[todo.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative w-full rounded-2xl border-4 p-4 transition-all duration-150 ${
        todo.completed
          ? 'bg-zinc-100/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 opacity-65'
          : todo.priority === 'high'
          ? 'bg-white dark:bg-zinc-900 border-vibrant-coral shadow-xs'
          : 'bg-white dark:bg-zinc-900 border-vibrant-dark/80 dark:border-zinc-805 shadow-xs hover:border-vibrant-dark'
      }`}
      id={`todo-card-${todo.id}`}
    >
      {isEditing ? (
        /* Edit Mode UI */
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
            <span className="text-xs font-black text-vibrant-purple">แก้ไขข้อมูลรายการ</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSave}
                className="p-1 px-3 bg-vibrant-teal text-white border-2 border-vibrant-dark rounded-xl text-xs font-black flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                id={`btn-save-inline-${todo.id}`}
              >
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>บันทึก</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(todo.text);
                  setEditCategory(todo.categoryId);
                  setEditPriority(todo.priority);
                  setEditTime(todo.time || '');
                }}
                className="p-1 px-3 bg-zinc-100 dark:bg-zinc-800 border-2 border-vibrant-dark/20 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-black flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                id={`btn-cancel-inline-${todo.id}`}
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ยกเลิก</span>
              </button>
            </div>
          </div>

          {/* Simple Inline edit inputs */}
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-vibrant-dark rounded-xl text-sm text-zinc-800 dark:text-zinc-105 font-black focus:border-vibrant-dark outline-hidden"
                placeholder="รายการที่ต้องทำ"
                id={`input-inline-text-${todo.id}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Select category */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 mb-1">หมวดหมู่</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border-2 border-vibrant-dark rounded-xl text-xs font-black text-zinc-800 dark:text-zinc-300 outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select priority */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 mb-1">ความสำคัญ</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-805 border-2 border-vibrant-dark rounded-xl text-xs font-black text-zinc-800 dark:text-zinc-300 outline-hidden"
                >
                  <option value="low">🟢 ทั่วไป</option>
                  <option value="medium">🟡 ปานกลาง</option>
                  <option value="high">🔴 ด่วนมาก</option>
                </select>
              </div>

              {/* Select time */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 mb-1">เวลาที่กำหนด</label>
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-805 border-2 border-vibrant-dark rounded-xl text-xs font-black text-zinc-800 dark:text-zinc-300 outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Regular View Mode UI */
        <div className="flex items-start gap-3">
          {/* Custom Checkbox */}
          <div className="pt-0.5 shrink-0 select-none">
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 border-vibrant-dark transition-all duration-150 cursor-pointer ${
                todo.completed
                  ? 'bg-vibrant-teal text-white shadow-xs'
                  : todo.priority === 'high'
                  ? 'bg-vibrant-coral-light dark:bg-rose-950/10 hover:bg-vibrant-coral/20'
                  : 'bg-vibrant-light hover:bg-vibrant-yellow/30'
              }`}
              id={`checkbox-${todo.id}`}
              role="checkbox"
              aria-checked={todo.completed}
            >
              {todo.completed && (
                <svg
                  className="w-4 h-4 stroke-[3.5] stroke-current pb-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Todo Contents */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5 bg-transparent">
              {/* Category Badge */}
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wide border-2 border-vibrant-dark dark:border-zinc-700 bg-white text-zinc-800`}>
                <span className="mr-1 inline-block text-[9px]">{category.icon}</span>
                {category.name}
              </span>

              {/* Priority Badge */}
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wide flex items-center gap-1.5 ${prioMeta.bgClass} ${prioMeta.textClass}`}>
                <span className={`w-1.5 h-1.5 rounded-md ${prioMeta.dotClass} border border-vibrant-dark/30`} />
                {prioMeta.label}
              </span>

              {/* Due Time indicator if it exists */}
              {todo.time && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] bg-zinc-50 text-vibrant-dark dark:bg-zinc-800 dark:text-zinc-300 border-2 border-vibrant-dark/25 dark:border-zinc-800 flex items-center gap-1 font-black">
                  <Clock className="w-3.5 h-3.5 text-vibrant-coral stroke-[2.5]" />
                  <span>{todo.time} น.</span>
                </span>
              )}
            </div>

            {/* Todo text */}
            <p
              onClick={() => onToggleComplete(todo.id)}
              className={`text-sm leading-relaxed font-black cursor-pointer select-none break-words ${
                todo.completed
                  ? 'text-zinc-400 dark:text-zinc-500 line-through decoration-vibrant-dark dark:decoration-zinc-700 decoration-2'
                  : 'text-vibrant-dark dark:text-zinc-100'
              }`}
            >
              {todo.text}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0 self-center">
            {/* Edit Button */}
            {!todo.completed && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 px-[6px] text-zinc-400 hover:text-vibrant-purple hover:bg-vibrant-yellow/30 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-vibrant-dark/20"
                id={`btn-edit-${todo.id}`}
                title="แก้ไขข้อมูล"
              >
                <Edit3 className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            {/* Delete button */}
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="p-1 px-[6px] text-zinc-400 hover:text-vibrant-coral hover:bg-vibrant-coral-light/30 dark:hover:bg-rose-955/20 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-vibrant-dark/20"
              id={`btn-delete-${todo.id}`}
              title="ลบรายการ"
            >
              <Trash2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
