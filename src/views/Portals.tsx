import React, { useState } from "react";
import { 
  Users, 
  Mic, 
  Award, 
  HelpCircle, 
  Clipboard, 
  Store, 
  Plus, 
  CheckCircle, 
  Upload, 
  FileText, 
  Compass, 
  Download, 
  TrendingUp, 
  MapPin,
  Flame,
  AlertTriangle
} from "lucide-react";
import { mockSpeakers, mockTasks, mockVendorBooths } from "../data/mockData";

export default function Portals() {
  const [activePortalTab, setActivePortalTab] = useState<"Speaker" | "Sponsor" | "Volunteer" | "Vendor">("Speaker");
  
  // Custom interactive states
  const [slideUploaded, setSlideUploaded] = useState(false);
  const [leadsCount, setLeadsCount] = useState(245);
  const [volunteerTasks, setVolunteerTasks] = useState(mockTasks);

  // Toggle tasks status
  const handleToggleTaskStatus = (id: string) => {
    setVolunteerTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === "Completed" ? "Pending" as const : "Completed" as const
        };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">Decoupled Stakeholder Ecosystem</h1>
        <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Specialized client environments for key delegates, event staff, sponsors, and on-site vendors.</p>
      </div>

      {/* Tabs navigation bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(["Speaker", "Sponsor", "Volunteer", "Vendor"] as const).map((tab) => {
          const Icon = tab === "Speaker" ? Mic : tab === "Sponsor" ? Award : tab === "Volunteer" ? Clipboard : Store;
          const isSelected = activePortalTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActivePortalTab(tab)}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 py-3 px-4 text-xs font-sans font-semibold border-b-2 transition-all
                ${isSelected 
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200"}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab} Hub</span>
            </button>
          );
        })}
      </div>

      {/* Portals Router content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[350px]">
        
        {/* SPEAKER PORTAL */}
        {activePortalTab === "Speaker" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center">
                  <Mic className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Keynote Speaker Dashboard</span>
                </h3>
                <p className="text-xs font-sans text-slate-400 mt-0.5">Manage biography metadata, session timing, and upload slides.</p>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-600 dark:bg-blue-950/20 px-2 py-0.5 rounded uppercase font-bold">Confirmed speaker profile</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-4">
                <div className="text-center">
                  <img src={mockSpeakers[0].avatar} alt="Avatar" className="w-16 h-16 rounded-full mx-auto object-cover border border-slate-200" referrerPolicy="no-referrer" />
                  <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mt-3">{mockSpeakers[0].name}</h4>
                  <span className="text-xs font-sans text-slate-400 block">{mockSpeakers[0].title}</span>
                  <span className="text-[10px] font-mono text-slate-500 block font-semibold">{mockSpeakers[0].company}</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400 text-center leading-relaxed italic border-t border-slate-200/50 pt-3">
                  "{mockSpeakers[0].bio}"
                </p>
              </div>

              {/* Upload Slides deck */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>Presentation Deck Files</span>
                  </h4>
                  <p className="text-[11px] font-sans text-slate-400 leading-relaxed mt-1.5">Upload high definition presentation slides (.PDF, .KEYNOTE, max 100MB) for review on site screens.</p>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-center">
                  {slideUploaded ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                      <span className="text-[11px] font-sans text-slate-700 block font-bold">Slide deck verified successfully</span>
                      <button onClick={() => setSlideUploaded(false)} className="text-[10px] font-mono text-blue-500 hover:underline">Reupload</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSlideUploaded(true)}
                      className="text-center hover:scale-101 transition-transform cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                      <span className="text-[11px] font-sans text-slate-500 block mt-1.5 font-bold">Select Presentation Slide File</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Speaker Sessions list */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-3.5">
                <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-blue-500" />
                  <span>Your Confirmed Sessions</span>
                </h4>
                
                <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400">09:00 - 10:30 &bull; Ballroom A</span>
                  <h5 className="text-xs font-sans font-bold text-slate-800 dark:text-slate-200 mt-1">Orchestrating the AI-First Enterprise</h5>
                  <p className="text-[10px] font-sans text-slate-400 mt-1 leading-normal">Keynote speech about foundation neural systems and organizational safety metrics.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SPONSOR PORTAL */}
        {activePortalTab === "Sponsor" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center">
                  <Award className="w-5 h-5 text-amber-500 mr-2" />
                  <span>Sponsor ROI & Lead Hub</span>
                </h3>
                <p className="text-xs font-sans text-slate-400 mt-0.5">Monitor lead conversions, download reports, and track brand impressions.</p>
              </div>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-600 dark:bg-amber-950/20 px-2 py-0.5 rounded uppercase font-bold">Platinum Sponsor (Google Cloud)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ROI leads conversion metrics */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Leads Captured via QR scan</span>
                  <strong className="text-3xl font-sans font-extrabold text-slate-950 dark:text-white block mt-2">{leadsCount} leads</strong>
                  <p className="text-[9px] font-mono text-emerald-600 font-semibold mt-1">+14.2% since yesterday morning</p>
                </div>

                <button 
                  onClick={() => setLeadsCount(prev => prev + 12)}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  Capture Demo Lead
                </button>
              </div>

              {/* Brand impressions card */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Exhibition Hall Banner Impressions</span>
                <strong className="text-2xl font-sans font-bold text-slate-905 dark:text-white block">14,240 views</strong>
                
                {/* Visual SVG mini bar chart */}
                <div className="h-16 w-full flex items-end space-x-2 pt-2">
                  <div className="bg-blue-600 h-8 flex-1 rounded"></div>
                  <div className="bg-blue-600 h-12 flex-1 rounded"></div>
                  <div className="bg-blue-600 h-6 flex-1 rounded"></div>
                  <div className="bg-blue-600 h-14 flex-1 rounded"></div>
                  <div className="bg-purple-600 h-16 flex-1 rounded"></div>
                </div>
              </div>

              {/* Download Assets */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Download Sponsor Kit</span>
                  </h4>
                  <p className="text-[11px] font-sans text-slate-500 mt-1 leading-normal">Retrieve badge scanning schemas, logo vectors, and floor layout files.</p>
                </div>

                <button 
                  onClick={() => alert("Sponsor Pack downloaded.")}
                  className="w-full py-2 bg-slate-950 text-white border border-slate-800 rounded-xl text-xs font-semibold mt-4"
                >
                  Download Asset Kit
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VOLUNTEER PORTAL */}
        {activePortalTab === "Volunteer" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center">
                  <Clipboard className="w-5 h-5 text-purple-500 mr-2" />
                  <span>On-Site Volunteer Tasks Center</span>
                </h3>
                <p className="text-xs font-sans text-slate-400 mt-0.5">Toggle assigned checklists, check timelines, and find emergency coordinator contacts.</p>
              </div>
              <span className="text-[10px] font-mono bg-purple-50 text-purple-600 dark:bg-purple-950/20 px-2 py-0.5 rounded uppercase font-bold">Moscone West Wing Crew</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Task list checkbox items */}
              <div className="md:col-span-2 p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-4">
                <h4 className="font-sans font-bold text-xs text-slate-850 dark:text-slate-200">Your Checklist Tasks</h4>
                
                <div className="space-y-3">
                  {volunteerTasks.slice(0, 3).map((task) => {
                    const isCompleted = task.status === "Completed";
                    return (
                      <div 
                        key={task.id} 
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className={`p-3.5 border rounded-2xl flex items-start space-x-3 cursor-pointer transition-all
                          ${isCompleted 
                            ? "bg-slate-100/50 dark:bg-slate-900/35 border-transparent opacity-60" 
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400"}`}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-mono font-extrabold">✓</span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px]"></span>
                          )}
                        </div>
                        <div>
                          <span className={`text-xs font-sans font-bold block ${isCompleted ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>{task.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Target limit: {task.dueDate} &bull; Priority {task.priority}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Emergency communications */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Emergency Contacts</span>
                  </h4>
                  <p className="text-[11px] font-sans text-slate-400 mt-2 leading-relaxed">For any on-site badge hardware failures, medical occurrences, or sponsor disputes, ping these immediate dispatch terminals:</p>
                </div>

                <div className="border-t border-slate-200/50 dark:border-slate-850 pt-4 space-y-2 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Onsite Coordinator:</span>
                    <strong>Alex Jenkins (+1-555-019-22)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Medical Wing dispatcher:</span>
                    <strong>Gate B Infirmary (Moscone West)</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VENDOR PORTAL */}
        {activePortalTab === "Vendor" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center">
                  <Store className="w-5 h-5 text-emerald-500 mr-2" />
                  <span>Exhibitor & Vendor Portal</span>
                </h3>
                <p className="text-xs font-sans text-slate-400 mt-0.5">Verify booth location, coordinate order deliveries, and audit invoices.</p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 px-2 py-0.5 rounded uppercase font-bold">Standard Booth exhibitor</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Booth detail diagram */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Your Booth Designation</span>
                
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-150 rounded-xl space-y-2 text-center">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold block">HALL A</span>
                  <strong className="text-xl font-sans font-extrabold text-slate-900 dark:text-white block">BOOTH A-12</strong>
                  <span className="text-[10px] font-sans text-slate-400 block mt-0.5">NVIDIA hardware Acceleration Lounge</span>
                </div>
              </div>

              {/* Vendor inventory list */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-3.5">
                <h4 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200">Exhibition Deliveries</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-100 rounded-xl">
                    <span>4K Demo Monitors</span>
                    <strong className="font-mono text-blue-500">x4 units</strong>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-100 rounded-xl">
                    <span>NVIDIA Poster Boards</span>
                    <strong className="font-mono text-blue-500">x2 large</strong>
                  </div>
                </div>
              </div>

              {/* Booth inventory status */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Payment Invoices</span>
                  <strong className="text-xl font-sans font-bold text-slate-900 dark:text-white block mt-2">₹2,40,000 INR</strong>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 text-[9px] font-mono font-bold rounded-full uppercase inline-block mt-2">Paid & Clear</span>
                </div>

                <button 
                  onClick={() => alert("Exhibitor invoice receipt downloaded to downloads folder.")}
                  className="w-full py-2 bg-slate-950 text-white border border-slate-800 rounded-xl text-xs font-semibold mt-4"
                >
                  Download Receipt
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
