import React, { useState, useEffect } from "react";
import { 
  Activity, 
  ShieldCheck, 
  Building2, 
  Layers, 
  Users2, 
  DollarSign, 
  AlertCircle, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  TrendingUp,
  Database,
  Cpu,
  MailWarning
} from "lucide-react";
import { azureApi } from "../lib/azureApi";
import { EventItem, AuditLog } from "../types";
import EmptyState from "../components/EmptyState";

export default function SuperAdminDashboard() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketStatus, setTicketStatus] = useState("Open");
  const [orgsCount, setOrgsCount] = useState(24);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const fetchedEvents = await azureApi.getEvents();
      setEvents(fetchedEvents);

      const logs = await azureApi.getAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error("Failed to sync super admin metrics from Azure SQL:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleSystemOptimize = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      loadMetrics();
    }, 1000);
  };

  const totalRevenue = events.reduce((acc, curr) => acc + curr.revenue, 0);

  const sysMetrics = [
    { label: "Total Revenue Flow", value: `₹${totalRevenue.toLocaleString()}`, change: "+14.8%", desc: "Platform cut: 3%", icon: DollarSign, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { label: "Total Organizations", value: orgsCount.toString(), change: "+3.2%", desc: "Active business tenants", icon: Building2, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { label: "Orchestrated Events", value: events.length.toString(), change: "Live Sync", desc: "Across all tenants", icon: Layers, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { label: "Total Active Users", value: "11,840", change: "+8.9%", desc: "Unique account profiles", icon: Users2, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" }
  ];

  const tickets = [
    { id: "tkt-101", from: "admin@stanford.edu", subject: "Sponsor tier invoice mismatch", priority: "High", status: "Open" },
    { id: "tkt-102", from: "partners@stripe.com", subject: "Requesting customized REST webhook", priority: "Medium", status: "Open" },
    { id: "tkt-103", from: "volunteer_chief@moscone.com", subject: "Double assignment alert on scanner", priority: "High", status: "Resolved" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Upper Status Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">Super Admin Panel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold tracking-tight mt-1.5">Intelligent Global Registry Console</h1>
          <p className="text-xs font-sans text-slate-400 mt-1 leading-relaxed">Continuous system telemetry, cross-tenant transactions, and decentralized platform health nodes.</p>
        </div>
        
        <button
          id="sys-optimize-btn"
          onClick={handleSystemOptimize}
          disabled={isRefreshing}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center space-x-2"
        >
          <Cpu className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Optimizing Nodes..." : "Perform System Tuneup"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sysMetrics.map((met, i) => {
          const Icon = met.icon;
          return (
            <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-semibold text-slate-500 dark:text-slate-400">{met.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${met.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-sans font-bold text-slate-900 dark:text-white">{met.value}</span>
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${met.change.includes("+") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                  {met.change}
                </span>
              </div>
              <p className="text-[10px] font-sans text-slate-400 mt-2">{met.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Revenue Timelines & Tenant Directory */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Chart Widget (Visual SVG) */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Active Revenue Projections</h3>
                <p className="text-[11px] font-sans text-slate-400 mt-0.5">Aggregated payouts and processing volumes across active enterprise pools.</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-[10px] font-mono text-slate-500">Direct Ticket Sales</span>
              </div>
            </div>

            {/* Custom high-fidelity responsive SVG chart */}
            <div className="h-44 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25"/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Background lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" className="dark:stroke-slate-850" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeDasharray="3 3" className="dark:stroke-slate-850" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" className="dark:stroke-slate-850" />

                {/* Shaded Area */}
                <path 
                  d="M 0,90 Q 100,50 180,75 T 320,30 T 420,15 T 500,10 L 500,100 L 0,100 Z" 
                  fill="url(#chartGrad)" 
                />
                
                {/* Line Path */}
                <path 
                  d="M 0,90 Q 100,50 180,75 T 320,30 T 420,15 T 500,10" 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                
                {/* Data point dots */}
                <circle cx="180" cy="75" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" className="dark:stroke-slate-900" />
                <circle cx="320" cy="30" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" className="dark:stroke-slate-900" />
                <circle cx="420" cy="15" r="4.5" fill="#c084fc" stroke="#ffffff" strokeWidth="2" className="dark:stroke-slate-900" />
              </svg>
            </div>
            
            {/* Chart X-Axis Labels */}
            <div className="flex justify-between items-center mt-3 px-1">
              <span className="text-[9px] font-mono text-slate-400">Q1 2026</span>
              <span className="text-[9px] font-mono text-slate-400">Feb</span>
              <span className="text-[9px] font-mono text-slate-400">Mar</span>
              <span className="text-[9px] font-mono text-slate-400">Apr</span>
              <span className="text-[9px] font-mono text-slate-400">May</span>
              <span className="text-[9px] font-mono text-slate-400">Jun (Peak)</span>
            </div>
          </div>

          {/* Tenants / Organizations Registry List */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Enterprise Organizations</h3>
                <p className="text-[11px] font-sans text-slate-400 mt-0.5">Verified educational networks, startups, and community centers.</p>
              </div>
              <button 
                onClick={() => setOrgsCount(prev => prev + 1)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-150 dark:bg-slate-800/80 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold font-sans transition-all border border-slate-200 dark:border-slate-750"
              >
                + Register New Tenant
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80">
                    <th className="py-3 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Tenant Name</th>
                    <th className="py-3 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Host Branch</th>
                    <th className="py-3 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-center">Active Events</th>
                    <th className="py-3 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-right">Transactions</th>
                    <th className="py-3 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/40">
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-3.5 text-xs font-sans font-bold text-slate-800 dark:text-slate-200">Stanford University Dept</td>
                    <td className="py-3.5 text-xs font-sans text-slate-500">Palo Alto Network</td>
                    <td className="py-3.5 text-xs font-sans font-semibold text-center text-slate-700 dark:text-slate-300">
                      {events.length > 0 ? Math.ceil(events.length / 2) : 0}
                    </td>
                    <td className="py-3.5 text-xs font-mono font-semibold text-right text-slate-800 dark:text-slate-200">₹45,200</td>
                    <td className="py-3.5 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full text-[10px] font-mono font-bold uppercase">Active</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-3.5 text-xs font-sans font-bold text-slate-800 dark:text-slate-200">Stripe Developer Relations</td>
                    <td className="py-3.5 text-xs font-sans text-slate-500">Fintech Hub A</td>
                    <td className="py-3.5 text-xs font-sans font-semibold text-center text-slate-700 dark:text-slate-300">
                      {events.length > 0 ? Math.floor(events.length / 2) : 0}
                    </td>
                    <td className="py-3.5 text-xs font-mono font-semibold text-right text-slate-800 dark:text-slate-200">₹{totalRevenue.toLocaleString()}</td>
                    <td className="py-3.5 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full text-[10px] font-mono font-bold uppercase">Active</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-3.5 text-xs font-sans font-bold text-slate-800 dark:text-slate-200">Global AI Researchers NGO</td>
                    <td className="py-3.5 text-xs font-sans text-slate-500">Austin Cohort</td>
                    <td className="py-3.5 text-xs font-sans font-semibold text-center text-slate-700 dark:text-slate-300">1</td>
                    <td className="py-3.5 text-xs font-mono font-semibold text-right text-slate-800 dark:text-slate-200">₹16,000</td>
                    <td className="py-3.5 text-right"><span className="px-2 py-0.5 bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase">Restricted</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Platform Health & Support Desk */}
        <div className="space-y-6">
          
          {/* Health status gauge */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl">
            <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase font-bold">Cloud Infrastructure Node Health</h4>
            
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-sans mb-1">
                  <span className="text-slate-300">Ticket Server API Gateway</span>
                  <span className="text-emerald-400 font-bold font-mono">100% Operational</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-sans mb-1">
                  <span className="text-slate-300">AI Model Orchestrator</span>
                  <span className="text-emerald-400 font-bold font-mono">100% Operational</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-sans mb-1">
                  <span className="text-slate-300">Node Cluster Processing</span>
                  <span className="text-amber-400 font-bold font-mono">89% Peak Load</span>
                </div>
                <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[89%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-800/80 pt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Total API requests today:</span>
              <span className="text-xs font-mono text-blue-400 font-bold">81,240 reqs</span>
            </div>
          </div>

          {/* Support Tickets Queue */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h4 className="text-xs font-sans font-bold text-slate-900 dark:text-white mb-4">Critical Support Queue</h4>
            
            <div className="space-y-3">
              {tickets.map((tkt, i) => {
                const isHigh = tkt.priority === "High";
                return (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-slate-400">#{tkt.id}</span>
                        <span className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded ${isHigh ? "bg-red-50 text-red-600 dark:bg-red-950/20" : "bg-amber-50 text-amber-600"}`}>
                          {tkt.priority}
                        </span>
                      </div>
                      <p className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 mt-1 leading-snug">{tkt.subject}</p>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{tkt.from}</span>
                    </div>
                    <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-blue-50/50 text-blue-600 uppercase">
                      {tkt.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Audit Logs */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h4 className="text-xs font-sans font-bold text-slate-900 dark:text-white mb-3">Live System Access Logs</h4>
            
            {isLoading ? (
              <div className="text-center py-6 text-xs text-slate-400 font-sans">Connecting to Azure Monitor...</div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl text-xs text-slate-400 font-sans">
                No access audit logs registered on Azure Monitor.
              </div>
            ) : (
              <div className="space-y-3">
                {auditLogs.slice(0, 4).map((log) => {
                  return (
                    <div key={log.id} className="text-[10px] font-sans border-l-2 border-blue-500 pl-2.5">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="font-mono text-[9px]">{log.timestamp}</span>
                        <span className="font-mono text-[9px] bg-slate-50 dark:bg-slate-950 px-1 rounded">{log.ip}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5 leading-snug">{log.action}</p>
                      <span className="text-[9px] font-mono text-slate-400 block truncate">{log.user}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
