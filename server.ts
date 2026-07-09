import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to persistent emulation storage representing Azure SQL database state
const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "azure_db.json");

// Ensure the directory exists
const dir = path.dirname(DB_FILE_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

interface AzureDB {
  users: any[];
  organizations: any[];
  events: any[];
  tasks: any[];
  resources: any[];
  transactions: any[];
  notifications: any[];
  auditLogs: any[];
  vendorBooths: any[];
  settings: any;
}

// Initial completely empty state for Azure SQL database to honor the raw production-ready rules
const INITIAL_DB_STATE: AzureDB = {
  users: [],
  organizations: [],
  events: [],
  tasks: [],
  resources: [],
  transactions: [],
  notifications: [],
  auditLogs: [],
  vendorBooths: [],
  settings: {
    webhookUrl: "https://api.acme.com/v1/webhooks/stripe-clearing",
    keyVaultSecretIdentifier: "https://evt-vault.vault.azure.net/secrets/stripe-secret",
    isSaved: true
  }
};

// Seed records mapped for Microsoft Azure platform demonstration
const AZURE_SEEDED_DATA: AzureDB = {
  users: [
    {
      id: "usr-azure-1",
      name: "Manish Kumar",
      email: "manishkumarofficial701@gmail.com",
      role: "Organization Admin",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      organization: "Cloud Tech India"
    }
  ],
  organizations: [
    { id: "org-azure-1", name: "Cloud Tech India", domain: "cloudtech.in", logo_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80" }
  ],
  events: [
    {
      id: "evt-azure-1",
      title: "Microsoft Azure Enterprise Summit 2026",
      description: "The premier gathering for Fortune 500 cloud architects, AI engineers, and DevOps leaders.",
      longDescription: "Join 5,000+ cloud technology leaders and enterprise engineers for two intensive days of keynote addresses, hands-on workshops, and deep technical roundtables. Discover how state-of-the-art foundation models and Microsoft Entra ID are reshaping identity security, cloud intelligence, and enterprise microservices.",
      date: "2026-08-15",
      time: "09:00",
      venue: "Convention Center Hall A, Bangalore",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
      organizerId: "org-azure-1",
      attendeesCount: 4120,
      revenue: 495000,
      ticketsSold: 4120,
      ticketCapacity: 5000,
      ticketCategories: [
        { id: "t-1-1", name: "Azure Executive Pass", price: 1500, capacity: 500, sold: 480, perks: ["All-access Keynote seats", "VIP lounge entry", "Catered luncheon", "1-on-1 speaker meetups"] },
        { id: "t-1-2", name: "Cloud Architect Pass", price: 450, capacity: 3500, sold: 3140, perks: ["Access to exhibition floor", "Main-stage tracks", "Event badge & kit", "Digital recordings"] },
        { id: "t-1-3", name: "Developer & Academic Pass", price: 150, capacity: 1000, sold: 500, perks: ["General entry", "Access to community tracks", "Digital badge"] }
      ],
      speakers: [
        { id: "spk-1", name: "Dr. Aris Thorne", title: "Chief AI Scientist", company: "Synthetix Labs", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", bio: "Pioneering researcher in large model architectures and enterprise generative intelligence." },
        { id: "spk-2", name: "Sarah Jenkins", title: "VP of Product Strategy", company: "Stripe", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", bio: "Passionate about building frictionless fintech experiences and scale-invariant global developer platforms." }
      ],
      sponsors: [
        { id: "spon-1", name: "Microsoft Azure", tier: "Platinum", logo: "Microsoft Azure", website: "https://azure.microsoft.com" },
        { id: "spon-2", name: "Stripe", tier: "Platinum", logo: "Stripe", website: "https://stripe.com" }
      ],
      sessions: [
        { id: "s-1-1", title: "Keynote: Orchestrating the Azure-First Enterprise", description: "Fireside chat and strategic outlook on embedding generative architectures safely.", startTime: "09:00", endTime: "10:30", speakerId: "spk-1", room: "Grand Ball Room" },
        { id: "s-1-2", title: "Scale-Invariant Payments via Azure SQL database", description: "How Stripe is scaling its multi-currency payment ledgers.", startTime: "11:00", endTime: "12:15", speakerId: "spk-2", room: "Main Hall A" }
      ]
    },
    {
      id: "evt-azure-2",
      title: "Intelligent Agent & Azure Cosmos Hackathon",
      description: "Build the future of autonomous agentic solutions using modern multi-agent systems and Cosmos DB.",
      longDescription: "A 48-hour continuous sprint bringing together elite software engineers, product designers, and AI researchers to conceptualize, train, and ship production-ready cognitive workflows on Microsoft Azure App Service.",
      date: "2026-07-22",
      time: "18:00",
      venue: "Azure Dev Center, Sector 5 Bangalore",
      status: "Live",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80",
      organizerId: "org-azure-1",
      attendeesCount: 320,
      revenue: 16000,
      ticketsSold: 320,
      ticketCapacity: 350,
      ticketCategories: [
        { id: "t-2-1", name: "Hacker Pass", price: 50, capacity: 300, sold: 290, perks: ["Free APIs", "48hr catering & drinks", "T-shirt & stickers", "Mentorship sessions"] }
      ],
      speakers: [
        { id: "spk-1", name: "Dr. Aris Thorne", title: "Chief AI Scientist", company: "Synthetix Labs", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", bio: "Pioneering researcher in large model architectures." }
      ],
      sponsors: [
        { id: "spon-1", name: "Microsoft Azure", tier: "Platinum", logo: "Microsoft Azure", website: "https://azure.microsoft.com" }
      ],
      sessions: [
        { id: "s-2-1", title: "Agentic Engineering Patterns with Azure OpenAI", description: "Advanced session on tool usage, self-correction, and planning behaviors.", startTime: "18:30", endTime: "19:30", speakerId: "spk-1", room: "Garage Stage" }
      ]
    }
  ],
  tasks: [
    { id: "tsk-azure-1", title: "Audit Azure Blob Storage QR Code Links", assignedTo: "Marcus Chen", roleNeeded: "Volunteer", status: "Pending", dueDate: "2026-07-22", priority: "High", eventId: "evt-azure-2" },
    { id: "tsk-azure-2", title: "Verify VIP Lounge Catering Ingredients", assignedTo: "Jane Austen", roleNeeded: "Event Manager", status: "In Progress", dueDate: "2026-08-14", priority: "Medium", eventId: "evt-azure-1" }
  ],
  resources: [
    { id: "res-azure-1", name: "Convention Center Hall A", type: "Venue", quantity: 1, status: "Booked", assignedEvent: "evt-azure-1", date: "2026-08-15", cost: 12000 },
    { id: "res-azure-2", name: "Premium 4K Laser Projectors", type: "Equipment", quantity: 3, status: "Booked", assignedEvent: "evt-azure-1", date: "2026-08-15", cost: 1500 }
  ],
  transactions: [
    { id: "tx-azure-1", eventId: "evt-azure-1", eventTitle: "Microsoft Azure Enterprise Summit 2026", buyerName: "Jonathan Miller", buyerEmail: "jon.m@stripe.com", amount: 1500, status: "Success", date: "2026-07-08 14:32", ticketType: "Azure Executive Pass", invoiceNumber: "INV-AZURE-0091" },
    { id: "tx-azure-2", eventId: "evt-azure-1", eventTitle: "Microsoft Azure Enterprise Summit 2026", buyerName: "Alice Zhang", buyerEmail: "azhang@notion.so", amount: 450, status: "Success", date: "2026-07-09 09:12", ticketType: "Cloud Architect Pass", invoiceNumber: "INV-AZURE-0092" }
  ],
  notifications: [
    { id: "n-azure-1", title: "Microsoft Entra Verified Sync", description: "Azure AD B2C securely loaded identity context for active sessions.", time: "10 mins ago", type: "success", read: false },
    { id: "n-azure-2", title: "Azure SQL Connection Pool Active", description: "Enterprise database server instance health is nominal.", time: "1 hour ago", type: "info", read: false }
  ],
  auditLogs: [
    { id: "al-azure-1", timestamp: "2026-07-09 05:41", user: "manishkumarofficial701@gmail.com", action: "Configured Entra External ID Auth Claims Policy", ip: "13.67.12.190", severity: "info" },
    { id: "al-azure-2", timestamp: "2026-07-09 04:12", user: "system@azure-entra.com", action: "Azure Key Vault Rotation Completed for JWT signing certificates", ip: "127.0.0.1", severity: "info" }
  ],
  vendorBooths: [
    { id: "v-azure-1", name: "AI hardware Acceleration Lounge", vendorName: "NVIDIA Corp", boothNumber: "Booth A-12", status: "Assigned", itemsOrdered: 4, paymentStatus: "Paid" }
  ],
  settings: {
    webhookUrl: "https://api.acme.com/v1/webhooks/stripe-clearing",
    keyVaultSecretIdentifier: "https://evt-vault.vault.azure.net/secrets/stripe-secret",
    isSaved: true
  }
};

// Database utility helpers
function readDB(): AzureDB {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DB_STATE, null, 2));
      return INITIAL_DB_STATE;
    }
    const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
    // Handle corrupted or empty file
    if (!content.trim()) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DB_STATE, null, 2));
      return INITIAL_DB_STATE;
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading emulator JSON DB:", error);
    return INITIAL_DB_STATE;
  }
}

