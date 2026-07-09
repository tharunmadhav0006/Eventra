import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  DollarSign,
  Activity,
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { mockTransactions, mockEvents } from "../data/mockData";

export default function ReportsEngine() {
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExportSimulate = (type: string) => {
    setIsExporting(type);
    setTimeout(() => {
      setIsExporting(null);
      alert(`Export Complete: ${type} download dispatched successfully to your workstation.`);
    }, 1200);
  };

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesMethod = filterMethod === "All" || tx.ticketType.includes(filterMethod) || filterMethod === "Stripe API";
    const matchesStatus = filterStatus === "All" || tx.status === filterStatus;
    return matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">Financial Clearing & Audits Console</h1>
          <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Audit cross-tenant payouts, download invoices, review billing spikes, and file compliance reports.</p>
        </div>

        {/* Download links */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExportSimulate("PDF")}
            disabled={isExporting !== null}
            className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting === "PDF" ? "Formatting PDF..." : "Export PDF Ledger"}</span>
          </button>
          
          <button
            onClick={() => handleExportSimulate("CSV")}
            disabled={isExporting !== null}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting === "CSV" ? "Compiling..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout splits */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Interactive Filters and quick selectors (1 Col) */}
        <div className="space-y-6">
          
          {/* Controls Card */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
            <h3 className="font-sans font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
              <SlidersHorizontal className="w-4 h-4 text-blue-500 mr-2" />
              <span>Query Parameters</span>
            </h3>

            <div>
              <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Clearing Method</label>
              <select 
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
              >
                <option value="All">All Payment Systems</option>
                <option value="Stripe API">Stripe API</option>
                <option value="ApplePay API">ApplePay API</option>
                <option value="Bank Wire Transfer">Bank Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Settlement Status</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
              >
                <option value="All">All Status Options</option>
                <option value="Succeeded">Succeeded</option>
                <option value="Processing">Processing</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Quick billing summary totals card */}
          <div className="p-5 bg-slate-950 text-white rounded-3xl space-y-4 shadow-xl border border-slate-850">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Gross Clearing Summary</span>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400">Total Net Inflow</span>
                <strong className="text-xl font-sans block mt-0.5">₹6,96,240 INR</strong>
              </div>
              <div className="h-px bg-slate-800"></div>
              <div>
                <span className="text-xs text-slate-400">Merchant Fees (3%)</span>
                <strong className="text-sm font-mono block mt-0.5">₹20,887 INR</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Right 3 Cols: SVG Analytics chart & transactions database table */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Revenue timelines */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Active Clearing Velocities</h3>
                <p className="text-[11px] font-sans text-slate-400 mt-0.5">Real-time merchant clearing settlements compiled over current operating quarters.</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-slate-500">Stripe Transactions</span>
              </div>
            </div>

            {/* Custom interactive responsive visual SVG bar spikes */}
            <div className="h-28 w-full flex items-end justify-between pt-4">
              {[30, 45, 60, 38, 70, 95, 50, 64, 82, 100, 45, 90].map((val, i) => (
                <div key={i} className="flex flex-col items-center flex-1 mx-1.5 space-y-1.5">
                  <div 
                    className="w-full bg-emerald-500 dark:bg-emerald-600 rounded-t-lg transition-all hover:bg-emerald-400" 
                    style={{ height: `${val}px` }}
                    title={`₹${(val * 500).toLocaleString()}`}
                  ></div>
                  <span className="text-[8px] font-mono text-slate-400">Day {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions ledgers table list */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">Clearing Settlements Registry</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80">
                    <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Payment ID</th>
                    <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Target Event</th>
                    <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Clearing Gateway</th>
                    <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-center">Amount</th>
                    <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/40 text-xs">
                  {filteredTransactions.map((tx) => {
                    const isSucceeded = tx.status === "Success";
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3">
                          <strong className="text-slate-850 dark:text-slate-200 font-mono block">{tx.id}</strong>
                          <span className="text-[10px] font-mono text-slate-400">{tx.date}</span>
                        </td>
                        <td className="py-3 text-slate-500 max-w-[140px] truncate">{tx.eventTitle}</td>
                        <td className="py-3 text-slate-500 font-sans">Stripe API Gateway</td>
                        <td className="py-3 text-center font-mono font-bold text-slate-850 dark:text-slate-200">₹{tx.amount.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase
                            ${isSucceeded ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-red-50 text-red-600 dark:bg-red-950/20"}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
