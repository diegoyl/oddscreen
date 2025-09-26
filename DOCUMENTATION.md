# OddsScreen Next.js Migration Documentation

## Overview
This project has been migrated from a React + Express.js setup to Next.js for easier deployment on Vercel.

## Key Changes

### Port Configuration
- **Development**: Runs on port 3000 (Next.js default)
- **API Routes**: Available at `/api/oddsAPI/*` endpoints
- **Previous**: Express server on port 4000, React on port 3000
- **Now**: Everything runs on port 3000

### API Endpoints
All API endpoints have been converted from Express routes to Next.js API routes:

- `GET /api/oddsAPI` - Main odds fetching endpoint
- `GET /api/oddsAPI/gamedict` - Get saved game data
- `GET /api/oddsAPI/reqs` - Get API request usage
- `GET /api/oddsAPI/pullcsv` - Get CSV data
- `GET /api/oddsAPI/pulltracking` - Get tracking data
- `GET /api/oddsAPI/pullwantdict` - Get want dictionary
- `POST /api/oddsAPI/storetracking` - Store tracking data
- `POST /api/oddsAPI` - Store want dictionary

### Environment Variables
Create a `.env.local` file in the root directory with:

```
DB_URI=your_mongodb_connection_string
API_KEY=your_odds_api_key
```

### MongoDB Setup
1. **Option A**: Use existing MongoDB (update connection string)
2. **Option B**: Set up MongoDB Atlas (recommended for Vercel deployment)

### Development Commands
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `DB_URI`
   - `API_KEY`
4. Deploy

### File Structure
```
src/
├── app/
│   ├── api/oddsAPI/     # API routes
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components (to be migrated)
└── lib/
    └── schemas.ts       # MongoDB schemas
```

### Migration Status
- ✅ Next.js project structure
- ✅ API routes converted
- ✅ MongoDB schemas
- ✅ React components (basic structure)
- ⏳ Environment setup
- ⏳ MongoDB connection testing
- ⏳ Full component migration
- ⏳ Testing

### Notes
- All hardcoded `localhost:4000` URLs have been removed
- API calls now use relative paths (`/api/oddsAPI`)
- MongoDB connection is handled in each API route
- TypeScript is enabled for better development experience
