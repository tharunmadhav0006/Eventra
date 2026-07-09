export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  ORG_ADMIN = "Organization Admin",
  EVENT_MANAGER = "Event Manager",
  ORGANIZER = "Organizer",
  VOLUNTEER = "Volunteer",
  SPEAKER = "Speaker",
  SPONSOR = "Sponsor",
  VENDOR = "Vendor",
  ATTENDEE = "Attendee",
  GUEST = "Guest"
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organization?: string;
}

export interface EventSession {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speakerId: string;
  room?: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
}

export interface EventSponsor {
  id: string;
  name: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  logo: string;
  website: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  perks: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time: string;
  venue: string;
  status: "Draft" | "Upcoming" | "Live" | "Completed" | "Cancelled";
  image: string;
  organizerId: string;
  attendeesCount: number;
  revenue: number;
  ticketsSold: number;
  ticketCapacity: number;
  sessions: EventSession[];
  speakers: EventSpeaker[];
  sponsors: EventSponsor[];
  ticketCategories: TicketCategory[];
}

export interface TaskItem {
  id: string;
  title: string;
  assignedTo: string; // user name/id
  roleNeeded: UserRole;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  eventId?: string;
}

export interface ResourceBooking {
  id: string;
  name: string;
  type: "Venue" | "Equipment" | "Staff" | "Catering" | "Accommodation";
  quantity: number;
  status: "Available" | "Booked" | "Maintenance";
  assignedEvent?: string;
  date: string;
  cost: number;
  capacity?: number;
  unit?: string;
  bookedSessions: {
    eventId: string;
    title: string;
    date: string;
    time: string;
  }[];
}

export interface Transaction {
  id: string;
  eventId: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: "Success" | "Refunded" | "Pending";
  date: string;
  ticketType: string;
  invoiceNumber: string;
}

export interface AIHelpMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  severity: "info" | "warning" | "error";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
}

export interface VendorBooth {
  id: string;
  name: string;
  vendorName: string;
  boothNumber: string;
  status: "Assigned" | "Open" | "Reserved";
  itemsOrdered: number;
  paymentStatus: "Paid" | "Unpaid";
}
