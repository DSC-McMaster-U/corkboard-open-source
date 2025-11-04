# Corkboard Web FrontendThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



Modern Next.js web application for discovering local music events in Hamilton.## Getting Started



## FeaturesFirst, run the development server:



- 🎨 Beautiful UI built with Next.js 16, TypeScript, and Tailwind CSS```bash

- 🎭 shadcn/ui components for consistent designnpm run dev

- 📱 Fully responsive design# or

- ⚡ Server-side rendering for optimal performanceyarn dev

- 🧪 Unit tests with Jest and React Testing Library# or

- 🐳 Docker support with multi-stage buildspnpm dev

- ☸️ Kubernetes-ready deployments# or

bun dev

## Quick Start```



### Local DevelopmentOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



```bashYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# Install dependencies

npm installThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



# Start development server## Learn More

npm run dev

To learn more about Next.js, take a look at the following resources:

# Visit http://localhost:3001

```- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### Environment Variables

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

Create a `.env.local` file:

## Deploy on Vercel

```bash

NEXT_PUBLIC_API_URL=http://localhost:3000The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
```

## Project Structure

```
web-frontend/
├── app/
│   ├── page.tsx              # Home page with event list
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── events/
│       └── [id]/
│           └── page.tsx      # Event detail page
├── components/
│   ├── event-card.tsx        # Event card component
│   ├── event-card-skeleton.tsx
│   ├── ui/                   # shadcn/ui components
│   └── __tests__/            # Component tests
├── lib/
│   ├── api-client.ts         # API client
│   └── utils.ts              # Utility functions
├── types/
│   └── api.ts                # TypeScript types
└── public/                   # Static assets
```

## API Integration

The frontend connects to the backend API at `NEXT_PUBLIC_API_URL`. All API calls are handled through the `apiClient` in `lib/api-client.ts`.

### Available API Endpoints

- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `GET /events/genre/:genre` - Filter events by genre
- `GET /health` - Health check

## Docker

### Build Image

```bash
docker build -t corkboard-frontend:latest .
```

### Run Container

```bash
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000 \
  corkboard-frontend:latest
```

## Kubernetes Deployment

Deploy to Kubernetes:

```bash
# Apply frontend deployment and service
kubectl apply -f k8s/frontend-deployment.yaml

# Check deployment status
kubectl get pods -l app=frontend

# Access the service
kubectl port-forward svc/frontend-svc 3001:3001
```

## Testing

### Run Tests

```bash
npm test
```

### Test Coverage

The test suite includes:
- Component rendering tests
- User interaction tests
- API integration tests

## UI Components

Built with [shadcn/ui](https://ui.shadcn.com/):
- Card
- Badge
- Button
- Input
- Select
- Skeleton loaders

## Performance

- **Server-Side Rendering**: Pages are rendered on the server for fast initial load
- **Image Optimization**: Automatic image optimization with Next.js Image
- **Code Splitting**: Automatic code splitting for optimal bundle sizes
- **Caching**: API responses are cached appropriately

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT
