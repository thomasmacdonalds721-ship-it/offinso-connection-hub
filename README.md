# Offinso Connection Hub

The official community portal for Offinso, Ghana — thecommunityhub.online

## Features
- Job listings and applications (with gig support)
- Community auction floor with real-time bidding
- Charity and relief program applications
- School Supplies relief program
- Travel abroad inquiry
- Community events (Beauty Pageant, etc.)
- Health & safety resources
- Literacy programs with full course syllabus
- Agricultural sector support
- Social development programs
- English / Twi language toggle
- Dark mode

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Supabase (database, auth, real-time)
- Deployed on Netlify

## Local Development

1. Install dependencies:
   npm install

2. Create .env.local file:
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

3. Start dev server:
   npm run dev

4. Open http://localhost:3000

## Deployment
Hosted on Netlify with auto-deploy from GitHub main branch.
Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify
environment variables.
