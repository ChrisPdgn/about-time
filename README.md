# About Time

AI-powered scheduling buddy - A personal scheduling assistant that helps you create weekly and monthly schedules using intelligent AI recommendations.

## 🚀 Features

- **AI-Powered Scheduling**: Uses Google Gemini API to generate personalized schedules
- **Context-Aware**: Understands your preferences, work hours, and recurring commitments
- **Beautiful UI**: Modern interface built with Next.js and shadcn/ui
- **Export & Share**: Download schedules as PDF or send via email
- **Flexible Planning**: Generate weekly or monthly schedules with easy refinement

## 🛠 Tech Stack

- **Monorepo**: Yarn Workspaces + Lerna
- **Frontend**: Next.js 14+, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Database**: MongoDB Atlas (free tier)
- **AI**: Google Gemini API
- **Email**: SendGrid (free tier)
- **PDF**: Puppeteer

## 📦 Project Structure

```
about-time/
├── packages/
│   ├── backend/     # Express API server
│   └── frontend/    # Next.js web application
├── k8s/             # Kubernetes manifests
├── lerna.json       # Lerna configuration
└── package.json     # Root package with workspaces
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0
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
yarn install
```

3. Set up environment variables (see Environment Variables section)

4. Run development servers:
```bash
# Run both frontend and backend
yarn dev

# Or run individually
yarn dev:backend
yarn dev:frontend
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-email@domain.com
NODE_ENV=development
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📜 Available Scripts

- `yarn dev` - Run both frontend and backend in parallel
- `yarn dev:backend` - Run backend only
- `yarn dev:frontend` - Run frontend only
- `yarn build` - Build all packages
- `yarn lint` - Lint all packages
- `yarn clean` - Clean all node_modules

## 🚢 Deployment

The project can be deployed using:
- **Kubernetes**: minikube (local) or Oracle Cloud Free Tier (production)
- **Alternative**: Railway (backend) + Vercel (frontend)

See the `/k8s` directory for Kubernetes manifests.

## 📝 License

MIT

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

