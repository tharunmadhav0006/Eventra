import React, { useState, useEffect } from "react";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  X, 
  Users, 
  Ticket, 
  Clock, 
  Layers, 
  Megaphone,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { mockSpeakers, mockSponsors } from "../data/mockData";
import { EventItem } from "../types";
import { azureApi } from "../lib/azureApi";
import EmptyState from "../components/EmptyState";

export default function EventDashboard() {
  const [activeTab, setActiveTab] = useState<"All" | "Live" | "Upcoming" | "Draft" | "Completed">("All");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedEventDetails, setSelectedEventDetails] = useState<EventItem | null>(null);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await azureApi.getEvents();
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventDetails(data[0]);
      } else {
        setSelectedEventDetails(null);
      }
    } catch (err) {
      console.error("Failed to load events from Azure SQL:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Wizard temporary forms state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState(100);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fallbackSpeaker = { 
      id: "spk-1", 
      name: "Dr. Aris Thorne", 
      title: "Chief AI Scientist", 
      company: "Synthetix Labs", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", 
      bio: "Pioneering researcher in large model architectures." 
    };
    
    const fallbackSponsor = { 
      id: "spon-1", 
      name: "Microsoft Azure", 
      tier: "Platinum" as const, 
      logo: "Microsoft Azure", 
      website: "https://azure.microsoft.com" 
    };

    const newEvent: EventItem = {
      id: `evt-${Math.random().toString().slice(2, 6)}`,
      title: newTitle || "Untitled Innovative Event",
      description: newDesc || "High quality strategic roundtable discussions.",
      date: newDate || "2026-10-12",
      time: newTime || "09:00",
      venue: newVenue || "Convention Center Hall A, Bangalore",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
      organizerId: "org-azure-1",
      attendeesCount: 0,
      revenue: 0,
      ticketsSold: 0,
      ticketCapacity: 300,
      ticketCategories: [
        { id: "t-new-1", name: "Standard Entry Pass", price: Number(ticketPrice), capacity: 300, sold: 0, perks: ["Exhibition access", "Digital workbook"] }
      ],
      speakers: mockSpeakers.length > 0 ? [mockSpeakers[0]] : [fallbackSpeaker],
      sponsors: mockSponsors.length > 0 ? [mockSponsors[0]] : [fallbackSponsor],
      sessions: [
        { id: "s-new-1", title: "General Cloud Keynote", description: "Strategic kick-off session.", startTime: "09:30", endTime: "11:00", speakerId: "spk-1" }
      ]
    };

    try {
      await azureApi.createEvent(newEvent);
      await loadEvents();
      setShowWizard(false);
      setWizardStep(1);
      
      // reset form fields
      setNewTitle("");
      setNewDesc("");
      setNewVenue("");
      setNewDate("");
      setNewTime("");
    } catch (err) {
      console.error("Failed to commit event creation to Azure:", err);
    }
  };

  const filteredEvents = activeTab === "All" 
    ? events 
    : events.filter(e => e.status === activeTab);

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">Enterprise Events Portfolio</h1>
          <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Plan, structure, modify, and monitor ticket sale analytics across active frameworks.</p>
        </div>

        <button
          id="trigger-wizard-btn"
          onClick={() => setShowWizard(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Creation Wizard</span>
        </button>
      </div>

      {/* Main Stepper Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Wizard Header with Stepper Progress */}
            <div className="p-6 bg-slate-900 text-white border-b border-slate-850">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="font-sans font-bold text-base">Intelligent Event Creation Wizard</span>
                </div>
                <button onClick={() => setShowWizard(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Indicator Progress line */}
              <div className="mt-6 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${wizardStep >= 1 ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-500"}`}>1</span>
                  <span className={wizardStep >= 1 ? "font-semibold text-slate-100" : "text-slate-500"}>Core Info</span>
                </div>
                <div className="h-px bg-slate-800 flex-1 mx-4"></div>
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${wizardStep >= 2 ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-500"}`}>2</span>
                  <span className={wizardStep >= 2 ? "font-semibold text-slate-100" : "text-slate-500"}>Logistics</span>
                </div>
                <div className="h-px bg-slate-800 flex-1 mx-4"></div>
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${wizardStep >= 3 ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-500"}`}>3</span>
                  <span className={wizardStep >= 3 ? "font-semibold text-slate-100" : "text-slate-500"}>Review</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              
              {wizardStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Event Title</label>
                    <input 
                      type="text" 
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                      placeholder="e.g. Stanford Quantum Cryptography Meetup"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Description</label>
                    <textarea 
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                      placeholder="Provide comprehensive details of agenda goals..."
                    ></textarea>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Date</label>
                      <input 
                        type="date" 
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">Time</label>
                      <input 
                        type="time" 
                        required
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Physical Venue / Digital Address</label>
                    <input 
                      type="text" 
                      required
                      value={newVenue}
                      onChange={(e) => setNewVenue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                      placeholder="e.g. Grand Ball Room B, W Hotel SF"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Standard Ticket Cost (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4 animate-in fade-in text-xs font-sans text-slate-600 dark:text-slate-300">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-2">
                    <div>
                      <span className="text-slate-400 block">Proposed Title:</span>
                      <strong className="text-sm text-slate-900 dark:text-white">{newTitle || "Untitled Event"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Date & Venue:</span>
                      <strong>{newDate || "TBD"} &bull; {newTime || "TBD"} &bull; {newVenue || "TBD"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Standard Ticket price:</span>
                      <strong>₹{ticketPrice} INR</strong>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Double checking compliance values. System matches 100% security rules.</span>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(prev => prev - 1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back</span>
                  </button>
                ) : <div />}

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(prev => prev + 1)}
                    className="px-5 py-2 bg-slate-900 text-white dark:bg-blue-600 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <span>Next step</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Publish Event Live</span>
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Primary Layout: Left col list, Right col expanded item */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section: Events Filtering & Listing (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filtering tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-850 pb-2">
            {(["All", "Live", "Upcoming", "Draft", "Completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-sans font-medium rounded-xl transition-all
                  ${activeTab === tab 
                    ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100" 
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-10 font-sans text-xs text-slate-400">Querying Azure SQL Database...</div>
            ) : filteredEvents.length === 0 ? (
              <EmptyState
                title="No events have been created yet."
                description="Your Azure SQL database is online. Launch the Event Creation Wizard or seed the database under settings to display active streams."
                actionLabel="Launch Creation Wizard"
                onAction={() => setShowWizard(true)}
              />
            ) : (
              filteredEvents.map((evt) => {
                const isSelected = selectedEventDetails?.id === evt.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEventDetails(evt)}
                    className={`w-full p-4 bg-white dark:bg-slate-900 border text-left rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all
                      ${isSelected 
                        ? "border-blue-500 dark:border-blue-600 ring-2 ring-blue-500/10" 
                        : "border-slate-200 dark:border-slate-850 hover:bg-slate-50/60"}`}
                  >
                    <div className="flex items-start space-x-3.5 min-w-0">
                      <img src={evt.image} alt="Cover" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-slate-400">{evt.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-mono text-slate-400">{evt.venue.split(",")[0]}</span>
                        </div>
                        <h3 className="font-sans font-bold text-xs text-slate-900 dark:text-white block truncate mt-0.5">{evt.title}</h3>
                        <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 block truncate max-w-sm mt-0.5">{evt.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2.5 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 block">₹{evt.revenue.toLocaleString()}</span>
                        <span className="text-[9px] font-mono text-slate-400 block">{evt.attendeesCount} tickets sold</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{evt.status}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section: Expanded Selected Event Details Cover, Speakers, Sessions (1 Col) */}
        <div className="space-y-6">
          {selectedEventDetails ? (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 animate-in fade-in duration-200">
              
              {/* Event Image Cover */}
              <div className="relative h-40 rounded-2xl overflow-hidden">
                <img 
                  src={selectedEventDetails.image} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase rounded-full">
                  {selectedEventDetails.status}
                </span>
              </div>

              {/* Title & Stats */}
              <div>
                <h2 className="font-sans font-bold text-sm text-slate-900 dark:text-white">{selectedEventDetails.title}</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 border-y border-slate-100 dark:border-slate-850 py-3 text-center">
                  <div>
                    <span className="text-[10px] font-sans text-slate-400 block">Total Capacity</span>
                    <strong className="text-sm font-sans text-slate-800 dark:text-slate-200">{selectedEventDetails.ticketCapacity} seats</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans text-slate-400 block">Current Gross</span>
                    <strong className="text-sm font-sans text-slate-800 dark:text-slate-200">₹{selectedEventDetails.revenue.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-2.5 text-xs font-sans text-slate-600 dark:text-slate-350">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{selectedEventDetails.date} at {selectedEventDetails.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{selectedEventDetails.venue}</span>
                </div>
              </div>

              {/* Sessions Agenda timeline */}
              <div>
                <h4 className="text-xs font-sans font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                  <span>Sessions Timeline</span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedEventDetails.sessions.length} sessions</span>
                </h4>
                <div className="space-y-3">
                  {selectedEventDetails.sessions.map((ses) => (
                    <div key={ses.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-start space-x-3">
                      <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-mono text-slate-400">{ses.startTime} - {ses.endTime} &bull; Room: {ses.room || "Main Stage"}</span>
                        <h5 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">{ses.title}</h5>
                        <p className="text-[10px] font-sans text-slate-400 mt-0.5 leading-relaxed">{ses.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirmed Speakers list */}
              <div>
                <h4 className="text-xs font-sans font-bold text-slate-900 dark:text-white mb-3">Keynote Speakers</h4>
                <div className="space-y-2">
                  {selectedEventDetails.speakers.map((spk) => (
                    <div key={spk.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all">
                      <img src={spk.avatar} alt={spk.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <span className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 block truncate">{spk.name}</span>
                        <span className="text-[10px] font-sans text-slate-400 block truncate">{spk.title}, {spk.company}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl text-center text-xs text-slate-400">
              Select an event from the ledger to display details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
