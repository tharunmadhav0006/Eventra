import React, { useState } from "react";
import { 
  QrCode, 
  Search, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  Camera, 
  Sparkles, 
  Activity,
  UserCheck,
  X
} from "lucide-react";
import { mockEvents } from "../data/mockData";

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
  checkInTime?: string;
  seatNum?: string;
}

export default function CheckInSystem() {
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: "att-101", name: "Jonathan Miller", email: "jon.m@stripe.com", ticketType: "Executive VIP Pass", checkedIn: true, checkInTime: "08:14 AM", seatNum: "VIP-A12" },
    { id: "att-102", name: "Alice Zhang", email: "azhang@notion.so", ticketType: "General Admission", checkedIn: false, seatNum: "GEN-D03" },
    { id: "att-103", name: "Bob Robertson", email: "bob@agenticlabs.ai", ticketType: "Hacker Ticket", checkedIn: false, seatNum: "HC-911" },
    { id: "att-104", name: "Emily Watson", email: "emily.watson@mit.edu", ticketType: "Student Pass", checkedIn: true, checkInTime: "08:42 AM", seatNum: "ST-B01" },
    { id: "att-105", name: "Sarah Connor", email: "sconnor@cyberdyne.com", ticketType: "Executive VIP Pass", checkedIn: false, seatNum: "VIP-A09" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "fail">("idle");
  const [scannedGuest, setScannedGuest] = useState<Attendee | null>(null);
  const [showBadge, setShowBadge] = useState<Attendee | null>(null);

  const totalAttendees = attendees.length;
  const verifiedCount = attendees.filter(a => a.checkedIn).length;
  const pendingCount = totalAttendees - verifiedCount;

  // Manual Check-in toggle
  const handleToggleCheckin = (id: string) => {
    setAttendees(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = !a.checkedIn;
        return {
          ...a,
          checkedIn: nextStatus,
          checkInTime: nextStatus ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return a;
    }));
  };

  // Simulate scanning code
  const handleSimulateScan = () => {
    setScanStatus("scanning");
    setScannedGuest(null);
    
    setTimeout(() => {
      // Find a random pending attendee to successfully scan
      const pendingOnes = attendees.filter(a => !a.checkedIn);
      if (pendingOnes.length > 0) {
        const randomAttendee = pendingOnes[Math.floor(Math.random() * pendingOnes.length)];
        
        // update status to checked-in
        setAttendees(prev => prev.map(a => {
          if (a.id === randomAttendee.id) {
            return {
              ...a,
              checkedIn: true,
              checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return a;
        }));

        setScannedGuest({
          ...randomAttendee,
          checkedIn: true,
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setScanStatus("success");
      } else {
        setScanStatus("fail");
      }
    }, 1500);
  };

  // Filter list
  const filteredList = attendees.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">On-site Verification & Badge Console</h1>
        <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Simulate live mobile QR ticketing check-in, review seat layouts, and output conference identity cards.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section: Live camera scanner simulator (1 Col) */}
        <div className="space-y-6">
          
          {/* Simulated QR scan chamber */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4 text-center">
            <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Active Scanner Terminal</h3>
            
            {/* Viewfinder box */}
            <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center">
              
              {/* Corner scan lines */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br"></div>

              {/* Scanning red laser animator */}
              {scanStatus === "scanning" && (
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-lg shadow-red-500/50 animate-bounce top-1/4"></div>
              )}

              {/* Central icons or camera backdrop */}
              <div className="text-slate-600 flex flex-col items-center">
                <Camera className="w-12 h-12 text-slate-500 mb-2 animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest uppercase">Verifying Stream</span>
              </div>

              {/* Status overlay banner */}
              {scanStatus === "success" && scannedGuest && (
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-white animate-in zoom-in-95">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">Verification Approved</span>
                  <span className="text-sm font-sans font-bold mt-1.5">{scannedGuest.name}</span>
                  <span className="text-[10px] font-sans text-slate-300 mt-0.5">{scannedGuest.ticketType} &bull; Seat {scannedGuest.seatNum}</span>
                  
                  <button 
                    onClick={() => setShowBadge(scannedGuest)}
                    className="mt-4 px-3 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-sans font-semibold rounded-lg flex items-center space-x-1 border border-white/20"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Conference Badge</span>
                  </button>
                </div>
              )}

              {scanStatus === "fail" && (
                <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-white animate-in zoom-in-95">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">No Pending Guests Found</span>
                  <span className="text-[10px] font-sans text-slate-300 text-center mt-2 leading-relaxed">All mock database attendees are currently verified and checked in!</span>
                </div>
              )}
            </div>

            <button
              id="simulate-scan-btn"
              onClick={handleSimulateScan}
              disabled={scanStatus === "scanning"}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold font-sans text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              {scanStatus === "scanning" ? "Synchronizing RFID Data..." : "Simulate QR Scan Pass"}
            </button>
          </div>

        </div>

        {/* Middle & Right combined (2 Cols): Manual list & printer deck */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Check-in Stats banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Checked In</span>
              <strong className="text-xl font-sans font-bold text-slate-850 dark:text-white block mt-1">{verifiedCount} attendees</strong>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Awaiting Arrival</span>
              <strong className="text-xl font-sans font-bold text-slate-850 dark:text-white block mt-1">{pendingCount} attendees</strong>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total RSVP list</span>
              <strong className="text-xl font-sans font-bold text-slate-850 dark:text-white block mt-1">{totalAttendees} RSVPs</strong>
            </div>
          </div>

          {/* Table list lookup */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Registered Attendee Ledger</h3>
              
              <div className="relative w-full max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Lookup attendee profile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80">
                    <th className="py-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Attendee Name</th>
                    <th className="py-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">Ticket category</th>
                    <th className="py-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-center">Seat</th>
                    <th className="py-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-center">Checked-in</th>
                    <th className="py-2 text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold text-right">Badge Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/40 text-xs">
                  {filteredList.map((g) => {
                    return (
                      <tr key={g.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3">
                          <strong className="text-slate-800 dark:text-slate-200 block">{g.name}</strong>
                          <span className="text-[10px] font-mono text-slate-400">{g.email}</span>
                        </td>
                        <td className="py-3 text-slate-500">{g.ticketType}</td>
                        <td className="py-3 text-center font-mono text-slate-400">{g.seatNum || "TBD"}</td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleToggleCheckin(g.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase transition-all
                              ${g.checkedIn 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                          >
                            {g.checkedIn ? `IN (${g.checkInTime})` : "Manual IN"}
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setShowBadge(g)}
                            disabled={!g.checkedIn}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 disabled:opacity-40 transition-all inline-flex items-center justify-center"
                            title="Generate & Print Badges"
                          >
                            <Printer className="w-4 h-4 text-blue-600" />
                          </button>
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

      {/* Conference badge popover printer drawer simulation */}
      {showBadge && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 text-center space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-sans font-bold text-slate-900 dark:text-white">Active NFC Badge Printer Deck</span>
              <button onClick={() => setShowBadge(null)} className="p-1 rounded hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>

            {/* Rendered Badge preview */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-6 space-y-4 shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-500"></div>
              
              <div className="text-center pt-2">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">EVENTRA DELEGATE</span>
                <h4 className="text-lg font-sans font-extrabold text-slate-900 dark:text-white mt-1.5 leading-tight">{showBadge.name}</h4>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">{showBadge.email}</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-150 rounded-xl text-center space-y-1">
                <span className="text-[8px] font-mono text-slate-400 uppercase">ACCESS PERK LEVEL:</span>
                <strong className="text-xs font-sans text-blue-600 block uppercase font-bold">{showBadge.ticketType}</strong>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
                <span>SEAT: {showBadge.seatNum}</span>
                <span className="text-emerald-500 font-bold">APPROVED GATE A</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button 
                onClick={() => setShowBadge(null)} 
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Close Queue
              </button>
              <button 
                onClick={() => {
                  alert("Badge signal forwarded to verified Moscone West D-12 printer node successfully.");
                  setShowBadge(null);
                }} 
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Output Hardware NFC
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
