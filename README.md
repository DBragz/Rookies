# Rookies - Live Sports Streaming & Betting Platform

A dynamic social sports betting platform leveraging interactive geospatial technology to connect users with live sporting events.

## 🏆 Authors

**Daniel Ribeirinha-Braga** - Project Creator  
**[Editor](https://github.com/replit)** - Development Assistant

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Components](#components)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)

## 🎯 Overview

Rookies is a full-stack web application that combines live sports streaming with real-time betting functionality. Users can discover sporting events through an interactive map interface, watch live streams, place bets, and interact with other users through chat and social features.

## ✨ Features

### Core Features
- **Interactive Map Interface** - Leaflet-based map with multiple layer options (Street, Satellite, Dark Mode, Terrain)
- **Live Sports Streaming** - Real-time video streaming with overlay statistics
- **Real-time Betting System** - Place bets on live sporting events with dynamic odds
- **Social Features** - User profiles, friends system, and leaderboards
- **Live Chat** - Real-time messaging during streams via WebSocket
- **Mobile Responsive** - Optimized for both desktop and mobile devices

### User Interface
- **Modern Design** - Glassmorphism effects with gradient backgrounds
- **Dark Theme** - DraftKings-style aesthetic with green accents
- **Custom Markers** - Modern gradient markers with sport-specific emojis
- **Interactive Popups** - Enhanced venue information with action buttons

### Technical Features
- **WebSocket Integration** - Real-time communication for chat and betting
- **In-Memory Storage** - Fast data operations with seeded mock data
- **Query Optimization** - TanStack Query for efficient data fetching
- **Form Validation** - Zod schema validation with React Hook Form
- **Type Safety** - Full TypeScript implementation

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling with validation
- **Leaflet** - Interactive maps

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **WebSocket (ws)** - Real-time communication
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Schema validation

### Database & Storage
- **PostgreSQL** - Primary database (with in-memory fallback)
- **In-Memory Storage** - Development and testing

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rookies
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

The application will automatically start both the Express backend and Vite frontend on the same port.

## 📁 Project Structure

```
rookies/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── Header.tsx
│   │   │   ├── FullScreenMap.tsx
│   │   │   └── ...
│   │   ├── pages/         # Application pages
│   │   │   ├── home.tsx
│   │   │   ├── profile.tsx
│   │   │   └── not-found.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main application component
│   └── index.html
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   └── vite.ts           # Vite integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
├── components.json       # shadcn/ui configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🔌 API Endpoints

### Users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/bets` - Get user's betting history
- `GET /api/users/:id/friends` - Get user's friends list

### Streams
- `GET /api/streams/:id` - Get stream details
- `GET /api/streams/:id/stats` - Get real-time stream statistics
- `GET /api/streams/:id/bet-options` - Get available betting options
- `GET /api/streams/:id/messages` - Get stream chat messages

### Betting
- `POST /api/users/:id/bets` - Place a new bet
- `GET /api/leaderboard` - Get daily leaderboard

### WebSocket Events
- `chat` - Real-time chat messages
- `bet_placed` - Betting notifications
- `stats_update` - Live statistics updates

## 🗄 Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - User email
- `balance` - Account balance
- `avatar` - Avatar initials
- `totalWinnings` - Lifetime winnings
- `totalBets` - Total bets placed

### Streams Table
- `id` - Primary key
- `userId` - Stream owner
- `title` - Stream title
- `sport` - Sport type
- `isLive` - Live status
- `viewerCount` - Current viewers
- `location` - GPS coordinates

### Bets Table
- `id` - Primary key
- `userId` - Bettor ID
- `streamId` - Associated stream
- `betType` - Type of bet
- `amount` - Bet amount
- `odds` - Betting odds
- `status` - Bet status (pending/won/lost)

## 🧩 Components

### Core Components
- **Header** - Navigation bar with user info and balance
- **FullScreenMap** - Interactive Leaflet map with custom markers
- **LiveStream** - Video streaming component with overlays
- **BettingPanel** - Betting interface and options
- **ChatPanel** - Real-time chat functionality
- **Profile** - User profile and statistics

### UI Components
- **Button** - Styled button with variants
- **Card** - Container component with glassmorphism
- **Avatar** - User avatar display
- **Badge** - Status and category indicators
- **Input** - Form input fields
- **Dialog** - Modal dialogs

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
DATABASE_URL=your_postgresql_url (optional)
```

### Tailwind Configuration
The project uses custom CSS variables for theming:
- `--background` - Main background color
- `--accent-green` - Primary green accent
- `--accent-blue` - Blue accent color
- `--accent-orange` - Orange accent color

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing component structure
- Implement proper error handling
- Use the provided storage interface for data operations
- Maintain responsive design principles

### Adding New Features
1. Define data models in `shared/schema.ts`
2. Update storage interface in `server/storage.ts`
3. Create API routes in `server/routes.ts`
4. Build React components in `client/src/components/`
5. Add routing in `client/src/App.tsx`

## 🚀 Deployment

### Replit Deployment
The application is configured for Replit Deployments:

1. Ensure all code is committed
2. Use the deploy button in Replit
3. The application will be available under a `.replit.app` domain

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your preferred hosting platform

## 📝 Notes

- The application currently uses in-memory storage for development
- WebSocket connections handle real-time features
- Map markers use custom SVG icons with sport-specific styling
- The betting system includes mock data for demonstration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.