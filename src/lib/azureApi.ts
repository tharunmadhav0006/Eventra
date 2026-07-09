// ===================================================
// MICROSOFT AZURE REST API CLIENT PROVIDER
// ===================================================
import { EventItem, TaskItem, ResourceBooking, Transaction, NotificationItem, AuditLog, VendorBooth } from "../types";

// Base fetch wrap with error handling
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const azureApi = {
  // Authentication & Entra ID B2C Identity Operations
  async login(email: string, password: string): Promise<{ message: string; user: any }> {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(params: { name: string; email: string; password?: string; role: string; organization?: string }): Promise<{ message: string; user: any }> {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  // Events Service
  async getEvents(): Promise<EventItem[]> {
    return request<EventItem[]>("/api/events");
  },

  async createEvent(event: Partial<EventItem>): Promise<EventItem> {
    return request<EventItem>("/api/events", {
      method: "POST",
      body: JSON.stringify(event),
    });
  },

  // Tasks Service
  async getTasks(): Promise<TaskItem[]> {
    return request<TaskItem[]>("/api/tasks");
  },

  async createTask(task: Partial<TaskItem>): Promise<TaskItem> {
    return request<TaskItem>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  async updateTask(id: string, fields: Partial<TaskItem>): Promise<TaskItem> {
    return request<TaskItem>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    });
  },

  // Resource Management Service
  async getResources(): Promise<ResourceBooking[]> {
    return request<ResourceBooking[]>("/api/resources");
  },

  async createResource(res: Partial<ResourceBooking>): Promise<ResourceBooking> {
    return request<ResourceBooking>("/api/resources", {
      method: "POST",
      body: JSON.stringify(res),
    });
  },

  async updateResource(id: string, fields: Partial<ResourceBooking>): Promise<ResourceBooking> {
    return request<ResourceBooking>(`/api/resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    });
  },

  // Billing & Transactions Service
  async getTransactions(): Promise<Transaction[]> {
    return request<Transaction[]>("/api/transactions");
  },

  async createTransaction(tx: Partial<Transaction>): Promise<Transaction> {
    return request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(tx),
    });
  },

  // Notifications & Logging Service
  async getNotifications(): Promise<NotificationItem[]> {
    return request<NotificationItem[]>("/api/notifications");
  },

  async createNotification(notif: Partial<NotificationItem>): Promise<NotificationItem> {
    return request<NotificationItem>("/api/notifications", {
      method: "POST",
      body: JSON.stringify(notif),
    });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>("/api/notifications/read-all", {
      method: "PUT",
    });
  },

  // Log Analytics structured format
  async getAuditLogs(): Promise<AuditLog[]> {
    return request<AuditLog[]>("/api/audit-logs");
  },

  // Vendor Exhibition Service
  async getVendors(): Promise<VendorBooth[]> {
    return request<VendorBooth[]>("/api/vendors");
  },

  async createVendor(vendor: Partial<VendorBooth>): Promise<VendorBooth> {
    return request<VendorBooth>("/api/vendors", {
      method: "POST",
      body: JSON.stringify(vendor),
    });
  },

  async updateVendor(id: string, fields: Partial<VendorBooth>): Promise<VendorBooth> {
    return request<VendorBooth>(`/api/vendors/${id}`, {
      method: "PUT",
      body: JSON.stringify(fields),
    });
  },

  // Key Vault and Webhook config settings
  async getSettings(): Promise<any> {
    return request<any>("/api/settings");
  },

  async saveSettings(settings: any): Promise<any> {
    return request<any>("/api/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    });
  },

  // Azure Administrative Simulation Controls
  async seedAzureDatabase(): Promise<{ message: string }> {
    return request<{ message: string }>("/api/azure/seed", { method: "POST" });
  },

  async clearAzureDatabase(): Promise<{ message: string }> {
    return request<{ message: string }>("/api/azure/clear", { method: "POST" });
  }
};
