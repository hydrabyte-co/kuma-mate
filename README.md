# KumaMate

KumaMate is a lightweight, open-source Node.js service designed to monitor CPU, RAM, and storage usage on Ubuntu virtual machines (VMs). It provides simple, customizable REST APIs to track system resources in real-time, making it an ideal companion for Uptime Kuma to centralize alerting and monitoring. With flexible parameters like `threshold`, `duration`, and `path`, KumaMate empowers users to define precise alerting conditions, such as triggering alarms when CPU usage exceeds 75% over 60 seconds or when the root filesystem (`/`) usage crosses 90%.

## Key Features
- **REST APIs**: Monitor CPU (`/cpu-usage`), RAM (`/ram-usage`), and storage (`/storage-usage`) with HTTP status codes (200 for OK, 500 for alarms).
- **Customizable Alerts**: Set thresholds and time durations for fine-grained monitoring (e.g., `/cpu-usage?threshold=75&duration=60`).
- **Path-Specific Storage Monitoring**: Track specific filesystems (e.g., `/storage-usage?path=/`) for targeted insights.
- **Lightweight & Easy to Deploy**: Built with Express.js, deployable via Git clone, `npm install`, and systemd for background execution.
- **Seamless Integration**: Pairs perfectly with Uptime Kuma for centralized monitoring and notifications (Telegram, Slack, email, etc.).

## Use Case
KumaMate is perfect for DevOps engineers, system administrators, or anyone managing Ubuntu VMs who needs a simple, self-hosted monitoring solution. It shines in distributed systems, private clouds, or decentralized projects requiring efficient resource tracking.

## System Architecture
Below is a sequence diagram illustrating how KumaMate interacts with Uptime Kuma and VMs:

```mermaid
sequenceDiagram
    participant U as Uptime Kuma
    participant N as Nginx Public
    participant K as KumaMate (VM1)
    participant V as VM1

    U->>N: GET /vm1/cpu-usage?threshold=75&duration=60
    N->>K: Proxy request to VM1:3000
    K->>V: Check CPU usage
    V-->>K: Return CPU data
    alt CPU > 75%
        K-->>N: HTTP 500 (ALARM)
        N-->>U: HTTP 500
        U->>U: Send alert (Telegram/Slack)
    else CPU <= 75%
        K-->>N: HTTP 200 (OK)
        N-->>U: HTTP 200
    end
```

## Setup Guide
Follow these steps to run KumaMate as a server on an Ubuntu VM:

### Prerequisites
- Ubuntu 20.04 or later.
- Git installed (`sudo apt install git`).
- Internet access for downloading dependencies.

### Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-repo>/kumamate.git /opt/kumamate
   cd /opt/kumamate
   ```
   Replace `<your-repo>` with your GitHub repository (e.g., `tonyhoang/kumamate`).

2. **Install Node.js**
   KumaMate requires Node.js 16.x or later. Install it if not already present:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   node -v  # Should show ~16.x
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up Systemd Service**
   Create a systemd service to run KumaMate in the background:
   ```bash
   sudo nano /etc/systemd/system/kumamate.service
   ```
   Add the following:
   ```ini
   [Unit]
   Description=KumaMate - VM Resource Monitoring Service
   After=network.target

   [Service]
   Type=simple
   User=uptimekuma
   WorkingDirectory=/opt/kumamate
   ExecStart=/usr/bin/node index.js
   Restart=always
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```
   Save and exit, then enable the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable kumamate
   sudo systemctl start kumamate
   ```
   Check status:
   ```bash
   sudo systemctl status kumamate
   ```
   Look for `active (running)`.

5. **Verify the Service**
   Test the APIs locally:
   ```bash
   curl "http://localhost:3000/cpu-usage?threshold=75&duration=60"
   ```
   Example output:
   ```json
   {"currentUsage":20.30,"averageUsage":18.50}
   ```
   Repeat for `/ram-usage?threshold=80` and `/storage-usage?threshold=90&path=/`.

### Integration
- **Uptime Kuma**: Add monitors for each endpoint (e.g., `http://<vm-ip>:3000/cpu-usage?threshold=75&duration=60`) with expected status code `200`.
- **Nginx Proxy**: If using a public Nginx server, proxy requests to `http://<vm-ip>:3000` (see Nginx configuration in [your setup](#)).
- **Security**: Consider adding an API key to endpoints for authentication.

### Troubleshooting
- **Service not running**: Check logs with `sudo journalctl -u kumamate`.
- **Port conflict**: Ensure port 3000 is free (`sudo netstat -tuln | grep 3000`).
- **Dependency errors**: Run `npm install` again or check Node.js version.

## Credits
KumaMate was coded by **Grok**, created by xAI, based on the innovative ideas of **Tony Hoang (tonyh@hydrabyte.co)**.

## Getting Started
1. Follow the [Setup Guide](#setup-guide) above.
2. Integrate with Uptime Kuma for monitoring.
3. Scale to multiple VMs by repeating the installation steps.

---

**License**: MIT  
**Repository**: [Coming soon]  
**Contact**: tonyh@hydrabyte.co