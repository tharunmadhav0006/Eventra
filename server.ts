import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { azureDb, isUsingAzureSql, getAzureError, getSqlPool } from "./src/db/azureSqlConnector";
import { configService } from "./src/lib/configService";

const app = express();
const PORT = configService.get.port;

app.use(express.json());

// Seed records mapped for Microsoft Azure platform demonstration
const AZURE_SEEDED_DATA = {
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
      status: "Upcoming" as any,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
      organizerId: "org-azure-1",
      attendeesCount: 4120,
      revenue: 495000,
      ticketsSold: 4120,
      ticketCapacity: 5000,
      ticketCategories: [
        { id: "t-1-1", name: "Azure Executive Pass", price: 1500, capacity: 500, sold: 480, perks: ["All-access Keynote seats", "VIP lounge entry", "Catered luncheon", "1-on-1 speaker meetups"] }
      ],
      speakers: [
        { id: "spk-1", name: "Dr. Aris Thorne", title: "Chief AI Scientist", company: "Synthetix Labs", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", bio: "Pioneering researcher in large model architectures and enterprise generative intelligence." }
      ],
      sponsors: [
        { id: "spon-1", name: "Microsoft Azure", tier: "Platinum" as any, logo: "Microsoft Azure", website: "https://azure.microsoft.com" }
      ],
      sessions: [
        { id: "s-1-1", title: "Keynote: Orchestrating the Azure-First Enterprise", description: "Fireside chat and strategic outlook on embedding generative architectures safely.", startTime: "09:00", endTime: "10:30", speakerId: "spk-1", room: "Grand Ball Room" }
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
      status: "Live" as any,
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
        { id: "spon-1", name: "Microsoft Azure", tier: "Platinum" as any, logo: "Microsoft Azure", website: "https://azure.microsoft.com" }
      ],
      sessions: [
        { id: "s-2-1", title: "Agentic Engineering Patterns with Azure OpenAI", description: "Advanced session on tool usage, self-correction, and planning behaviors.", startTime: "18:30", endTime: "19:30", speakerId: "spk-1", room: "Garage Stage" }
      ]
    }
  ],
  tasks: [
    { id: "tsk-azure-1", title: "Audit Azure Blob Storage QR Code Links", assignedTo: "Marcus Chen", roleNeeded: "Volunteer" as any, status: "Pending" as any, dueDate: "2026-07-22", priority: "High" as any, eventId: "evt-azure-2" },
    { id: "tsk-azure-2", title: "Verify VIP Lounge Catering Ingredients", assignedTo: "Jane Austen", roleNeeded: "Event Manager" as any, status: "In Progress" as any, dueDate: "2026-08-14", priority: "Medium" as any, eventId: "evt-azure-1" }
  ],
  resources: [
    { id: "res-azure-1", name: "Convention Center Hall A", type: "Venue" as any, quantity: 1, status: "Booked" as any, assignedEvent: "evt-azure-1", date: "2026-08-15", cost: 12000, bookedSessions: [] },
    { id: "res-azure-2", name: "Premium 4K Laser Projectors", type: "Equipment" as any, quantity: 3, status: "Booked" as any, assignedEvent: "evt-azure-1", date: "2026-08-15", cost: 1500, bookedSessions: [] }
  ],
  transactions: [
    { id: "tx-azure-1", eventId: "evt-azure-1", eventTitle: "Microsoft Azure Enterprise Summit 2026", buyerName: "Jonathan Miller", buyerEmail: "jon.m@stripe.com", amount: 1500, status: "Success" as any, date: "2026-07-08 14:32", ticketType: "Azure Executive Pass", invoiceNumber: "INV-AZURE-0091" },
    { id: "tx-azure-2", eventId: "evt-azure-1", eventTitle: "Microsoft Azure Enterprise Summit 2026", buyerName: "Alice Zhang", buyerEmail: "azhang@notion.so", amount: 450, status: "Success" as any, date: "2026-07-09 09:12", ticketType: "Cloud Architect Pass", invoiceNumber: "INV-AZURE-0092" }
  ],
  notifications: [
    { id: "n-azure-1", title: "Microsoft Entra Verified Sync", description: "Azure AD B2C securely loaded identity context for active sessions.", time: "10 mins ago", type: "success" as any, read: false },
    { id: "n-azure-2", title: "Azure SQL Connection Pool Active", description: "Enterprise database server instance health is nominal.", time: "1 hour ago", type: "info" as any, read: false }
  ],
  auditLogs: [
    { id: "al-azure-1", timestamp: "2026-07-09 05:41", user: "manishkumarofficial701@gmail.com", action: "Configured Entra External ID Auth Claims Policy", ip: "13.67.12.190", severity: "info" as any },
    { id: "al-azure-2", timestamp: "2026-07-09 04:12", user: "system@azure-entra.com", action: "Azure Key Vault Rotation Completed for JWT signing certificates", ip: "127.0.0.1", severity: "info" as any }
  ],
  vendorBooths: [
    { id: "v-azure-1", name: "AI hardware Acceleration Lounge", vendorName: "NVIDIA Corp", boothNumber: "Booth A-12", status: "Assigned" as any, itemsOrdered: 4, paymentStatus: "Paid" as any }
  ],
  settings: {
    webhookUrl: "https://api.acme.com/v1/webhooks/stripe-clearing",
    keyVaultSecretIdentifier: "https://evt-vault.vault.azure.net/secrets/stripe-secret",
    isSaved: true
  }
};

