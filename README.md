🔖 Smart Bookmark App

A modern, full-stack bookmark manager built with Next.js, Supabase, and Framer Motion.

Users can securely save, manage, and delete personal bookmarks with real-time updates and automatic metadata extraction.

# Live Demo

👉 https://smart-bookmark-app-beta-lilac.vercel.app

# Tech Stack
	•	Frontend: Next.js 14 (App Router)
	•	Backend: Supabase (Postgres + Auth + Realtime)
	•	Authentication: Google OAuth (Supabase Auth)
	•	Styling: Tailwind CSS
	•	Animations: Framer Motion
	•	Metadata Extraction: Microlink API
	•	Deployment: Vercel

# Features
	•	 Google Authentication
	•	 Real-time bookmark syncing
	•	 Auto-fetch website metadata (title)
	•	 Debounced metadata API calls
	•	 Smooth UI animations with Framer Motion
	•	 Delete confirmation modal
	•	 Row-Level Security (RLS) enforced per user

# Challenges & Solutions

1. Realtime Updates Not Syncing

Problem: Bookmarks didn’t update instantly across tabs.
Solution:
Implemented Supabase postgres_changes subscription inside a custom useBookmarks hook.

2. Excessive Metadata API Calls

Problem: Metadata API triggered on every keystroke.
Solution:
Implemented 800ms debounce inside useMetadata hook.

3. Large Component File

Problem: Dashboard became difficult to maintain.
Solution:
Refactored into:
	•	useBookmarks (data logic)
	•	useMetadata (API logic)
	•	DeleteModal (UI component)

Improved separation of concerns and readability.

4. Secure User Data

Problem: Prevent users from seeing others’ bookmarks.
Solution:
Used Supabase Row-Level Security (RLS) with user_id filtering.

5. Prevent Overwriting User Title

Problem: Metadata replaced manually entered title.
Solution:
Auto-fill title only when title field is empty.

# Local Setup

```sh
git clone https://github.com/leahfrancis/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```
Run:
```sh
npm run dev
```
# Author

Leah Francis
Full Stack Developer
