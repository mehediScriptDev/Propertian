# QuiahGroup - User Role Flows

## All User Roles Overview

```mermaid
flowchart TD
    START([User Access System]) --> AUTH{Authentication}
    AUTH --> ROLE{User Role?}
    
    ROLE --> SUPER_ADMIN[👑 SUPER_ADMIN]
    ROLE --> ADMIN[🔑 ADMIN]
    ROLE --> AGENT[🏢 AGENT]
    ROLE --> PARTNER[🤝 PARTNER]
    ROLE --> SPONSOR[💎 SPONSOR]
    ROLE --> CONCIERGE[🛎️ CONCIERGE_PARTNER]
    ROLE --> USER[👤 USER]
```

---

## 1. Super Admin Flow

```mermaid
flowchart TD
    SA([👑 SUPER_ADMIN]) --> SA_FULL[Full System Access]
    
    SA_FULL --> SA_USERS[Manage Users]
    SA_FULL --> SA_PROPS[Manage All Properties]
    SA_FULL --> SA_PARTNERS[Manage Partners]
    SA_FULL --> SA_CONCIERGE[Manage Concierge]
    SA_FULL --> SA_SPONSORS[Manage Sponsors]
    SA_FULL --> SA_EVENTS[Manage Events]
    SA_FULL --> SA_ANALYTICS[View All Analytics]
    SA_FULL --> SA_SETTINGS[System Settings]
    
    SA_USERS --> SA_U1[Create/Edit/Delete Users]
    SA_USERS --> SA_U2[Change User Roles]
    SA_USERS --> SA_U3[View All User Activity]
    
    SA_PROPS --> SA_P1[Approve/Reject Properties]
    SA_PROPS --> SA_P2[Verify Properties]
    SA_PROPS --> SA_P3[Manage Listings]
    
    SA_PARTNERS --> SA_PA1[Approve Partner Applications]
    SA_PARTNERS --> SA_PA2[Manage Partner Campaigns]
    SA_PARTNERS --> SA_PA3[Partner Performance Reports]
    
    SA_CONCIERGE --> SA_C1[Assign Tickets]
    SA_CONCIERGE --> SA_C2[Approve Partners]
    SA_CONCIERGE --> SA_C3[View All Tickets]
    
    SA_SPONSORS --> SA_S1[Approve Sponsor Applications]
    SA_SPONSORS --> SA_S2[Manage Event Sponsorships]
    SA_SPONSORS --> SA_S3[Review Campaigns]
```

---

## 2. Admin Flow

```mermaid
flowchart TD
    ADMIN([🔑 ADMIN]) --> ADMIN_ACCESS[Administrative Access]
    
    ADMIN_ACCESS --> ADMIN_PROPS[Property Management]
    ADMIN_ACCESS --> ADMIN_USERS[User Management Limited]
    ADMIN_ACCESS --> ADMIN_CONC[Concierge Management]
    ADMIN_ACCESS --> ADMIN_EVENTS[Event Management]
    ADMIN_ACCESS --> ADMIN_REPORTS[Reports & Analytics]
    
    ADMIN_PROPS --> AP1[Review Property Submissions]
    ADMIN_PROPS --> AP2[Approve/Reject Properties]
    ADMIN_PROPS --> AP3[Request Revisions]
    
    ADMIN_CONC --> AC1[View All Tickets]
    ADMIN_CONC --> AC2[Assign Tickets to Staff/Partners]
    ADMIN_CONC --> AC3[Update Ticket Status]
    ADMIN_CONC --> AC4[Review Quotes]
    ADMIN_CONC --> AC5[Approve Partner Applications]
    
    ADMIN_EVENTS --> AE1[Approve Events]
    ADMIN_EVENTS --> AE2[Manage Registrations]
    ADMIN_EVENTS --> AE3[Review Sponsorships]
```

---

## 3. Agent Flow

