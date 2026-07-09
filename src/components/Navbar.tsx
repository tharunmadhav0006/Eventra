import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  User, 
  ChevronDown, 
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building,
  CalendarCheck,
  Compass,
  Check
} from "lucide-react";
import { UserRole, NotificationItem } from "../types";
import { mockNotifications } from "../data/mockData";

interface NavbarProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
  currentUser: { name: string; email: string; avatar: string };
}

export default function Navbar({
  currentRole,
  setRole,
  isDarkMode,
  setIsDarkMode,
  setIsSidebarOpen,
  onLogout,
  currentUser
}: NavbarProps) {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return ShieldCheck;
      case UserRole.ORG_ADMIN:
        return Building;
      case UserRole.EVENT_MANAGER:
      case UserRole.ORGANIZER:
        return CalendarCheck;
      default:
        return Compass;
    }
  };

  const ActiveRoleIcon = getRoleIcon(currentRole);

  return (
    <header className="h-16 border-b border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      {/* Left section: Sidebar trigger & search */}
      <div className="flex items-center space-x-3 flex-1 max-w-lg">
        <button
          id="mobile-sidebar-toggle"
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-55 dark:text-slate-400 dark:hover:bg-slate-900 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs sm:max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Quick search events, speakers, tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl border border-slate-100 dark:border-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right section: Actions & profile dropdowns */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        
        {/* Role Switcher Sandbox Dropdown */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            id="role-switcher-btn"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-sans text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
          >
            <ActiveRoleIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2 z-55 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-semibold">Sandbox Role Swapper</span>
              </div>
              <div className="max-h-72 overflow-y-auto custom-scrollbar">
                {Object.values(UserRole).map((role) => {
                  const isSelected = role === currentRole;
                  const Icon = getRoleIcon(role);
                  return (
                    <button
                      key={role}
                      id={`role-select-${role.replace(/\s+/g, "-")}`}
                      onClick={() => {
                        setRole(role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs font-medium font-sans hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors
                        ${isSelected ? "text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/10" : "text-slate-700 dark:text-slate-300"}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{role}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggler */}
        <button
          id="theme-toggler-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all shadow-sm"
          title="Toggle UI Color Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            id="notification-bell-btn"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all shadow-sm relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-55 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-sans font-semibold text-slate-900 dark:text-slate-100">Live Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-sans font-medium transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 custom-scrollbar">
                {notifications.map((notif) => {
                  return (
                    <div 
                      key={notif.id} 
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex items-start space-x-3 ${!notif.read ? "bg-blue-50/20 dark:bg-blue-950/5" : ""}`}
                    >
                      <div className="mt-0.5">
                        {notif.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {notif.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {notif.type === "alert" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {notif.type === "info" && <Info className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-sans font-medium text-slate-800 dark:text-slate-200">{notif.title}</p>
                        <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.description}</p>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            id="profile-dropdown-btn"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
          >
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-800 flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-left hidden md:block max-w-[120px]">
              <span className="text-xs font-sans font-semibold text-slate-900 dark:text-slate-100 block truncate leading-tight">{currentUser.name}</span>
              <span className="text-[10px] font-mono text-slate-400 block truncate">{currentUser.email}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block flex-shrink-0" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1.5 z-55 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 md:hidden">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate">{currentUser.name}</span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">{currentUser.email}</span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left text-xs font-medium font-sans text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Log Out to Landing</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
