/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'high' | 'medium' | 'low';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string; // Tailwind class background
  textColor: string; // Tailwind class text
}

export interface Todo {
  id: string;
  text: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  priority: Priority;
  categoryId: string;
  time?: string; // Standard HH:MM format optional
  notes?: string;
  createdAt: number;
}

export interface DailyMemo {
  date: string; // YYYY-MM-DD
  text: string;
}

export const CATEGORIES: Category[] = [
  { id: 'personal', name: 'ส่วนตัว', icon: '👤', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900', textColor: 'text-emerald-700' },
  { id: 'work', name: 'งาน', icon: '💼', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900', textColor: 'text-blue-700' },
  { id: 'shopping', name: 'ซื้อของ', icon: '🛍️', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900', textColor: 'text-amber-700' },
  { id: 'health', name: 'สุขภาพ', icon: '🏃', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900', textColor: 'text-rose-700' },
  { id: 'finance', name: 'การเงิน', icon: '💰', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-100 dark:border-purple-900', textColor: 'text-purple-700' },
  { id: 'education', name: 'การเรียน', icon: '🎓', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border-sky-100 dark:border-sky-900', textColor: 'text-sky-700' },
  { id: 'routine', name: 'กิจวัตร', icon: '🔁', color: 'bg-slate-50 text-slate-700 dark:bg-slate-950/30 dark:text-slate-400 border-slate-100 dark:border-slate-900', textColor: 'text-slate-700' },
];

export interface DailyStats {
  completed: number;
  total: number;
  pct: number;
}
