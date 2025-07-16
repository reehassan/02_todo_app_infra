#!/bin/bash

# Update & install core dependencies
sudo apt update -y
sudo apt install -y docker.io git postgresql-client curl

# Install Docker Compose (v2.29.1)
sudo curl -L "https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js 18.x (for backend build step)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Add ubuntu user to docker group and enable Docker
sudo usermod -aG docker ubuntu
sudo systemctl start docker
sudo systemctl enable docker

# Move to ubuntu's home directory
cd /home/ubuntu

# Clone your GitHub repo
git clone https://github.com/reehassan/02_todo_app_infra.git
sudo chown -R ubuntu:ubuntu 02_todo_app_infra
cd 02_todo_app_infra

# Create the .env.production file
cat <<EOF > .env.production
NODE_ENV=production
DB_HOST=${rds_endpoint}
DB_USER=${db_username}
DB_PASSWORD=${db_password}
DB_NAME=todoapp
DB_PORT=5432
API_PORT=3000
WEB_PORT=80
EOF

# Build backend for production
cd backend
npm install
npm run build
cd ..

# Apply init.sql to RDS
export PGPASSWORD=${db_password}
psql -h ${rds_endpoint} -p 5432 -U ${db_username} -d todoapp -f database/init.sql

# Run containers in production mode
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d
