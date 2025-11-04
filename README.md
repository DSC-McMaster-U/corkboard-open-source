# 🎵 Corkboard - Hamilton Music Scene# 🎵 Corkboard - Hamilton Music Scene<h1 align="center">📍 Corkboard</h1>



<h1 align="center">📍 Corkboard</h1>



Discover local music events happening around Hamilton. Corkboard is a full-stack web application that helps you find concerts, shows, and live music performances at Hamilton's best venues.Discover local music events happening around Hamilton. Corkboard is a full-stack web application that helps you find concerts, shows, and live music performances at Hamilton's best venues.## 🎧 Project Overview



## 🎧 Project Overview



**Corkboard** is a mobile-first app for discovering local music shows in Hamilton.## 🚀 Features**Corkboard** is a mobile-first app for discovering local music shows in Hamilton.



Breaking into the city's live music scene can be tough, especially for students or newcomers. Corkboard makes it easy to discover indie gigs, pub shows, house events, and pop-up performances through a clean, map-based and timeline-based feed.



## 🚀 Features- **Event Discovery**: Browse 15+ curated Hamilton music eventsBreaking into the city’s live music scene can be tough, especially for students or newcomers. Corkboard makes it easy to discover indie gigs, pub shows, house events, and pop-up performances through a clean, map-based and timeline-based feed. The app curates content from community sources like Instagram, Facebook, and venue calendars, as well as users.



- **Event Discovery**: Browse 15+ curated Hamilton music events- **Detailed Views**: See event details including venue, time, description, and genres

- **Detailed Views**: See event details including venue, time, description, and genres

- **Responsive Design**: Beautiful UI that works on desktop and mobile- **Responsive Design**: Beautiful UI that works on desktop and mobile---

- **Real-time Data**: Events served from a PostgreSQL database via REST API

- **API Gateway**: Nginx reverse proxy for unified access- **Real-time Data**: Events served from a PostgreSQL database via REST API

- **Fully Tested**: Comprehensive test coverage for frontend and backend

- **Production Ready**: Docker and Kubernetes deployment configurations included- **Fully Tested**: Comprehensive test coverage for frontend and backend### 🔑 Key Features (Planned for MVP)



## 🏗️ Architecture- **Production Ready**: Docker and Kubernetes deployment configurations included- 📍 Map and timeline views of upcoming shows



```- 🎫 Event detail pages with flyer, cost, genre, venue

                    ┌──────────────┐

                    │    Nginx     │## 🏗️ Architecture- 🧾 Show submission form with moderation queue

                    │   Gateway    │  ← Single Entry Point

                    │  (Port 80)   │- 🔎 Filtering by genre, venue type, and date

                    └──────┬───────┘

                           │```- 🧠 Personalized show recommendations (embeddings-based ranking)

              ┌────────────┴────────────┐

              │                         │┌─────────────┐      ┌─────────────┐      ┌─────────────┐- 🧑‍💻 Admin dashboard for curators

              ▼                         ▼

    ┌─────────────┐            ┌─────────────┐│   Next.js   │ ───> │   Express   │ ───> │ PostgreSQL  │

    │   Next.js   │            │   Express   │

    │  Frontend   │            │   Backend   ││  Frontend   │      │   Backend   │      │  Database   │---

    │ (Port 3001) │            │ (Port 3000) │

    └─────────────┘            └──────┬──────┘│  (Port 3001)│ <─── │  (Port 3000)│ <─── │ (Port 5432) │

                                      │

                                      ▼└─────────────┘      └─────────────┘      └─────────────┘### 🛠️ Technologies

                              ┌─────────────┐

                              │ PostgreSQL  │```- **Frontend:** React Native, TailwindCSS

                              │  Database   │

                              │ (Port 5432) │- **Backend:** Firebase (Auth, Firestore, Cloud Functions)

                              └─────────────┘

```### Tech Stack- **Hosting:** Firebase Hosting



**Gateway Routing:**- **Map SDK:** Google Maps SDK

- `http://localhost/` → Frontend (Next.js)

