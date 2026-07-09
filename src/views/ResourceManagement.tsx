import React, { useState, useEffect } from "react";
import { 
  Plus, 
  MapPin, 
  Tv, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert,
  Sliders,
  Calendar
} from "lucide-react";
import { azureApi } from "../lib/azureApi";
import { ResourceBooking } from "../types";
import EmptyState from "../components/EmptyState";

export default function ResourceManagement() {
  const [resources, setResources] = useState<ResourceBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState<"All" | "Venue" | "Equipment" | "Staff">("All");
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Booking fields
  const [bookResourceName, setBookResourceName] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookHours, setBookHours] = useState("2");

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const data = await azureApi.getResources();
      setResources(data);
    } catch (err) {
      console.error("Failed to load on-site resources from Azure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = selectedResourceType === "All"
    ? resources
    : resources.filter(r => r.type === selectedResourceType);

  const handleBookResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookResourceName) return;

    try {
      // Find matching resource and trigger booking update on server
      const match = resources.find(r => r.name.toLowerCase().includes(bookResourceName.toLowerCase()) || r.id === bookResourceName);
      if (match) {
        const updatedSessions = [
          ...match.bookedSessions,
          {
            eventId: "evt-user-triggered",
            title: "Special Core Standup Session",
            date: bookDate || "2026-07-15",
            time: "11:00 - 13:00"
          }
        ];
        await azureApi.updateResource(match.id, {
          status: "Booked",
          bookedSessions: updatedSessions
        });
      } else {
        // If resource doesn't exist, create a new demo asset
        await azureApi.createResource({
          id: `res-${Math.random().toString().slice(2, 6)}`,
          name: bookResourceName,
          type: "Venue",
          capacity: 100,
          status: "Booked",
          bookedSessions: [{
            eventId: "evt-user-triggered",
            title: "Corporate Technical Symposium",
            date: bookDate || "2026-07-15",
            time: "09:00 - 13:00"
          }]
        });
      }

      setBookResourceName("");
      setBookDate("");
      setShowBookingModal(false);
      await loadResources();
    } catch (err) {
      console.error("Failed to schedule resource booking:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">On-site Infrastructure Registry</h1>
          <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Book lecture auditoriums, coordinate AV hardware, map standby security personnel, and view conflict timelines.</p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Resource Booking</span>
        </button>
      </div>

      {/* Main Content splits */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left side: Categorized controls (1 Col) */}
        <div className="space-y-6">
          
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <h3 className="font-sans font-bold text-xs text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span>Registry Types</span>
            </h3>

            <div className="space-y-1.5">
              {(["All", "Venue", "Equipment", "Staff"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedResourceType(type)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all flex items-center justify-between
                    ${selectedResourceType === type 
                      ? "bg-slate-950 text-white dark:bg-slate-800 dark:text-slate-100" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"}`}
                >
                  <span>{type} Items</span>
                  <span className="text-[10px] font-mono opacity-60">
                    {type === "All" ? resources.length : resources.filter(r => r.type === type).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conflict advisory warning notice */}
          <div className="p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-3xl space-y-2 text-xs text-amber-800 dark:text-amber-400">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>System Conflict Warning</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Ballroom C setup overlaps with the Student Cryptography Standup scheduled on June 15th at 14:00. Verify session timetables!
            </p>
          </div>

        </div>

        {/* Right side: Interactive layout grid cards showing resource lists (3 Cols) */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-16 font-sans text-xs text-slate-400">Loading infrastructure resources from Azure...</div>
          ) : filteredResources.length === 0 ? (
            <EmptyState
              title="No infrastructure resources booked."
              description="Your onsite resources database is currently vacant. Schedule a venue, staff or equipment booking or run the database seeder to start tracking timelines."
              actionLabel="Book Onsite Asset"
              onAction={() => setShowBookingModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map((res) => {
                const isAvailable = res.status === "Available";
                
                return (
                  <div key={res.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/20 px-1.5 py-0.5 rounded uppercase font-bold">
                          {res.type}
                        </span>
                        <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white mt-2">{res.name}</h3>
                        <p className="text-[11px] font-sans text-slate-400 mt-1 leading-normal">Capacity: {res.capacity || "N/A"} &bull; Unit: {res.unit || "N/A"}</p>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase
                        ${isAvailable ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-red-50 text-red-600 dark:bg-red-950/20"}`}>
                        {res.status}
                      </span>
                    </div>

                    {/* Booked schedule list blocks */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 rounded-2xl space-y-2.5">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Active Booked Timelines:</span>
                      {res.bookedSessions.map((ses, idx) => (
                        <div key={idx} className="text-[10px] font-sans border-l-2 border-blue-500 pl-2">
                          <strong className="text-slate-800 dark:text-slate-200 block truncate leading-tight">{ses.title}</strong>
                          <span className="text-[9px] font-mono text-slate-400">{ses.date} at {ses.time}</span>
                        </div>
                      ))}

                      {res.bookedSessions.length === 0 && (
                        <span className="text-[10px] text-slate-400 font-sans italic block">No active bookings registered. Ready for immediate assignment.</span>
                      )}
                    </div>

                    {/* Booking Trigger button */}
                    <button
                      onClick={() => {
                        setBookResourceName(res.name);
                        setShowBookingModal(true);
                      }}
                      disabled={!isAvailable}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold font-sans transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isAvailable ? "Reserve Onsite Asset" : "Asset Booked Out"}</span>
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Booking simulation modal popup */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-sans font-bold text-slate-900 dark:text-white">Reserve On-site Resource</h3>
            
            <form onSubmit={handleBookResource} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Resource / Onsite asset ID</label>
                <input 
                  type="text" 
                  value={bookResourceName}
                  onChange={(e) => setBookResourceName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl focus:outline-none"
                  placeholder="e.g. Ballroom C"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Target Date</label>
                  <input 
                    type="date" 
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Hours Needed</label>
                  <input 
                    type="number" 
                    value={bookHours}
                    onChange={(e) => setBookHours(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
