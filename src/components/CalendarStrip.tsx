/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Todo } from '../types';

interface CalendarStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  todos: Todo[];
}

export default function CalendarStrip({ selectedDate, onSelectDate, todos }: CalendarStripProps) {
  // Base date around which we render a 7-day window
  const [pivotDate, setPivotDate] = useState<Date>(() => {
    // default to selectedDate or today
    const d = new Date(selectedDate);
    return isNaN(d.getTime()) ? new Date() : d;
  });

  // Generate 7 days centered on pivotDate's week (or relative start of week)
  const weekDays = useMemo(() => {
    // Start of the week (Sunday as 1st day or Monday. Let's do Monday = index 1)
    const currentPivot = new Date(pivotDate);
    const dayOfWeek = currentPivot.getDay(); // 0 is Sun, 1 is Mon...
    const diff = currentPivot.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
    
    const startOfWeek = new Date(currentPivot.setDate(diff));
    
    return Array.from({ length: 7 }).map((_, idx) => {
      const nextDay = new Date(startOfWeek);
      nextDay.setDate(startOfWeek.getDate() + idx);
      
      const year = nextDay.getFullYear();
      const month = String(nextDay.getMonth() + 1).padStart(2, '0');
      const dateVal = String(nextDay.getDate()).padStart(2, '0');
      const isoString = `${year}-${month}-${dateVal}`;
      
      const isToday = () => {
        const today = new Date();
        return today.getFullYear() === year &&
               today.getMonth() === nextDay.getMonth() &&
               today.getDate() === nextDay.getDate();
      };

      return {
        date: nextDay,
        formattedIso: isoString,
        dayNum: nextDay.getDate(),
        dayLabel: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'][nextDay.getDay()],
        isToday: isToday(),
      };
    });
  }, [pivotDate]);

  // Navigate week backwards
  const prevWeek = () => {
    setPivotDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  // Navigate week forwards
  const nextWeek = () => {
    setPivotDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  // Navigate directly back to today
  const jumpToToday = () => {
    const today = new Date();
    setPivotDate(today);
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const dateVal = String(today.getDate()).padStart(2, '0');
    onSelectDate(`${year}-${month}-${dateVal}`);
  };

  // Get current displayed Month & Buddhist Year for header
  const headerLabel = useMemo(() => {
    const monthsThai = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const month = pivotDate.getMonth();
    const christianYear = pivotDate.getFullYear();
    const buddhistYear = christianYear + 543;
    return `${monthsThai[month]} ${buddhistYear}`;
  }, [pivotDate]);

  // Helper to calculate progress for a specific day
  const getDayProgress = (isoDate: string) => {
    const dayTodos = todos.filter((todo) => todo.dueDate === isoDate);
    if (dayTodos.length === 0) return null;
    const completed = dayTodos.filter((t) => t.completed).length;
    return {
      total: dayTodos.length,
      completed,
      percentage: (completed / dayTodos.length) * 100,
    };
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-[32px] border-4 border-vibrant-dark dark:border-zinc-800 p-5 shadow-md">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-vibrant-coral dark:text-rose-455 stroke-[2.5]" />
          <h3 className="font-black text-vibrant-dark dark:text-zinc-100 text-lg">
            {headerLabel}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={jumpToToday}
            className="px-3 py-1 text-xs font-black text-white bg-vibrant-coral dark:bg-rose-500 border-2 border-vibrant-dark rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            id="btn-today"
          >
            วันนี้
          </button>
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-850 p-1 rounded-xl border-2 border-vibrant-dark/15 dark:border-zinc-800">
            <button
              onClick={prevWeek}
              className="p-1 hover:bg-vibrant-yellow dark:hover:bg-zinc-800 rounded-lg text-zinc-550 dark:text-zinc-400 hover:text-vibrant-dark dark:hover:text-zinc-200 transition-all border border-transparent hover:border-vibrant-dark"
              id="btn-prev-week"
              title="สัปดาห์ก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1 hover:bg-vibrant-yellow dark:hover:bg-zinc-800 rounded-lg text-zinc-550 dark:text-zinc-400 hover:text-vibrant-dark dark:hover:text-zinc-200 transition-all border border-transparent hover:border-vibrant-dark"
              id="btn-next-week"
              title="สัปดาห์ถัดไป"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Calendar Strip Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => {
          const isSelected = day.formattedIso === selectedDate;
          const progress = getDayProgress(day.formattedIso);
          
          return (
            <motion.button
              key={day.formattedIso}
              onClick={() => onSelectDate(day.formattedIso)}
              whileTap={{ scale: 0.95 }}
              id={`calendar-day-${day.formattedIso}`}
              className={`relative flex flex-col items-center py-3 px-1 rounded-2xl cursor-pointer transition-all duration-250 border-2 ${
                isSelected
                  ? 'bg-vibrant-yellow border-vibrant-dark text-vibrant-dark shadow-sm font-black'
                  : 'bg-zinc-50/40 dark:bg-zinc-800/10 border-vibrant-border dark:border-zinc-800/80 hover:bg-vibrant-yellow/15 hover:border-vibrant-dark text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {/* Day Label (e.g. จ., อ.) */}
              <span className={`text-[10px] font-black tracking-wide uppercase mb-1 ${
                isSelected ? 'text-vibrant-dark' : 'text-zinc-405 dark:text-zinc-500'
              }`}>
                {day.dayLabel}
              </span>

              {/* Day Number (e.g. 8) */}
              <span className={`text-sm sm:text-base font-black ${
                isSelected ? 'text-vibrant-dark' : 'text-zinc-800 dark:text-zinc-100'
              }`}>
                {day.dayNum}
              </span>

              {/* Indicator (Today or Progress Dot) */}
              <div className="mt-1.5 flex flex-col items-center justify-center min-h-[6px]">
                {day.isToday && !isSelected && (
                  <span className="block w-2 h-2 rounded-md bg-vibrant-coral border border-vibrant-dark animate-pulse" />
                )}
                {day.isToday && isSelected && (
                  <span className="block w-2 h-2 rounded-md bg-vibrant-coral border border-vibrant-dark" />
                )}
                
                {/* Stats miniature bar if progress exists */}
                {!day.isToday && progress !== null && (
                  <div className="flex gap-0.5 justify-center">
                    {progress.completed === progress.total ? (
                      <span className={`block w-1.5 h-1.5 rounded-full border border-vibrant-dark bg-vibrant-teal`} />
                    ) : (
                      <span className={`block w-1.5 h-1.5 rounded-full border border-vibrant-dark bg-vibrant-coral`} />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
