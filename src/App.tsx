import React, { useState, useEffect } from "react";
import { UserRole } from "./types";

// Core View Screens
import LandingPage from "./views/LandingPage";
import Authentication from "./views/Authentication";

// Shared Shell Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AIConversationalAssistant from "./components/AIConversationalAssistant";

// Operational Dashboards & Views
import SuperAdminDashboard from "./views/SuperAdminDashboard";
import OrganizationDashboard from "./views/OrganizationDashboard";
import EventDashboard from "./views/EventDashboard";
import TicketDashboard from "./views/TicketDashboard";
import CalendarView from "./views/CalendarView";
import CheckInSystem from "./views/CheckInSystem";
import Portals from "./views/Portals";
import ResourceManagement from "./views/ResourceManagement";
import Communications from "./views/Communications";
import ReportsEngine from "./views/ReportsEngine";
import Settings from "./views/Settings";

export default function App() {
  // Global Navigation State
  // "landing" | "auth" | "workspace"
  const [currentScreen, setCurrentScreen] = useState<"landing" | "auth" | "workspace">("landing");
  
  // Workspace Tab selection (matches item.id in Sidebar.tsx)
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Current Active Simulated User Role
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.EVENT_MANAGER);
  
  // Dark Mode preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Mobile Sidebar trigger state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Authenticated User Profile values
  const [currentUser, setCurrentUser] = useState({
    name: "Guest User",
    email: "guest@acme.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
  });

  // Load session on startup from Azure Entra cache
  useEffect(() => {
    const savedSession = localStorage.getItem("azure_active_session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setCurrentUser({
          name: parsed.name,
          email: parsed.email,
          avatar: parsed.avatar
        });
        setCurrentRole(parsed.role as UserRole);
        setCurrentScreen("workspace");
      } catch (err) {
        console.error("Failed to recover Azure session claims cache:", err);
      }
    }
  }, []);

  // Sync Dark Mode state to root HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Dynamic router to render workspace contents
  const renderWorkspaceContent = () => {
    switch (activeTab) {
      case "dashboard":
        // Dynamic dashboard rendering depending on simulated user role
        switch (currentRole) {
          case UserRole.SUPER_ADMIN:
            return <SuperAdminDashboard />;
          case UserRole.ORG_ADMIN:
            return <OrganizationDashboard />;
          case UserRole.EVENT_MANAGER:
          case UserRole.ORGANIZER:
            return <EventDashboard />;
          case UserRole.VOLUNTEER:
          case UserRole.SPEAKER:
          case UserRole.SPONSOR:
          case UserRole.VENDOR:
            return <Portals />;
          case UserRole.ATTENDEE:
          case UserRole.GUEST:
            return <TicketDashboard />;
          default:
            return <EventDashboard />;
        }

      case "events":
        return <EventDashboard />;
      case "tickets":
        return <TicketDashboard />;
      case "calendar":
        return <CalendarView />;
      case "checkin":
        return <CheckInSystem />;
      case "portals":
        return <Portals />;
      case "resources":
        return <ResourceManagement />;
      case "communications":
        return <Communications />;
      case "reports":
        return <ReportsEngine />;
      case "settings":
        return <Settings />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  const handleGetStarted = () => {
    setCurrentScreen("auth");
  };

  const handleAuthSuccess = (user: { name: string; email: string; avatar: string; role: UserRole }) => {
    setCurrentRole(user.role);
    setCurrentUser({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
    localStorage.setItem("azure_active_session", JSON.stringify(user));
    setCurrentScreen("workspace");
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("azure_active_session");
    setCurrentScreen("landing");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. MARKETING LANDING PAGE SCREEN */}
      {currentScreen === "landing" && (
        <LandingPage onStartAuth={() => setCurrentScreen("auth")} />
      )}

      {/* 2. AUTHENTICATION & LOGIN SCREEN */}
      {currentScreen === "auth" && (
        <Authentication 
          onSuccess={handleAuthSuccess} 
          onBackToLanding={() => setCurrentScreen("landing")} 
        />
      )}

      {/* 3. MULTI-ROLE ENTERPRISE WORKSPACE SCREEN */}
      {currentScreen === "workspace" && (
        <div className="flex min-h-screen">
          
          {/* Collapsible/Slide-over Left Navigation Sidebar */}
          <Sidebar
            currentView={activeTab}
            setView={setActiveTab}
            currentRole={currentRole}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          {/* Outer Main Layout Content Container */}
          <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
            
            {/* Upper Top Navbar Header containing Notifications, Swapper, Profile */}
            <Navbar
              currentRole={currentRole}
              setRole={setCurrentRole}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              setIsSidebarOpen={setIsSidebarOpen}
              onLogout={handleLogout}
              currentUser={currentUser}
            />

            {/* Inner Dashboard View Canvas */}
            <main id="app-workspace-main" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {renderWorkspaceContent()}
              </div>
            </main>

            {/* Floating Conversational AI Assistant Drawer */}
            <AIConversationalAssistant />

          </div>

        </div>
      )}

    </div>
  );
}