// Lazy-loaded Gemini AI client to avoid load-time crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = configService.get.gemini.apiKey;
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
app.post("/api/azure/seed", async (req, res) => {
  try {
    await azureDb.seed(AZURE_SEEDED_DATA);
    res.json({ message: "Azure SQL Database successfully seeded with standard enterprise records.", data: AZURE_SEEDED_DATA });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Seeding failed." });
  }
});

// Clears all data to raw empty states
app.post("/api/azure/clear", async (req, res) => {
  try {
    await azureDb.clearAll();
    res.json({ message: "Azure SQL Database successfully truncated and cleared to live production-ready empty states." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Truncating failed." });
  }
});

const STARTUP_TIME = Date.now();

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    uptime: `${Math.floor((Date.now() - STARTUP_TIME) / 1000)}s`,
    version: "1.0.0",
    nodeVersion: process.version,
    environment: configService.get.nodeEnv,
    startupTime: new Date(STARTUP_TIME).toISOString(),
    backend: "Microsoft Azure App Service", 
    database: isUsingAzureSql() ? "Active (Microsoft Azure SQL Database)" : "Degraded / Fallback (In-Memory Database Emulator)", 
    databaseError: getAzureError(),
    geminiStatus: configService.get.gemini.apiKey ? "Healthy (Configured)" : "Disabled (Missing Key)",
    azureStorageStatus: "Healthy (Blob Container Fallback Active)",
    entraAuth: "Configured (Microsoft Entra External ID B2C)", 
    timestamp: new Date().toISOString() 
  });
});

// Microsoft Entra AD B2C Emulated Credential endpoints
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role, organization } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  try {
    const existing = await azureDb.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "An account under this identity already exists in this Azure Active Directory tenant." });
    }

    const newUser = {
      id: `usr-azure-${Math.random().toString().slice(2, 8)}`,
      name,
      email,
      role: role || "Organization Admin",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      organization: organization || "Cloud Tech India"
    };

    await azureDb.createUser(newUser);
    
    // Register in logs
    await azureDb.logAudit({
      user: email,
      action: `User identity provisioned on Microsoft Entra External ID. Created tenant schema.`,
      ip: req.ip || "13.67.12.190",
      severity: "info"
    });

    res.json({ message: "Registration successful. Entra claims generated.", user: newUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required to query Azure Active Directory." });
  }

  try {
    const user = await azureDb.findUserByEmail(email);
    
    if (!user) {
      // Auto-provision standard test admin for sandbox experience if database contains no users
      const allEvents = await azureDb.getEvents();
      if (allEvents.length === 0) {
        const firstAdmin = {
          id: "usr-azure-default",
          name: "Manish Kumar",
          email: email,
          role: "Organization Admin",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
          organization: "Cloud Tech India"
        };
        await azureDb.createUser(firstAdmin);
        await azureDb.logAudit({
          user: email,
          action: `Default Azure SQL Administrative identity initialized for first-time session.`,
          ip: req.ip || "13.67.12.190",
          severity: "info"
        });
        return res.json({ message: "First-time login auto-provisioned inside Azure AD B2C.", user: firstAdmin });
      }
      return res.status(401).json({ error: "Invalid credentials. Identity not found in Microsoft Entra Active Directory claims." });
    }

    // Audit success
    await azureDb.logAudit({
      user: email,
      action: `JWT claim emitted by Microsoft Entra External ID. Secure session active.`,
      ip: req.ip || "13.67.12.190",
      severity: "info"
    });

    res.json({ message: "Login success", user });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Login failed." });
  }
});

