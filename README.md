# About Time

AI-powered scheduling buddy - A personal scheduling assistant that helps you create weekly and monthly schedules using intelligent AI recommendations.

## Features

- **AI-Powered Scheduling**: Uses Google Gemini API to generate personalized schedules
- **Context-Aware**: Understands your preferences, work hours, and recurring commitments
- **Beautiful UI**: Modern interface built with Next.js and shadcn/ui
- **Export & Share**: Download schedules as PDF or send via email
- **Flexible Planning**: Generate weekly or monthly schedules with easy refinement

## Tech Stack

- **Monorepo**: pnpm Workspaces
- **Frontend**: Next.js 16+, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js 24, Express, TypeScript, Mongoose
- **Database**: MongoDB Atlas (free tier)
- **AI**: Google Gemini API
- **Email**: SendGrid (free tier)
- **PDF**: Puppeteer

## Project Structure

```
about-time/
├── packages/
│   ├── backend/          # Express API server
│   └── frontend/         # Next.js web application
├── pnpm-workspace.yaml   # pnpm workspace config
└── package.json          # Root package with workspaces
```

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- pnpm >= 11.x
- MongoDB Atlas account (free tier)
- Google Gemini API key
- SendGrid API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd about-time
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables (see Environment Variables section)

4. Run development servers:
```bash
# Run both frontend and backend
pnpm dev

# Or run individually
pnpm dev:backend
pnpm dev:frontend
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-email@domain.com
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Available Scripts

- `pnpm dev` - Run both frontend and backend in parallel
- `pnpm dev:backend` - Run backend only
- `pnpm dev:frontend` - Run frontend only
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean all node_modules and build artifacts

## Deployment

The project can be deployed using:
- **Kubernetes**: minikube (local) or Oracle Cloud Free Tier (production)
- **Alternative**: Railway (backend) + Vercel (frontend)

## License

MIT

## Contributing

This is a personal project, but feel free to fork and adapt for your own use!
