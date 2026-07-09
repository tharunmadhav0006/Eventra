import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Sparkles, 
  CheckSquare, 
  CheckCircle,
  MapPin,
  ListTodo
} from "lucide-react";
import { mockEvents } from "../data/mockData";

export default function CalendarView() {
  const [viewMode, setViewMode] = useState<"Month" | "Week" | "Day">("Month");
  const [currentMonth, setCurrentMonth] = useState("July 2026");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Unscheduled tasks simulated sidebar
  const [unscheduledTasks, setUnscheduledTasks] = useState([
    { id: "cal-t-1", title: "Setup Stanford Keynote audio feeds", duration: "1.5h" },
    { id: "cal-t-2", title: "Print VIP Gold pass labels", duration: "3h" },
    { id: "cal-t-3", title: "Catering final head-count lock", duration: "1h" }
  ]);

  const [calendarEvents, setCalendarEvents] = useState([
    { id: "ce-1", title: "AI Agent Hackathon Opening", date: "22", time: "18:00 - 19:30", color: "bg-red-500/10 text-red-600 border-red-500/20" },
    { id: "ce-2", title: "Moscone Ballroom A Setup Check", date: "14", time: "14:00 - 16:30", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { id: "ce-3", title: "Global Tech Summit Day 1 Keynote", date: "15", time: "09:00 - 10:30", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    { id: "ce-4", title: "Stripe VIP Lunch Meeting", date: "15", time: "12:00 - 14:00", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" }
  ]);

  const handleSimulateSchedule = (taskId: string, day: string) => {
    const task = unscheduledTasks.find(t => t.id === taskId);
    if (!task) return;

    setCalendarEvents(prev => [
      ...prev,
      {
        id: `ce-${Math.random()}`,
        title: task.title,
        date: day,
        time: "10:00 - 11:30",
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
      }
    ]);

    setUnscheduledTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Generate Month Grid dates (July 2026 starting on Wednesday)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const prefixEmptyDays = Array.from({ length: 3 }, (_, i) => ""); // Wed starts at index 3

  return (
    <div className="space-y-6">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">Active Agenda Calendar</h1>
          <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Schedules, keynote times, staff standups, and drag-and-drop workflow task mapping.</p>
        </div>

        {/* View mode selectors */}
        <div className="flex items-center space-x-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 rounded-xl">
          {(["Month", "Week", "Day"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-xs font-sans font-semibold rounded-lg transition-all
                ${viewMode === mode 
                  ? "bg-slate-950 text-white dark:bg-slate-800 dark:text-slate-100" 
                  : "text-slate-500 hover:text-slate-700"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Calendar Control & Unscheduled Items */}
        <div className="space-y-6">
          
          {/* Calendar Month navigator card */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans font-bold text-slate-900 dark:text-white">{currentMonth}</span>
              <div className="flex items-center space-x-1">
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Timezone: America/Los_Angeles</span>
              <span className="text-blue-500">Local synced</span>
            </div>
          </div>

          {/* Unscheduled Tasks Queue for simulated drag & drop scheduling */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <ListTodo className="w-4 h-4 text-blue-500" />
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Unscheduled Queue</h3>
            </div>
            <p className="text-[11px] font-sans text-slate-400 leading-relaxed mb-4">Click any task badge to quick-schedule it onto the 15th (Keynote Day):</p>
            
            <div className="space-y-3">
              {unscheduledTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSimulateSchedule(t.id, "15")}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-950 hover:bg-blue-500/5 hover:border-blue-500 border border-slate-100 dark:border-slate-850 rounded-2xl text-left transition-all block group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block leading-tight group-hover:text-blue-500">{t.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-2">
                    <span>Estimate: {t.duration}</span>
                    <span className="text-blue-500 group-hover:underline">Schedule &rarr;</span>
                  </div>
                </button>
              ))}

              {unscheduledTasks.length === 0 && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl text-xs text-center font-medium">
                  All task reminders mapped to dates!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 3 Cols: Month grid calendar */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 overflow-hidden">
          
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-4 font-bold">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-2 min-h-[400px]">
            {prefixEmptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50/30 dark:bg-slate-950/5 rounded-xl border border-transparent"></div>
            ))}

            {daysInMonth.map((day) => {
              const matchedEvents = calendarEvents.filter(e => e.date === day);
              return (
                <div 
                  key={day} 
                  className={`p-1.5 bg-slate-50/50 dark:bg-slate-950/15 border border-slate-100 dark:border-slate-850/80 rounded-2xl flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-all min-h-[80px]`}
                >
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 ml-1.5 mt-1">{day}</span>
                  
                  {/* Embedded events within grid cell */}
                  <div className="space-y-1 mt-1.5">
                    {matchedEvents.map((evt) => (
                      <div 
                        key={evt.id} 
                        className={`px-1.5 py-1 text-[9px] font-sans font-medium rounded-lg border leading-tight truncate ${evt.color}`}
                        title={`${evt.title} (${evt.time})`}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
