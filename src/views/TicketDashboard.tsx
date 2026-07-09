import React, { useState, useEffect } from "react";
import { 
  Ticket, 
  DollarSign, 
  Percent, 
  Plus, 
  QrCode, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  X
} from "lucide-react";
import { azureApi } from "../lib/azureApi";
import { EventItem } from "../types";
import EmptyState from "../components/EmptyState";

export default function TicketDashboard() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promoCodes, setPromoCodes] = useState([
    { code: "AI_SUMMIT_20", discount: "20%", type: "Percentage", usedCount: 145, status: "Active" },
    { code: "EARLY_BIRD_100", discount: "₹8,000", type: "Flat Rate", usedCount: 82, status: "Active" },
    { code: "STUDENT_FREE", discount: "100%", type: "Percentage", usedCount: 12, status: "Expired" }
  ]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [simulatedTicketType, setSimulatedTicketType] = useState("Executive VIP Pass");

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await azureApi.getEvents();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load ticketing events from Azure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;
    setPromoCodes(prev => [
      {
        code: newCode.toUpperCase().replace(/\s+/g, ""),
        discount: newDiscount,
        type: "Flat/Percentage",
        usedCount: 0,
        status: "Active"
      },
      ...prev
    ]);
    setNewCode("");
    setNewDiscount("");
    setIsPromoModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Upper Status Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">Ticketing Operations Console</h1>
        <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Configure multi-tier capacities, launch strategic discount cycles, verify QR barcodes, and track payment ledgers.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 font-sans text-xs text-slate-400">Synchronizing ticketers from Azure SQL Database...</div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No active events found for ticketing operations."
          description="Your ticketing dashboard is empty because there are no events in the database. Populate the database under settings to simulate ticket sales and QR passes."
          actionLabel="Go to Settings"
          onAction={() => alert("Navigate to the settings tab to seed or clear Azure SQL logs.")}
        />
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Section: Event capacities and promo manager (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selector header */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-sans font-semibold text-slate-500">Target Event:</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-xs font-sans font-bold text-slate-850 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
                >
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Total Capacity Limit: {activeEvent?.ticketCapacity || 0} seats</span>
            </div>

            {/* Ticket categories details */}
            {activeEvent && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-4">Configured Ticket Categories</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeEvent.ticketCategories.map((cat) => {
                    const percentSold = Math.round((cat.sold / cat.capacity) * 100);
                    return (
                      <div key={cat.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200">{cat.name}</h4>
                            <span className="text-[10px] font-sans text-slate-400">{cat.sold} of {cat.capacity} seats filled</span>
                          </div>
                          <span className="text-xs font-mono font-extrabold text-blue-600 dark:text-blue-400">
                            {cat.price === 0 ? "FREE" : `₹${cat.price.toLocaleString()}`}
                          </span>
                        </div>

                        {/* Progress Fill */}
                        <div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full" style={{ width: `${percentSold}%` }}></div>
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-1">
                            <span>{percentSold}% Sold</span>
                            <span>{cat.capacity - cat.sold} remaining</span>
                          </div>
                        </div>

                        {/* Perks List */}
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-850 space-y-1">
                          {cat.perks.map((perk, i) => (
                            <div key={i} className="flex items-center space-x-1.5 text-[10px] font-sans text-slate-500">
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Promo code database */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Active Promo & Referral Database</h3>
                  <p className="text-[11px] font-sans text-slate-400 mt-0.5">Configure discounts to accelerate ticket sell-out rates.</p>
                </div>
                <button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-semibold font-sans transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Add Coupon</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80">
                      <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Coupon Code</th>
                      <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-center">Discount value</th>
                      <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-center">Redeem Times</th>
                      <th className="py-2.5 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/40 text-xs">
                    {promoCodes.map((promo) => (
                      <tr key={promo.code} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">{promo.code}</td>
                        <td className="py-3 text-center font-sans font-semibold text-slate-700 dark:text-slate-300">{promo.discount}</td>
                        <td className="py-3 text-center font-mono text-slate-500">{promo.usedCount} used</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase
                            ${promo.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-slate-100 text-slate-400"}`}>
                            {promo.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Section: Virtual QR Pass Badge Generator Preview (1 Col) */}
          <div className="space-y-6">
            
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm text-center space-y-6">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Dynamic Pass Generator</span>
                <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mt-1">Virtual Ticket Simulator</h3>
              </div>

              {/* Simulated pass wrapper */}
              {activeEvent && (
                <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl space-y-4 text-left relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[9px] font-mono text-blue-400 tracking-wider font-bold uppercase block">EVENTRA PASS</span>
                      <span className="text-xs font-sans font-bold block truncate max-w-[160px]">{activeEvent.title}</span>
                    </div>
                    <div className="px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded border border-blue-500/20 text-[9px] font-mono font-bold">
                      {simulatedTicketType.toUpperCase()}
                    </div>
                  </div>

                  {/* QR Code Graphic box */}
                  <div className="w-32 h-32 bg-white rounded-xl mx-auto flex items-center justify-center p-2 relative shadow-lg">
                    <QrCode className="w-28 h-28 text-slate-950" />
                    <div className="absolute w-4 h-4 bg-white rounded-md border border-slate-200 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded"></div>
                    </div>
                  </div>

                  {/* Details card */}
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-slate-400 pt-3 border-t border-slate-800">
                    <div>
                      <span className="block text-[8px] uppercase">Holder:</span>
                      <strong className="text-slate-200 font-sans">Corporate Guest</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase">Unique Pass ID:</span>
                      <strong className="text-slate-200">EVT-901-A81Z</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick controller sandbox */}
              <div className="text-xs space-y-2.5">
                <span className="text-[10px] font-mono text-slate-400 block text-left font-semibold uppercase">Sandbox Controller</span>
                <select
                  value={simulatedTicketType}
                  onChange={(e) => setSimulatedTicketType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200 text-xs rounded-xl focus:outline-none"
                >
                  <option value="Executive VIP Pass">Executive VIP Pass</option>
                  <option value="General Admission">General Admission</option>
                  <option value="Student Pass">Student Pass</option>
                  <option value="Hacker Pass">Hacker Pass</option>
                </select>
                
                <button 
                  onClick={() => alert("QR Badge PDF generated and dispatched through Azure Notification Hub.")}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold font-sans transition-all"
                >
                  Download Simulation Pass
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Coupon Modal dialog */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-sans font-bold text-slate-900 dark:text-white">Configure New Promo Code</h3>
            <form onSubmit={handleAddPromoCode} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl focus:outline-none"
                  placeholder="e.g. SUMMER_25"
                />
              </div>
              <div>
                <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Discount Amount</label>
                <input 
                  type="text" 
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl focus:outline-none"
                  placeholder="e.g. 25% or ₹5,000"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsPromoModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">Publish Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