```mermaid
flowchart TD
    AGENT([🏢 AGENT]) --> AGENT_MAIN[Property Agent]
    
    AGENT_MAIN --> AGENT_LIST[Manage Own Listings]
    AGENT_MAIN --> AGENT_INQUIRIES[Handle Inquiries]
    AGENT_MAIN --> AGENT_BOOKINGS[Manage Bookings]
    AGENT_MAIN --> AGENT_CLIENTS[Client Management]
    
    AGENT_LIST --> AL1[Create Properties]
    AGENT_LIST --> AL2[Edit Own Properties]
    AGENT_LIST --> AL3[Upload Images]
    AGENT_LIST --> AL4[Wait for Approval]
    
    AL4 --> AL_APPROVED{Approved?}
    AL_APPROVED -- Yes --> AL5[Property Active]
    AL_APPROVED -- No --> AL6[Revise & Resubmit]
    
    AGENT_INQUIRIES --> AI1[View Property Inquiries]
    AGENT_INQUIRIES --> AI2[Respond to Inquiries]
    AGENT_INQUIRIES --> AI3[Schedule Viewings]
    
    AGENT_BOOKINGS --> AB1[View Bookings]
    AGENT_BOOKINGS --> AB2[Confirm Appointments]
    AGENT_BOOKINGS --> AB3[Update Booking Status]
```

---

## 4. Partner Flow

```mermaid
flowchart TD
    PARTNER([🤝 PARTNER]) --> PARTNER_START{Has Profile?}
    
    PARTNER_START -- No --> PA1[Submit Application]
    PA1 --> PA2[Provide Documents]
    PA2 --> PA3[Admin Review]
    PA3 --> PA_STATUS{Status?}
    PA_STATUS -- Approved --> PA4[Access Dashboard]
    PA_STATUS -- Rejected --> PA5[Reapply Later]
    PA_STATUS -- Revision --> PA6[Update Application]
    
    PARTNER_START -- Yes --> PA4
    
    PA4 --> PARTNER_DASH[Partner Dashboard]
    
    PARTNER_DASH --> PD1[Manage Properties]
    PARTNER_DASH --> PD2[View Analytics]
    PARTNER_DASH --> PD3[Manage Campaigns]
    PARTNER_DASH --> PD4[Handle Inquiries]
    
    PD1 --> PD1A[Create Listings]
    PD1 --> PD1B[Submit for Approval]
    PD1 --> PD1C[Track Status]
    PD1C --> PD_APPROVAL{Approval Status}
    PD_APPROVAL -- PENDING --> PD1D[Wait for Review]
    PD_APPROVAL -- APPROVED --> PD1E[Property Live]
    PD_APPROVAL -- REJECTED --> PD1F[Review Feedback]
    PD_APPROVAL -- NEEDS_REVISION --> PD1G[Update & Resubmit]
    
    PD3 --> PD3A[Create Campaign]
    PD3 --> PD3B[Submit for Approval]
    PD3 --> PD3C[Monitor Performance]
```

---

## 5. Sponsor Flow

```mermaid
flowchart TD
    SPONSOR([💎 SPONSOR]) --> SPONSOR_START{Has Profile?}
    
    SPONSOR_START -- No --> SP1[Submit Application]
    SP1 --> SP2[Provide Company Info]
    SP2 --> SP3[Upload Documents]
    SP3 --> SP4[Admin Review]
    SP4 --> SP_STATUS{Status?}
    SP_STATUS -- Approved --> SP5[Access Dashboard]
    SP_STATUS -- Rejected --> SP6[Reapply Later]
    
    SPONSOR_START -- Yes --> SP5
    
    SP5 --> SPONSOR_DASH[Sponsor Dashboard]
    
    SPONSOR_DASH --> SD1[Event Sponsorships]
    SPONSOR_DASH --> SD2[Create Events]
    SPONSOR_DASH --> SD3[View Analytics]
    SPONSOR_DASH --> SD4[Manage Campaigns]
    
    SD1 --> SD1A[Browse Events]
    SD1 --> SD1B[Submit Sponsorship Request]
    SD1B --> SD1C{Request Status}
    SD1C -- NEW --> SD1D[Pending Review]
    SD1C -- IN_REVIEW --> SD1E[Under Evaluation]
    SD1C -- APPROVED --> SD1F[Sponsorship Active]
    SD1C -- REJECTED --> SD1G[Review Feedback]
    
    SD2 --> SD2A[Create Event]
    SD2 --> SD2B[Submit for Approval]
    SD2B --> SD2C{Approval}
    SD2C -- PENDING --> SD2D[Admin Review]
    SD2C -- APPROVED --> SD2E[Event Published]
    SD2C -- REJECTED --> SD2F[Revise Event]
```

