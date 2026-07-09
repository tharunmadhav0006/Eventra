import React, { useState } from "react";
import { 
  Megaphone, 
  Send, 
  Mail, 
  MessageSquare, 
  Bell, 
  Sparkles, 
  User, 
  ChevronRight, 
  CheckCircle,
  Clock,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { mockNotifications } from "../data/mockData";

export default function Communications() {
  const [activeTab, setActiveTab] = useState<"Campaigns" | "Feed">("Campaigns");
  
  // Campaigns states
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignTemplate, setCampaignTemplate] = useState("Keynote Reminder");
  const [campaignAudience, setCampaignAudience] = useState("All Registered Attendees");
  const [sentCampaigns, setSentCampaigns] = useState([
    { id: "cmp-1", subject: "WiFi access protocols and badge requirements", template: "Logistics Notice", audience: "All Registered Attendees", date: "July 8, 2026", status: "Delivered" },
    { id: "cmp-2", subject: "Quantum Computing RSVP confirmation link", template: "Session Invite", audience: "VIP Pass Holders Only", date: "July 5, 2026", status: "Delivered" }
  ]);

  // Feed/forum states
  const [communityPosts, setCommunityPosts] = useState([
    { id: "post-1", author: "Dr. Clara Winters", role: "Keynote Speaker", content: "Excited to address the audience tomorrow regarding decentralized deep nets! Stop by Room B to check demo boards.", likes: 18, time: "2 hours ago" },
    { id: "post-2", author: "Siddharth Mehta", role: "Attendee", content: "Is anyone planning to co-work at the Moscone lounge this afternoon before the kickoff?", likes: 4, time: "4 hours ago" }
  ]);
  const [newPostContent, setNewPostContent] = useState("");

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject) return;

    setSentCampaigns(prev => [
      {
        id: `cmp-${Math.random().toString().slice(2, 6)}`,
        subject: campaignSubject,
        template: campaignTemplate,
        audience: campaignAudience,
        date: "Today",
        status: "Delivered"
      },
      ...prev
    ]);

    setCampaignSubject("");
    alert("Outbound marketing campaign queued. Dispatched to send pipeline.");
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent) return;

    setCommunityPosts(prev => [
      {
        id: `post-${Math.random()}`,
        author: "Manish Kumar",
        role: "Event Organizer",
        content: newPostContent,
        likes: 1,
        time: "Just now"
      },
      ...prev
    ]);

    setNewPostContent("");
  };

  const handleLikePost = (id: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Status Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">Communications & Marketing Command</h1>
          <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">Broadcast high-volume emails, send push notification alerts, and moderate community discussion forums.</p>
        </div>

        {/* View toggles */}
        <div className="flex items-center space-x-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("Campaigns")}
            className={`px-3 py-1.5 text-xs font-sans font-semibold rounded-lg transition-all flex items-center space-x-1.5
              ${activeTab === "Campaigns" 
                ? "bg-slate-950 text-white dark:bg-slate-800 dark:text-slate-100" 
                : "text-slate-500 hover:text-slate-700"}`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Campaigns & Bulletins</span>
          </button>
          <button
            onClick={() => setActiveTab("Feed")}
            className={`px-3 py-1.5 text-xs font-sans font-semibold rounded-lg transition-all flex items-center space-x-1.5
              ${activeTab === "Feed" 
                ? "bg-slate-950 text-white dark:bg-slate-800 dark:text-slate-100" 
                : "text-slate-500 hover:text-slate-700"}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Delegate Feed</span>
          </button>
        </div>
      </div>

      {/* Grid Layout depending on Tab */}
      {activeTab === "Campaigns" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Left: Compose campaign (2 Cols) */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Broadcast Bulletin Composer</h3>
              <p className="text-[11px] font-sans text-slate-400 mt-0.5">Author standard marketing templates, schedule dispatch parameters, and choose audience segments.</p>
            </div>

            <form onSubmit={handleSendCampaign} className="space-y-4">
              <div>
                <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Outbound Email Subject</label>
                <input 
                  type="text" 
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                  placeholder="e.g. Critical Parking Updates & Gate Entrance times"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Bulletins Template Style</label>
                  <select 
                    value={campaignTemplate}
                    onChange={(e) => setCampaignTemplate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                  >
                    <option value="Keynote Reminder">Keynote Reminder</option>
                    <option value="Logistics Notice">Logistics Notice</option>
                    <option value="Survey Outreach">Survey Outreach</option>
                    <option value="Promotion Deal">Promotion Deal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-sans font-semibold text-slate-500 block mb-1">Target Audience Cohort</label>
                  <select 
                    value={campaignAudience}
                    onChange={(e) => setCampaignAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl"
                  >
                    <option value="All Registered Attendees">All Registered Attendees</option>
                    <option value="VIP Pass Holders Only">VIP Pass Holders Only</option>
                    <option value="Staff & Volunteers Squad">Staff & Volunteers Squad</option>
                    <option value="Exhibitor Stand Booths">Exhibitor Stand Booths</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Verify & Send Broadcast</span>
              </button>
            </form>
          </div>

          {/* Right: Sent campaigns history list (1 Col) */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Outbound Bulletins History</h3>
            
            <div className="space-y-3.5">
              {sentCampaigns.map((cmp) => (
                <div key={cmp.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl">
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                    <span>{cmp.date} &bull; {cmp.template}</span>
                    <span className="text-emerald-500 font-bold">{cmp.status}</span>
                  </div>
                  <h4 className="text-xs font-sans font-bold text-slate-850 dark:text-slate-200 mt-1 leading-snug">{cmp.subject}</h4>
                  <span className="text-[10px] font-sans text-slate-400 block mt-1">To: {cmp.audience}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* DELEGATE COMMUNITY FORUM POSTS FEED */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Left: Feed thread (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Create forum post */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
              <form onSubmit={handleCreatePost} className="space-y-3">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 text-xs rounded-xl focus:outline-none"
                  placeholder="Share what is happening on the show floor..."
                  required
                ></textarea>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] font-mono text-slate-400">Posting as Manish Kumar (Organizer)</span>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Share Update
                  </button>
                </div>
              </form>
            </div>

            {/* Posts feed */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-700">
                        {post.author[0]}
                      </div>
                      <div>
                        <strong className="text-xs font-sans text-slate-850 dark:text-slate-100 block">{post.author}</strong>
                        <span className="text-[10px] font-mono text-blue-500 font-bold">{post.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{post.time}</span>
                  </div>

                  <p className="text-xs font-sans text-slate-750 dark:text-slate-300 leading-relaxed">{post.content}</p>

                  <div className="flex items-center space-x-2 border-t border-slate-100 dark:border-slate-850/80 pt-3">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className="text-[10px] font-mono text-slate-500 hover:text-blue-500 flex items-center space-x-1 transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} Upvotes</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Broadcast Alert system notices (1 Col) */}
          <div className="p-6 bg-slate-950 text-white rounded-3xl border border-slate-850 shadow-xl space-y-4">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-350">System-wide Broadcast Notifications</h3>
            
            <div className="space-y-4">
              {mockNotifications.map((not) => {
                const isUrgent = not.type === "alert" || not.type === "warning";
                return (
                  <div key={not.id} className="text-xs font-sans space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded ${isUrgent ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {not.type.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">{not.time}</span>
                    </div>
                    <p className="font-bold text-slate-200 mt-1 leading-snug">{not.title}</p>
                    <span className="text-[10px] font-mono text-slate-400 block">{not.description}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
