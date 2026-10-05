# 🌿 FIELD OF SOMA — COMPLETE DESIGN & ARCHITECTURE HANDOVER DOSSIER

> **Prepared for Claude (or Incoming Senior Design Engineer)**  
> **Project:** fieldofsoma.com  
> **Client:** Kirti Verma — Movement & Somatic Educator  
> **Status:** Full Specification, Research Dossier & Architecture Blueprint  

---

## 1. EXACT FIRST PROMPT & CLIENT BRIEF (VERBATIM)

The following is the exact raw initial prompt and brief received from the client/user at project initiation:

```text
we are starting a new project for fieldofsoma.com , here some messages from client : A little brief for you guys to know about me:
I am a Movement and Somatic educator (Somatic is a terminology that includes body based practices for the primary purpose of healing and coming back to one’s own healing capacity)
My work is informed from Somatics (related terms are Clinical Somatics, Embodied Somatics, Somatic movement) and Tai Chi (a gentle martial art form). 
These are two distinct practices and I also bring Creative movement elements derived from dance. So i want to throw some light on this as well (still figuring out how) , 
Website specifications:
• my bio (trainings, research, ideology)
• teaching experience with feedbacks
• a window that inform and convince people to learn more about Somatics
• Current practices and their description, how it helps
• Recorded Classes to buy. This will eventually become short recorded courses where people can buy on website itself. 
• See my calendar and book appointments and 1 on 1 sessions
• Articles and newsletters
• contact information
Here is the pinterest moodboard I have started to get an idea of color tones and visual graphics i want to use: https://pin.it/4fcW6Lmh2
Apart from this I have my own photographs which I will be sharing to go on the website. Will do so in a drive link...
```

---

## 2. CLIENT IDENTITY & THE TRIAD PHILOSOPHY

### Client Background
**Kirti Verma** is a Movement and Somatic Educator. Her work operates at the confluence of three distinct body-based disciplines. This triad is the primary differentiator and must be central to the website's conceptual architecture:

```
                          ┌────────────────────────┐
                          │   CLINICAL SOMATICS    │
                          │      Heal / Sense      │
                          │ Body-based healing and │
                          │  nervous system ease   │
                          └───────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │      FIELD OF SOMA      │
                         │   The Living Practice   │
                         └────────────┬────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              │                                               │
   ┌──────────┴──────────┐                         ┌──────────┴──────────┐
   │       TAI CHI       │                         │  CREATIVE MOVEMENT  │
   │    Ground / Flow    │                         │    Express / Play   │
   │ Gentle martial art, │                         │ Dance-derived bodily│
   │ rooting & stability │                         │  freedom & joy      │
   └─────────────────────┘                         └─────────────────────┘
```

### The Three Pillars Defined
1. **Somatics (Clinical Somatics / Embodied Somatics):**
   - *Core Premise:* The body holds habitual tension and nervous system patterns (sensory-motor amnesia). Rather than "forcing" alignment, Somatics re-educates the brain and nervous system through conscious, gentle micro-movements to release chronic pain and return to innate self-healing.
   - *Audience State:* "I am in pain, burnt out, disconnected from my physical self, or carrying stored stress."
2. **Tai Chi (Gentle Martial Art):**
   - *Core Premise:* Moving meditation, internal martial art cultivating grounding, spinal fluidity, dantian centering, circular energy, and effortless stability.
   - *Audience State:* "I want sustainable strength, balance, grounding, and quiet focus."
3. **Creative Movement (Dance-Derived):**
   - *Core Premise:* Free-form, somatic dance inquiry. No fixed choreography, no performance evaluation. Exploring sensation, spatial curiosity, rhythm, and expressive aliveness.
   - *Audience State:* "I want to feel alive, expressive, uninhibited, and playful in my body."

---

## 3. STRICT NEGATIVE CONSTRAINTS (USER REVIEWS & LESSONS LEARNED)

These are non-negotiable rules directly established through user feedback. Any design violating these will be immediately rejected:

### ❌ 1. ABSOLUTELY ZERO PILLS
- **Rule:** Never use `rounded-full` for badges, tags, buttons, categories, or chips.
- **Why:** Pill shapes make the UI look like a generic SaaS template or mobile app.
- **Instead:** Use clean sharp rectangles (`rounded-none`), subtle soft geometric corners (`rounded-sm` or `rounded-md`), or editorial borderless text links with understated underlines.

### ❌ 2. ABSOLUTELY ZERO EM-DASHES (`—`) OR EN-DASHES (`–`)
- **Rule:** Never insert `—` or `–` in any text, heading, subheader, quote attribution, or microcopy.
- **Instead:** Use colons (`:`), commas (`,`), standard slashes (`/`), or simple standard hyphens with surrounding spaces (` - `).

### ❌ 3. ZERO DECORATIVE LINES OR DASHES IN FRONT OF HEADINGS
- **Rule:** Never put decorative line elements before or beside headings (e.g. `<span className="w-5 h-px bg-..." />` or `— Heading`).
- **Why:** This is a hallmark of low-effort AI slop. Section headings must command respect through typography weight, size, letter spacing, and open space.

### ❌ 4. CENTERED IMAGES / NO PUSHING IMAGES TO WINDOW CORNERS
- **Rule:** Never shove primary imagery to the extreme side edges or corners of the desktop viewport where they feel detached or float awkwardly.
- **Instead:** Keep key visuals anchored towards the center with balanced gutters and intentional margins (e.g., `max-w-4xl mx-auto` or centered editorial layouts).

### ❌ 5. NO BOXY, COMPACT CONTAINERS ("RAW HTML BOXES")
- **Rule:** Avoid wrapping every paragraph, quote, or testimonial into a 1px bordered grey container that feels like a compact HTML table or legacy forum box.
- **Instead:** Generous whitespace (`py-28` to `py-40`), airy vertical rhythm, high-end editorial publication layout (like *Kinfolk*, *Cereal*, or *Aesop*), letting typography breathe without cage-like borders.

### ❌ 6. NO AI BUZZWORD SLOP
- **Rule:** Eliminate words like "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionary", "Dive in".
- **Tone:** Quiet, grounded, poetic, anatomically honest, and welcoming.

---

## 4. DESIGN SYSTEM SPECIFICATIONS

### 🎨 Color Palette (Derived from Pinterest Moodboard `https://pin.it/4fcW6Lmh2`)

The moodboard reflects organic raw paper, washed linen, dried botanical flora, soft clay, and deep ink.

| Token Name | HEX Code | CSS Variable | Semantic Purpose |
|------------|----------|--------------|------------------|
| **Paper Canvas** | `#FAF6F0` | `--color-soma-paper` | Primary page background; warm unbleached paper tone |
| **Linen Surface** | `#F0EAE1` | `--color-soma-linen` | Secondary surface, subtle content backgrounds |
| **Ink Earth** | `#1C1A17` | `--color-soma-ink` | Primary high-contrast typography, headings, dark accents |
| **Botanical Moss** | `#465942` | `--color-soma-moss` | Primary brand accent; grounded sage/moss for CTAs and focus |
| **Moss Light** | `#60775B` | `--color-soma-moss-light` | Hover states, active links, accents |
| **Warm Clay** | `#8E7B6C` | `--color-soma-clay` | Tertiary text, captions, metadata, warm muted cues |
| **Hairline Sand** | `#DED6C9` | `--color-soma-sand` | Delicate architectural divider lines |
| **Pure Base** | `#FFFFFF` | `--color-soma-white` | Selective clean card backings or contrast surfaces |

### 🔤 Typography Hierarchy

| Style | Recommended Font | Fallback | Weights | Characteristics |
|-------|------------------|----------|---------|-----------------|
| **Display / Headings** | `Cormorant Garamond` | `Georgia, serif` | 400, 500, 600 | High contrast, delicate serifs, literary, contemplative |
| **Body & UI** | `Plus Jakarta Sans` or `Outfit` | `system-ui, sans-serif` | 300, 400, 500 | Clean geometric sans, humanist warmth, legible at 15-16px |
| **Monospace / Meta** | `JetBrains Mono` (optional) | `monospace` | 400 | For delicate timestamp / catalog identifiers |