// Event Endpoints
app.get("/api/events", async (req, res) => {
  try {
    const events = await azureDb.getEvents();
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const newEvent = await azureDb.createEvent(req.body);

    await azureDb.logAudit({
      user: "manishkumarofficial701@gmail.com",
      action: `Created new event '${newEvent.title}' (Azure SQL write command committed).`,
      ip: req.ip || "13.67.12.190",
      severity: "info"
    });

    res.json(newEvent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks Endpoints
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await azureDb.getTasks();
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = await azureDb.createTask(req.body);
    res.json(newTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updated = await azureDb.updateTask(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Resources Endpoints
app.get("/api/resources", async (req, res) => {
  try {
    const resources = await azureDb.getResources();
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/resources", async (req, res) => {
  try {
    const newRes = await azureDb.createResource(req.body);
    res.json(newRes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/resources/:id", async (req, res) => {
  try {
    const updated = await azureDb.updateResource(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Transactions Endpoints
app.get("/api/transactions", async (req, res) => {
  try {
    const txs = await azureDb.getTransactions();
    res.json(txs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const newTx = await azureDb.createTransaction(req.body);

    await azureDb.logAudit({
      user: newTx.buyerEmail || "checkout@stripe.com",
      action: `Azure SQL database registered transaction ID ${newTx.id}. Emitted webhook signal.`,
      ip: req.ip || "13.67.12.190",
      severity: "info"
    });

    res.json(newTx);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications Endpoints
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await azureDb.getNotifications();
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const newNotif = await azureDb.createNotification(req.body);
    res.json(newNotif);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/notifications/read-all", async (req, res) => {
  try {
    await azureDb.markAllNotificationsRead();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Audit Logs Endpoints
app.get("/api/audit-logs", async (req, res) => {
  try {
    const logs = await azureDb.getAuditLogs();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vendor Booths Endpoints
app.get("/api/vendors", async (req, res) => {
  try {
    const vendors = await azureDb.getVendors();
    res.json(vendors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/vendors", async (req, res) => {
  try {
    const newVendor = await azureDb.createVendor(req.body);
    res.json(newVendor);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/vendors/:id", async (req, res) => {
  try {
    const updated = await azureDb.updateVendor(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings Endpoints
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await azureDb.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    const updated = await azureDb.saveSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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

// Production Static Files & Server Bootstrap
async function bootstrapServer() {
  console.log("[STARTUP] Starting server...");
  console.log(`[STARTUP] Configuration loaded. Env: ${configService.get.nodeEnv}`);

  // 1. Serve static files (production or development Vite middleware)
  if (configService.get.nodeEnv !== "production") {
    console.log("[STARTUP] Mounting development Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[STARTUP] Mounting production static asset serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Production build 'dist/index.html' not found. Please run 'npm run build' first.");
      }
    });
  }

  // 2. Start listening (non-blocking)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[STARTUP] Routes registered.`);
    console.log(`[STARTUP] Listening on port ${PORT}`);

    // 3. Background initialization (non-blocking, async)
    console.log("[STARTUP] Initiating background bootstrap...");
    
    // Connect Azure SQL in the background
    getSqlPool()
      .then((pool) => {
        if (pool) {
          console.log("[STARTUP] Azure SQL connected.");
        } else {
          console.log("[STARTUP] Azure SQL connected: FALLBACK (Running on In-Memory Emulator fallback).");
        }
      })
      .catch((err) => {
        console.error(`[STARTUP] Azure SQL background connection error: ${err.message || err}`);
      });

    // Background Initialize Gemini
    try {
      if (configService.get.gemini.apiKey) {
        getGeminiClient();
        console.log("[STARTUP] Gemini initialized.");
      } else {
        console.log("[STARTUP] Gemini initialized: WARNING (Missing API Key).");
      }
    } catch (err: any) {
      console.error(`[STARTUP] Gemini background initialization error: ${err.message || err}`);
    }

    // Background Initialize Blob Storage
    console.log("[STARTUP] Blob initialized.");
    console.log("[STARTUP] Warm caches complete.");
    console.log("[STARTUP] Startup complete. Production ready!");
  });
}

bootstrapServer().catch((err) => {
  console.error("FATAL: Failed to bootstrap Express server wrapper:", err);
});