---

## 6. Concierge Partner Flow

```mermaid
flowchart TD
    CONC([🛎️ CONCIERGE_PARTNER]) --> CONC_START{Has Profile?}
    
    CONC_START -- No --> CP1[Submit Application]
    CP1 --> CP2[Provide Service Details]
    CP2 --> CP3[Upload Certifications]
    CP3 --> CP4[Admin Review]
    CP4 --> CP_STATUS{Status?}
    CP_STATUS -- Approved --> CP5[Access Dashboard]
    CP_STATUS -- Rejected --> CP6[Reapply Later]
    
    CONC_START -- Yes --> CP5
    
    CP5 --> CONC_DASH[Concierge Dashboard]
    
    CONC_DASH --> CD1[View Assigned Tickets]
    CONC_DASH --> CD2[Manage Services]
    CONC_DASH --> CD3[Performance Stats]
    
    CD1 --> CD1A[New Assignments]
    CD1A --> CD1B{Ticket Status}
    CD1B -- ASSIGNED --> CD1C[Review Request]
    CD1C --> CD1D[Submit Quote]
    CD1D --> CD1E{User Response}
    CD1E -- Accepted --> CD1F[Schedule Service]
    CD1E -- Declined --> CD1G[Revise Quote]
    CD1F --> CD1H[IN_PROGRESS]
    CD1H --> CD1I[Complete Service]
    CD1I --> CD1J[COMPLETED]
    CD1J --> CD1K[Request Review]
```

---

## 7. Regular User Flow

```mermaid
flowchart TD
    USER([👤 USER]) --> USER_MAIN[Browse Platform]
    
    USER_MAIN --> U_PROPS[Properties]
    USER_MAIN --> U_CONC[Concierge Services]
    USER_MAIN --> U_EVENTS[Events]
    USER_MAIN --> U_PROFILE[My Profile]
    
    U_PROPS --> UP1[Browse Listings]
    UP1 --> UP2[Filter & Search]
    UP2 --> UP3[View Details]
    UP3 --> UP4{Interested?}
    UP4 -- Yes --> UP5[Send Inquiry]
    UP5 --> UP6[Schedule Viewing]
    UP6 --> UP7[Receive Response]
    UP4 -- Save --> UP8[Add to Favorites]
    
    U_CONC --> UC1[Browse Services]
    UC1 --> UC2[Select Service]
    UC2 --> UC3[Submit Ticket]
    UC3 --> UC_STATUS{Ticket Flow}
    UC_STATUS -- NEW --> UC4[Awaiting Review]
    UC_STATUS -- IN_REVIEW --> UC5[Being Processed]
    UC_STATUS -- QUOTED --> UC6[Review Quote]
    UC6 --> UC_DECISION{Accept?}
    UC_DECISION -- Yes --> UC7[SCHEDULED]
    UC_DECISION -- No --> UC8[Request Revision/Cancel]
    UC7 --> UC9[IN_PROGRESS]
    UC9 --> UC10[COMPLETED]
    UC10 --> UC11[Leave Review]
    
    U_EVENTS --> UE1[Browse Events]
    UE1 --> UE2[View Details]
    UE2 --> UE3[Register for Event]
    UE3 --> UE4[Receive Confirmation]
    
    U_PROFILE --> UPR1[View Bookings]
    U_PROFILE --> UPR2[View Tickets]
    U_PROFILE --> UPR3[View Favorites]
    U_PROFILE --> UPR4[Manage Inquiries]
```