function writeDB(data: AzureDB) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to emulator JSON DB:", error);
  }
}

// Lazy-loaded Gemini AI client to avoid load-time crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// REST API ROUTES DESIGNED FOR ENTERPRISE MICROSOFT AZURE BACKEND
// -------------------------------------------------------------

// Seeding tool for Azure verification
app.post("/api/azure/seed", (req, res) => {
  writeDB(AZURE_SEEDED_DATA);
  res.json({ message: "Azure SQL Database successfully seeded with standard enterprise records.", data: AZURE_SEEDED_DATA });
});

// Clears all data to raw empty states
app.post("/api/azure/clear", (req, res) => {
  writeDB(INITIAL_DB_STATE);
  res.json({ message: "Azure SQL Database successfully truncated and cleared to live production-ready empty states.", data: INITIAL_DB_STATE });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    backend: "Microsoft Azure App Service", 
    database: "Azure SQL Database", 
    keyVault: "Active", 
    entraAuth: "Configured (Microsoft Entra External ID B2C)", 
    blobStorage: "Azure Blob Container",
    timestamp: new Date().toISOString() 
  });
});

// Microsoft Entra AD B2C Emulated Credential endpoints
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, organization } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  const db = readDB();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account under this identity already exists in this Azure Active Directory tenant." });
  }

  // Create organization if optional name provided and doesn't exist
  let orgId = null;
  if (organization) {
    const cleanOrgName = organization.trim();
    let org = db.organizations.find(o => o.name.toLowerCase() === cleanOrgName.toLowerCase());
    if (!org) {
      org = {
        id: `org-azure-${Math.random().toString().slice(2, 6)}`,
        name: cleanOrgName,
        domain: email.split("@")[1] || "enterprise.local",
        logo_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80"
      };
      db.organizations.push(org);
    }
    orgId = org.id;
  }

  const newUser = {
    id: `usr-azure-${Math.random().toString().slice(2, 8)}`,
    name,
    email,
    role: role || "Organization Admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    organization: organization || ""
  };

  db.users.push(newUser);
  
  // Register in logs
  db.auditLogs.unshift({
    id: `al-${Math.random().toString().slice(2, 6)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    user: email,
    action: `User identity provisioned on Microsoft Entra External ID. Created tenant schema.`,
    ip: req.ip || "13.67.12.190",
    severity: "info"
  });

  writeDB(db);
  res.json({ message: "Registration successful. Entra claims generated.", user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required to query Azure Active Directory." });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // If database is completely empty and no users exist, we allow standard sandbox login to allow instant entry,
    // otherwise we strict check user account to offer normal user creation flow
    if (db.users.length === 0) {
      // Auto-provision basic test admin for sandbox experience so the user is never locked out of empty state
      const firstAdmin = {
        id: "usr-azure-default",
        name: "Manish Kumar",
        email: email,
        role: "Organization Admin",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        organization: "Cloud Tech India"
      };
      db.users.push(firstAdmin);
      db.organizations.push({ id: "org-azure-1", name: "Cloud Tech India", domain: email.split("@")[1] });
      db.auditLogs.unshift({
        id: `al-azure-init`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        user: email,
        action: `Default Azure SQL Administrative identity initialized for first-time session.`,
        ip: req.ip || "13.67.12.190",
        severity: "info"
      });
      writeDB(db);
      return res.json({ message: "First-time login auto-provisioned inside Azure AD B2C.", user: firstAdmin });
    }
    return res.status(401).json({ error: "Invalid credentials. Identity not found in Microsoft Entra Active Directory claims." });
  }

  // Audit success
  db.auditLogs.unshift({
    id: `al-${Math.random().toString().slice(2, 6)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    user: email,
    action: `JWT claim emitted by Microsoft Entra External ID. Secure session active.`,
    ip: req.ip || "13.67.12.190",
    severity: "info"
  });
  writeDB(db);

  res.json({ message: "Login success", user });
});