### Google Fonts Preload Tag:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 5. INFORMATION ARCHITECTURE & SITEMAP

The application contains 8 core routes:

```
/                     -> Home (The Digital Soma Sanctuary)
/about                -> About (Bio, Linage, Ideology, Experience)
/somatics             -> Discover Somatics ("The Conviction Window")
/practices            -> Practices (Detailed Somatics, Tai Chi & Dance)
/classes              -> Recorded Classes (Video Library & Future Courses)
/calendar             -> Calendar & Booking (Schedule, 1-on-1 Sessions)
/articles             -> Writing & Newsletters (Essays & Archive)
/contact              -> Contact (Inquiries, Studio Details, Connect)
*                     -> 404 (Minimal Editorial Recovery)
```

---

## 6. PAGE-BY-PAGE DETAILED FUNCTIONAL & LAYOUT SPECS

### 1. Home Page (`/`)
* **Hero Section:**
  - *Layout:* Centered or balanced editorial masthead. No clunky side-clamped images.
  - *Headline:* "Find your way back into your body." (Display serif, large scale `text-5xl` to `text-7xl`).
  - *Subtext:* "Through Somatic healing, Tai Chi, and Creative Movement, rediscover the quiet intelligence your body already holds."
  - *CTAs:* Primary text/button "Explore the Practices" (clean moss button) + Secondary "Book a Consultation" (border button).
  - *Imagery:* Hero photo centered or framed as an editorial centerpiece (`max-w-4xl mx-auto`).
* **Philosophy Manifesto Strip:**
  - *Copy:* "Your body is not a problem to fix. It is a living field of intelligence, capable of its own restoration, its own expression, its own quiet wisdom."
  - *Layout:* Generously padded text block with wide letter spacing.
* **The Three Pillars (Convergence Section):**
  - Clinical Somatics, Tai Chi, and Creative Movement presented with distinct pacing.
  - Asymmetric editorial balance rather than 3 identical box cards.
* **"The Window" (Somatics Preview):**
  - Teaser addressing the client's desire to educate and convince people about Somatics.
  - Highlights sensory-motor amnesia, gentle unlearning of pain, link to `/somatics`.
* **Testimonials & Student Words:**
  - Quotations with generous line height.
  - Clean typographic attributions (e.g. `Priya M. / Yoga Practitioner` or `- Priya M., Yoga Practitioner`).
* **Closing Schedule Invitation & Newsletter:**
  - Calm invitation to join sessions or read weekly reflections.

---

### 2. About Page (`/about`)
* **Bio Narrative:**
  - Kirti Verma's personal story: how chronic tension or life inquiry led her to body-based practices.
  - Blending scientific somatic education with internal martial arts and expressive dance.
* **Trainings & Research Linage:**
  - Structured list: Clinical Somatics certification, Tai Chi lineage, dance and movement arts study.
  - Clean editorial divider rows (not rounded badge tags).
* **Teaching Philosophy & Ideology:**
  - Non-dogmatic, trauma-informed, collaborative body education.
* **Student Reflections & Feedback:**
  - Real words from students describing somatic shifts, release of pain, emotional grounding.

---

### 3. Discover Somatics Page (`/somatics`) — "The Conviction Window"
*Client Note: "a window that inform and convince people to learn more about Somatics"*
* **The Core Problem:**
  - We live from the neck up. Chronic stress, sedentary habits, and emotional trauma cause sensory-motor amnesia (the brain forgets how to relax chronically contracted muscles).
* **How Somatics Differs:**
  - *Not Stretching:* Stretching triggers the stretch reflex; Somatics uses **pandiculation** (slow conscious contraction and deliberate release).
  - *Not Fixing from the Outside:* Chiropractors and massage therapists work on you; Somatics empowers you to release yourself from within.
* **Scientific & Experiential Grounding:**
  - Nervous system regulation (vagus nerve, parasympathetic shift).
  - Somatosensory cortex re-mapping.
* **Interactive Concept / Self-Inquiry Checklist:**
  - Where do you hold tension? (Jaw, shoulders, lower back, shallow breath).