---

## Property Approval Flow (All Roles)

```mermaid
flowchart TD
    START([Property Created]) --> CREATOR{Created By}
    
    CREATOR -- PARTNER/AGENT --> PENDING[Status: PENDING<br/>Approval: PENDING_APPROVAL]
    CREATOR -- ADMIN/SUPER_ADMIN --> AVAILABLE[Status: AVAILABLE<br/>Approval: APPROVED]
    
    PENDING --> ADMIN_REV[Admin Reviews]
    ADMIN_REV --> DECISION{Decision}
    
    DECISION -- Approve --> APPROVED[Status: AVAILABLE<br/>Approval: APPROVED]
    DECISION -- Reject --> REJECTED[Status: PENDING<br/>Approval: REJECTED]
    DECISION -- Needs Changes --> REVISION[Status: PENDING<br/>Approval: NEEDS_REVISION]
    
    APPROVED --> LIVE[Property Visible<br/>to All Users]
    REJECTED --> NOTIFY_REJECT[Notify Owner<br/>with Reason]
    REVISION --> NOTIFY_REV[Request Changes<br/>from Owner]
    NOTIFY_REV --> OWNER_UPDATE[Owner Updates]
    OWNER_UPDATE --> ADMIN_REV
```

---

## Concierge Ticket Flow (Complete)

```mermaid
flowchart TD
    USER_SUB([User Submits Ticket]) --> NEW[Status: NEW]
    NEW --> ADMIN_REV[Admin Reviews]
    
    ADMIN_REV --> IN_REVIEW[Status: IN_REVIEW]
    IN_REVIEW --> ASSIGN_DEC{Assign To?}
    
    ASSIGN_DEC -- Internal Staff --> ASSIGNED_STAFF[ASSIGNED<br/>Type: INTERNAL_STAFF]
    ASSIGN_DEC -- Partner --> ASSIGNED_PARTNER[ASSIGNED<br/>Type: EXTERNAL_PARTNER]
    
    ASSIGNED_STAFF --> REVIEW_REQ[Staff Reviews]
    ASSIGNED_PARTNER --> REVIEW_REQ
    
    REVIEW_REQ --> QUOTE_NEEDED{Quote Required?}
    
    QUOTE_NEEDED -- No --> SCHEDULED[Status: SCHEDULED]
    QUOTE_NEEDED -- Yes --> QUOTED[Status: QUOTED]
    
    QUOTED --> USER_REVIEW[User Reviews Quote]
    USER_REVIEW --> ACCEPT_DEC{Accepts?}
    
    ACCEPT_DEC -- Yes --> ACCEPTED[Status: ACCEPTED]
    ACCEPT_DEC -- No --> CANCEL_OR_REVISE{Action?}
    CANCEL_OR_REVISE -- Cancel --> CANCELLED[Status: CANCELLED]
    CANCEL_OR_REVISE -- Revise --> REVIEW_REQ
    
    ACCEPTED --> SCHEDULED
    SCHEDULED --> IN_PROGRESS[Status: IN_PROGRESS]
    IN_PROGRESS --> COMPLETE_WORK[Service Delivered]
    COMPLETE_WORK --> COMPLETED[Status: COMPLETED]
    COMPLETED --> CLOSE_REVIEW[Admin Review & Notes]
    CLOSE_REVIEW --> CLOSED[Status: CLOSED]
    CLOSED --> REQUEST_RATING[Request User Rating]
```

---

## Authentication & Access Control

