# 🎵 Corkboard - Hamilton Music Scene<h1 align="center">📍 Corkboard</h1>



Discover local music events happening around Hamilton. Corkboard is a full-stack web application that helps you find concerts, shows, and live music performances at Hamilton's best venues.## 🎧 Project Overview



## 🚀 Features**Corkboard** is a mobile-first app for discovering local music shows in Hamilton.



- **Event Discovery**: Browse 15+ curated Hamilton music eventsBreaking into the city’s live music scene can be tough, especially for students or newcomers. Corkboard makes it easy to discover indie gigs, pub shows, house events, and pop-up performances through a clean, map-based and timeline-based feed. The app curates content from community sources like Instagram, Facebook, and venue calendars, as well as users.

- **Detailed Views**: See event details including venue, time, description, and genres

- **Responsive Design**: Beautiful UI that works on desktop and mobile---

- **Real-time Data**: Events served from a PostgreSQL database via REST API

- **Fully Tested**: Comprehensive test coverage for frontend and backend### 🔑 Key Features (Planned for MVP)

- **Production Ready**: Docker and Kubernetes deployment configurations included- 📍 Map and timeline views of upcoming shows

- 🎫 Event detail pages with flyer, cost, genre, venue

## 🏗️ Architecture- 🧾 Show submission form with moderation queue

- 🔎 Filtering by genre, venue type, and date

```- 🧠 Personalized show recommendations (embeddings-based ranking)

┌─────────────┐      ┌─────────────┐      ┌─────────────┐- 🧑‍💻 Admin dashboard for curators

│   Next.js   │ ───> │   Express   │ ───> │ PostgreSQL  │

│  Frontend   │      │   Backend   │      │  Database   │---

│  (Port 3001)│ <─── │  (Port 3000)│ <─── │ (Port 5432) │

└─────────────┘      └─────────────┘      └─────────────┘### 🛠️ Technologies

```- **Frontend:** React Native, TailwindCSS

- **Backend:** Firebase (Auth, Firestore, Cloud Functions)

### Tech Stack- **Hosting:** Firebase Hosting

- **Map SDK:** Google Maps SDK

**Frontend** (`web-frontend/`)- **Storage:** Firebase Storage or Cloudinary

- Next.js 16 with App Router- **Search / ML:** OpenAI embeddings, Pinecone or ChromaDB

- TypeScript- **External APIs:** Spotify Web API, IG scraping (optional), Eventbrite (optional)

- Tailwind CSS

- shadcn/ui components---

- Jest + React Testing Library## Contributors :handshake:



**Backend** (`backend/`)| Contributor                                                                                                     | Expertise & Tools                                                                                                                                                                                                                                   | Notable Contributions                                                                                                                                                        |

- Node.js + Express| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

