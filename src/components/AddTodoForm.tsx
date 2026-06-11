/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Tag, AlertTriangle, Clock } from 'lucide-react';
import { Priority, CATEGORIES } from '../types';

interface AddTodoFormProps {
  onAddTodo: (text: string, categoryId: string, priority: Priority, time?: string) => void;
}

export default function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [priority, setPriority] = useState<Priority>('medium');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('กรุณากรอกรายการสิ่งที่ต้องทำ');
      return;
    }
    setError('');
    onAddTodo(text.trim(), categoryId, priority, time.trim() || undefined);
    
    // Clear inputs and close
    setText('');
    setTime('');
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          id="btn-open-add-form"
          className="w-full py-3.5 bg-vibrant-coral hover:bg-[#fb7a7a] text-white border-4 border-vibrant-dark rounded-2xl font-black flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors duration-200"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>เพิ่มรายการสิ่งที่ต้องทำใหม่</span>
        </motion.button>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          className="w-full bg-white dark:bg-zinc-900 border-4 border-vibrant-dark rounded-[32px] p-6 shadow-md space-y-4"
        >
          {/* Form Header */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-zinc-100 dark:border-zinc-800">
            <h4 className="text-sm font-black text-vibrant-dark dark:text-zinc-100">สร้างรายการงานใหม่</h4>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
              className="text-xs font-black text-zinc-400 hover:text-vibrant-coral dark:hover:text-vibrant-coral px-2.5 py-1 rounded-lg border-2 border-transparent hover:border-vibrant-dark transition-all duration-150 cursor-pointer"
              id="btn-cancel-add"
            >
              ยกเลิก
            </button>
          </div>

          {/* Task Input Text */}
          <div className="space-y-1">
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="เช่น ซื้อของกินเข้าบ้านวันนี้, สรุปประชุมงานกับทีม..."
              maxLength={120}
              className="w-full px-4 py-3 bg-[#FCFBE8] dark:bg-zinc-800 border-2 border-vibrant-dark rounded-xl text-sm font-bold text-vibrant-dark dark:text-zinc-150 placeholder-zinc-400 dark:placeholder-zinc-650 outline-hidden transition-all shadow-inner"
              autoFocus
              id="input-todo-text"
            />
            {error && (
              <p className="text-xs text-vibrant-coral font-black flex items-center gap-1 pl-1">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                {error}
              </p>
            )}
          </div>

          {/* Quick Details Options (Category, Priority, Time) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-550 dark:text-zinc-400 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-vibrant-teal" />
                <span>หมวดหมู่</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                      categoryId === cat.id
                        ? 'bg-vibrant-yellow border-vibrant-dark text-vibrant-dark shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800/40 dark:border-zinc-800 dark:text-zinc-400 hover:border-vibrant-dark hover:text-vibrant-dark'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right column: Priority & Time */}
            <div className="space-y-4">
              {/* Priority levels */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-550 dark:text-zinc-400">ระดับความสำคัญ</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'low', label: 'ทั่วไป', active: 'bg-vibrant-teal border-vibrant-dark text-white font-black', bgNormal: 'border-2 border-vibrant-border/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' },
                    { val: 'medium', label: 'ปานกลาง', active: 'bg-vibrant-yellow border-vibrant-dark text-vibrant-dark font-black', bgNormal: 'border-2 border-vibrant-border/50 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' },
                    { val: 'high', label: 'ด่วนมาก', active: 'bg-vibrant-coral border-vibrant-dark text-white font-black', bgNormal: 'border-2 border-vibrant-border/50 bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400' },
                  ].map((prio) => {
                    const isSelected = priority === prio.val;
                    return (
                      <button
                        key={prio.val}
                        type="button"
                        onClick={() => setPriority(prio.val as Priority)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all border-2 cursor-pointer ${
                          isSelected ? prio.active : `${prio.bgNormal} hover:border-vibrant-dark hover:text-vibrant-dark`
                        }`}
                      >
                        {prio.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time option */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-550 dark:text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-vibrant-coral" />
                  <span>เวลาที่กำหนด (เลือกได้)</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-800 focus:border-vibrant-dark rounded-xl text-xs font-black text-zinc-800 dark:text-zinc-150 outline-hidden transition-all"
                  id="input-todo-time"
                />
              </div>
            </div>
          </div>

          {/* Form Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-vibrant-teal hover:bg-[#59ddd5] text-white border-2 border-vibrant-dark rounded-xl font-black flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-transform duration-100 hover:scale-[1.01] active:scale-[0.99] text-sm"
              id="btn-submit-todo"
            >
              <span>ยืนยันข้อมูลเพิ่มรายการ</span>
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}
