# Getting Started with About Time

This guide will help you set up and run the About Time application locally.

## Prerequisites

- Node.js >= 24.0.0 (use [nvm](https://github.com/nvm-sh/nvm): `nvm install 24 && nvm use 24`)
- pnpm >= 11.x (`npm install -g pnpm`)
- MongoDB Atlas account (free tier)
- Google Gemini API key (free tier)
- SendGrid API key (free tier)

## Step 1: Install Dependencies

```bash
cd about-time
pnpm install
```

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Create a database user with a password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 3: Get Google Gemini API Key

1. Go to https://ai.google.dev/
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key for later use

## Step 4: Get SendGrid API Key

1. Go to https://signup.sendgrid.com/
2. Create a free account
3. Verify your email address
4. Go to Settings > API Keys
5. Create a new API key with "Mail Send" permissions
6. Verify a sender email address (Settings > Sender Authentication)

## Step 5: Configure Environment Variables

### Backend Environment Variables

Create `packages/backend/.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/abouttime?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key-here
SENDGRID_API_KEY=your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=your-verified-email@domain.com
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Replace the placeholder values with your actual credentials.

### Frontend Environment Variables

Create `packages/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Step 6: Run the Application

### Option 1: Run Both Services Together

```bash
pnpm dev
```

This will start both the backend (port 3001) and frontend (port 3000) in parallel.

### Option 2: Run Services Separately

Terminal 1 - Backend:
```bash
pnpm dev:backend
```

Terminal 2 - Frontend:
```bash
pnpm dev:frontend
```

## Step 7: Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend Health Check: http://localhost:3001/health

## Step 8: Test the Application

1. **Register a new account** at http://localhost:3000/register
2. **Set your context** by going to "Set Context" from the dashboard
   - Configure your planning strictness
   - Add learning goals
   - Set your work schedule
   - Add recurring activities (like gym)
3. **Generate a schedule** by clicking "Generate Schedule"
   - Choose weekly or monthly
   - Select date range
   - Add any additional requirements
4. **View and export** your generated schedule
   - Download as PDF
   - Send via email

## Common Issues

### MongoDB Connection Error
- Make sure your IP is whitelisted in MongoDB Atlas
- Check that your connection string is correct
- Verify your database user credentials

### Gemini API Error
- Ensure your API key is valid
- Check that you haven't exceeded the free tier limits (60 req/min, 1500 req/day)

### SendGrid Email Not Sending
- Verify that your sender email is authenticated in SendGrid
- Check that your API key has "Mail Send" permissions
- Make sure you're not exceeding the free tier limit (100 emails/day)

### Port Already in Use
If ports 3000 or 3001 are already in use, you can change them:
- Backend: Change `PORT` in `.env`
- Frontend: Run with `pnpm dev:frontend -- -p 3002`

### Auth / Cookie Issues
Session authentication uses httpOnly cookies. If you're testing across different origins or with tools like Postman, make sure:
- The backend `FRONTEND_URL` env var matches your frontend's actual URL
- Your HTTP client sends credentials (`withCredentials: true` / `--cookie-jar`)

## Project Structure

```
about-time/
├── packages/
│   ├── backend/          # Express API
│   │   ├── src/
│   │   │   ├── routes/     # API routes
│   │   │   ├── models/     # Mongoose models
│   │   │   ├── services/   # Business logic
│   │   │   └── middleware/ # Auth middleware
│   │   └── .env            # Backend config (create this)
│   └── frontend/         # Next.js app
│       ├── app/            # App Router pages
│       ├── components/     # UI components
│       ├── lib/            # Utilities
│       └── .env.local      # Frontend config (create this)
├── pnpm-workspace.yaml   # pnpm workspace config
└── package.json          # Root package

```

## Next Steps

After getting the application running locally:

1. **Docker Containerization**: Create Dockerfiles for both services
2. **Kubernetes Deployment**: Create K8s manifests for local deployment with minikube
3. **Production Deployment**: Deploy to Oracle Cloud free tier or Railway/Vercel

See `README.md` and `PROGRESS.md` for more details about the project.

## Support

If you encounter any issues:
1. Check the terminal logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all external services (MongoDB, Gemini, SendGrid) are configured properly