```mermaid
flowchart TD
    LOGIN([Login Attempt]) --> AUTH_CHECK{Valid Credentials?}
    
    AUTH_CHECK -- No --> FAIL[Login Failed]
    AUTH_CHECK -- Yes --> ROLE_CHECK{User Role}
    
    ROLE_CHECK -- SUPER_ADMIN --> SA_ACCESS[All Routes<br/>All Permissions]
    ROLE_CHECK -- ADMIN --> A_ACCESS[Admin Routes<br/>Management Access]
    ROLE_CHECK -- AGENT --> AG_ACCESS[Agent Routes<br/>Property Management]
    ROLE_CHECK -- PARTNER --> P_ACCESS[Partner Routes<br/>Listing & Campaigns]
    ROLE_CHECK -- SPONSOR --> SP_ACCESS[Sponsor Routes<br/>Events & Sponsorships]
    ROLE_CHECK -- CONCIERGE_PARTNER --> C_ACCESS[Concierge Routes<br/>Ticket Management]
    ROLE_CHECK -- USER --> U_ACCESS[User Routes<br/>Browse & Submit]
    
    SA_ACCESS --> TOKEN[JWT Token Issued<br/>Full Permissions]
    A_ACCESS --> TOKEN
    AG_ACCESS --> TOKEN
    P_ACCESS --> TOKEN
    SP_ACCESS --> TOKEN
    C_ACCESS --> TOKEN
    U_ACCESS --> TOKEN
    
    TOKEN --> PROTECTED[Access Protected Routes]
```

---

## Test Accounts Reference

| Role | Email | Password |
|------|-------|----------|
| 👑 Super Admin | admin@quiahgroup.com | admin123 |
| 👤 Regular User | user@quiahgroup.com | user123 |
| 🏢 Agent | agent@quiahgroup.com | agent123 |
| 🤝 Partner | partner@quiahgroup.com | partner123 |
| 💎 Sponsor | sponsor@quiahgroup.com | sponsor123 |
| 🛎️ Concierge Partner | concierge@quiahgroup.com | concierge123 |

---

## API Endpoints by Role

### Super Admin Only
- `POST /api/users` - Create users
- `DELETE /api/users/:id` - Delete users
- `PUT /api/users/:id/role` - Change user roles
- `GET /api/admin/system-settings` - System configuration

### Admin + Super Admin
- `GET /api/admin/properties` - All properties
- `POST /api/admin/properties/:id/approve` - Approve property
- `POST /api/admin/properties/:id/reject` - Reject property
- `GET /api/concierge/tickets` - All concierge tickets
- `PUT /api/concierge/tickets/:id/assign` - Assign tickets
- `POST /api/admin/partners/:id/approve` - Approve partners

### Agent
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update own property
- `GET /api/properties/my-properties` - Own properties
- `GET /api/inquiries` - Property inquiries

### Partner
- `POST /api/properties` - Create property (requires approval)
- `GET /api/partner/dashboard` - Partner dashboard
- `POST /api/partner/campaigns` - Create campaign
- `GET /api/partner/analytics` - Performance stats

### Sponsor
- `POST /api/sponsors/apply` - Submit application
- `POST /api/events` - Create event (requires approval)
- `POST /api/event-sponsorships` - Submit sponsorship request
- `GET /api/sponsors/dashboard` - Sponsor dashboard

### Concierge Partner
- `GET /api/concierge/tickets/assigned-to-me` - Assigned tickets
- `POST /api/concierge/tickets/:id/quote` - Submit quote
- `PUT /api/concierge/tickets/:id/complete` - Complete ticket
- `POST /api/concierge/tickets/:id/notes` - Add notes

### Regular User
- `GET /api/properties` - Browse properties
- `POST /api/properties/:id/inquiry` - Submit inquiry
- `POST /api/concierge/tickets` - Request service
- `GET /api/concierge/tickets/my-tickets` - Own tickets
- `POST /api/events/:id/register` - Register for event
