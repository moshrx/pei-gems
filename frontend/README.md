# PEI Local Frontend

React + Vite + Tailwind UI for PEI Local Business Directory

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```
VITE_API_URL=http://localhost:5000
```

3. Run dev server:
```bash
npm run dev
```

App runs on http://localhost:3000

## Components

- `SearchBar` - Search & filter form
- `BusinessCard` - Business listing preview
- `RatingStars` - Star rating display/input

## Build for Production

```bash
npm run build
```

Then deploy to Vercel, Netlify, etc.
