
# Full Stack Todo Application with Devops

A modern, containerized todo application built with a static frontend (HTML, CSS, JavaScript), a Node.js backend, and a PostgreSQL database. This project demonstrates Docker fundamentals, container orchestration with Docker Compose, and DevOps best practices.



## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/reehassan/01_todo_app.git
cd 01_todo_app

# Install backend dependencies and build
cd backend
npm install
npm run build

# Go back to project root
cd ..

# Start services
docker-compose --env-file .env up --build
```



## 📋 Table of Contents

* [Features](#features)
* [Architecture](#architecture)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
* [Docker Commands](#docker-commands)
* [API Documentation](#api-documentation)
* [Development](#development)
* [Production Deployment](#production-deployment)
* [Monitoring & Logging](#monitoring--logging)
* [Troubleshooting](#troubleshooting)
* [Performance Optimization](#performance-optimization)
* [Security](#security)
* [Contributing](#contributing)
* [License](#license)
* [Support](#support)
* [Learning Objectives](#learning-objectives)
* [Next Steps](#next-steps)



## ✨ Features

### App Features

* ✅ Add, edit, delete todos
* ✅ Mark todos as complete/incomplete
* ✅ Persistent PostgreSQL storage
* ✅ Responsive UI
* ✅ Real-time updates

### DevOps Features

* 🐳 Fully containerized with Docker
* 🏗️ Multi-stage Docker builds
* 🎼 Docker Compose orchestration
* 🔒 Basic security hardening
* 🩺 Health checks
* 🚀 Production-ready setup
* 📚 Clean and thorough documentation



## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌────────────────────┐
│   Frontend      │    │   Backend       │    │     Database       │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)     │
│   Port: 80      │    │   Port: 3000    │    │   Port: 5432       │
└─────────────────┘    └─────────────────┘    └────────────────────┘
```

* **Frontend**: Static files via Nginx
* **Backend**: Node.js/Express API
* **Database**: PostgreSQL with persistent volume
* **Reverse Proxy**: Nginx for routing



## 🛠️ Prerequisites

* Docker Desktop 4.0+
* Docker Compose 2.0+
* Git installed
* 4GB+ available RAM



## 📦 Installation

### Development Environment

```bash
# Clone the repository
git clone https://github.com/reehassan/01_todo_app.git
cd 01_todo_app

# Install backend dependencies and build
cd backend
npm install
npm run build

# Go back to project root
cd ..

# Start services
docker-compose --env-file .env up --build
```

Access:

* Web: [http://localhost:9090](http://localhost:9090)
* API Health: `http://localhost:9090/api/health`
* DB: `localhost:5432` (via pgAdmin or psql)

---

### Production Environment

### 📁 1. Create the Production `.env.production` File

In the root of your project (`01_todo_app/`), create a file named `.env.production` and add the following configuration:

```env
# .env.production
NODE_ENV=production
DB_HOST=db
DB_USER=todouser
DB_PASSWORD=yourpassword
DB_NAME=todoapp
DB_PORT=5432
API_PORT=3000
WEB_PORT=80
```

> ⚠️ Replace `yourpassword` with a secure password.

---

### 🧱 2. Build Backend Files for Production

Before running the containers, ensure the backend build artifacts are created:

```bash
cd backend
npm install
npm run build
cd ..
```

---

### 📦 3. Start the Production Environment

Use Docker Compose with the production configuration:

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d
```

---

### 🔍 4. Verify Containers Are Running

Check container statuses:

```bash
docker-compose -f docker-compose.prod.yml ps
```

View logs if needed:

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

## 🎮 Usage

### Web Interface

* Navigate to [http://localhost:80](http://localhost:80)
* Add, complete, or delete todos using the UI

### API Usage

```bash
# Get all todos
curl http://localhost:80/api/todos

# Create todo
curl -X POST http://localhost:80/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Docker"}'

# Update todo
curl -X PUT http://localhost:80/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Docker", "completed": true}'

# Delete todo
curl -X DELETE http://localhost:80/api/todos/1
```



## 🐳 Docker Commands

### General

```bash
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose up --build
docker-compose down -v
```

### Development

```bash
docker-compose exec web sh
docker-compose exec backend sh
docker-compose exec db psql -U todouser -d todoapp
docker-compose exec backend npm test
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml up --scale backend=3
docker stats
```



## 📚 API Documentation

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/todos`     | Fetch all todos |
| POST   | `/api/todos`     | Create new todo |
| PUT    | `/api/todos/:id` | Update a todo   |
| DELETE | `/api/todos/:id` | Delete a todo   |
| GET    | `/api/health`    | Health check    |


## 🔧 Development

### File Structure

```
01_todo_app/
├── index.html
├── backend/
├── database/
├── nginx/
├── resources/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── Dockerfile.multi-stage
└── docs/
```

### Hot Reload (Frontend)

Modify files in `resources/` — changes reflect instantly (volumes are mounted).

### Backend Restart

```bash
docker-compose restart backend
```

### Reset Database

```bash
docker-compose down -v
docker-compose up -d
```



## 🚀 Production Deployment

### Checklist

* ✅ Update `.env.production`
* ✅ Set secure DB passwords
* ✅ Enable HTTPS (e.g., with Nginx + Certbot)
* ✅ Add monitoring/logging
* ✅ Automate backups

### Deploy

```bash
# Sync code to server
rsync -av --exclude node_modules . user@server:/app/

# Set env
cp .env.production .env

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

### Docker Hub

```bash
docker build -t youruser/todo-app:latest .
docker push youruser/todo-app:latest
```



## 🔍 Monitoring & Logging

```bash
docker stats
docker-compose ps
docker-compose logs -f
docker-compose logs -f backend
```

Health:

* Web: `/health`
* API: `/api/health`
* DB: `pg_isready`



## 🛠️ Troubleshooting

### Port Conflict

Change ports in `docker-compose.yml`

### DB Not Connecting

```bash
docker-compose exec db pg_isready -U todouser
```

### Container Fails

```bash
docker-compose logs backend
docker-compose up --build backend
```


## 📊 Performance Optimization

* ✅ Multi-stage builds for small image sizes
* ✅ `.dockerignore` to reduce context
* ✅ Alpine base images
* ✅ Health checks
* ✅ Resource limits in Compose

---

## 🔒 Security Best Practices

* Run containers as non-root
* Read-only filesystems (optional)
* Environment secrets, not hardcoded values
* Disable unnecessary ports
* Harden database access

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m "Add xyz"`
4. Push: `git push origin feature/xyz`
5. Open a Pull Request


## 📄 License

MIT License. See [LICENSE.md](LICENSE.md) for details.


## 🙋‍♂️ Support

* Review logs: `docker-compose logs`
* Create an issue on GitHub


## 🎯 Learning Objectives

* Docker fundamentals
* Multi-container apps with Compose
* Multi-stage builds
* DevOps workflows and automation
* Secure, production-ready deployments


## 📈 Next Steps

* [ ] CI/CD with GitHub Actions
* [ ] Add SSL/TLS with Let's Encrypt
* [ ] Integrate log aggregation (ELK or Loki)
* [ ] Add Prometheus/Grafana monitoring
* [ ] Database backups & scheduled jobs



### 🧠 Credit

> This project is based on [@themaxsandelin's](https://github.com/themaxsandelin/todo) simple todo app. Extended by Areeba Hassan with a backend, PostgreSQL database, and Dockerized full stack environment.


**Happy shipping! 🚢**

