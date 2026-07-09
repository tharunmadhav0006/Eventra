-- ==========================================
-- ENTERPRISE EVENTRA AZURE SQL DATABASE SCHEMA
-- Target Platform: Microsoft Azure SQL Database
-- Designed with normalized tables, foreign keys, indexes, and timestamps
-- ==========================================

-- 1. Organizations Table
CREATE TABLE Organizations (
    organization_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    domain NVARCHAR(100) NULL,
    logo_url NVARCHAR(2083) NULL, -- Azure Blob Storage URI
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE NONCLUSTERED INDEX IX_Organizations_Name ON Organizations(name);

-- 2. Users Table (Integrated with Microsoft Entra External ID Claims)
CREATE TABLE Users (
    user_id NVARCHAR(128) PRIMARY KEY, -- Entra External ID oid / sub claim
    organization_id UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Organizations(organization_id),
    full_name NVARCHAR(255) NOT NULL,
    email NVARCHAR(256) NOT NULL UNIQUE,
    user_role NVARCHAR(50) NOT NULL, -- Super Admin, Org Admin, Event Manager, etc.
    avatar_url NVARCHAR(2083) NULL, -- Azure Blob Storage URI
    remember_me_token VARCHAR(255) NULL,
    email_verified BIT NOT NULL DEFAULT 0,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(email);
CREATE NONCLUSTERED INDEX IX_Users_Org ON Users(organization_id);

-- 3. Venues Table
CREATE TABLE Venues (
    venue_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    address NVARCHAR(500) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    amenities NVARCHAR(MAX) NULL, -- JSON formatted list of features
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 4. Speakers Table
CREATE TABLE Speakers (
    speaker_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    title NVARCHAR(255) NOT NULL,
    company NVARCHAR(255) NOT NULL,
    avatar_url NVARCHAR(2083) NULL, -- Azure Blob Storage URI
    bio NVARCHAR(MAX) NULL,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 5. Sponsors Table
CREATE TABLE Sponsors (
    sponsor_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    tier NVARCHAR(50) NOT NULL, -- Platinum, Gold, Silver, Bronze
    logo_url NVARCHAR(2083) NULL, -- Azure Blob Storage URI
    website_url NVARCHAR(2083) NULL,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 6. Events Table
CREATE TABLE Events (
    event_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    organization_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Organizations(organization_id),
    venue_id UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Venues(venue_id),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(500) NOT NULL,
    long_description NVARCHAR(MAX) NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'Draft', -- Draft, Upcoming, Live, Completed, Cancelled
    banner_url NVARCHAR(2083) NULL, -- Azure Blob Storage URI
    attendees_count INT NOT NULL DEFAULT 0,
    revenue DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    tickets_sold INT NOT NULL DEFAULT 0,
    ticket_capacity INT NOT NULL DEFAULT 0,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE NONCLUSTERED INDEX IX_Events_Org ON Events(organization_id);
CREATE NONCLUSTERED INDEX IX_Events_Date ON Events(event_date);
CREATE NONCLUSTERED INDEX IX_Events_Status ON Events(status);

-- 7. Event Categories Table
CREATE TABLE EventCategories (
    category_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Events(event_id) ON DELETE CASCADE,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255) NULL,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 8. Tickets Table (Ticket Categories for an Event)
CREATE TABLE Tickets (
    ticket_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Events(event_id) ON DELETE CASCADE,
    name NVARCHAR(150) NOT NULL, -- VIP, GA, Student
    price DECIMAL(18, 2) NOT NULL,
    capacity INT NOT NULL,
    sold INT NOT NULL DEFAULT 0,
    perks NVARCHAR(MAX) NULL, -- JSON formatted array
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE NONCLUSTERED INDEX IX_Tickets_Event ON Tickets(event_id);

-- 9. Volunteers Table
CREATE TABLE Volunteers (
    volunteer_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id NVARCHAR(128) NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    event_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Events(event_id),
    assigned_role NVARCHAR(100) NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Inactive
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 10. Vendors Table (Vendor Booths)
CREATE TABLE Vendors (
    vendor_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Events(event_id) ON DELETE CASCADE,
    name NVARCHAR(255) NOT NULL,
    booth_number NVARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'Reserved', -- Assigned, Open, Reserved
    items_ordered INT NOT NULL DEFAULT 0,
    payment_status NVARCHAR(50) NOT NULL DEFAULT 'Unpaid', -- Paid, Unpaid
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 11. Attendees Table
CREATE TABLE Attendees (
    attendee_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    full_name NVARCHAR(255) NOT NULL,
    email NVARCHAR(256) NOT NULL UNIQUE,
    phone NVARCHAR(50) NULL,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 12. Registrations Table (Connecting Attendees to Events & Tickets)
CREATE TABLE Registrations (
    registration_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Events(event_id),
    attendee_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Attendees(attendee_id),
    ticket_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Tickets(ticket_id),
    registration_date DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    checked_in BIT NOT NULL DEFAULT 0,
    check_in_time DATETIMEOFFSET NULL,
    qr_code_url NVARCHAR(2083) NULL -- Azure Blob Storage QR Code URI
);
CREATE NONCLUSTERED INDEX IX_Registrations_Event ON Registrations(event_id);
CREATE NONCLUSTERED INDEX IX_Registrations_Attendee ON Registrations(attendee_id);

-- 13. Payments Table (Financial Transactions)
CREATE TABLE Payments (
    payment_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    registration_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Registrations(registration_id),
    invoice_number NVARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(18, 2) NOT NULL,
    status NVARCHAR(50) NOT NULL, -- Success, Refunded, Pending
    gateway NVARCHAR(100) NOT NULL DEFAULT 'Stripe API Gateway',
    payment_date DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE NONCLUSTERED INDEX IX_Payments_Registration ON Payments(registration_id);

-- 14. Notifications Table
CREATE TABLE Notifications (
    notification_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(500) NOT NULL,
    notif_type NVARCHAR(50) NOT NULL, -- info, warning, success, alert
    is_read BIT NOT NULL DEFAULT 0,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 15. Reports Table (Dynamic generated PDF or Analytical records)
CREATE TABLE Reports (
    report_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(255) NOT NULL,
    report_type NVARCHAR(100) NOT NULL, -- Financial, Attendees, Operational
    generated_by NVARCHAR(128) NOT NULL, -- User ID
    blob_url NVARCHAR(2083) NOT NULL, -- Azure Blob Storage file link
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 16. AuditLogs Table (Azure Log Analytics structured format)
CREATE TABLE AuditLogs (
    log_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    timestamp DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    actor_email NVARCHAR(256) NOT NULL,
    action_performed NVARCHAR(MAX) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    severity NVARCHAR(50) NOT NULL DEFAULT 'info' -- info, warning, error
);
CREATE NONCLUSTERED INDEX IX_AuditLogs_Timestamp ON AuditLogs(timestamp DESC);

-- 17. Settings Table (Enterprise Webhook & Key Vault parameters)
CREATE TABLE Settings (
    setting_id INT PRIMARY KEY IDENTITY(1,1),
    webhook_url NVARCHAR(2083) NULL,
    key_vault_secret_identifier NVARCHAR(500) NULL,
    is_saved BIT NOT NULL DEFAULT 1,
    last_modified DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
