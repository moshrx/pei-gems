# PEI Local Backend

Node.js + Express + MongoDB API for PEI Local Business Directory

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with your MongoDB URI:
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/pei-local
PORT=5000
```

3. Run development server:
```bash
npm run dev
```

Server runs on http://localhost:5000

## API Endpoints

### Businesses
- `GET /api/businesses` - List all (with filters)
- `GET /api/businesses/:id` - Get one
- `POST /api/businesses` - Create
- `PUT /api/businesses/:id` - Update

### Reviews
- `GET /api/reviews/business/:businessId` - Get reviews
- `POST /api/reviews` - Create review

## Database (MongoDB Atlas)

1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Paste in .env.local