- `http://localhost/api/*` → Backend API (Express)**Frontend** (`web-frontend/`)- **Storage:** Firebase Storage or Cloudinary

- All services communicate internally via Docker network

- Next.js 16 with App Router- **Search / ML:** OpenAI embeddings, Pinecone or ChromaDB

### Tech Stack

- TypeScript- **External APIs:** Spotify Web API, IG scraping (optional), Eventbrite (optional)

**Gateway** (`gateway/`)

- Nginx 1.27 Alpine- Tailwind CSS

- Reverse proxy with load balancing

- Health checks- shadcn/ui components---

- Gzip compression

- Static file caching- Jest + React Testing Library## Contributors :handshake:



**Frontend** (`web-frontend/`)

- Next.js 16 with App Router

- TypeScript**Backend** (`backend/`)| Contributor                                                                                                     | Expertise & Tools                                                                                                                                                                                                                                   | Notable Contributions                                                                                                                                                        |

- Tailwind CSS 4

- shadcn/ui components- Node.js + Express| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

- Jest + React Testing Library

- PostgreSQL with pg driver| [**Harrison Johns**](https://github.com/johnsh9656) <br/><i>Project Lead</i> |  |  |

**Backend** (`backend/`)

- Node.js 20 + Express- CORS-enabled REST API| [**Ian Yeh**](https://github.com/ian-yeh) <br/><i>Frontend Team</i> | | |

- PostgreSQL with pg driver

- CORS-enabled REST API- Jest + Supertest| [**Billy Wu**](https://github.com/Billy423) <br/><i>Backend Developer</i> |  |  |  |

- Jest + Supertest

| [**Alex Horton**](https://github.com/needlesndpins)<br/><i>Backend Developer</i> |  |  |  |

**Database**

- PostgreSQL 15**Database**| [**Mila Serafimovska**](https://github.com/mila-sera) <br/><i> Frontend Team</i> |  |  |  |

- 15 seeded Hamilton music events

- Tables: events, users- PostgreSQL 15| [**Yanna Lazarova**](https://github.com/yanna-nl) <br/><i>Frontend Team</i> | | |



**DevOps**- 15 seeded Hamilton music events| [**Austin Bray**](https://github.com/austinbray77) <br/><i>Backend Developer</i> |  |  |  |

- Docker & Docker Compose

- Kubernetes manifests- Tables: events, users| [**Shiv Patel**](https://github.com/Shiv-sp) <br/><i>Frontend Developer</i> |  |  |  |

- Health checks and probes

- Multi-stage builds| [**Ahmed Zafar**](https://github.com/ahmed-z5645) <br/><i>Backend Developer</i> |  |  |  |



## 🚀 Quick Start**DevOps**| [**Angela Fernando**](https://github.com/angefern)<br/><i>Backend Developer</i> |  |  |  |



### Option 1: Docker Compose (Recommended)- Docker & Docker Compose|  |  |  |  |



```bash- Kubernetes manifests

# Start everything (database + backend + frontend + gateway)

docker compose up -d- Health checks and probes## For More Information.....



# View logs- Multi-stage builds### [View the Project Roadmap](./PROJECT-ROADMAP.md)

docker compose logs -f



# Stop all services

docker compose down## 🚀 Quick Start

```



**Access the application:**

- **Main Application**: http://localhost (via gateway)### Option 1: Docker Compose (Recommended)

- **Frontend**: http://localhost/ (served by gateway)

- **Backend API**: http://localhost/api/ (proxied by gateway)

- **Gateway Health**: http://localhost/health

- **Direct Backend** (debugging): http://localhost:3000```bash

- **Direct Frontend** (debugging): http://localhost:3001

# Start everything (database + backend + frontend)

### Option 2: Local Development

docker compose up -d

#### Prerequisites

- Node.js 20+

- PostgreSQL 15

- npm or yarn# View logs

docker compose logs -f

#### Backend Setup

# Stop all services

```bashdocker compose down

cd backend```



# Install dependenciesAccess the application:

npm install- **Frontend**: http://localhost:3001

- **Backend API**: http://localhost:3000

# Start PostgreSQL- **Database**: localhost:5432

docker compose up db -d

### Option 2: Local Development

# Start backend server

npm start#### Prerequisites

- Node.js 20+

# Run tests- PostgreSQL 15

npm test- npm or yarn

```

#### Backend Setup

#### Frontend Setup

```bash

```bashcd backend

cd web-frontend

# Install dependencies

# Install dependenciesnpm install

npm install

# Start PostgreSQL

# Set environment variabledocker compose up -d

export NEXT_PUBLIC_API_URL=http://localhost:3000

# Start backend server

# Start dev servernpm start

npm run dev

# Run tests

# Run testsnpm test

npm test```

```

#### Frontend Setup

## 📁 Project Structure

```bash

```cd web-frontend

corkboard-open-source/

├── gateway/                   # Nginx reverse proxy# Install dependencies

│   ├── nginx.conf            # Gateway configurationnpm install

│   ├── Dockerfile            # Gateway container

│   └── k8s/# Start dev server

│       └── gateway-deployment.yamlnpm run dev

│

├── backend/                   # Express API server# Run tests

│   ├── server.js             # Main server filenpm test

│   ├── package.json          # Dependencies```

│   ├── Dockerfile            # Backend container

│   ├── docker-compose.yml    # Local DB setup## 📁 Project Structure

│   ├── __tests__/            # Jest tests

│   ├── initdb/```

│   │   └── init.sql          # Database schema + seed datacorkboard-open-source/

│   └── k8s/                  # Kubernetes manifests├── backend/                    # Express API server

│       ├── backend-deployment.yaml│   ├── server.js              # Main server file

│       ├── postgres-deployment.yaml│   ├── package.json           # Dependencies

│       ├── postgres-secret.yaml│   ├── Dockerfile             # Backend container

│       ├── postgres-pvc.yaml│   ├── docker-compose.yml     # Local DB setup

│       ├── postgres-configmap.yaml│   ├── __tests__/             # Jest tests

│       └── seed-job.yaml│   ├── initdb/

││   │   └── init.sql           # Database schema + seed data

├── web-frontend/             # Next.js web app│   └── k8s/                   # Kubernetes manifests

│   ├── app/                  # App router pages│       ├── backend-deployment.yaml

│   │   ├── page.tsx         # Home page (event list)│       ├── postgres-deployment.yaml

│   │   └── events/[id]/     # Event detail page│       ├── postgres-secret.yaml

│   ├── components/           # React components│       ├── postgres-pvc.yaml

│   │   ├── event-card.tsx│       ├── postgres-configmap.yaml

│   │   ├── ui/              # shadcn/ui components│       └── seed-job.yaml

│   │   └── __tests__/       # Component tests│

│   ├── lib/├── web-frontend/              # Next.js web app

│   │   └── api-client.ts    # API integration│   ├── app/                   # App router pages

│   ├── types/│   │   ├── page.tsx          # Home page (event list)

│   │   └── api.ts           # TypeScript types│   │   └── events/[id]/      # Event detail page

│   ├── Dockerfile           # Frontend container│   ├── components/            # React components

│   └── k8s/│   │   ├── event-card.tsx

│       └── frontend-deployment.yaml│   │   ├── ui/               # shadcn/ui components

││   │   └── __tests__/        # Component tests

└── docker-compose.yml        # Orchestrate all services│   ├── lib/

```│   │   └── api-client.ts     # API integration

│   ├── types/

## 🔌 API Endpoints│   │   └── api.ts            # TypeScript types

│   ├── Dockerfile            # Frontend container

All API endpoints are accessed through the gateway at `http://localhost/api/`│   └── k8s/

│       └── frontend-deployment.yaml

### GET /api/│

Returns basic API information.├── docker-compose.yml         # Full stack orchestration

├── PROJECT-ROADMAP.md         # Project planning

**Response:**├── PROJECT-ROADMAP-MVP.md     # MVP implementation guide

```json└── README.md                  # This file

{```

  "message": "Corkboard API",

  "version": "1.0.0",## 🧪 Testing

  "endpoints": ["/health", "/events", "/events/:id"]

}### Backend Tests

```

```bash

### GET /api/healthcd backend

Health check endpoint for monitoring.npm test

```

**Response:**

```jsonTest coverage includes:

{- ✅ API endpoint tests

  "status": "healthy",- ✅ Database query mocking

  "database": "connected",- ✅ Error handling

  "timestamp": "2025-10-30T01:00:00.000Z"- ✅ Health checks

}

```### Frontend Tests



### GET /api/events```bash

Returns all events.cd web-frontend

npm test

**Query Parameters:**```

- `genre` (optional): Filter by genre

Test coverage includes:

**Response:**- ✅ Component rendering

```json- ✅ User interactions

{- ✅ API integration

  "events": [- ✅ Error states

    {

      "id": 1,## 🐳 Docker Deployment

      "title": "Jazz & Blues Night",

      "description": "Experience the smooth sounds of jazz...",### Build Images

      "venue_name": "The Casbah",

      "venue_address": "306 King St W, Hamilton, ON",```bash

      "start_time": "2024-02-15T20:00:00.000Z",# Build all images

      "end_time": "2024-02-15T23:30:00.000Z",docker compose build

      "genres": ["jazz", "blues"],

      "ticket_price": 25.00,# Or build individually

      "age_restriction": "19+",docker build -t corkboard-backend:latest ./backend

      "organizer_id": 1,docker build -t corkboard-frontend:latest ./web-frontend

      "created_at": "2024-01-15T10:00:00.000Z",```

      "updated_at": "2024-01-15T10:00:00.000Z"

    }### Run Containers

  ],

  "count": 15```bash

}# Start all services

```docker compose up -d



### GET /api/events/:id# Check status

Returns a specific event by ID.docker compose ps



**Response:**# View logs

```jsondocker compose logs -f backend

{docker compose logs -f frontend

  "event": {

    "id": 1,# Stop services

    "title": "Jazz & Blues Night",docker compose down

    ...

  }# Clean up volumes

}docker compose down -v

``````



## 🧪 Testing## ☸️ Kubernetes Deployment



### Backend Tests### Prerequisites

- kubectl configured

```bash- Kubernetes cluster running (minikube, kind, or cloud provider)

cd backend

npm test### Deploy Database

```

```bash

**Coverage:**# Create namespace (optional)

- GET / - API info endpointkubectl create namespace corkboard

- GET /health - Health check with database connection

- GET /events - List all events# Deploy Postgres

- GET /events/:id - Get specific eventkubectl apply -f backend/k8s/postgres-secret.yaml

- Error handling (404, 500)kubectl apply -f backend/k8s/postgres-pvc.yaml

kubectl apply -f backend/k8s/postgres-deployment.yaml

### Frontend Tests

# Seed database

```bashkubectl apply -f backend/k8s/postgres-configmap.yaml

cd web-frontendkubectl apply -f backend/k8s/seed-job.yaml

npm test

```# Wait for seed job

kubectl wait --for=condition=complete job/postgres-seed-job --timeout=60s

**Coverage:**```

- EventCard component rendering

- Event data display### Deploy Backend

- Genre badges

- Link navigation```bash

# Build and load image (for local clusters like minikube)

## 🐳 Docker Deploymentdocker build -t corkboard-backend:latest ./backend

minikube image load corkboard-backend:latest  # if using minikube

### Build Individual Services

# Deploy

```bashkubectl apply -f backend/k8s/backend-deployment.yaml

# Build gateway

docker compose build gateway# Check status

kubectl get pods -l app=backend

# Build backendkubectl logs -l app=backend

docker compose build backend```



# Build frontend### Deploy Frontend

docker compose build frontend

``````bash

# Build and load image

### Environment Variablesdocker build -t corkboard-frontend:latest ./web-frontend

minikube image load corkboard-frontend:latest  # if using minikube

**Backend** (`backend/.env`):

```env# Deploy

DB_HOST=dbkubectl apply -f web-frontend/k8s/frontend-deployment.yaml

DB_PORT=5432

DB_NAME=corkboard# Check status

DB_USER=postgreskubectl get pods -l app=frontend

DB_PASSWORD=postgrespw```

PORT=3000

```### Access Services



**Frontend** (`web-frontend/.env.local`):```bash

```env# Port forward to access locally

NEXT_PUBLIC_API_URL=http://localhost/apikubectl port-forward svc/frontend-svc 3001:3001

```kubectl port-forward svc/backend-svc 3000:3000



## ☸️ Kubernetes Deployment# Or use LoadBalancer/NodePort

kubectl get svc

### Prerequisites```

- Kubernetes cluster (local or cloud)

- kubectl configured## 🔧 API Documentation

- Docker images pushed to registry (or local cluster)

### Base URL

### Deploy All Services`http://localhost:3000`



```bash### Endpoints

# Deploy database and backend

cd backend/k8s#### Get All Events

kubectl apply -f postgres-secret.yaml```http

kubectl apply -f postgres-pvc.yamlGET /events

kubectl apply -f postgres-configmap.yaml```

kubectl apply -f postgres-deployment.yaml

kubectl apply -f seed-job.yamlResponse:

kubectl apply -f backend-deployment.yaml```json

{

# Deploy frontend  "count": 15,

cd ../../web-frontend/k8s  "events": [

kubectl apply -f frontend-deployment.yaml    {

      "id": 1,

# Deploy gateway      "title": "Indie Night at The Casbah",

cd ../../gateway/k8s      "description": "Local indie bands showcase...",

kubectl apply -f gateway-deployment.yaml      "venue_name": "The Casbah",

```      "venue_address": "306 King St W, Hamilton, ON",

      "latitude": "43.2557",

### Check Deployment Status      "longitude": "-79.8711",

      "start_time": "2025-11-15T20:00:00-05:00",

```bash      "end_time": "2025-11-15T23:30:00-05:00",

# Check all pods      "genre_tags": ["indie", "rock", "alternative"],

kubectl get pods      "thumbnail_url": null,

      "created_at": "2025-10-30T00:00:00Z"

# Check services    }

kubectl get services  ]

}

# View gateway logs```

kubectl logs -f deployment/gateway

#### Get Event by ID

# View backend logs```http

kubectl logs -f deployment/backendGET /events/:id

``````



### Access the Application#### Filter by Genre

```http

```bashGET /events/genre/:genre

# Get the gateway service external IP/URL```

kubectl get service gateway-svc

#### Health Check

# If using LoadBalancer, access via external IP```http

# If using NodePort, access via node IP and portGET /health

# If using Ingress, access via ingress hostname```

```

Response:

### Kubernetes Architecture```json

{

- **Gateway**: 2 replicas, LoadBalancer service on port 80  "status": "healthy",

- **Frontend**: 2 replicas, ClusterIP service on port 3001  "database": "connected",

- **Backend**: 2 replicas, ClusterIP service on port 3000  "timestamp": "2025-10-30T00:00:00Z"

- **Database**: 1 replica, ClusterIP service on port 5432, 1Gi PVC}

```

## 🛠️ Development

## 🌐 Environment Variables

### Adding New Events

### Backend

1. Connect to the database:

```bash```bash

docker exec -it corkboard-open-source-db-1 psql -U postgres -d corkboardDB_HOST=localhost

```DB_PORT=5432

DB_NAME=corkboard

2. Insert event:DB_USER=postgres

```sqlDB_PASSWORD=postgrespw

INSERT INTO events (title, description, venue_name, venue_address, start_time, end_time, genres, ticket_price, age_restriction, organizer_id)PORT=3000

VALUES ('Your Event', 'Description...', 'Venue Name', 'Address', '2024-03-01 20:00:00', '2024-03-01 23:00:00', ARRAY['rock', 'indie'], 20.00, '19+', 1);```

```

### Frontend

### Backend Development

```bash

The backend uses Express with a PostgreSQL connection pool:NEXT_PUBLIC_API_URL=http://localhost:3000

PORT=3001

```javascript```

// Add new endpoint in server.js

app.get('/api/events/genre/:genre', async (req, res) => {## 📝 Development Workflow

  const { genre } = req.params;

  const result = await pool.query(1. **Start Database**

    'SELECT * FROM events WHERE $1 = ANY(genres)',   ```bash

    [genre]   cd backend && docker compose up -d

  );   ```

  res.json({ events: result.rows });

});2. **Start Backend**

```   ```bash

   cd backend && npm run dev

### Frontend Development   ```



Pages use Next.js App Router with server components:3. **Start Frontend**

   ```bash

```typescript   cd web-frontend && npm run dev

// app/events/page.tsx   ```

import { apiClient } from '@/lib/api-client';

4. **Run Tests**

export default async function EventsPage() {   ```bash

  const { events } = await apiClient.getEvents();   # Backend

  return <EventsList events={events} />;   cd backend && npm test

}   

```   # Frontend

   cd web-frontend && npm test

## 📊 Monitoring   ```



### Health Checks5. **Build for Production**

   ```bash

```bash   docker compose build

# Gateway health   ```

curl http://localhost/health

## 🤝 Contributing

# Backend health (through gateway)

curl http://localhost/api/health1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)

# Backend health (direct)3. Commit your changes (`git commit -m 'Add amazing feature'`)

curl http://localhost:3000/health4. Push to the branch (`git push origin feature/amazing-feature`)

```5. Open a Pull Request



### Container Logs## 📄 License



```bashMIT

# View all logs

docker compose logs## 🙏 Acknowledgments



# Follow specific service- Built by DSC-McMaster-U

docker compose logs -f gateway- Hamilton music venues and community

docker compose logs -f backend- shadcn/ui for beautiful components

docker compose logs -f frontend- Next.js and React teams



# View last 100 lines---

docker compose logs --tail=100 backend

```**Made with ❤️ for the Hamilton music scene** 🎸


### Database Queries

```bash
# Connect to database
docker exec -it corkboard-open-source-db-1 psql -U postgres -d corkboard

# Check event count
SELECT COUNT(*) FROM events;

# List all venues
SELECT DISTINCT venue_name FROM events;

# Events by genre
SELECT title, genres FROM events WHERE 'rock' = ANY(genres);
```

## 🎯 Future Roadmap

### Planned Features (MVP)
- 📍 Map and timeline views of upcoming shows
- 🎫 Event detail pages with flyer images
- 🧾 Show submission form with moderation queue
- 🔎 Advanced filtering by genre, venue type, and date
- 🧠 Personalized show recommendations (embeddings-based ranking)
- 🧑‍💻 Admin dashboard for curators

### Technologies to Add
- **Authentication**: Firebase Auth or Auth0
- **Map Integration**: Google Maps SDK or Mapbox
- **Search**: OpenAI embeddings with Pinecone/ChromaDB
- **External APIs**: Spotify Web API, Eventbrite
- **Image Hosting**: Cloudinary or Firebase Storage

See [PROJECT-ROADMAP.md](./PROJECT-ROADMAP.md) for detailed roadmap.

## 👥 Contributors

| Contributor | Role | Contributions |
|------------|------|---------------|
| [**Harrison Johns**](https://github.com/johnsh9656) | Project Lead | Architecture & DevOps |
| [**Ian Yeh**](https://github.com/ian-yeh) | Frontend Team | UI Components |
| [**Billy Wu**](https://github.com/Billy423) | Backend Developer | API Development |
| [**Alex Horton**](https://github.com/needlesndpins) | Backend Developer | Database Design |
| [**Mila Serafimovska**](https://github.com/mila-sera) | Frontend Team | Event Pages |
| [**Yanna Lazarova**](https://github.com/yanna-nl) | Frontend Team | Styling |
| [**Austin Bray**](https://github.com/austinbray77) | Backend Developer | Testing |
| [**Shiv Patel**](https://github.com/Shiv-sp) | Frontend Developer | Components |
| [**Ahmed Zafar**](https://github.com/ahmed-z5645) | Backend Developer | API Endpoints |
| [**Angela Fernando**](https://github.com/angefern) | Backend Developer | Integration |

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ by the Corkboard Team | DSC McMaster University
