import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  MapPin, 
  Megaphone, 
  CheckSquare, 
  Plus, 
  Activity, 
  ChevronRight, 
  Clock,
  Sparkles,
  UserPlus,
  TrendingUp,
  Award
} from "lucide-react";
import { azureApi } from "../lib/azureApi";
import { EventItem } from "../types";
import EmptyState from "../components/EmptyState";

export default function OrganizationDashboard() {
  const [activeBranch, setActiveBranch] = useState("San Francisco (HQ)");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [announcements, setAnnouncements] = useState([
    { id: "ann-1", title: "Security briefing regarding badges", content: "All Moscone West support volunteers must pick up their physical NFC devices by Wednesday afternoon.", date: "July 9, 2026", author: "Operational Desk" },
    { id: "ann-2", title: "Stripe contract renewed", content: "We have finalized our multi-currency clearing pipeline with Stripe Payments.", date: "July 8, 2026", author: "Finance Director" }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnContent, setNewAnnContent] = useState("");
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);

  const teamMembers = [
    { name: "Sarah Jenkins", role: "VP of Product Strategy", dept: "Engineering", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
    { name: "Marcus Aurelius Chen", role: "Director of UX", dept: "Design System", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
    { name: "Elena Rostova", role: "Head of DevRel", dept: "Growth", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" }
  ];

  const branches = [
    { name: "San Francisco (HQ)", address: "Moscone Corridor Center", staffCount: 145 },
    { name: "Austin Branch Office", address: "Figma Downtown Spaces", staffCount: 82 },
    { name: "London Creative Node", address: "Oval Exhibition Hub", staffCount: 38 }
  ];

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      try {
        const data = await azureApi.getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load dashboard events from Azure:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const totalRevenue = events.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalTicketsSold = events.reduce((acc, curr) => acc + curr.ticketsSold, 0);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    setAnnouncements(prev => [
      {
        id: Math.random().toString(),
        title: newAnnTitle,
        content: newAnnContent,
        date: "Today",
        author: "System Administrator"
      },
      ...prev
    ]);
    setNewAnnTitle("");
    setNewAnnContent("");
    setIsAnnModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-350">
      
      {/* Org Profile Header */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-sans font-bold text-2xl shadow-md">
            AC
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-sans font-bold text-slate-900 dark:text-white">Acme Enterprise Technologies</h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 uppercase tracking-wider">Premium Host</span>
            </div>
            <p className="text-xs font-sans text-slate-400 mt-1">Unified directory portal of tech communities, workspaces, branches, and active logistics.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Branches</span>
            <span className="text-sm font-sans font-bold text-slate-800 dark:text-slate-200">{branches.length} Nodes</span>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Tickets Sold</span>
            <span className="text-sm font-sans font-bold text-slate-800 dark:text-slate-200">{totalTicketsSold.toLocaleString()} tickets</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Events Summary, Calendar Tasks, Team */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-xs font-sans text-slate-500">Gross Event Billings</span>
              <span className="text-xl font-sans font-extrabold text-slate-950 dark:text-white block mt-1">
                ₹{totalRevenue.toLocaleString()}
              </span>
              <p className="text-[9px] font-mono text-emerald-600 mt-1 font-semibold">Real-time Azure Sync</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-xs font-sans text-slate-500">Total Live Catalog</span>
              <span className="text-xl font-sans font-extrabold text-slate-950 dark:text-white block mt-1">
                {events.length} Events
              </span>
              <p className="text-[9px] font-mono text-slate-400 mt-1">Durable SQL storage</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <span className="text-xs font-sans text-slate-500">Active Volunteer Squad</span>
              <span className="text-xl font-sans font-extrabold text-slate-950 dark:text-white block mt-1">45 staff</span>
              <p className="text-[9px] font-mono text-purple-600 mt-1 font-semibold">Onsite duty</p>
            </div>
          </div>

          {/* Events Overview */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">Organizational Events Ledger</h3>
            
            {isLoading ? (
              <div className="text-center py-10 text-xs font-sans text-slate-400">Syncing with Azure SQL Database...</div>
            ) : events.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-sans text-slate-400 block">No corporate events listed on the Ledger.</span>
                <span className="text-[10px] font-sans text-slate-400 block mt-1">Use the database seeder inside settings to populate active mock records.</span>
              </div>
            ) : (
              <div className="space-y-3.5">
                {events.slice(0, 3).map((evt) => {
                  const isLive = evt.status === "Live";
                  const isDraft = evt.status === "Draft";
                  return (
                    <div key={evt.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-3.5 min-w-0">
                        <img src={evt.image} alt="Event" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-slate-400">{evt.date} &bull; {evt.venue}</span>
                          <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block truncate mt-0.5">{evt.title}</h4>
                          <span className="text-[10px] font-sans text-slate-400 mt-0.5 block truncate max-w-sm">{evt.description}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 block">₹{evt.revenue.toLocaleString()}</span>
                          <span className="text-[9px] font-mono text-slate-400 block">{evt.attendeesCount} sold</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase
                          ${isLive ? "bg-red-50 text-red-600 dark:bg-red-950/20" : isDraft ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-600"}`}>
                          {evt.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Core Corporate Team Directory */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Central Team Directory</h3>
                <p className="text-[11px] font-sans text-slate-400 mt-0.5">Corporate administrators, product heads, and staff with workspace key permissions.</p>
              </div>
              <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center" title="Invite Team Member">
                <UserPlus className="w-4 h-4 text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {teamMembers.map((member, i) => {
                return (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center space-x-3">
                    <img src={member.avatar} alt="Team" className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block truncate leading-tight">{member.name}</span>
                      <span className="text-[10px] font-sans text-slate-400 block truncate mt-0.5">{member.role}</span>
                      <span className="text-[9px] font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/15 dark:text-blue-400 px-1 rounded inline-block mt-1 font-medium">{member.dept}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Branch locations, announcements postboard */}
        <div className="space-y-6">
          
          {/* Branch Offices Nodes */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Enterprise Branches</h3>
            <div className="space-y-3">
              {branches.map((br) => {
                const isSelected = activeBranch === br.name;
                return (
                  <button
                    key={br.name}
                    onClick={() => setActiveBranch(br.name)}
                    className={`w-full p-4 text-left rounded-2xl border transition-all flex items-center justify-between
                      ${isSelected 
                        ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/10" 
                        : "border-slate-100 dark:border-slate-850 hover:bg-slate-50/60"}`}
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block truncate">{br.name}</span>
                      <span className="text-[10px] font-sans text-slate-400 block truncate mt-0.5">{br.address}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold flex-shrink-0 ml-2">{br.staffCount} staff</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Announcements postboard */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Local Broadcasts</h3>
              <button 
                onClick={() => setIsAnnModalOpen(true)}
                className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-blue-500 font-bold uppercase">{ann.author}</span>
                    <span className="text-[9px] font-mono text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 mt-1">{ann.title}</h4>
                  <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Org task list checklists */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3">Milestone Reminders</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <span className="w-4 h-4 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 rounded-full flex items-center justify-center text-[10px] font-mono font-bold">✓</span>
                </div>
                <div>
                  <span className="text-xs font-sans text-slate-700 dark:text-slate-300 font-medium block leading-snug">Verify Key Vault Policies</span>
                  <span className="text-[10px] font-sans text-slate-400 block mt-0.5">Assigned to Cloud Architect</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <span className="w-4 h-4 border border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-[10px] font-mono"></span>
                </div>
                <div>
                  <span className="text-xs font-sans text-slate-700 dark:text-slate-300 font-medium block leading-snug">Sync Azure Monitor Logs</span>
                  <span className="text-[10px] font-sans text-slate-400 block mt-0.5">Assigned to Operations Lead</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Mini Modal for Posting Announcements */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6">
            <h3 className="text-base font-sans font-bold text-slate-900 dark:text-white">Broadcast New Announcement</h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Title</label>
                <input 
                  type="text" 
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                  placeholder="e.g. WiFi code update"
                />
              </div>
              <div>
                <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Content description</label>
                <textarea 
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                  placeholder="Provide precise details here..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                >
                  Broadcast Announcements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
