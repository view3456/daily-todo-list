/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Search, 
  Trash2, 
  Sun, 
  Moon, 
  Sparkles, 
  X,
  ArrowRight
} from 'lucide-react';
import { Todo, DailyMemo, CATEGORIES, Priority } from './types';
import CalendarStrip from './components/CalendarStrip';
import DailyGoalMeter from './components/DailyGoalMeter';
import AddTodoForm from './components/AddTodoForm';
import TodoItem from './components/TodoItem';
import QuickMemo from './components/QuickMemo';

// Helper to get local date in YYYY-MM-DD representation safely
const getTodayISOString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dateVal = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dateVal}`;
};

// Beautiful default initial items to delight users on first load
const INITIAL_TODOS = (todayISO: string): Todo[] => [
  {
    id: 'init-1',
    text: 'ดื่มน้ำตอนเช้าเพื่อสุขภาพที่ดี 💧',
    dueDate: todayISO,
    completed: true,
    priority: 'low',
    categoryId: 'health',
    time: '07:30',
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'init-2',
    text: 'จัดอันดับความสำคัญเป้าหมายประจำวันและเริ่มทำสิ่งแรก 📈',
    dueDate: todayISO,
    completed: false,
    priority: 'high',
    categoryId: 'work',
    time: '09:00',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'init-3',
    text: 'ซื้อของสดและผลไม้เพื่อปรุงอาหารเพื่อสุขภาพ 🍎',
    dueDate: todayISO,
    completed: false,
    priority: 'medium',
    categoryId: 'shopping',
    time: '17:30',
    createdAt: Date.now() - 3600000,
  }
];

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISOString);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [darkMode, setDarkMode] = useState(false);

  // Core States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [memos, setMemos] = useState<DailyMemo[]>([]);

  // 1. Initial Load of States from localStorage
  useEffect(() => {
    const todayISO = getTodayISOString();
    
    // Load Todos
    const cachedTodos = localStorage.getItem('daily_todo_items');
    if (cachedTodos) {
      try {
        setTodos(JSON.parse(cachedTodos));
      } catch (e) {
        setTodos(INITIAL_TODOS(todayISO));
      }
    } else {
      // Setup demo values
      const initial = INITIAL_TODOS(todayISO);
      setTodos(initial);
      localStorage.setItem('daily_todo_items', JSON.stringify(initial));
    }

    // Load Memos
    const cachedMemos = localStorage.getItem('daily_memo_items');
    if (cachedMemos) {
      try {
        setMemos(JSON.parse(cachedMemos));
      } catch (e) {
        setMemos([]);
      }
    }

    // Check system preference dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // 2. Persist states in storage on changes
  const saveTodosToStorage = (updatedTodos: Todo[]) => {
    setTodos(updatedTodos);
    localStorage.setItem('daily_todo_items', JSON.stringify(updatedTodos));
  };

  const saveMemosToStorage = (updatedMemos: DailyMemo[]) => {
    setMemos(updatedMemos);
    localStorage.setItem('daily_memo_items', JSON.stringify(updatedMemos));
  };

  // 3. Dark Mode HTML class dynamic binding
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Compute Greeting phrase depending on Thai Current Local Time
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้าครับ ☀️';
    if (hour < 17) return 'สวัสดีตอนบ่ายครับ ☕';
    return 'สวัสดีตอนเย็นครับ 🌙';
  }, []);

  // Filter & Query Calculations
  const dateFormattedThai = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d.getTime())) return '';
    const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const monthsThai = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    return `${daysThai[d.getDay()]}ที่ ${d.getDate()} ${monthsThai[d.getMonth()]} ${d.getFullYear() + 543}`;
  }, [selectedDate]);

  // Subset of todos for the active selected day
  const dailyTodos = useMemo(() => {
    return todos.filter((todo: Todo) => todo.dueDate === selectedDate);
  }, [todos, selectedDate]);

  // Compute daily metrics (completed vs total)
  const dailyMetrics = useMemo(() => {
    const total = dailyTodos.length;
    const completed = dailyTodos.filter((t: Todo) => t.completed).length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [dailyTodos]);

  // Get active text memo for the selected date
  const activeMemoText = useMemo(() => {
    const found = memos.find((memo: DailyMemo) => memo.date === selectedDate);
    return found ? found.text : '';
  }, [memos, selectedDate]);

  // Filter list by selected tab AND search string
  const filteredAndSearchedTodos = useMemo(() => {
    return dailyTodos
      .filter((todo: Todo) => {
        // Tab Filter
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      })
      .filter((todo: Todo) => {
        // Search Filter
        if (!searchQuery.trim()) return true;
        return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
      })
      // Order items: priority (high -> medium -> low), then time (if set), then createdAt
      .sort((a: Todo, b: Todo) => {
        const priorityScore = { high: 3, medium: 2, low: 1 };
        const diff = priorityScore[b.priority] - priorityScore[a.priority];
        if (diff !== 0) return diff;
        
        // Time sorting
        if (a.time && !b.time) return -1;
        if (!a.time && b.time) return 1;
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        
        return a.createdAt - b.createdAt;
      });
  }, [dailyTodos, filter, searchQuery]);

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  const handleAddTodo = (text: string, categoryId: string, priority: Priority, time?: string) => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text,
      dueDate: selectedDate,
      completed: false,
      priority,
      categoryId,
      time,
      createdAt: Date.now(),
    };
    saveTodosToStorage([...todos, newTodo]);
  };

  const handleToggleComplete = (id: string) => {
    const updated = todos.map((todo: Todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    saveTodosToStorage(updated);
  };

  const handleEditTodo = (id: string, text: string, categoryId: string, priority: Priority, time?: string) => {
    const updated = todos.map((todo: Todo) => {
      if (todo.id === id) {
        return { ...todo, text, categoryId, priority, time };
      }
      return todo;
    });
    saveTodosToStorage(updated);
  };

  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter((todo: Todo) => todo.id !== id);
    saveTodosToStorage(updated);
  };

  const clearCompletedOfSelectedDate = () => {
    const updated = todos.filter((todo: Todo) => !(todo.dueDate === selectedDate && todo.completed));
    saveTodosToStorage(updated);
  };

  const handleSaveMemo = (date: string, text: string) => {
    const existingIndex = memos.findIndex((m: DailyMemo) => m.date === date);
    let updatedMemos = [...memos];
    
    if (existingIndex > -1) {
      if (text.trim() === '') {
        // delete if empty
        updatedMemos.splice(existingIndex, 1);
      } else {
        updatedMemos[existingIndex] = { date, text };
      }
    } else if (text.trim() !== '') {
      updatedMemos.push({ date, text });
    }
    
    saveMemosToStorage(updatedMemos);
  };

  // Carry forward all uncompleted items from select date to TODAY or TOMORROW
  const handleCarryForwardUnfinished = () => {
    const uncompletedIds = dailyTodos.filter((t: Todo) => !t.completed).map((t: Todo) => t.id);
    if (uncompletedIds.length === 0) return;

    // Default to move them to TODAY. Let's find today ISO
    const todayISO = getTodayISOString();
    
    // If we are already on today, maybe move to tomorrow? Let's check:
    let destinationDate = todayISO;
    if (selectedDate === todayISO) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dateVal = String(tomorrow.getDate()).padStart(2, '0');
      destinationDate = `${year}-${month}-${dateVal}`;
    }

    const updated = todos.map((todo: Todo) => {
      if (uncompletedIds.includes(todo.id)) {
        return { ...todo, dueDate: destinationDate };
      }
      return todo;
    });

    saveTodosToStorage(updated);
  };

  return (
    <div className="min-h-screen bg-[#FFFEEB] text-vibrant-dark transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100 font-sans antialiased pb-12">
      {/* Outer elegant container */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Real App Header */}
        <header className="flex items-center justify-between mb-8 border-b-4 border-vibrant-dark dark:border-zinc-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-vibrant-coral text-white border-4 border-vibrant-dark rounded-2xl flex items-center justify-center shadow-xs">
              <CheckSquare className="w-7 h-7 stroke-[3]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-vibrant-dark dark:text-zinc-100 flex items-center gap-2">
                <span>สมุดจดงานรายวัน</span>
                <span className="text-xs bg-vibrant-yellow text-vibrant-dark border-2 border-vibrant-dark px-2.5 py-0.5 rounded-lg font-black">
                  พ.ศ. {new Date().getFullYear() + 543}
                </span>
              </h1>
              <p className="text-xs font-black text-zinc-650 dark:text-zinc-400 mt-1">
                {greetingText} วางแผนอย่างมีเป้าหมายเพื่อทุกวันที่ดียิ่งขึ้น
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-2xl bg-white hover:bg-vibrant-yellow dark:bg-zinc-900 border-4 border-vibrant-dark text-vibrant-dark dark:text-zinc-400 transition-all duration-200 cursor-pointer shadow-xs active:translate-y-0.5"
              title="สลับโหมดสว่าง/มืด"
              id="theme-toggler"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500 fill-amber-500" /> : <Moon className="w-5 h-5 text-vibrant-coral" />}
            </button>
          </div>
        </header>

        {/* Dashboard Grid Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT AGGREGATORS COLUMN */}
          <section className="lg:col-span-5 space-y-6">
            {/* Calendar Week Strip */}
            <CalendarStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              todos={todos}
            />

            {/* Daily Goal Gauge/Meter */}
            <DailyGoalMeter
              completedCount={dailyMetrics.completed}
              totalCount={dailyMetrics.total}
            />

            {/* Daily text memo pad */}
            <QuickMemo
              selectedDate={selectedDate}
              memoText={activeMemoText}
              onSaveMemo={handleSaveMemo}
            />
          </section>

          {/* RIGHT TASKS HANDLING COLUMN */}
          <section className="lg:col-span-7 bg-white dark:bg-zinc-900 border-4 border-vibrant-dark rounded-[32px] p-6 shadow-sm flex flex-col min-h-[500px]">
            {/* Current Active date banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 mb-5 gap-3">
              <div>
                <span className="text-[10px] font-black tracking-wider text-vibrant-teal uppercase">
                  ตารางงานประจำวัน
                </span>
                <h2 className="text-lg font-black text-vibrant-dark dark:text-zinc-100">
                  {dateFormattedThai}
                </h2>
              </div>

              {/* Carry forward option if there are uncompleted items on past selected dates */}
              {dailyTodos.some((t: Todo) => !t.completed) && (
                <button
                  onClick={handleCarryForwardUnfinished}
                  className="px-3.5 py-2 self-start sm:self-auto bg-vibrant-yellow hover:bg-[#ffe266] text-vibrant-dark border-2 border-vibrant-dark text-xs font-black rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:translate-y-0.5"
                  title="ย้ายงานที่ยังทำไม่เสร็จของวันนี้ไปยังพรุ่งนี้หรือวันนี้"
                  id="btn-carry-forward"
                >
                  <span>เลื่อนงานไปพรุ่งนี้</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Todo Submit Form */}
            <div className="mb-5">
              <AddTodoForm onAddTodo={handleAddTodo} />
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-5">
              {/* Filter Tabs */}
              <div className="flex bg-zinc-100/70 p-1 dark:bg-zinc-800 rounded-xl border-2 border-vibrant-dark shrink-0">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'active', label: 'กำลังทำ' },
                  { id: 'completed', label: 'เสร็จแล้ว' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as 'all' | 'active' | 'completed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-150 cursor-pointer ${
                      filter === tab.id
                        ? 'bg-vibrant-dark border border-vibrant-dark text-white'
                        : 'text-zinc-650 hover:text-vibrant-dark dark:text-zinc-400 hover:bg-zinc-200/50'
                    }`}
                  >
                    {tab.label}
                    {tab.id === 'all' && dailyTodos.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-vibrant-yellow text-vibrant-dark text-[9px] font-black rounded-md border border-vibrant-dark/20">
                        {dailyTodos.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Simple Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vibrant-dark/70 stroke-[2.5]" />
                <input
                  type="text"
                  placeholder="ค้นหารายการงานวันนี้..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-zinc-50 dark:bg-zinc-800 border-2 border-vibrant-dark rounded-xl text-xs font-black text-vibrant-dark dark:text-zinc-200 outline-hidden focus:border-vibrant-coral"
                  id="search-todos"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 px-1 top-1/2 -translate-y-1/2 text-vibrant-dark/70 hover:text-vibrant-coral cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>

            {/* Todos Listings or Empty States */}
            <div className="flex-1 space-y-3 min-h-[250px] relative">
              <AnimatePresence mode="popLayout">
                {filteredAndSearchedTodos.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAndSearchedTodos.map((todo: Todo) => (
                      <div key={todo.id}>
                        <TodoItem
                          todo={todo}
                          onToggleComplete={handleToggleComplete}
                          onEditTodo={handleEditTodo}
                          onDeleteTodo={handleDeleteTodo}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-14 h-14 bg-vibrant-yellow border-2 border-vibrant-dark rounded-2xl flex items-center justify-center text-vibrant-dark mb-3.5">
                      <Sparkles className="w-7 h-7 text-vibrant-dark stroke-[2.5]" />
                    </div>
                    <h3 className="text-sm font-black text-vibrant-dark dark:text-zinc-300">
                      {searchQuery 
                        ? 'ไม่พบรายการที่ค้นหา' 
                        : filter === 'completed' 
                        ? 'ยังไม่มีรายการกิจกรรมที่ทำเสร็จ' 
                        : 'ไม่มีภารกิจของวันนี้'}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 max-w-[280px] mx-auto leading-relaxed font-bold">
                      {searchQuery
                        ? 'ลองตรวจสอบคำค้นหาใหม่อีกครั้ง หรือล้างข้อความค้นหา'
                        : filter === 'completed'
                        ? 'เมื่อคุณทำสิ่งต่าง ๆ สำเร็จ ข้อมูลจะแสดงบันทึกไว้ตรงนี้'
                        : 'ใช้ปุ่มสร้างงานใหม่ เพื่อเริ่มต้นวางแผนวันที่มีประสิทธิภาพของคุณ'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bulk Actions Footer */}
            {dailyMetrics.completed > 0 && (
              <div className="border-t-2 border-vibrant-dark dark:border-zinc-800 pt-4 mt-6 flex justify-end gap-2">
                <button
                  onClick={clearCompletedOfSelectedDate}
                  className="px-4 py-2 font-black text-xs border-2 border-vibrant-dark text-vibrant-dark bg-white hover:bg-vibrant-coral hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  id="btn-clear-completed"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ล้างภารกิจที่เสร็จแล้วของวันนี้</span>
                </button>
              </div>
            )}
          </section>
        </main>

        {/* Humble standard footer with human label */}
        <footer className="mt-12 text-center border-t-4 border-vibrant-dark dark:border-zinc-800 pt-5 text-zinc-540 dark:text-zinc-650 text-[11px] font-black">
          <p>© {new Date().getFullYear() + 543} Daily Todo List • ออกแบบให้เรียบง่ายและเป็นระเบียบสม่ำเสมอในทุกวัน</p>
        </footer>
      </div>
    </div>
  );
}