* **Frequently Asked Doubts (Accordion / Clean List):**
  - Is it strenuous? (No, extremely gentle).
  - Can I do it if I have chronic pain? (Yes, specifically built for it).
  - Can sessions happen online? (Yes, verbal somatic guidance is remarkably effective).

---

### 4. Practices Page (`/practices`)
* Deep breakdown of the three distinct offerings:
  1. **Clinical Somatics:**
     - Individual and group pandiculation sessions.
     - Release of back, neck, hip, and shoulder holding patterns.
  2. **Tai Chi:**
     - Grounding forms, circular movement, breath synchronization, effortless balance.
  3. **Creative Movement:**
     - Dance-derived exploration, somatic improvisation, freeing emotional expression.
* Each practice includes:
  - Intention & Spirit
  - What a typical 60-minute session feels like
  - Who will benefit most
  - Direct booking link to `/calendar`

---

### 5. Recorded Classes Page (`/classes`)
*Client Note: "Recorded Classes to buy. This will eventually become short recorded courses where people can buy on website itself."*
* **Architecture:**
  - Filterable by modality: *Somatics*, *Tai Chi*, *Creative Movement*.
  - Class Card attributes: Title, Duration (e.g. 45 mins), Level (All Levels), Focus (e.g. "Neck & Shoulder Freedom", "Grounding Flow", "Spine Release"), Price tag.
  - Direct purchase / preview mechanism (Phase 1: Stripe / Razorpay checkout; Phase 2: Video portal access).

---

### 6. Calendar & Booking Page (`/calendar`)
*Client Note: "See my calendar and book appointments and 1 on 1 sessions"*
* **Two Booking Paths:**
  1. **Private 1-on-1 Somatic Sessions (60–75 mins):** In-depth assessment, guided pandiculation, personalized self-practice plan.
  2. **Weekly Group Classes:** Live streaming or in-person Tai Chi and Somatic movement circles.
* **Technical Integration:**
  - Ready for Calendly, Cal.com embed, or custom booking slot selector.

---

### 7. Articles & Newsletters Page (`/articles`)
*Client Note: "Articles and newsletters"*
* **Editorial Feed:**
  - Long-form essays on somatic philosophy, movement biology, trauma release, and artistic expression.
  - Featured article with generous typography and full excerpt.
* **Newsletter Signup ("Field Notes"):**
  - Email subscription form with calm, respectful microcopy ("Delivered quietly twice a month. Unsubscribe anytime.").

---

### 8. Contact Page (`/contact`)
* Clean inquiry form with fields: Full Name, Email, Practice of Interest, Message / Body Inquiry.
* Direct email address, studio location / timezone, and social channels.

---

## 7. SUGGESTED DRIBBLE / PINTEREST DESIGN IDEAS & REFERENCES

When Claude redesigns the visual interface, Claude should draw inspiration from these proven design patterns:

1. **Kinfolk / Cereal Magazine Editorial Layouts:**
   - Wide page margins, prominent serif titles, subtle uppercase tracking labels (e.g. `CLINICAL SOMATICS / PRACTICE 01`).
   - Hairline separators in `#DED6C9`.
2. **Aesop-style Product & Practice Showcases:**
   - Earthy, desaturated canvas backgrounds (`#FAF6F0`).
   - Minimalist grid with generous padding and vertical rhythm (`py-32`).
3. **Studio Movement Portfolios (Contemporary Dance & Somatics):**
   - High aspect ratio photography centered in view.
   - Smooth text transitions, gentle stagger animations with `motion/react`.
   - Subtle interactive elements (e.g., interactive breath guide or body region tension selector).

---

## 8. CODEBASE STATUS AT HANDOVER

The previous code draft in `d:\FieldOfSoma\src` has been purged per user request to provide a clean slate for Claude to design from first principles without legacy baggage. The Vite configuration and package setup remain ready:

- **Dependencies Installed:**
  - `react`, `react-dom`
  - `react-router-dom`
  - `tailwindcss` v4 (with `@tailwindcss/vite`)
  - `motion` (Framer Motion)
  - `@phosphor-icons/react`
  - `lucide-react`

**Claude can now start fresh, import the tokens and fonts, and produce an award-worthy, 100% custom-tailored frontend for Field of Soma.**
