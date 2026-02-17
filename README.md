# Smart Bookmark App

A real-time personal bookmark manager built with **Next.js (App Router)** and **Supabase**.

Users can securely log in with Google, manage their private bookmarks, and see updates instantly across multiple tabs or devices without refreshing.

---

## Live Demo

Production URL:  
`https://bookmarks-rust.vercel.app/`

---

## Features

- Google OAuth authentication (Supabase Auth)
- Add, edit, and delete bookmarks
- Private data per user (Row Level Security)
- Real-time updates across tabs/devices
- Optimistic UI for instant feedback
- Responsive layout (mobile + desktop)
- Deployed on Vercel

---

## Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS

**Backend (BaaS)**
- Supabase
  - PostgreSQL
  - Auth (Google OAuth)
  - Realtime (WebSockets)
  - Row Level Security (RLS)

**Deployment**
- Vercel

---

## Architecture Overview
Client (Next.js)
|
| Supabase JS SDK
|
Supabase
├── Auth (Google OAuth)
├── Postgres Database
├── Row Level Security
└── Realtime (WebSockets)


### Data Model

**Table: bookmarks**

| Column     | Type      |
|------------|-----------|
| id         | uuid (PK) |
| user_id    | uuid      |
| title      | text      |
| url        | text      |
| created_at | timestamp |

---

## Security (RLS)

All operations are restricted to the authenticated user.

Policies:
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

This ensures complete user data isolation.

---

## Realtime Design

- Supabase Realtime subscriptions on `bookmarks` table
- Events handled:
  - INSERT
  - UPDATE
  - DELETE
- Optimistic updates applied for better UX
- Tab focus resync added to handle WebSocket drops

---

## Getting Started

### 1. Clone

```bash
git clone [<repo-url>](https://github.com/TheChiragKaushik/Bookmarks)
cd Bookmarks
```

### 2. Install
```bash
npm install
```

### 3. Environment Variables

Create .env

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_REDIRECT_URL=http://localhost:3000 || production_url

### 4. Run
```bash
npm run dev
```

Open: 
```bash 
http://localhost:3000
```

## Challenges Faced & Solutions

---

### 1. UPDATE Requests Returning `204` but No Data Change

**Problem:**
PATCH request succeeded but the bookmark was not updated in the database.

**Root Cause:**
Missing **Row Level Security (RLS) UPDATE policy**.

**Solution:**
Added UPDATE policy:

```sql
auth.uid() = user_id
```

---

### 2. UI Delay After Add / Edit / Delete

**Problem:**
Changes appeared after a noticeable delay.

**Solution:**
Implemented **Optimistic UI Updates**:

* Updated local state immediately
* Synced with Supabase in the background

---

### 3. Login Screen Flash on Reload

**Problem:**
Login component briefly appeared even when the user was already authenticated.

**Solution:**

* Added **authentication loading state**
* Rendered UI only after session check completes

---

## Folder Structure

```
src/
 ├── app/
 ├── components/
 │     └── Bookmarks.tsx
 ├── lib/
 │     ├── supabaseClient.ts
 │     ├── bookmarksOperations.ts
 │     └── interfaces.ts
```

