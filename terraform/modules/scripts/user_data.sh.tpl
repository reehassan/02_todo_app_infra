#!/bin/bash

# Install dependencies
apt update -y
apt install -y docker.io docker-compose git postgresql-client curl

# Install Node.js (optional, depending on your backend)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Enable Docker
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# Switch to /home/ubuntu
cd /home/ubuntu

# Clone the app
git clone https://github.com/reehassan/02_todo_app_infra.git
chown -R ubuntu:ubuntu 02_todo_app_infra
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

# Apply init.sql to RDS
export PGPASSWORD=${db_password}
psql -h ${rds_endpoint} -U ${db_username} -d todoapp -f database/init.sql

# Run the containers
docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d
