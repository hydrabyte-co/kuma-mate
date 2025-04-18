#!/bin/bash

# Script to set up Kuma Mate on Ubuntu

# Exit on error
set -e

# Variables
INSTALL_DIR="/opt/kuma-mate"
SERVICE_FILE="/etc/systemd/system/kuma-mate.service"

# Step 1: Ensure working directory
echo "Navigating to Kuma Mate directory..."
cd "$INSTALL_DIR"

# Step 2: Install Node.js 18.x if not present
if ! command -v node &> /dev/null; then
  echo "Node.js not found, installing Node.js 18.x..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
else
  echo "Node.js already installed: $(node -v)"
fi

# Step 3: Install dependencies
echo "Installing dependencies..."
npm install

# Step 4: Set up systemd service
echo "Creating systemd service..."
sudo bash -c "cat > $SERVICE_FILE" << EOL
[Unit]
Description=Kuma Mate - VM Resource Monitoring Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

# Step 5: Enable and start the service
echo "Enabling and starting Kuma Mate service..."
sudo systemctl daemon-reload
sudo systemctl enable kuma-mate
sudo systemctl start kuma-mate

# Step 6: Verify the service
echo "Verifying Kuma Mate service..."
sudo systemctl status kuma-mate --no-pager

echo "Kuma Mate setup complete! Access at http://localhost:4000"