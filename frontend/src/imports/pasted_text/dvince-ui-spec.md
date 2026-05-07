Hello Figma Maker,

I need you to design the **complete UI** for my project **Dvince** – a knowledge exchange platform (like Stack Overflow / Quora).

This is a **COMPLETELY NEW PROJECT**. Please ignore any previous designs. Build everything from scratch based on these specifications.

---

## 📋 TOTAL FRAMES REQUIRED:

| Device | Authentication Frames | Main Pages Frames | Total |
|--------|------------------------|-------------------|-------|
| 📱 Mobile (375×812) | 10 frames | 10+ frames | 20+ frames |
| 📟 Tablet (768×1024) | 10 frames | 10+ frames | 20+ frames |
| 🖥️ Desktop (1440×1024) | 10 frames | 10+ frames | 20+ frames |

**Total: 60+ frames** in one Figma file.

---

## 📐 HOW TO ARRANGE (VERY IMPORTANT):

Arrange all frames **vertically**, in this order:
📱 MOBILE SECTION (375×812)
├── Authentication Flow (10 frames)
│ 1. Welcome Screen
│ 2. Login Form
│ 3. Sign Up Step 1 (Basic Info)
│ 4. Sign Up Step 2 (Profile Details)
│ 5. Sign Up Step 3 (Interests)
│ 6. Email Verification Sent
│ 7. Email Verification Success
│ 8. Forgot Password Request
│ 9. Reset Password Form
│ 10. Password Reset Success
│
└── Main Pages (10+ frames)
11. Home Feed / Dashboard
12. Question Detail Page
13. Ask Question Form
14. User Profile Page
15. Edit Profile Page
16. Topics/Categories Explorer
17. Search Results Page
18. Notifications Center
19. Saved / Bookmarked Content
20. Settings & Account Management
(Add more if needed)

(Leave space between sections)

📟 TABLET SECTION (768×1024)
├── Authentication Flow (10 frames – same content, tablet layout)
└── Main Pages (10+ frames – same pages, tablet layout)

(Leave space between sections)

🖥️ DESKTOP SECTION (1440×1024)
├── Authentication Flow (10 frames – same content, desktop layout)
└── Main Pages (10+ frames – same pages, desktop layout)

text

---

## 🎯 DESIGN PHILOSOPHY:

Each device must have its **own unique layout** adapted to its screen size:

| Device | Layout Style |
|--------|--------------|
| 📱 Mobile | Single column, full width, 16px margins, thumb-friendly, compact |
| 📟 Tablet | 2-3 columns, centered cards (550px), 24px margins, balanced |
| 🖥️ Desktop | Multi-column, split views, 32px margins, hover states, detailed |

**But colors, fonts, and brand style must be IDENTICAL across all devices.**

---

## 🎨 COLOR SCHEME (EXACT):

| Element | Color Code | Usage |
|--------|------------|-------|
| Primary Blue | #2563EB | Main buttons, links, active states, icons |
| Primary Dark | #1D4ED8 | Hover states, secondary buttons |
| Background | #FFFFFF | Page backgrounds |
| Card Background | #F9FAFB | Cards, sections, input backgrounds |
| Text Dark (headings) | #1F2937 | Headings, titles, important text |
| Text Gray (body) | #6B7280 | Body text, descriptions |
| Text Light Gray | #9CA3AF | Placeholders, disabled text |
| Accent Orange | #F97316 | Highlights, warnings, special badges |
| Success Green | #10B981 | Success messages, verified badges |
| Error Red | #EF4444 | Error messages, validation alerts |
| Border Light | #E5E7EB | Dividers, input borders |
| Border Focus | #2563EB | Input focus state |

---

## 🔤 FONTS (INTER):

Use **Inter** font family for everything.

| Device | Heading | Body | Label | Small |
|--------|---------|------|-------|-------|
| 📱 Mobile | 28px Bold | 15px Regular | 14px Medium | 12px Regular |
| 📟 Tablet | 32px Bold | 16px Regular | 14px Medium | 12px Regular |
| 🖥️ Desktop | 36px Bold | 18px Regular | 15px Medium | 13px Regular |

---

## 📏 BUTTONS & INPUTS (CONSISTENT):

