Field of Soma

Movement and somatic education practice by Kirti Verma. Field of Soma offers gentle movement practices including Somatic Movement Therapy, Tai Chi, and Creative Movement to help release long-held tension and reconnect with somatic awareness.

Live website: fieldofsoma.vercel.app

Overview

Field of Soma is a complete digital home for Kirti Verma's movement education work. It pairs a calm, editorial frontend with an interactive admin suite and a Node.js + Fastify backend connected to MongoDB.

Key areas of the site:

The Practices: Detailed guides covering Somatic Movement Therapy, Tai Chi, and Creative Movement.
Recorded Classes: On-demand video lessons with preview snippets, duration, and direct purchasing.
Session Bookings: Private 1:1 sessions and group workshop bookings with calendar integration.
Essays and Notes: Editorial library of writings on somatic awareness, pandiculation, and movement science.
Admin Dashboard: Private administrative interface (/admin) for managing bookings, orders, student reviews, classes, writings, and profile settings.
Resilient Contact Forms: Inquiry forms backed by Nodemailer via Hostinger SMTP, with serverless failover and client-side fallback.
Tech Stack
Frontend
React 19 with Vite 6
React Router v7 for single-page routing
Tailwind CSS v4 for clean, bespoke styling
Motion for gentle, physics-based micro-interactions
Lenis for smooth kinetic scrolling
Phosphor Icons for minimalist iconography
Backend and APIs
Fastify 5: High-performance HTTP server running on Node.js
MongoDB 7: Document store for sync data, bookings, classes, reviews, and notes
Nodemailer: SMTP email transport for inquiries and booking notifications
Vercel Serverless Functions: Production API endpoints (/api/send-email, /api/sync)
CORS and Dotenv: Secure configuration and cross-origin access
Performance and SEO
Custom Static Pre-renderer (scripts/prerender.mjs): Generates social preview tags and static HTML heads for every route at build time.
Dynamic Sitemap Generator (scripts/sitemap.mjs): Auto-indexes all 20+ public routes into dist/sitemap.xml.
House Rules Checker (scripts/check-copy.mjs): Enforces typography integrity and prevents copy drift.
Architecture and Project Structure
FieldOfSoma/
├── api/                  # Vercel serverless function handlers
│   └── send-email.js     # Production SMTP email handler
├── backend/              # Node.js Fastify backend
│   ├── config/           # Database connections (db.js)
│   ├── routes/           # REST endpoints (bookings, classes, sync, email, etc.)
│   ├── services/         # Data seeding and migrations
│   ├── mailer.js         # Nodemailer SMTP transporter setup
│   ├── server.js         # Fastify application entry point
│   └── test-email.js     # SMTP transport verification utility
├── scripts/              # Build utilities
│   ├── check-copy.mjs    # House rules and typography validation
│   ├── prerender.mjs     # HTML head and meta tag injector
│   └── sitemap.mjs       # XML sitemap generator
├── src/
│   ├── admin/            # Administrative suite (/admin)
│   │   ├── pages/        # Dashboard, Bookings, Orders, Classes, Writing, Settings
│   │   ├── AdminLayout.jsx
│   │   ├── sampleData.js # Baseline state and seed data
│   │   └── store.jsx     # Synchronized admin state store
│   ├── components/       # Shared UI components (Layout, Reveal, SEO, Frame, etc.)
│   ├── content/          # Content registries (classes, practices, articles, about)
│   ├── lib/              # Client utilities (forms, email, helpers)
│   ├── pages/            # Public pages (Home, Practices, Classes, Somatics, About, Contact)
│   ├── App.jsx           # Root router and layout wrapper
│   └── main.jsx          # React DOM hydration
├── index.html            # HTML shell with typography and preload definitions
├── vercel.json           # Vercel routing rules and rewrite exemptions
└── vite.config.js        # Vite build config and local backend proxy
Getting Started
Prerequisites
Node.js 20 or higher
npm or pnpm
MongoDB (optional for local mock mode; required for persistent backend storage)
Installation

Clone the repository:

bash
git clone https://github.com/i-shubham24/FieldOfSoma.git
cd FieldOfSoma

Install dependencies:

bash
npm install

Set up environment variables: Copy the example environment file:

bash
cp backend/.env.example .env.local

Configure the following keys in .env.local:

ini
# SMTP Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@fieldofsoma.com
SMTP_PASS=your_email_password
NOTIFY_EMAIL=info@fieldofsoma.com
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/fieldofsoma
PORT=3001
Running Locally
1. Start the Frontend Development Server
bash
npm run dev

The site will run at http://localhost:5173.

2. Start the Fastify Backend

In a separate terminal:

bash
npm run backend

The Fastify server will listen on http://localhost:3001. The Vite dev server proxies requests made to /api/* directly to http://localhost:3001.

3. Test Email Delivery

Verify your SMTP credentials anytime by sending a test message:

bash
npm run test:email
4. Run Copy and Typography Audit
bash
npm run check:copy
5. Production Build

Build the client, generate sitemaps, and prerender page headers:

bash
npm run build

Preview the built artifacts:

bash
npm run preview
Admin Panel

The administrative panel is accessible at /admin.

Features:

Dashboard: Key metrics for bookings, pending inquiries, class purchases, and recent activity.
Inbox: Form submissions and inquiry details.
Bookings: Manage private 1:1 sessions, status changes, and student contacts.
Recorded Classes: Edit pricing, video links, descriptions, and class availability.
Reviews: Moderate and curate student testimonials shown on the website.
Orders: Track purchases of recorded classes.
Writing: Draft and publish somatic movement notes and essays.
Settings and Profile: Update teacher biography, credentials, photo, social links, and legal policies.

Changes made in the admin panel automatically synchronize with MongoDB when the backend is active, and persist locally in browser storage when running offline.

House Rules and Editorial Principles

The codebase adheres to strict editorial rules checked automatically by scripts/check-copy.mjs:

Zero em-dashes and zero en-dashes: Use colons, commas, parentheses, or separate sentences instead.
No spaced hyphens in copy: Spaced hyphens are not used as dashes in visible copy.
No pill buttons: Avoid rounded-full styling, preferring architectural borders and subtle radiuses.
Calm editorial language: Marketing buzzwords are forbidden in written copy.
Deployment

The project is configured for deployment on Vercel:

Static assets and prerendered HTML are served via Vercel Edge.
Serverless functions in api/ handle production email delivery.
Production environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS, MONGODB_URI) can be set in the Vercel Project Settings.
License

Private and proprietary. All rights reserved by Kirti Verma (Field of Soma).
