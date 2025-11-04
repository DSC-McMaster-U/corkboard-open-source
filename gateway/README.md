# Gateway Service

The Nginx-based API gateway serves as a reverse proxy and single entry point for the Corkboard application.

## Architecture

The gateway routes traffic to different services:
- `/*` → Frontend (Next.js on port 3001)
- `/api/*` → Backend (Express on port 3000)
- `/health` → Gateway health check

## Features

- **Reverse Proxy**: Routes traffic to frontend and backend services
- **Path Rewriting**: Strips `/api` prefix before forwarding to backend
- **Load Balancing**: Distributes traffic across service replicas (in K8s)
- **Gzip Compression**: Reduces bandwidth usage
- **Static File Caching**: Caches Next.js static assets
- **Health Checks**: Exposes `/health` endpoint
- **Request Headers**: Forwards real IP and protocol information

## Configuration

### Docker Compose

The gateway is automatically configured in `docker-compose.yml`:

```yaml
gateway:
  build:
    context: ./gateway
  ports:
    - "80:80"
  depends_on:
    - backend
    - frontend
```

### Kubernetes

Deploy using the included manifest:

```bash
kubectl apply -f k8s/gateway-deployment.yaml
```

This creates:
- ConfigMap with nginx.conf
- Deployment with 2 replicas
- LoadBalancer Service on port 80

## Local Development

### Build and Run

```bash
# Build the gateway image
docker build -t corkboard-gateway .

# Run standalone (requires backend and frontend running)
docker run -d -p 80:80 \
  --network corkboard-network \
  --name gateway \
  corkboard-gateway
```

### Test the Gateway

```bash
# Gateway health
curl http://localhost/health

# Frontend (proxied)
curl http://localhost/

# Backend API (proxied)
curl http://localhost/api/health
curl http://localhost/api/events
```

## Configuration Files

### nginx.conf

The main configuration file defines:

1. **Events block**: Worker connections
2. **HTTP block**: 
   - Basic settings (sendfile, keepalive)
   - Gzip compression
   - Upstream definitions for backend and frontend
   - Server block with location directives

### Upstream Configuration

```nginx
upstream backend {
    server backend:3000;
}

upstream frontend {
    server frontend:3001;
}
```

### Location Directives

```nginx
# Health check
location /health {
    return 200 "Gateway healthy\n";
}

# Backend API
location /api {
    rewrite ^/api/(.*) /$1 break;
    proxy_pass http://backend;
    # ... proxy headers
}

# Frontend
location / {
    proxy_pass http://frontend;
    # ... proxy headers
}
```

## Monitoring

### Health Checks

The gateway includes both Docker and Kubernetes health checks:

**Docker:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health
```

**Kubernetes:**
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
readinessProbe:
  httpGet:
    path: /health
    port: 80
```

### Logs

View gateway logs:

```bash
# Docker Compose
docker compose logs -f gateway

# Docker
docker logs -f gateway

# Kubernetes
kubectl logs -f deployment/gateway
```

### Access Logs

Nginx access and error logs are written to:
- `/var/log/nginx/access.log`
- `/var/log/nginx/error.log`

View them:

```bash
# Docker
docker exec gateway tail -f /var/log/nginx/access.log

# Kubernetes
kubectl exec -it deployment/gateway -- tail -f /var/log/nginx/access.log
```

## Troubleshooting

### Gateway Returns 502 Bad Gateway

**Possible causes:**
1. Backend or frontend service is not running
2. Service names don't resolve in Docker network
3. Backend/frontend ports are incorrect

**Solutions:**
```bash
# Check all services are running
docker compose ps

# Check backend health directly
curl http://localhost:3000/health

# Check frontend directly
curl http://localhost:3001

# Check Docker network
docker network inspect corkboard-open-source_corkboard-network
```

### API Requests Return 404

**Possible causes:**
1. Path rewriting not working correctly
2. Backend routes don't match

**Solutions:**
```bash
# Test backend directly
curl http://localhost:3000/health
curl http://localhost:3000/events

# Test through gateway
curl http://localhost/api/health
curl http://localhost/api/events

# Check nginx logs for errors
docker compose logs gateway
```

### Frontend Not Loading

**Possible causes:**
1. Frontend container not ready
2. Next.js not started properly

**Solutions:**
```bash
# Check frontend logs
docker compose logs frontend

# Check frontend health directly
curl -I http://localhost:3001

# Restart frontend
docker compose restart frontend
```

## Performance Tuning

### Worker Connections

Adjust in nginx.conf:

```nginx
events {
    worker_connections 1024;  # Increase for high traffic
}
```

### Gzip Compression

Already enabled for common MIME types. Add more if needed:

```nginx
gzip_types text/plain text/css ... application/your-type;
```

### Caching

Static files are cached for 60 minutes:

```nginx
location /_next/static {
    proxy_pass http://frontend;
    proxy_cache_valid 60m;
    add_header Cache-Control "public, immutable";
}
```

### Timeouts

Adjust proxy timeouts if needed:

```nginx
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

## Security Considerations

1. **HTTPS**: Add SSL/TLS certificates for production
2. **Rate Limiting**: Consider adding rate limiting for API endpoints
3. **CORS**: Handled by backend, gateway forwards headers
4. **Headers**: Security headers can be added:

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## Production Deployment

### Docker Compose

Already configured in root `docker-compose.yml`.

### Kubernetes

```bash
# Apply gateway manifests
kubectl apply -f k8s/gateway-deployment.yaml

# Get external IP
kubectl get service gateway-svc

# Scale replicas
kubectl scale deployment gateway --replicas=3
```

### Cloud Providers

For cloud deployment:
- **AWS**: Use Application Load Balancer or NLB
- **GCP**: Use Cloud Load Balancing
- **Azure**: Use Azure Load Balancer
- **DigitalOcean**: Use Load Balancer

Update the Service type in K8s manifest accordingly.

## References

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Nginx as Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Docker Nginx Image](https://hub.docker.com/_/nginx)