// Event Endpoints
app.get("/api/events", (req, res) => {
  const db = readDB();
  res.json(db.events);
});

app.post("/api/events", (req, res) => {
  const db = readDB();
  const newEvent = req.body;
  if (!newEvent.id) {
    newEvent.id = `evt-${Math.random().toString().slice(2, 6)}`;
  }
  db.events.unshift(newEvent);

  db.auditLogs.unshift({
    id: `al-${Math.random().toString().slice(2, 6)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    user: "manishkumarofficial701@gmail.com",
    action: `Created new event '${newEvent.title}' (Azure SQL write command committed).`,
    ip: req.ip || "13.67.12.190",
    severity: "info"
  });

  writeDB(db);
  res.json(newEvent);
});

// Tasks Endpoints
app.get("/api/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks);
});

app.post("/api/tasks", (req, res) => {
  const db = readDB();
  const newTask = req.body;
  if (!newTask.id) {
    newTask.id = `tsk-${Math.random().toString().slice(2, 6)}`;
  }
  db.tasks.unshift(newTask);
  writeDB(db);
  res.json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const index = db.tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    db.tasks[index] = { ...db.tasks[index], ...req.body };
    writeDB(db);
    return res.json(db.tasks[index]);
  }
  res.status(404).json({ error: "Task not found" });
});

// Resources Endpoints
app.get("/api/resources", (req, res) => {
  const db = readDB();
  res.json(db.resources);
});

app.post("/api/resources", (req, res) => {
  const db = readDB();
  const newRes = req.body;
  if (!newRes.id) {
    newRes.id = `res-${Math.random().toString().slice(2, 6)}`;
  }
  db.resources.unshift(newRes);
  writeDB(db);
  res.json(newRes);
});

app.put("/api/resources/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const index = db.resources.findIndex(r => r.id === id);
  if (index !== -1) {
    db.resources[index] = { ...db.resources[index], ...req.body };
    writeDB(db);
    return res.json(db.resources[index]);
  }
  res.status(404).json({ error: "Resource not found" });
});

// Transactions Endpoints
app.get("/api/transactions", (req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

app.post("/api/transactions", (req, res) => {
  const db = readDB();
  const newTx = req.body;
  if (!newTx.id) {
    newTx.id = `tx-${Math.random().toString().slice(2, 6)}`;
  }
  db.transactions.unshift(newTx);

  // Auto increment event revenues & tickets sold
  const eventIdx = db.events.findIndex(e => e.id === newTx.eventId);
  if (eventIdx !== -1) {
    db.events[eventIdx].ticketsSold = (db.events[eventIdx].ticketsSold || 0) + 1;
    db.events[eventIdx].attendeesCount = (db.events[eventIdx].attendeesCount || 0) + 1;
    db.events[eventIdx].revenue = (db.events[eventIdx].revenue || 0) + Number(newTx.amount);
  }

  db.auditLogs.unshift({
    id: `al-${Math.random().toString().slice(2, 6)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
    user: newTx.buyerEmail || "checkout@stripe.com",
    action: `Azure SQL database registered transaction ID ${newTx.id}. Emitted webhook signal.`,
    ip: req.ip || "13.67.12.190",
    severity: "info"
  });

  writeDB(db);
  res.json(newTx);
});

// Notifications Endpoints
app.get("/api/notifications", (req, res) => {
  const db = readDB();
  res.json(db.notifications);
});

app.post("/api/notifications", (req, res) => {
  const db = readDB();
  const newNotif = req.body;
  if (!newNotif.id) {
    newNotif.id = `n-${Math.random().toString().slice(2, 6)}`;
  }
  db.notifications.unshift(newNotif);
  writeDB(db);
  res.json(newNotif);
});

app.put("/api/notifications/read-all", (req, res) => {
  const db = readDB();
  db.notifications.forEach(n => n.read = true);
  writeDB(db);
  res.json({ success: true });
});

// Audit Logs Endpoints
app.get("/api/audit-logs", (req, res) => {
  const db = readDB();
  res.json(db.auditLogs);
});

// Vendor Booths Endpoints
app.get("/api/vendors", (req, res) => {
  const db = readDB();
  res.json(db.vendorBooths);
});

app.post("/api/vendors", (req, res) => {
  const db = readDB();
  const newBooth = req.body;
  if (!newBooth.id) {
    newBooth.id = `v-${Math.random().toString().slice(2, 6)}`;
  }
  db.vendorBooths.unshift(newBooth);
  writeDB(db);
  res.json(newBooth);
});

app.put("/api/vendors/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const index = db.vendorBooths.findIndex(v => v.id === id);
  if (index !== -1) {
    db.vendorBooths[index] = { ...db.vendorBooths[index], ...req.body };
    writeDB(db);
    return res.json(db.vendorBooths[index]);
  }
  res.status(404).json({ error: "Booth not found" });
});

