import mssql from "mssql";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { EventItem, TaskItem, ResourceBooking, Transaction, NotificationItem, AuditLog, VendorBooth } from "../types";

dotenv.config();

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "azure_db.json");

// Define Azure Database interface
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

let sqlPool: mssql.ConnectionPool | null = null;
let connectionError: string | null = null;
let usingAzureSql = false;

// Dynamic helper to fetch current server container's outbound public IP
async function getCurrentPublicIp(): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json() as any;
      if (data && data.ip) {
        return data.ip;
      }
    }
  } catch (e) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch("https://ipinfo.io/json", { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json() as any;
        if (data && data.ip) {
          return data.ip;
        }
      }
    } catch (e2) {
      // ignore
    }
  }
  return "";
}

// Initialize connection pool
export async function getSqlPool(): Promise<mssql.ConnectionPool | null> {
  if (sqlPool) return sqlPool;

  const connectionString = process.env.AZURE_SQL_CONNECTION_STRING;
  const server = process.env.AZURE_SQL_SERVER;
  const database = process.env.AZURE_SQL_DATABASE;
  const user = process.env.AZURE_SQL_USER;
  const password = process.env.AZURE_SQL_PASSWORD;

  // If no credentials configured, we fall back to Emulator
  if (!connectionString && (!server || !database || !user || !password)) {
    console.log("No Azure SQL Credentials found in environment. Running on Local JSON Database Emulator.");
    usingAzureSql = false;
    return null;
  }

  try {
    const config: string | mssql.config = connectionString
      ? connectionString
      : {
          server: server!,
          database: database!,
          user: user!,
          password: password!,
          options: {
            encrypt: true,
            trustServerCertificate: false,
          },
          port: 1433,
          connectionTimeout: 15000,
        };

    console.log(`Attempting connection to Microsoft Azure SQL Database [${database || 'Configured via Connection String'}]...`);
    sqlPool = await mssql.connect(config);
    usingAzureSql = true;
    connectionError = null;
    console.log("SUCCESS: Active live connection pool established with Microsoft Azure SQL Database!");
    
    // Auto-bootstrap extra tables if missing (like a dedicated Tasks table or schema logs)
    await bootstrapAzureTables(sqlPool);

    return sqlPool;
  } catch (err: any) {
    let errMsg = err.message || String(err);
    console.error("CRITICAL: Failed to connect to Azure SQL Database. Falling back to Local Emulator. Reason:", errMsg);
    
    try {
      const publicIp = await getCurrentPublicIp();
      if (publicIp) {
        errMsg += `\n[DIAGNOSTIC DATA]: Your app container's outbound public IP is currently ${publicIp}. Because our Google Cloud Run preview container runs with dynamic outbound IPs, please ensure ${publicIp} is added to your Azure SQL Firewall rules, or configure your Azure SQL server to temporarily accept traffic from all IPs (0.0.0.0 - 255.255.255.255) for testing.`;
      } else {
        errMsg += `\n[DIAGNOSTIC DATA]: Unable to fetch outbound IP, but please ensure your Azure SQL firewall allows traffic from Google Cloud Run IP ranges or contains a 0.0.0.0 - 255.255.255.255 temporary rule for this sandbox environment.`;
      }
    } catch (ipErr) {
      // ignore
    }

    connectionError = errMsg;
    sqlPool = null;
    usingAzureSql = false;
    return null;
  }
}

// On-the-fly table bootstrap for missing tables or helper tables
async function bootstrapAzureTables(pool: mssql.ConnectionPool) {
  try {
    // 1. Create Tasks table if not present in schema to store task data fully
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tasks' AND xtype='U')
      CREATE TABLE Tasks (
        task_id NVARCHAR(128) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        assigned_to NVARCHAR(255) NOT NULL,
        role_needed NVARCHAR(100) NOT NULL,
        status NVARCHAR(50) NOT NULL,
        due_date NVARCHAR(50) NOT NULL,
        priority NVARCHAR(50) NOT NULL,
        event_id NVARCHAR(128) NULL
      )
    `);

    // 2. Create Resources table if not present to store equipment bookings
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Resources' AND xtype='U')
      CREATE TABLE Resources (
        resource_id NVARCHAR(128) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        type NVARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        status NVARCHAR(50) NOT NULL,
        assigned_event NVARCHAR(128) NULL,
        date NVARCHAR(50) NOT NULL,
        cost DECIMAL(18, 2) NOT NULL,
        booked_sessions NVARCHAR(MAX) NULL
      )
    `);

    console.log("Azure SQL extra tables bootstrap verified successfully.");
  } catch (err) {
    console.warn("Bootstrap verification notice (non-fatal):", err);
  }
}

export function isUsingAzureSql(): boolean {
  return usingAzureSql;
}

export function getAzureError(): string | null {
  return connectionError;
}

// ==========================================
// LOCAL EMULATOR READ/WRITE OPERATIONS
// ==========================================
function readLocalDB(): AzureDB {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DB_STATE, null, 2));
      return INITIAL_DB_STATE;
    }
    const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
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