| Element | Height | Border Radius | Style |
|---------|--------|---------------|-------|
| Primary Buttons | 56px | 12px | Primary Blue (#2563EB), white text |
| Secondary Buttons | 56px | 12px | White, blue border, blue text |
| Input Fields | 56px | 8px | White, border #E5E7EB, focus border #2563EB |
| Cards | Auto | 12px | White background, subtle shadow |
| Chips/Tags | 32px | 20px | Light Blue (#E6F0FA), blue text |

---

## 📱 DETAILED DESCRIPTIONS FOR ALL FRAMES:

---

### AUTHENTICATION FLOW (10 frames):

#### FRAME 1: Welcome Screen
- **Logo** at top (can be simple "Dvince" text in blue)
- **Hero image/illustration** (center) – can be simple geometric shapes
- **Headline:** "Share Knowledge, Grow Together"
- **Subheadline:** "Join the community of learners and experts"
- **Two buttons:** 
  - "Log In" (Primary Blue, full width)
  - "Create Account" (White with blue border)
- **Bottom text:** "Continue as guest" (optional link)

---

#### FRAME 2: Login Form
- **Back arrow** top-left
- **Title:** "Welcome Back"
- **Form fields:**
  - Email (with email icon)
  - Password (with lock icon, show/hide toggle)
- **"Forgot Password?"** link (right-aligned)
- **Login button** (Primary Blue, full width)
- **Divider:** "OR"
- **Social login options:** Google, Apple (icons only or buttons)
- **Bottom text:** "Don't have an account? Sign Up" (link)

---

#### FRAME 3: Sign Up Step 1 – Basic Info
- **Progress bar** (Step 1 of 3)
- **Title:** "Create your account"
- **Form fields:**
  - Full Name (with user icon)
  - Email (with email icon)
  - Password (with lock icon, show/hide)
  - Confirm Password
- **Password requirements hint** (min 8 chars, etc.)
- **Next button** (Primary Blue, full width)

---

#### FRAME 4: Sign Up Step 2 – Profile Details
- **Progress bar** (Step 2 of 3)
- **Title:** "Tell us about yourself"
- **Profile picture upload** (circle with camera icon)
- **Form fields:**
  - Username
  - Bio (textarea, 160 char max)
  - Location (optional)
- **Next button** (Primary Blue, full width)

---

#### FRAME 5: Sign Up Step 3 – Interests
- **Progress bar** (Step 3 of 3)
- **Title:** "Choose your interests"
- **Subtitle:** "Select topics you're interested in"
- **Grid of interest chips** (2 columns on mobile, 3 on tablet, 4 on desktop):
  - Technology, Programming, AI, Data Science, Mathematics, Physics, Literature, History, Arts, Business, Health, etc.
- Selected chips turn Primary Blue
- **"Skip"** link (top-right)
- **Create Account button** (Primary Blue, full width)

---

#### FRAME 6: Email Verification Sent
- **Illustration** (envelope or email icon)
- **Title:** "Check your email"
- **Message:** "We've sent a verification link to your email address"
- **Email display:** user@email.com
- **Resend option:** "Didn't receive it? Resend"
- **Open email app button** (Primary Blue)
- **Bottom link:** "Back to Login"

---

#### FRAME 7: Email Verification Success
- **Success illustration** (checkmark in circle)
- **Title:** "Email Verified!"
- **Message:** "Your email has been successfully verified"
- **Continue button** (Primary Blue) – goes to Home Feed

---

#### FRAME 8: Forgot Password Request
- **Back arrow** top-left
- **Title:** "Reset Password"
- **Message:** "Enter your email and we'll send you a reset link"
- **Email field**
- **Send Reset Link button** (Primary Blue, full width)
- **Remember password? Login** link

---

#### FRAME 9: Reset Password Form
- **Title:** "Create new password"
- **Message:** "Enter your new password below"
- **Form fields:**
  - New Password (with requirements hint)
  - Confirm New Password
- **Reset Password button** (Primary Blue, full width)

---

#### FRAME 10: Password Reset Success
- **Success illustration** (checkmark)
- **Title:** "Password Reset!"
- **Message:** "Your password has been successfully changed"
- **Login button** (Primary Blue)

---

### MAIN PAGES (10+ frames):

---

#### FRAME 11: Home Feed / Dashboard
- **Header:** Logo, search bar (icon on mobile), notification icon, user avatar
- **Categories/Topics chips** (horizontal scroll on mobile)
- **Feed of questions** (cards)
- Each card shows:
  - Question title (Bold, Text Dark)
  - Preview/excerpt (2 lines, Text Gray)
  - Author avatar + name (small)
  - Vote count (with up arrow)
  - Answer count (with message icon)
  - Tags (chips)
- **Sidebar** (tablet/desktop): Trending topics, top contributors
- **Bottom navigation** (mobile) with: Home, Search, Ask, Notifications, Profile
- **Desktop:** Left sidebar with navigation menu

---

#### FRAME 12: Question Detail Page
- **Back arrow** (mobile) or breadcrumbs (desktop)
- **Question section:**
  - Title (Heading)
  - Full description (Body text)
  - Author info: avatar, name, reputation, date posted
  - Tags (chips)
  - Vote buttons (up/down) with count
  - Bookmark/save button (icon)
- **Answers section:**
  - Answer count header
  - List of answers
  - Each answer: author avatar, name, reputation, content, date, votes, reply button
  - "Write an answer" input at bottom (expands on focus)
- **Related questions** sidebar (tablet/desktop)

---

#### FRAME 13: Ask Question Form
- **Title:** "Ask a question"
- **Form fields:**
  - Question title (with character counter: max 150 chars)
  - Detailed description (rich text editor placeholder – can be simple textarea for now)
  - Category/topic dropdown
  - Tags input (type and press Enter to add)
  - Attach image/file button
- **Preview option** (toggle)
- **Submit button** (Primary Blue)
- **Similar questions suggestion box** (shows while typing title)

---

#### FRAME 14: User Profile Page
- **Cover photo** (simple Primary Dark gradient)
- **Profile avatar** (circle, large)
- **User name** and **username**
- **Bio** (short description)
- **Stats:** Questions asked (125), Answers given (340), Reputation (2.4k)
- **Follow/Message buttons** (for other users) or **Edit Profile** (for own profile)
- **Tabs:** Overview, Questions, Answers, Saved
- **Grid of user's recent contributions:**
  - Recent questions (cards)
  - Recent answers (cards)
- **Achievements/badges** section (optional)

---

#### FRAME 15: Edit Profile Page
- **Profile picture upload** (circle with camera icon, upload overlay)
- **Form fields:**
  - Full Name
  - Username
  - Bio (textarea, with character count)
  - Location
  - Website (optional)
  - Expertise areas (chips – click to add/remove)
- **Save Changes button** (Primary Blue)
- **Cancel link**

---

#### FRAME 16: Topics/Categories Explorer
- **Title:** "Explore Topics"
- **Search/filter** bar (with icon)
- **Grid of category cards:**
  - Technology (icon: 💻) – 12.3k questions
  - Programming (icon: 👨‍💻) – 8.7k questions
  - Artificial Intelligence (icon: 🤖) – 5.2k questions
  - Data Science (icon: 📊) – 4.1k questions
  - Mathematics (icon: ➗) – 3.8k questions
  - Physics (icon: ⚛️) – 2.9k questions
  - Literature (icon: 📚) – 2.5k questions
  - History (icon: 🏛️) – 2.1k questions
  - Arts (icon: 🎨) – 1.8k questions
  - Business (icon: 💼) – 1.6k questions
- Each card: icon, name, question count, follow button (small)
- **Follow/Unfollow button** on each card (blue when following)
- Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop

---

#### FRAME 17: Search Results Page
- **Search bar** at top (with current query pre-filled)
- **Filter chips:** All, Questions, Answers, Users, Tags (scrollable)
- **Results count:** "About 124 results"
- **Sort by dropdown:** Relevance, Recent, Votes
- **Results list:**
  - Questions results (with preview, votes, answers, tags)
  - People results (avatar, name, expertise, reputation, Follow button)
  - Tags results (tag name, question count, Follow button)
- **Pagination** or infinite scroll

---

#### FRAME 18: Notifications Center
- **Title:** "Notifications"
- **Tabs:** All, Mentions, Answers, Updates
- **Notification list:**
  - 🔔 "JohnDoe answered your question" – 2 hours ago
  - 💬 "Sarah mentioned you in a comment" – yesterday
  - ⬆️ "Your question got 10 upvotes" – 2 days ago
  - 👤 "Alex started following you" – 3 days ago
  - ✅ "Your answer was accepted" – 5 days ago
- **Read/unread indicators:** Unread have blue dot and bold text
- **Mark all as read** button (top-right)
- **Empty state:** Illustration with "No notifications yet"

---

#### FRAME 19: Saved / Bookmarked Content
- **Title:** "Saved items"
- **Tabs:** Questions, Answers, Collections
- **Grid/list view toggle**
- **Each saved item:**
  - Question: Title, author, preview, date saved, remove icon
  - Answer: Question title, answer preview, author, remove icon
- **Search within saved** bar
- **Create collection** button
- **Empty state:** Illustration with "Save questions to read later"

---

#### FRAME 20: Settings & Account Management
- **Title:** "Settings"
- **Sections:**
  - **Profile Settings:** (link to Edit Profile)
  - **Account Preferences:**
    - Email notifications (toggle switches)
    - Language selection (dropdown)
    - Dark Mode toggle
  - **Privacy Settings:**
    - Private account (toggle)
    - Show email on profile (toggle)
    - Who can message me (dropdown)
  - **Security:**
    - Change Password (link)
    - Two-factor authentication (toggle)
  - **Danger zone:** 
    - Delete account button (red)
    - Warning modal on click
- **Logout button** (bottom, gray outline)
- **Save Changes button** at top/bottom

---

#### FRAME 21 (Optional): About Page
- Company/Platform info
- Mission statement
- Team section (placeholder)
- Contact info

#### FRAME 22 (Optional): Help/FAQ
- Search help articles
- FAQ accordions
- Contact support button

---

## ✅ DEVICE-SPECIFIC ADAPTATIONS:

### For Mobile (375×812):
- Single column everywhere
- Full width elements
- Bottom navigation bar (Home, Search, Ask, Notifications, Profile)
- Stacked vertically
- 2-column grid for interests/categories
- 16px margins
- Hamburger menu for more options

### For Tablet (768×1024):
- 2-3 columns where appropriate
- Centered cards for forms (max width 550px)
- Sidebar can be collapsible (hamburger icon)
- 24px margins
- 3-column grid for categories
- Left navigation as column or top tabs

### For Desktop (1440×1024):
- Multi-column layouts (3-4 columns)
- Split views common (left sidebar + main content + right sidebar)
- Permanent left navigation sidebar
- Hover states on all interactive elements
- 32px+ margins
- 4-column grid for categories
- Max-width container 1200px (centered)
- Breadcrumbs for navigation

---

## 🧩 COMPONENTS TO CREATE (Reusable):

Please create these as components in Figma:

1. **Button** (Primary, Secondary, Outline, Text)
2. **Input field** (Default, Focus, Error, Disabled)
3. **Card** (Question card, Profile card, Category card)
4. **Navigation** (Bottom nav mobile, Sidebar desktop)
5. **Chip/Tag** (Default, Selected, Category)
6. **Avatar** (Small, Medium, Large, with badge)
7. **Modal/Dialog** (Delete confirmation, etc.)
8. **Toast/Alert** (Success, Error, Warning)
9. **Tab bar** (Top tabs)
10. **Progress bar** (For signup flow)

---

## 📋 FINAL CHECKLIST:

- [ ] **Mobile Section:** 20+ frames (Authentication 10 + Main Pages 10+) – 375×812
- [ ] **Tablet Section:** 20+ frames (same content, tablet layout) – 768×1024
- [ ] **Desktop Section:** 20+ frames (same content, desktop layout) – 1440×1024
- [ ] All frames arranged vertically: Mobile → Tablet → Desktop
- [ ] Colors exactly as specified (#2563EB, #F9FAFB, etc.)
- [ ] Fonts are Inter with correct sizes per device
- [ ] Button/input heights consistent (56px)
- [ ] Each device has unique layout adapted to screen size
- [ ] All elements built manually – no images as backgrounds
- [ ] Text is real text layers – editable
- [ ] Layers organized and named (Mobile/Frame1_Login, etc.)
- [ ] Auto Layout used where appropriate
- [ ] Components created for reuse

---

## ✅ DELIVERABLE:

One Figma file containing:
- 📱 **Mobile section:** 20+ frames (375×812) – stacked vertically at top
- 📟 **Tablet section:** 20+ frames (768×1024) – stacked vertically below mobile
- 🖥️ **Desktop section:** 20+ frames (1440×1024) – stacked vertically below tablet

**Total: 60+ frames** with complete authentication + main pages.

Please confirm you understand and can deliver this.

Thank you!