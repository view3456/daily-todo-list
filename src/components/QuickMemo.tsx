/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BookOpen, Check } from 'lucide-react';

interface QuickMemoProps {
  selectedDate: string;
  memoText: string;
  onSaveMemo: (date: string, text: string) => void;
}

export default function QuickMemo({ selectedDate, memoText, onSaveMemo }: QuickMemoProps) {
  const [text, setText] = useState(memoText);
  const [isSavedNotify, setIsSavedNotify] = useState(false);

  // Sync internal text state with parent value on date change
  useEffect(() => {
    setText(memoText);
  }, [memoText, selectedDate]);

  // Debounced/Auto-save mechanism with an interactive button
  const handleSave = () => {
    onSaveMemo(selectedDate, text);
    setIsSavedNotify(true);
    setTimeout(() => {
      setIsSavedNotify(false);
    }, 2000);
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-4 border-vibrant-dark border-t-[10px] border-t-vibrant-teal dark:border-zinc-805 rounded-[32px] p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-vibrant-teal dark:text-teal-400 stroke-[2.5]" />
          <h4 className="text-sm font-black text-vibrant-dark dark:text-zinc-100">บันทึกสั้นประจำวัน</h4>
        </div>

        <button
          onClick={handleSave}
          className="px-3 py-1.5 bg-vibrant-teal text-white dark:bg-teal-500 border-2 border-vibrant-dark text-xs font-black rounded-xl flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          id="btn-save-memo"
        >
          {isSavedNotify ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>บันทึกเสร็จสิ้น</span>
            </>
          ) : (
            <span>บันทึกข้อมูล</span>
          )}
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="จดบันทึกไอเดีย, ความประทับใจ, ผลลัพธ์สำคัญสั้นๆ ของวันนี้..."
        rows={4}
        className="w-full bg-vibrant-light/40 dark:bg-zinc-800/10 focus:bg-white dark:focus:bg-zinc-850 border-2 border-vibrant-border focus:border-vibrant-dark dark:border-zinc-800 outline-hidden rounded-2xl p-3 text-sm text-vibrant-dark dark:text-zinc-200 font-bold placeholder-zinc-400/80 dark:placeholder-zinc-600 resize-none transition-all duration-150"
        id="textarea-day-memo"
      />
    </div>
  );
}