function writeLocalDB(data: AzureDB) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to emulator JSON DB:", error);
  }
}

// ==========================================
// CORE DATABASE REPOSITORY OPERATIONS (DUAL IMPLEMENTATION)
// ==========================================

export const azureDb = {
  // Clear Database
  async clearAll(): Promise<void> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        console.log("Truncating Azure SQL database tables...");
        // Clear tables in reverse dependency order
        await pool.request().query("DELETE FROM Payments");
        await pool.request().query("DELETE FROM Registrations");
        await pool.request().query("DELETE FROM Vendors");
        await pool.request().query("DELETE FROM Volunteers");
        await pool.request().query("DELETE FROM Tickets");
        await pool.request().query("DELETE FROM EventCategories");
        await pool.request().query("DELETE FROM Events");
        await pool.request().query("DELETE FROM Sponsors");
        await pool.request().query("DELETE FROM Speakers");
        await pool.request().query("DELETE FROM Venues");
        await pool.request().query("DELETE FROM Users");
        await pool.request().query("DELETE FROM Organizations");
        await pool.request().query("DELETE FROM Tasks");
        await pool.request().query("DELETE FROM Resources");
        await pool.request().query("DELETE FROM Notifications");
        await pool.request().query("DELETE FROM AuditLogs");
        await pool.request().query("DELETE FROM Settings");
        return;
      } catch (err) {
        console.error("Azure SQL clear failed, attempting individual deletes:", err);
      }
    }
    writeLocalDB(INITIAL_DB_STATE);
  },

  // Seed Database
  async seed(seededData: AzureDB): Promise<void> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        await this.clearAll();
        console.log("Seeding live Azure SQL database tables...");

        // Seed settings
        await pool.request()
          .input("webhookUrl", mssql.NVarChar, seededData.settings.webhookUrl)
          .input("keyVaultSecretIdentifier", mssql.NVarChar, seededData.settings.keyVaultSecretIdentifier)
          .query(`
            INSERT INTO Settings (webhook_url, key_vault_secret_identifier, is_saved)
            VALUES (@webhookUrl, @keyVaultSecretIdentifier, 1)
          `);

        // Seed users
        for (const user of seededData.users) {
          // Ensure organization exists first
          let orgId = "11111111-1111-1111-1111-111111111111";
          const org = seededData.organizations[0];
          if (org) {
            await pool.request()
              .input("orgId", mssql.UniqueIdentifier, orgId)
              .input("name", mssql.NVarChar, org.name)
              .input("domain", mssql.NVarChar, org.domain)
              .input("logoUrl", mssql.NVarChar, org.logo_url)
              .query(`
                IF NOT EXISTS (SELECT * FROM Organizations WHERE organization_id = @orgId)
                INSERT INTO Organizations (organization_id, name, domain, logo_url)
                VALUES (@orgId, @name, @domain, @logoUrl)
              `);
          }

          await pool.request()
            .input("userId", mssql.NVarChar, user.id)
            .input("orgId", mssql.UniqueIdentifier, orgId)
            .input("fullName", mssql.NVarChar, user.name)
            .input("email", mssql.NVarChar, user.email)
            .input("userRole", mssql.NVarChar, user.role)
            .input("avatarUrl", mssql.NVarChar, user.avatar)
            .query(`
              INSERT INTO Users (user_id, organization_id, full_name, email, user_role, avatar_url)
              VALUES (@userId, @orgId, @fullName, @email, @userRole, @avatarUrl)
            `);
        }

        // Seed events
        for (const evt of seededData.events) {
          const orgId = "11111111-1111-1111-1111-111111111111";
          // Create Event
          await pool.request()
            .input("eventId", mssql.NVarChar, evt.id)
            .input("orgId", mssql.UniqueIdentifier, orgId)
            .input("title", mssql.NVarChar, evt.title)
            .input("desc", mssql.NVarChar, evt.description)
            .input("longDesc", mssql.NVarChar, evt.longDescription || "")
            .input("date", mssql.Date, new Date(evt.date))
            .input("time", mssql.VarChar, evt.time)
            .input("venue", mssql.NVarChar, evt.venue)
            .input("status", mssql.NVarChar, evt.status)
            .input("bannerUrl", mssql.NVarChar, evt.image)
            .input("attendeesCount", mssql.Int, evt.attendeesCount)
            .input("revenue", mssql.Decimal(18, 2), evt.revenue)
            .input("ticketsSold", mssql.Int, evt.ticketsSold)
            .input("ticketCapacity", mssql.Int, evt.ticketCapacity)
            .query(`
              INSERT INTO Events (event_id, organization_id, title, description, long_description, event_date, event_time, status, banner_url, attendees_count, revenue, tickets_sold, ticket_capacity)
              VALUES (CONVERT(uniqueidentifier, HASHBYTES('MD5', @eventId)), @orgId, @title, @desc, @longDesc, @date, CAST(@time AS time), @status, @bannerUrl, @attendeesCount, @revenue, @ticketsSold, @ticketCapacity)
            `);
        }

        // Seed tasks
        for (const task of seededData.tasks) {
          await pool.request()
            .input("taskId", mssql.NVarChar, task.id)
            .input("title", mssql.NVarChar, task.title)
            .input("assignedTo", mssql.NVarChar, task.assignedTo)
            .input("roleNeeded", mssql.NVarChar, task.roleNeeded)
            .input("status", mssql.NVarChar, task.status)
            .input("dueDate", mssql.NVarChar, task.dueDate)
            .input("priority", mssql.NVarChar, task.priority)
            .input("eventId", mssql.NVarChar, task.eventId || "")
            .query(`
              INSERT INTO Tasks (task_id, title, assigned_to, role_needed, status, due_date, priority, event_id)
              VALUES (@taskId, @title, @assignedTo, @roleNeeded, @status, @dueDate, @priority, @eventId)
            `);
        }

        // Seed resources
        for (const res of seededData.resources) {
          await pool.request()
            .input("resId", mssql.NVarChar, res.id)
            .input("name", mssql.NVarChar, res.name)
            .input("type", mssql.NVarChar, res.type)
            .input("qty", mssql.Int, res.quantity)
            .input("status", mssql.NVarChar, res.status)
            .input("assigned", mssql.NVarChar, res.assignedEvent || "")
            .input("date", mssql.NVarChar, res.date)
            .input("cost", mssql.Decimal(18, 2), res.cost)
            .input("bookedSessions", mssql.NVarChar, JSON.stringify(res.bookedSessions || []))
            .query(`
              INSERT INTO Resources (resource_id, name, type, quantity, status, assigned_event, date, cost, booked_sessions)
              VALUES (@resId, @name, @type, @qty, @status, @assigned, @date, @cost, @bookedSessions)
            `);
        }

        // Seed notifications
        for (const notif of seededData.notifications) {
          await pool.request()
            .input("title", mssql.NVarChar, notif.title)
            .input("desc", mssql.NVarChar, notif.description)
            .input("type", mssql.NVarChar, notif.type)
            .input("read", mssql.Bit, notif.read ? 1 : 0)
            .query(`
              INSERT INTO Notifications (title, description, notif_type, is_read)
              VALUES (@title, @desc, @type, @read)
            `);
        }

        // Seed audit logs
        for (const log of seededData.auditLogs) {
          await pool.request()
            .input("email", mssql.NVarChar, log.user)
            .input("action", mssql.NVarChar, log.action)
            .input("ip", mssql.VarChar, log.ip)
            .input("severity", mssql.NVarChar, log.severity)
            .query(`
              INSERT INTO AuditLogs (actor_email, action_performed, ip_address, severity)
              VALUES (@email, @action, @ip, @severity)
            `);
        }

        // Seed vendors
        for (const v of seededData.vendorBooths) {
          // Assign to first event for SQL compatibility
          const orgId = "11111111-1111-1111-1111-111111111111";
          const firstEvtId = seededData.events[0]?.id || "evt-azure-1";
          await pool.request()
            .input("vendorId", mssql.UniqueIdentifier, "22222222-2222-2222-2222-222222222222")
            .input("evtId", mssql.UniqueIdentifier, orgId) // Map to org or dynamic
            .input("name", mssql.NVarChar, v.name)
            .input("booth", mssql.NVarChar, v.boothNumber)
            .input("status", mssql.NVarChar, v.status)
            .input("items", mssql.Int, v.itemsOrdered)
            .input("payment", mssql.NVarChar, v.paymentStatus)
            .query(`
              INSERT INTO Vendors (vendor_id, event_id, name, booth_number, status, items_ordered, payment_status)
              VALUES (@vendorId, CONVERT(uniqueidentifier, HASHBYTES('MD5', 'evt-azure-1')), @name, @booth, @status, @items, @payment)
            `);
        }

        console.log("SUCCESS: Live Azure SQL database seeding completed!");
        return;
      } catch (err) {
        console.error("SQL Seeding failed. Falling back to local db seeding.", err);
      }
    }
    writeLocalDB(seededData);
  },

  // Users Auth Repository
  async findUserByEmail(email: string): Promise<any | null> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request()
          .input("email", mssql.NVarChar, email.toLowerCase())
          .query("SELECT TOP 1 * FROM Users WHERE LOWER(email) = @email");
        
        if (result.recordset.length > 0) {
          const row = result.recordset[0];
          return {
            id: row.user_id,
            name: row.full_name,
            email: row.email,
            role: row.user_role,
            avatar: row.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
            organization: ""
          };
        }
        return null;
      } catch (err) {
        console.error("Azure SQL findUserByEmail failed:", err);
      }
    }

    const localDb = readLocalDB();
    return localDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async createUser(user: { id: string; name: string; email: string; role: string; avatar: string; organization?: string }): Promise<any> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const orgId = "11111111-1111-1111-1111-111111111111";
        // Ensure Org table populated
        await pool.request()
          .input("orgId", mssql.UniqueIdentifier, orgId)
          .input("orgName", mssql.NVarChar, user.organization || "Cloud Tech India")
          .query(`
            IF NOT EXISTS (SELECT * FROM Organizations WHERE organization_id = @orgId)
            INSERT INTO Organizations (organization_id, name, domain, logo_url)
            VALUES (@orgId, @orgName, 'cloudtech.in', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80')
          `);

        await pool.request()
          .input("userId", mssql.NVarChar, user.id)
          .input("orgId", mssql.UniqueIdentifier, orgId)
          .input("fullName", mssql.NVarChar, user.name)
          .input("email", mssql.NVarChar, user.email)
          .input("userRole", mssql.NVarChar, user.role)
          .input("avatarUrl", mssql.NVarChar, user.avatar)
          .query(`
            INSERT INTO Users (user_id, organization_id, full_name, email, user_role, avatar_url)
            VALUES (@userId, @orgId, @fullName, @email, @userRole, @avatarUrl)
          `);
        return user;
      } catch (err) {
        console.error("Azure SQL createUser failed:", err);
      }
    }

    const localDb = readLocalDB();
    localDb.users.push(user);
    writeLocalDB(localDb);
    return user;
  },

  // Events Repository
  async getEvents(): Promise<EventItem[]> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT * FROM Events ORDER BY created_at DESC");
        return result.recordset.map(row => ({
          id: row.event_id,
          title: row.title,
          description: row.description,
          longDescription: row.long_description,
          date: row.event_date ? new Date(row.event_date).toISOString().split("T")[0] : "2026-08-15",
          time: "09:00",
          venue: row.venue || "Convention Center, Bangalore",
          status: row.status || "Upcoming",
          image: row.banner_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
          organizerId: "org-azure-1",
          attendeesCount: row.attendees_count || 0,
          revenue: Number(row.revenue || 0),
          ticketsSold: row.tickets_sold || 0,
          ticketCapacity: row.ticket_capacity || 5000,
          sessions: [
            { id: "s-1-1", title: "Keynote: Orchestrating the Azure-First Enterprise", description: "Strategic outlook on embedding generative architectures.", startTime: "09:00", endTime: "10:30", speakerId: "spk-1", room: "Grand Ball Room" }
          ],
          speakers: [
            { id: "spk-1", name: "Dr. Aris Thorne", title: "Chief AI Scientist", company: "Synthetix Labs", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", bio: "Thorne is a pioneering researcher in large model architectures." }
          ],
          sponsors: [
            { id: "spon-1", name: "Microsoft Azure", tier: "Platinum", logo: "Microsoft Azure", website: "https://azure.microsoft.com" }
          ],
          ticketCategories: [
            { id: "t-1-1", name: "Executive Pass", price: 1500, capacity: 500, sold: 480, perks: ["All-access Keynote seats", "VIP lounge entry"] }
          ]
        }));
      } catch (err) {
        console.error("Azure SQL getEvents failed:", err);
      }
    }

    return readLocalDB().events;
  },

  async createEvent(event: Partial<EventItem>): Promise<EventItem> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const orgId = "11111111-1111-1111-1111-111111111111";
        const id = event.id || `evt-${Math.random().toString().slice(2, 6)}`;
        await pool.request()
          .input("eventId", mssql.NVarChar, id)
          .input("orgId", mssql.UniqueIdentifier, orgId)
          .input("title", mssql.NVarChar, event.title)
          .input("desc", mssql.NVarChar, event.description)
          .input("longDesc", mssql.NVarChar, event.longDescription || "")
          .input("date", mssql.Date, new Date(event.date || "2026-08-15"))
          .input("time", mssql.VarChar, event.time || "09:00")
          .input("venue", mssql.NVarChar, event.venue)
          .input("status", mssql.NVarChar, event.status || "Upcoming")
          .input("bannerUrl", mssql.NVarChar, event.image)
          .input("attendeesCount", mssql.Int, event.attendeesCount || 0)
          .input("revenue", mssql.Decimal(18, 2), event.revenue || 0)
          .input("ticketsSold", mssql.Int, event.ticketsSold || 0)
          .input("ticketCapacity", mssql.Int, event.ticketCapacity || 1000)
          .query(`
            INSERT INTO Events (event_id, organization_id, title, description, long_description, event_date, event_time, status, banner_url, attendees_count, revenue, tickets_sold, ticket_capacity)
            VALUES (CONVERT(uniqueidentifier, HASHBYTES('MD5', @eventId)), @orgId, @title, @desc, @longDesc, @date, CAST(@time AS time), @status, @bannerUrl, @attendeesCount, @revenue, @ticketsSold, @ticketCapacity)
          `);
        
        event.id = id;
        return event as EventItem;
      } catch (err) {
        console.error("Azure SQL createEvent failed:", err);
      }
    }

    const localDb = readLocalDB();
    const newEvent = {
      id: event.id || `evt-${Math.random().toString().slice(2, 6)}`,
      title: event.title || "",
      description: event.description || "",
      longDescription: event.longDescription || "",
      date: event.date || "2026-08-15",
      time: event.time || "09:00",
      venue: event.venue || "TBD",
      status: event.status || "Upcoming",
      image: event.image || "",
      organizerId: "org-azure-1",
      attendeesCount: event.attendeesCount || 0,
      revenue: event.revenue || 0,
      ticketsSold: event.ticketsSold || 0,
      ticketCapacity: event.ticketCapacity || 500,
      sessions: event.sessions || [],
      speakers: event.speakers || [],
      sponsors: event.sponsors || [],
      ticketCategories: event.ticketCategories || []
    };
    localDb.events.unshift(newEvent);
    writeLocalDB(localDb);
    return newEvent;
  },

  // Tasks Repository
  async getTasks(): Promise<TaskItem[]> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT * FROM Tasks");
        return result.recordset.map(row => ({
          id: row.task_id,
          title: row.title,
          assignedTo: row.assigned_to,
          roleNeeded: row.role_needed,
          status: row.status,
          dueDate: row.due_date,
          priority: row.priority,
          eventId: row.event_id
        }));
      } catch (err) {
        console.error("Azure SQL getTasks failed:", err);
      }
    }

    return readLocalDB().tasks;
  },

  async createTask(task: Partial<TaskItem>): Promise<TaskItem> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const id = task.id || `tsk-${Math.random().toString().slice(2, 6)}`;
        await pool.request()
          .input("taskId", mssql.NVarChar, id)
          .input("title", mssql.NVarChar, task.title)
          .input("assignedTo", mssql.NVarChar, task.assignedTo)
          .input("roleNeeded", mssql.NVarChar, task.roleNeeded)
          .input("status", mssql.NVarChar, task.status)
          .input("dueDate", mssql.NVarChar, task.dueDate)
          .input("priority", mssql.NVarChar, task.priority)
          .input("eventId", mssql.NVarChar, task.eventId || "")
          .query(`
            INSERT INTO Tasks (task_id, title, assigned_to, role_needed, status, due_date, priority, event_id)
            VALUES (@taskId, @title, @assignedTo, @roleNeeded, @status, @dueDate, @priority, @eventId)
          `);
        task.id = id;
        return task as TaskItem;
      } catch (err) {
        console.error("Azure SQL createTask failed:", err);
      }
    }

    const localDb = readLocalDB();
    const newTask = {
      id: task.id || `tsk-${Math.random().toString().slice(2, 6)}`,
      title: task.title || "",
      assignedTo: task.assignedTo || "",
      roleNeeded: task.roleNeeded || "Volunteer" as any,
      status: task.status || "Pending",
      dueDate: task.dueDate || "2026-08-15",
      priority: task.priority || "Medium",
      eventId: task.eventId
    };
    localDb.tasks.unshift(newTask);
    writeLocalDB(localDb);
    return newTask;
  },

  async updateTask(id: string, fields: Partial<TaskItem>): Promise<TaskItem> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        // Construct query dynamically for simplicity or do inline updates
        let query = "UPDATE Tasks SET ";
        const request = pool.request();
        const keys = Object.keys(fields).filter(k => k !== "id");
        
        keys.forEach((key, idx) => {
          const sqlKey = key === "assignedTo" ? "assigned_to" : key === "roleNeeded" ? "role_needed" : key === "dueDate" ? "due_date" : key === "eventId" ? "event_id" : key;
          request.input(`val_${key}`, fields[key as keyof TaskItem]);
          query += `${sqlKey} = @val_${key}${idx < keys.length - 1 ? ", " : " "}`;
        });
        
        request.input("taskId", mssql.NVarChar, id);
        query += "WHERE task_id = @taskId";
        
        await request.query(query);
        
        // Fetch and return updated task
        const updated = await pool.request().input("taskId", mssql.NVarChar, id).query("SELECT * FROM Tasks WHERE task_id = @taskId");
        const row = updated.recordset[0];
        return {
          id: row.task_id,
          title: row.title,
          assignedTo: row.assigned_to,
          roleNeeded: row.role_needed,
          status: row.status,
          dueDate: row.due_date,
          priority: row.priority,
          eventId: row.event_id
        };
      } catch (err) {
        console.error("Azure SQL updateTask failed:", err);
      }
    }

    const localDb = readLocalDB();
    const index = localDb.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      localDb.tasks[index] = { ...localDb.tasks[index], ...fields };
      writeLocalDB(localDb);
      return localDb.tasks[index];
    }
    throw new Error("Task not found");
  },

  // Resources Repository
  async getResources(): Promise<ResourceBooking[]> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT * FROM Resources");
        return result.recordset.map(row => ({
          id: row.resource_id,
          name: row.name,
          type: row.type,
          quantity: row.quantity,
          status: row.status,
          assignedEvent: row.assigned_event,
          date: row.date,
          cost: Number(row.cost),
          bookedSessions: JSON.parse(row.booked_sessions || "[]")
        }));
      } catch (err) {
        console.error("Azure SQL getResources failed:", err);
      }
    }

    return readLocalDB().resources;
  },

  async createResource(res: Partial<ResourceBooking>): Promise<ResourceBooking> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const id = res.id || `res-${Math.random().toString().slice(2, 6)}`;
        await pool.request()
          .input("resId", mssql.NVarChar, id)
          .input("name", mssql.NVarChar, res.name)
          .input("type", mssql.NVarChar, res.type)
          .input("qty", mssql.Int, res.quantity)
          .input("status", mssql.NVarChar, res.status)
          .input("assigned", mssql.NVarChar, res.assignedEvent || "")
          .input("date", mssql.NVarChar, res.date)
          .input("cost", mssql.Decimal(18, 2), res.cost || 0)
          .input("bookedSessions", mssql.NVarChar, JSON.stringify(res.bookedSessions || []))
          .query(`
            INSERT INTO Resources (resource_id, name, type, quantity, status, assigned_event, date, cost, booked_sessions)
            VALUES (@resId, @name, @type, @qty, @status, @assigned, @date, @cost, @bookedSessions)
          `);
        res.id = id;
        return res as ResourceBooking;
      } catch (err) {
        console.error("Azure SQL createResource failed:", err);
      }
    }

    const localDb = readLocalDB();
    const newRes = {
      id: res.id || `res-${Math.random().toString().slice(2, 6)}`,
      name: res.name || "",
      type: res.type || "Equipment" as any,
      quantity: res.quantity || 1,
      status: res.status || "Available" as any,
      assignedEvent: res.assignedEvent,
      date: res.date || "2026-08-15",
      cost: res.cost || 0,
      bookedSessions: res.bookedSessions || []
    };
    localDb.resources.unshift(newRes);
    writeLocalDB(localDb);
    return newRes;
  },

  async updateResource(id: string, fields: Partial<ResourceBooking>): Promise<ResourceBooking> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        let query = "UPDATE Resources SET ";
        const request = pool.request();
        const keys = Object.keys(fields).filter(k => k !== "id");
        
        keys.forEach((key, idx) => {
          const sqlKey = key === "assignedEvent" ? "assigned_event" : key === "bookedSessions" ? "booked_sessions" : key;
          const val = key === "bookedSessions" ? JSON.stringify(fields[key]) : fields[key as keyof ResourceBooking];
          request.input(`val_${key}`, val);
          query += `${sqlKey} = @val_${key}${idx < keys.length - 1 ? ", " : " "}`;
        });
        
        request.input("resId", mssql.NVarChar, id);
        query += "WHERE resource_id = @resId";
        
        await request.query(query);
        
        const updated = await pool.request().input("resId", mssql.NVarChar, id).query("SELECT * FROM Resources WHERE resource_id = @resId");
        const row = updated.recordset[0];
        return {
          id: row.resource_id,
          name: row.name,
          type: row.type,
          quantity: row.quantity,
          status: row.status,
          assignedEvent: row.assigned_event,
          date: row.date,
          cost: Number(row.cost),
          bookedSessions: JSON.parse(row.booked_sessions || "[]")
        };
      } catch (err) {
        console.error("Azure SQL updateResource failed:", err);
      }
    }

    const localDb = readLocalDB();
    const index = localDb.resources.findIndex(r => r.id === id);
    if (index !== -1) {
      localDb.resources[index] = { ...localDb.resources[index], ...fields };
      writeLocalDB(localDb);
      return localDb.resources[index];
    }
    throw new Error("Resource not found");
  },

  // Transactions Repository
  async getTransactions(): Promise<Transaction[]> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT * FROM Payments ORDER BY payment_date DESC");
        return result.recordset.map(row => ({
          id: row.payment_id,
          eventId: "evt-azure-1",
          eventTitle: "Microsoft Azure Enterprise Summit 2026",
          buyerName: "Enterprise Attendee",
          buyerEmail: "billing@azure.local",
          amount: Number(row.amount),
          status: row.status,
          date: new Date(row.payment_date).toISOString().replace("T", " ").substring(0, 16),
          ticketType: "Cloud Pass",
          invoiceNumber: row.invoice_number
        }));
      } catch (err) {
        console.error("Azure SQL getTransactions failed:", err);
      }
    }

    return readLocalDB().transactions;
  },

  async createTransaction(tx: Partial<Transaction>): Promise<Transaction> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const id = tx.id || `tx-${Math.random().toString().slice(2, 6)}`;
        // For compliance we insert registrations and payment rows linked
        const regId = "33333333-3333-3333-3333-333333333333";
        const attendeeId = "44444444-4444-4444-4444-444444444444";
        const ticketId = "55555555-5555-5555-5555-555555555555";
        
        await pool.request()
          .input("attendeeId", mssql.UniqueIdentifier, attendeeId)
          .input("name", mssql.NVarChar, tx.buyerName || "John Doe")
          .input("email", mssql.NVarChar, tx.buyerEmail || "john@doe.com")
          .query(`
            IF NOT EXISTS (SELECT * FROM Attendees WHERE attendee_id = @attendeeId)
            INSERT INTO Attendees (attendee_id, full_name, email)
            VALUES (@attendeeId, @name, @email)
          `);

        await pool.request()
          .input("regId", mssql.UniqueIdentifier, regId)
          .input("attendeeId", mssql.UniqueIdentifier, attendeeId)
          .query(`
            IF NOT EXISTS (SELECT * FROM Registrations WHERE registration_id = @regId)
            INSERT INTO Registrations (registration_id, event_id, attendee_id, ticket_id)
            VALUES (@regId, CONVERT(uniqueidentifier, HASHBYTES('MD5', 'evt-azure-1')), @attendeeId, @attendeeId)
          `);

        await pool.request()
          .input("paymentId", mssql.UniqueIdentifier, "66666666-6666-6666-6666-666666666666")
          .input("regId", mssql.UniqueIdentifier, regId)
          .input("invoice", mssql.NVarChar, tx.invoiceNumber || `INV-${id}`)
          .input("amt", mssql.Decimal(18, 2), tx.amount || 1500)
          .input("status", mssql.NVarChar, tx.status || "Success")
          .query(`
            INSERT INTO Payments (payment_id, registration_id, invoice_number, amount, status)
            VALUES (NEWID(), @regId, @invoice, @amt, @status)
          `);

        tx.id = id;
        return tx as Transaction;
      } catch (err) {
        console.error("Azure SQL createTransaction failed:", err);
      }
    }

    const localDb = readLocalDB();
    const newTx = {
      id: tx.id || `tx-${Math.random().toString().slice(2, 6)}`,
      eventId: tx.eventId || "evt-azure-1",
      eventTitle: tx.eventTitle || "Standard Event",
      buyerName: tx.buyerName || "Buyer",
      buyerEmail: tx.buyerEmail || "buyer@test.com",
      amount: tx.amount || 0,
      status: tx.status || "Success" as any,
      date: tx.date || new Date().toISOString().replace("T", " ").substring(0, 16),
      ticketType: tx.ticketType || "General Admission",
      invoiceNumber: tx.invoiceNumber || `INV-${Math.random().toString().slice(2, 8)}`
    };
    localDb.transactions.unshift(newTx);
    writeLocalDB(localDb);
    return newTx;
  },

  // Notifications Repository
  async getNotifications(): Promise<NotificationItem[]> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT * FROM Notifications ORDER BY created_at DESC");
        return result.recordset.map(row => ({
          id: row.notification_id,
          title: row.title,
          description: row.description,
          time: "1 hour ago",
          type: row.notif_type,
          read: row.is_read
        }));
      } catch (err) {
        console.error("Azure SQL getNotifications failed:", err);
      }
    }

    return readLocalDB().notifications;
  },

  async createNotification(notif: Partial<NotificationItem>): Promise<NotificationItem> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        await pool.request()
          .input("title", mssql.NVarChar, notif.title)
          .input("desc", mssql.NVarChar, notif.description)
          .input("type", mssql.NVarChar, notif.type || "info")
          .input("read", mssql.Bit, notif.read ? 1 : 0)
          .query(`
            INSERT INTO Notifications (title, description, notif_type, is_read)
            VALUES (@title, @desc, @type, @read)
          `);
        return notif as NotificationItem;
      } catch (err) {
        console.error("Azure SQL createNotification failed:", err);
      }
    }

    const localDb = readLocalDB();
    const newNotif = {
      id: notif.id || `n-${Math.random().toString().slice(2, 6)}`,
      title: notif.title || "",
      description: notif.description || "",
      time: notif.time || "Just now",
      type: notif.type || "info" as any,
      read: notif.read || false
    };
    localDb.notifications.unshift(newNotif);
    writeLocalDB(localDb);
    return newNotif;
  },

  async markAllNotificationsRead(): Promise<void> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        await pool.request().query("UPDATE Notifications SET is_read = 1");
        return;
      } catch (err) {
        console.error("Azure SQL markAllNotificationsRead failed:", err);
      }
    }

    const localDb = readLocalDB();
    localDb.notifications.forEach(n => n.read = true);
    writeLocalDB(localDb);
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT TOP 50 * FROM AuditLogs ORDER BY timestamp DESC");
        return result.recordset.map(row => ({
          id: row.log_id,
          timestamp: new Date(row.timestamp).toISOString().replace("T", " ").substring(0, 16),
          user: row.actor_email,
          action: row.action_performed,
          ip: row.ip_address,
          severity: row.severity
        }));
      } catch (err) {
        console.error("Azure SQL getAuditLogs failed:", err);
      }
    }

    return readLocalDB().auditLogs;
  },

  async logAudit(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        await pool.request()
          .input("email", mssql.NVarChar, log.user)
          .input("action", mssql.NVarChar, log.action)
          .input("ip", mssql.VarChar, log.ip)
          .input("severity", mssql.NVarChar, log.severity)
          .query(`
            INSERT INTO AuditLogs (actor_email, action_performed, ip_address, severity)
            VALUES (@email, @action, @ip, @severity)
          `);
        return;
      } catch (err) {
        console.error("Azure SQL logAudit failed:", err);
      }
    }

    const localDb = readLocalDB();
    const newLog = {
      id: `al-${Math.random().toString().slice(2, 6)}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      ...log
    };
    localDb.auditLogs.unshift(newLog);
    writeLocalDB(localDb);
  },

  // Vendors
  async getVendors(): Promise<VendorBooth[]> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT * FROM Vendors");
        return result.recordset.map(row => ({
          id: row.vendor_id,
          name: row.name,
          vendorName: "External Corporate",
          boothNumber: row.booth_number,
          status: row.status,
          itemsOrdered: row.items_ordered,
          paymentStatus: row.payment_status
        }));
      } catch (err) {
        console.error("Azure SQL getVendors failed:", err);
      }
    }

    return readLocalDB().vendorBooths;
  },

  async createVendor(vendor: Partial<VendorBooth>): Promise<VendorBooth> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const id = "99999999-9999-9999-9999-999999999999";
        await pool.request()
          .input("name", mssql.NVarChar, vendor.name)
          .input("booth", mssql.NVarChar, vendor.boothNumber)
          .input("status", mssql.NVarChar, vendor.status || "Reserved")
          .input("items", mssql.Int, vendor.itemsOrdered || 0)
          .input("payment", mssql.NVarChar, vendor.paymentStatus || "Unpaid")
          .query(`
            INSERT INTO Vendors (vendor_id, event_id, name, booth_number, status, items_ordered, payment_status)
            VALUES (NEWID(), CONVERT(uniqueidentifier, HASHBYTES('MD5', 'evt-azure-1')), @name, @booth, @status, @items, @payment)
          `);
        return vendor as VendorBooth;
      } catch (err) {
        console.error("Azure SQL createVendor failed:", err);
      }
    }

    const localDb = readLocalDB();
    const newVendor = {
      id: vendor.id || `v-${Math.random().toString().slice(2, 6)}`,
      name: vendor.name || "",
      vendorName: vendor.vendorName || "",
      boothNumber: vendor.boothNumber || "",
      status: vendor.status || "Reserved" as any,
      itemsOrdered: vendor.itemsOrdered || 0,
      paymentStatus: vendor.paymentStatus || "Unpaid" as any
    };
    localDb.vendorBooths.unshift(newVendor);
    writeLocalDB(localDb);
    return newVendor;
  },

  async updateVendor(id: string, fields: Partial<VendorBooth>): Promise<VendorBooth> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        let query = "UPDATE Vendors SET ";
        const request = pool.request();
        const keys = Object.keys(fields).filter(k => k !== "id");
        
        keys.forEach((key, idx) => {
          const sqlKey = key === "boothNumber" ? "booth_number" : key === "itemsOrdered" ? "items_ordered" : key === "paymentStatus" ? "payment_status" : key;
          request.input(`val_${key}`, fields[key as keyof VendorBooth]);
          query += `${sqlKey} = @val_${key}${idx < keys.length - 1 ? ", " : " "}`;
        });
        
        request.input("vId", mssql.UniqueIdentifier, id);
        query += "WHERE vendor_id = @vId";
        
        await request.query(query);
        
        const updated = await pool.request().input("vId", mssql.UniqueIdentifier, id).query("SELECT * FROM Vendors WHERE vendor_id = @vId");
        const row = updated.recordset[0];
        return {
          id: row.vendor_id,
          name: row.name,
          vendorName: "External Corporate",
          boothNumber: row.booth_number,
          status: row.status,
          itemsOrdered: row.items_ordered,
          paymentStatus: row.payment_status
        };
      } catch (err) {
        console.error("Azure SQL updateVendor failed:", err);
      }
    }

    const localDb = readLocalDB();
    const index = localDb.vendorBooths.findIndex(v => v.id === id);
    if (index !== -1) {
      localDb.vendorBooths[index] = { ...localDb.vendorBooths[index], ...fields };
      writeLocalDB(localDb);
      return localDb.vendorBooths[index];
    }
    throw new Error("Vendor not found");
  },

  // Settings
  async getSettings(): Promise<any> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        const result = await pool.request().query("SELECT TOP 1 * FROM Settings");
        if (result.recordset.length > 0) {
          const row = result.recordset[0];
          return {
            webhookUrl: row.webhook_url,
            keyVaultSecretIdentifier: row.key_vault_secret_identifier,
            isSaved: row.is_saved
          };
        }
      } catch (err) {
        console.error("Azure SQL getSettings failed:", err);
      }
    }

    return readLocalDB().settings;
  },

  async saveSettings(settings: any): Promise<any> {
    const pool = await getSqlPool();
    if (pool && usingAzureSql) {
      try {
        await pool.request()
          .input("webhookUrl", mssql.NVarChar, settings.webhookUrl)
          .input("keyVaultSecretIdentifier", mssql.NVarChar, settings.keyVaultSecretIdentifier)
          .query(`
            UPDATE Settings
            SET webhook_url = @webhookUrl, key_vault_secret_identifier = @keyVaultSecretIdentifier, is_saved = 1
          `);
        return settings;
      } catch (err) {
        console.error("Azure SQL saveSettings failed:", err);
      }
    }

    const localDb = readLocalDB();
    localDb.settings = { ...localDb.settings, ...settings };
    writeLocalDB(localDb);
    return settings;
  }
};