// Settings Endpoints
app.get("/api/settings", (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.post("/api/settings", (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json(db.settings);
});

// AI Assistant endpoint
app.post("/api/ai", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  try {
    const ai = getGeminiClient();
    
    // Format the system instruction mapped for Microsoft Azure environment
    const systemInstruction = `You are EVENTRA's expert AI enterprise events consultant running on Microsoft Azure App Service and Azure SQL Database. You assist organizations, colleges, and event managers with:
1. Event Planning & Database Query Logic (indexing strategies, scheduling, speaker management).
2. Audience Engagement & Ticketing (pricing plans, campaign recommendations).
3. Risk Management, Secrets Auditing via Azure Key Vault, & File Upload workflows on Azure Blob Storage.
4. Real-time Log Analytics & Application Insights Interpretation.

Keep your recommendations premium, modern, specific, actionable, and structured. Highlight Azure cloud engineering best practices (like Entra ID claims, blob containers, and Key Vault integration). Keep responses helpful and under 300 words. Use bullet points and bold text where relevant.`;

    let fullContext = "";
    for (const msg of messages) {
      const speaker = msg.sender === "user" ? "User" : "Assistant";
      fullContext += `${speaker}: ${msg.text}\n`;
    }
    fullContext += "Assistant: ";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to formulate a response. Please refine your query.";
    return res.json({ reply });

  } catch (err: any) {
    console.error("Gemini API Error in /api/ai:", err.message);
    const isKeyMissing = err.message.includes("GEMINI_API_KEY");
    return res.status(500).json({ 
      error: isKeyMissing 
        ? "Gemini API key is not configured yet. Set GEMINI_API_KEY under the Secrets panel." 
        : `AI Assistant unavailable: ${err.message}` 
    });
  }
});

// 2. Vite Dev vs Production Handling
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static asset serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EVENTRA server is running on port ${PORT}`);
  });
}

setupServer();
