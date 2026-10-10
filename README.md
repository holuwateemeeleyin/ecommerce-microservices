# E-commerce Microservices

A containerized e-commerce application built with Node.js, Docker, and Docker Compose.

## Architecture

```text
                 Client
                   |
                   v
            API Gateway :3000
              /         \
             v           v
     Product Service   Order Service
         :3001             :3002
             \             /
              \           /
               PostgreSQL
                  Redis
```

The API Gateway routes requests to the Product and Order services. PostgreSQL provides persistent database storage, while Redis is included as a cache service.

## Services

| Service | Port | Purpose |
|---|---:|---|
| API Gateway | 3000 | Routes client requests |
| Product Service | 3001 | Returns product information |
| Order Service | 3002 | Returns order information |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |

The Gateway is exposed on port 3003 on the host by default.

## Prerequisites

- Docker Desktop or an equivalent Docker environment
- Docker Compose

## Configuration

Copy `.env.example` to `.env` and update the local configuration values as required.

```bash
cp .env.example .env
```

Do not commit `.env` or real credentials to version control.

## Run the application

Start the development environment:

```bash
docker compose up -d --build
```

Check container status:

```bash
docker compose ps
```

Test the endpoints:

```bash
curl http://localhost:3003/health
curl http://localhost:3003/products
curl http://localhost:3003/orders
```

Stop the application:

```bash
docker compose down
```

Persistent database and Redis data are stored in named Docker volumes.

## Image size report

The following are the approximate sizes measured locally for the production application images:

| Image | Tag | Size |
|---|---|---:|
| API Gateway | v1.0.7 | 129.94 MB |
| Product Service | v1.0.7 | 129.94 MB |
| Order Service | v1.0.7 | 129.94 MB |

All three application images are under the 150 MB requirement.

The production images use a minimal `scratch` base and copy in the Node.js runtime, required Alpine shared libraries, and application code. The containers run as a non-root user.

## Security and reliability

- Application images use a non-root user.
- `.dockerignore` files exclude unnecessary files and environment secrets from build contexts.
- Environment-specific settings are provided through environment variables.
- Health checks are configured for the application services, PostgreSQL, and Redis.
- Compose uses separate frontend and internal backend networks.
- Named volumes preserve database and cache data.
- Resource limits are configured for the services.

## Development

The Compose override file configures source-code mounts, Node.js watch mode, and debugging ports for local development.

## Production and publishing

Production images should be tagged with semantic versions and published to a container registry. Configure the production Compose file to pull those published images rather than build them locally.

See `docker-compose.prod.yml` for the production deployment configuration.