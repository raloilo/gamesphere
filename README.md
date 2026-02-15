# GameSphere - Your Ultimate Gaming Platform

A comprehensive full-stack gaming platform built with React, Node.js, Express, and MongoDB.

## Features

### Home Page
- Latest gaming news
- Trending and popular games (GTA V, God of War, Horizon Forbidden West, Forza Horizon, etc.)
- Clean, modern gaming-inspired UI

### Upcoming Games
- List of upcoming major titles (GTA VI, Battlefield VI, etc.)
- Game name, release date, platforms, images, and descriptions

### Games Library
- Browse popular and classic games
- Rating system, category, and recent updates
- Search bar and filters (category, platform, sort)

### Game Details
- Comprehensive game information
- Screenshots, trailers, community ratings
- Latest news and updates

### User Features
- Registration and login
- Rate and review games
- Bookmark favorite games
- Notification system for new releases and updates

### Admin Panel
- Manage game listings, news, and updates
- Add or remove content

### Technical
- React frontend with Vite
- Node.js + Express backend
- MongoDB database
- Responsive design (mobile & desktop)
- API ready for real-time gaming news integration

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd GameSphere/backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Seed Database

```bash
cd GameSphere/backend
node seed.js
```

This creates sample games, news, and an admin user:
- **Admin:** admin@gamesphere.com / admin123

### Frontend

```bash
cd GameSphere/frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user (protected)

### Games
- `GET /api/games` - List games (filters: search, category, platform, sort)
- `GET /api/games/trending` - Trending games
- `GET /api/games/upcoming` - Upcoming games
- `GET /api/games/:slug` - Game details
- `GET /api/games/:id/reviews` - Game reviews
- `POST /api/games/:id/reviews` - Add review (protected)

### News
- `GET /api/news` - List news (limit, category, featured)
- `GET /api/news/:slug` - Single news

### Users (protected)
- `GET /api/users/bookmarks` - User bookmarks
- `POST /api/users/bookmarks/:gameId` - Toggle bookmark
- `GET /api/users/notifications` - Notifications
- `PATCH /api/users/notifications/:id/read` - Mark read

### Admin (admin only)
- `GET/POST/PUT/DELETE /api/admin/games`
- `GET/POST/PUT/DELETE /api/admin/news`
- `GET /api/admin/stats`

## Project Structure

```
GameSphere/
├── backend/
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── api.js
│   └── vite.config.js
└── README.md
```

## License

MIT