- PostgreSQL with pg driver| [**Harrison Johns**](https://github.com/johnsh9656) <br/><i>Project Lead</i> |  |  |

- CORS-enabled REST API| [**Ian Yeh**](https://github.com/ian-yeh) <br/><i>Frontend Team</i> | | |

- Jest + Supertest| [**Billy Wu**](https://github.com/Billy423) <br/><i>Backend Developer</i> |  |  |  |

| [**Alex Horton**](https://github.com/needlesndpins)<br/><i>Backend Developer</i> |  |  |  |

**Database**| [**Mila Serafimovska**](https://github.com/mila-sera) <br/><i> Frontend Team</i> |  |  |  |

- PostgreSQL 15| [**Yanna Lazarova**](https://github.com/yanna-nl) <br/><i>Frontend Team</i> | | |

- 15 seeded Hamilton music events| [**Austin Bray**](https://github.com/austinbray77) <br/><i>Backend Developer</i> |  |  |  |

- Tables: events, users| [**Shiv Patel**](https://github.com/Shiv-sp) <br/><i>Frontend Developer</i> |  |  |  |

| [**Ahmed Zafar**](https://github.com/ahmed-z5645) <br/><i>Backend Developer</i> |  |  |  |

**DevOps**| [**Angela Fernando**](https://github.com/angefern)<br/><i>Backend Developer</i> |  |  |  |

- Docker & Docker Compose|  |  |  |  |

- Kubernetes manifests

- Health checks and probes## For More Information.....

- Multi-stage builds### [View the Project Roadmap](./PROJECT-ROADMAP.md)



## 🚀 Quick Start



### Option 1: Docker Compose (Recommended)



```bash

# Start everything (database + backend + frontend)

docker compose up -d



# View logs
docker compose logs -f

# Stop all services
docker compose down
```

Access the application:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### Option 2: Local Development

#### Prerequisites
- Node.js 20+
- PostgreSQL 15
- npm or yarn

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start PostgreSQL
docker compose up -d

# Start backend server
npm start

# Run tests
npm test
```

#### Frontend Setup

```bash
cd web-frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test
```

## 📁 Project Structure

```
corkboard-open-source/
├── backend/                    # Express API server
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   ├── Dockerfile             # Backend container
│   ├── docker-compose.yml     # Local DB setup
│   ├── __tests__/             # Jest tests
│   ├── initdb/
│   │   └── init.sql           # Database schema + seed data
│   └── k8s/                   # Kubernetes manifests
│       ├── backend-deployment.yaml
│       ├── postgres-deployment.yaml
│       ├── postgres-secret.yaml
│       ├── postgres-pvc.yaml
│       ├── postgres-configmap.yaml
│       └── seed-job.yaml
│
├── web-frontend/              # Next.js web app
│   ├── app/                   # App router pages
│   │   ├── page.tsx          # Home page (event list)
│   │   └── events/[id]/      # Event detail page
│   ├── components/            # React components
│   │   ├── event-card.tsx
│   │   ├── ui/               # shadcn/ui components
│   │   └── __tests__/        # Component tests
│   ├── lib/
│   │   └── api-client.ts     # API integration
│   ├── types/
│   │   └── api.ts            # TypeScript types
│   ├── Dockerfile            # Frontend container
│   └── k8s/
│       └── frontend-deployment.yaml
│
├── docker-compose.yml         # Full stack orchestration
├── PROJECT-ROADMAP.md         # Project planning
├── PROJECT-ROADMAP-MVP.md     # MVP implementation guide
└── README.md                  # This file
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Test coverage includes:
- ✅ API endpoint tests
- ✅ Database query mocking
- ✅ Error handling
- ✅ Health checks

### Frontend Tests

```bash
cd web-frontend
npm test
```

Test coverage includes:
- ✅ Component rendering
- ✅ User interactions
- ✅ API integration
- ✅ Error states

## 🐳 Docker Deployment

### Build Images

```bash
# Build all images
docker compose build

# Or build individually
docker build -t corkboard-backend:latest ./backend
docker build -t corkboard-frontend:latest ./web-frontend
```

### Run Containers

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop services
docker compose down

# Clean up volumes
docker compose down -v
```

## ☸️ Kubernetes Deployment

### Prerequisites
- kubectl configured
- Kubernetes cluster running (minikube, kind, or cloud provider)

### Deploy Database

```bash
# Create namespace (optional)
kubectl create namespace corkboard

# Deploy Postgres
kubectl apply -f backend/k8s/postgres-secret.yaml
kubectl apply -f backend/k8s/postgres-pvc.yaml
kubectl apply -f backend/k8s/postgres-deployment.yaml

# Seed database
kubectl apply -f backend/k8s/postgres-configmap.yaml
kubectl apply -f backend/k8s/seed-job.yaml

# Wait for seed job
kubectl wait --for=condition=complete job/postgres-seed-job --timeout=60s
```

### Deploy Backend

```bash
# Build and load image (for local clusters like minikube)
docker build -t corkboard-backend:latest ./backend
minikube image load corkboard-backend:latest  # if using minikube

# Deploy
kubectl apply -f backend/k8s/backend-deployment.yaml

# Check status
kubectl get pods -l app=backend
kubectl logs -l app=backend
```

### Deploy Frontend

```bash
# Build and load image
docker build -t corkboard-frontend:latest ./web-frontend
minikube image load corkboard-frontend:latest  # if using minikube

# Deploy
kubectl apply -f web-frontend/k8s/frontend-deployment.yaml

# Check status
kubectl get pods -l app=frontend
```

### Access Services

```bash
# Port forward to access locally
kubectl port-forward svc/frontend-svc 3001:3001
kubectl port-forward svc/backend-svc 3000:3000

# Or use LoadBalancer/NodePort
kubectl get svc
```

## 🔧 API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

#### Get All Events
```http
GET /events
```

Response:
```json
{
  "count": 15,
  "events": [
    {
      "id": 1,
      "title": "Indie Night at The Casbah",
      "description": "Local indie bands showcase...",
      "venue_name": "The Casbah",
      "venue_address": "306 King St W, Hamilton, ON",
      "latitude": "43.2557",
      "longitude": "-79.8711",
      "start_time": "2025-11-15T20:00:00-05:00",
      "end_time": "2025-11-15T23:30:00-05:00",
      "genre_tags": ["indie", "rock", "alternative"],
      "thumbnail_url": null,
      "created_at": "2025-10-30T00:00:00Z"
    }
  ]
}
```

#### Get Event by ID
```http
GET /events/:id
```

#### Filter by Genre
```http
GET /events/genre/:genre
```

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-10-30T00:00:00Z"
}
```

## 🌐 Environment Variables

### Backend

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corkboard
DB_USER=postgres
DB_PASSWORD=postgrespw
PORT=3000
```

### Frontend

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
PORT=3001
```

## 📝 Development Workflow

1. **Start Database**
   ```bash
   cd backend && docker compose up -d
   ```

2. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

3. **Start Frontend**
   ```bash
   cd web-frontend && npm run dev
   ```

4. **Run Tests**
   ```bash
   # Backend
   cd backend && npm test
   
   # Frontend
   cd web-frontend && npm test
   ```

5. **Build for Production**
   ```bash
   docker compose build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

- Built by DSC-McMaster-U
- Hamilton music venues and community
- shadcn/ui for beautiful components
- Next.js and React teams

---

**Made with ❤️ for the Hamilton music scene** 🎸
