import React from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Users, 
  FileText, 
  Settings, 
  MessageSquare, 
  Layers, 
  QrCode, 
  Activity, 
  X,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Inbox
} from "lucide-react";
import { UserRole } from "../types";

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  currentRole: UserRole;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ 
  currentView, 
  setView, 
  currentRole, 
  isSidebarOpen, 
  setIsSidebarOpen 
}: SidebarProps) {
  
  // Custom workspace options based on selected role
  const getWorkspaceName = () => {
    switch (currentRole) {
      case UserRole.SUPER_ADMIN:
        return "System Registry";
      case UserRole.ORG_ADMIN:
        return "Acme Enterprise";
      case UserRole.EVENT_MANAGER:
        return "Prod Events HQ";
      case UserRole.VOLUNTEER:
        return "Moscone Team C";
      case UserRole.SPEAKER:
        return "Speaker Console";
      case UserRole.SPONSOR:
        return "Partner Portal";
      case UserRole.VENDOR:
        return "Exhibitor Deck";
      case UserRole.ATTENDEE:
      case UserRole.GUEST:
        return "My Tickets";
      default:
        return "Eventra Hub";
    }
  };

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, roles: Object.values(UserRole) },
    { id: "events", label: "Events & Wizard", icon: Layers, roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.EVENT_MANAGER, UserRole.ORGANIZER] },
    { id: "tickets", label: "Tickets & Promos", icon: Ticket, roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.EVENT_MANAGER, UserRole.ORGANIZER, UserRole.ATTENDEE, UserRole.SPONSOR] },
    { id: "calendar", label: "Calendar Schedules", icon: Calendar, roles: Object.values(UserRole) },
    { id: "checkin", label: "QR Check-in Scanner", icon: QrCode, roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.EVENT_MANAGER, UserRole.ORGANIZER, UserRole.VOLUNTEER] },
    { id: "portals", label: "Stakeholder Portals", icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.EVENT_MANAGER, UserRole.ORGANIZER, UserRole.SPEAKER, UserRole.SPONSOR, UserRole.VENDOR, UserRole.VOLUNTEER] },
    { id: "resources", label: "Resource Planner", icon: Activity, roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.EVENT_MANAGER, UserRole.ORGANIZER, UserRole.VENDOR] },
    { id: "communications", label: "Campaigns & Feeds", icon: MessageSquare, roles: Object.values(UserRole) },
    { id: "reports", label: "Reports & Export", icon: FileText, roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.EVENT_MANAGER] },
    { id: "settings", label: "System Settings", icon: Settings, roles: [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.EVENT_MANAGER] },
  ];

  // Filter navigation items based on current role
  const allowedNavItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside 
      id="app-sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col transition-transform duration-300 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display font-bold tracking-tight text-slate-900 dark:text-white text-lg">EVENTRA</span>
            <span className="text-[9px] block font-mono text-blue-600 dark:text-blue-400 font-semibold leading-none uppercase tracking-widest">MINIMALIST HQ</span>
          </div>
        </div>
        
        <button 
          id="close-sidebar-btn"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workspace Selector */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-900">
        <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-900 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase block font-semibold">Active Workspace</span>
            <span className="text-xs font-sans font-semibold text-slate-800 dark:text-slate-200 block truncate">{getWorkspaceName()}</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 ml-2" title="Sync Status: Live"></div>
        </div>
      </div>

      {/* Main Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2 text-[10px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold">
          Core Operations
        </div>
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => {
                setView(item.id);
                setIsSidebarOpen(false); // close on mobile
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl font-sans text-xs font-medium transition-all group duration-150
                ${isActive 
                  ? "bg-slate-100 dark:bg-slate-900 text-blue-700 dark:text-blue-400 font-semibold" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Support Desk */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-900 shadow-sm">
          <div className="flex items-start space-x-2.5">
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200">Need Guidance?</h4>
              <p className="text-[10px] font-sans text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Ask our floating AI helper below for tips, setup macros, and structural advice.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
