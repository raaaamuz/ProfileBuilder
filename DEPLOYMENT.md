# Profile2Connect - AWS EC2 Deployment Guide

## Live Site
- **URL**: https://profile2connect.com
- **IP Address**: 51.21.169.213

## Server Details
- **Instance**: t3.micro (Ubuntu 24.04 LTS)
- **Region**: eu-north-1 (Stockholm)
- **SSH Key**: `D:\PYDJ\KrossIQ-Admin\krossiq.pem`

---

## Quick Deploy (After Initial Setup)

### Option 1: Use Deploy Script (Recommended)

```bash
# From Git Bash or WSL
cd D:\PYDJ\Nagarajan
./deploy.sh
```

This script automatically:
1. Builds frontend locally
2. Uploads to server via SCP
3. Reloads nginx

### Option 2: Manual Deploy

```bash
# 1. Build frontend locally (server has limited RAM - only 1GB)
cd D:\PYDJ\Nagarajan\frontend
npm run build

# 2. Upload directly (no tar needed)
scp -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" -r build/* ubuntu@51.21.169.213:/var/www/nagarajan/frontend/build/

# 3. Reload nginx
ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213 "sudo systemctl reload nginx"

# 4. Restart backend (only if backend code changed)
ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213 "sudo systemctl restart nagarajan"
```

**Note**: Always build locally - server has only 1GB RAM which causes out-of-memory errors during npm build.

---

## 1. SSH Access

```bash
ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213
```

---

## 2. Initial Server Setup (One-time)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib git curl certbot python3-certbot-nginx

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create app directory
sudo mkdir -p /var/www/nagarajan
sudo chown -R ubuntu:ubuntu /var/www/nagarajan

# Create swap (t3.micro has limited RAM)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 3. PostgreSQL Database Setup

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE nagarajan_db;
CREATE USER nagarajan_user WITH PASSWORD 'Nag@r@j@n2026!';
GRANT ALL PRIVILEGES ON DATABASE nagarajan_db TO nagarajan_user;
ALTER DATABASE nagarajan_db OWNER TO nagarajan_user;
EOF
```

---

## 4. Upload Code

### Option A: Upload via SCP (from Windows)

```bash
# Create tar files (excluding node_modules and venv)
cd D:\PYDJ\Nagarajan

# Backend
tar --exclude='backend/venv' --exclude='backend/__pycache__' -cvf backend.tar backend
scp -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" backend.tar ubuntu@51.21.169.213:/var/www/nagarajan/

# On server
ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213
cd /var/www/nagarajan
tar -xvf backend.tar && rm backend.tar
```

### Option B: Git Clone
```bash
cd /var/www/nagarajan
git clone https://github.com/yourusername/nagarajan.git .
```

---

## 5. Backend Setup (Django)

```bash
cd /var/www/nagarajan/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary anthropic openai python-docx

# Create .env file
cat > .env << 'EOF'
DEBUG=False
DJANGO_SECRET_KEY=your-super-secret-key-change-this
DB_NAME=nagarajan_db
DB_USER=nagarajan_user
DB_PASSWORD=Nag@r@j@n2026!
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=profile2connect.com,www.profile2connect.com,51.21.169.213,localhost
CORS_ALLOW_ALL_ORIGINS=False
EOF

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='ram').exists():
    User.objects.create_superuser('ram', 'ram@example.com', 'ram123')
    print('Superuser created')
"
```

---

## 6. Frontend Setup (React)

**IMPORTANT**: Build locally due to server RAM limitations

### On Windows (Local):
```bash
cd D:\PYDJ\Nagarajan\frontend

# Set production API URL
echo "REACT_APP_API_URL=https://profile2connect.com/api" > .env.production

# Build
npm run build

# Create tar and upload
tar -czf build.tar.gz build
scp -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" build.tar.gz ubuntu@51.21.169.213:/var/www/nagarajan/frontend/
```

### On Server:
```bash
cd /var/www/nagarajan/frontend
rm -rf build
tar -xzf build.tar.gz
rm build.tar.gz
```

---

## 7. Gunicorn Systemd Service

```bash
sudo tee /etc/systemd/system/nagarajan.service << 'EOF'
[Unit]
Description=Nagarajan Portfolio Gunicorn
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/nagarajan/backend
ExecStart=/var/www/nagarajan/backend/venv/bin/gunicorn --access-logfile - --workers 2 --bind unix:/var/www/nagarajan/backend/nagarajan.sock backend.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl start nagarajan
sudo systemctl enable nagarajan
sudo systemctl status nagarajan
```

---

## 8. Nginx Configuration

```bash
sudo tee /etc/nginx/sites-available/nagarajan << 'EOF'
server {
    listen 80;
    server_name profile2connect.com www.profile2connect.com 51.21.169.213;

    # Frontend (React)
    location / {
        root /var/www/nagarajan/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/nagarajan/backend/nagarajan.sock;
    }

    # Django Admin
    location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/nagarajan/backend/nagarajan.sock;
    }

    # Django static files (for admin)
    location /django-static/ {
        alias /var/www/nagarajan/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /var/www/nagarajan/backend/media/;
    }

    client_max_body_size 50M;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/nagarajan /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

---

## 9. SSL Certificate (HTTPS)

```bash
# Install SSL certificate
sudo certbot --nginx -d profile2connect.com -d www.profile2connect.com --non-interactive --agree-tos --email ram@profile2connect.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 10. Domain DNS Setup (GoDaddy)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 51.21.169.213 | 600 |
| A | www | 51.21.169.213 | 600 |
| A | * | 51.21.169.213 | 600 |

**Note**: Delete any existing CNAME for `www` before adding A record.

---

## 11. Subdomain Configuration (username.profile2connect.com)

This allows each user to have their own subdomain like `raamamoorthy.profile2connect.com`.

### Step 1: DNS Wildcard Record (GoDaddy)

Add a wildcard A record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | * | 51.21.169.213 | 600 |

This routes ALL subdomains (*.profile2connect.com) to your server.

### Step 2: Wildcard SSL Certificate

Regular SSL certs only cover the main domain. You need a wildcard certificate for subdomains.

**Important**: Wildcard certs require DNS-01 challenge (not HTTP), so you need to add a TXT record.

```bash
# SSH to server
ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213

# Request wildcard certificate
sudo certbot certonly --manual --preferred-challenges dns \
  -d profile2connect.com \
  -d "*.profile2connect.com"
```

When prompted, certbot will display something like:
```
Please deploy a DNS TXT record under the name:
_acme-challenge.profile2connect.com
with the following value:
xYz123AbC456... (random string)
```

**Add the TXT record in GoDaddy:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | _acme-challenge | xYz123AbC456... | 600 |

Wait 1-2 minutes for DNS propagation, then press Enter in the terminal.

**Verify the certificate was created:**
```bash
sudo ls -la /etc/letsencrypt/live/profile2connect.com/
# Should show: fullchain.pem, privkey.pem, etc.
```

### Step 3: Nginx Subdomain Configuration

Create a separate nginx config for subdomains:

```bash
sudo tee /etc/nginx/sites-available/nagarajan-subdomains << 'EOF'
# Wildcard subdomain handler for user profiles
server {
    listen 80;
    listen 443 ssl;
    server_name ~^(?<subdomain>[^.]+)\.profile2connect\.com$;

    # SSL certificates (wildcard)
    ssl_certificate /etc/letsencrypt/live/profile2connect.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/profile2connect.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }

    # Frontend - React handles subdomain detection
    location / {
        root /var/www/nagarajan/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/var/www/nagarajan/backend/nagarajan.sock;
    }

    # Media files
    location /media/ {
        alias /var/www/nagarajan/backend/media/;
    }

    client_max_body_size 50M;
}
EOF

# Enable the subdomain config
sudo ln -sf /etc/nginx/sites-available/nagarajan-subdomains /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Frontend Subdomain Detection

The React app detects subdomains using `frontend/src/utils/subdomain.js`:

```javascript
// Detects if user is on a subdomain like raamamoorthy.profile2connect.com
export const getSubdomainUsername = () => {
  const hostname = window.location.hostname;
  const match = hostname.match(/^([^.]+)\.profile2connect\.com$/);
  if (match && match[1] !== 'www') {
    return match[1]; // Returns "raamamoorthy"
  }
  return null;
};
```

In `App.js`, when a subdomain is detected, it renders only public routes (no login/register):
- `/` → Profile page
- `/education` → Education page
- `/career` → Career page
- `/blog` → Blog page
- `/resume` → Resume page
- `/contact` → Contact page

### Step 5: Django ALLOWED_HOSTS

Update Django settings to accept all subdomains:

```python
# backend/settings.py
ALLOWED_HOSTS = [
    'profile2connect.com',
    'www.profile2connect.com',
    '.profile2connect.com',  # This allows ALL subdomains
    '51.21.169.213',
    'localhost',
]
```

Also update CORS settings:
```python
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://\w+\.profile2connect\.com$",
]
```

### Step 6: Where Users See Their Subdomain URL

Users can find their public profile URL in:
1. **Dashboard Settings page** - Shows their subdomain URL
2. **Profile Preview** - Shows the public link

Format: `https://{username}.profile2connect.com`

### Subdomain Troubleshooting

**Issue: "Not Secure" warning on subdomain**
```bash
# Verify wildcard cert covers subdomains
sudo certbot certificates

# Should show:
# Domains: profile2connect.com, *.profile2connect.com
```

**Issue: Subdomain shows login page instead of profile**
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure latest frontend is deployed
- Check App.js has subdomain routing logic

**Issue: Subdomain returns 404**
```bash
# Check nginx config is enabled
ls -la /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

**Issue: API calls fail on subdomain**
```bash
# Verify CORS settings allow subdomain origin
# Check Django logs
sudo journalctl -u nagarajan -f
```

### Renewing Wildcard SSL Certificate

Wildcard certs can't auto-renew via HTTP challenge. You must manually renew:

```bash
# Renew certificate (every 90 days)
sudo certbot certonly --manual --preferred-challenges dns \
  -d profile2connect.com \
  -d "*.profile2connect.com"

# Add the new TXT record when prompted
# Then reload nginx
sudo systemctl reload nginx
```

**Tip**: Set a calendar reminder for 60 days after certificate creation.

---

## 12. Deploying to a New Domain

If you want to deploy this app to a different domain (e.g., `newdomain.com`):

### Checklist

1. **DNS Records** (at your domain registrar):
   ```
   A    @    YOUR_SERVER_IP
   A    www  YOUR_SERVER_IP
   A    *    YOUR_SERVER_IP    (for subdomains)
   ```

2. **Update Frontend** (`frontend/src/utils/subdomain.js`):
   ```javascript
   // Change profile2connect.com to your domain
   const match = hostname.match(/^([^.]+)\.newdomain\.com$/);
   ```

3. **Update Frontend** (`.env.production`):
   ```
   REACT_APP_API_URL=https://newdomain.com/api
   ```

4. **Update Backend** (`backend/settings.py`):
   ```python
   ALLOWED_HOSTS = [
       'newdomain.com',
       'www.newdomain.com',
       '.newdomain.com',
       'YOUR_SERVER_IP',
   ]

   CORS_ALLOWED_ORIGIN_REGEXES = [
       r"^https://\w+\.newdomain\.com$",
   ]
   ```

5. **Update Nginx** (`/etc/nginx/sites-available/nagarajan`):
   ```nginx
   server_name newdomain.com www.newdomain.com;
   ```

6. **Update Nginx Subdomains** (`/etc/nginx/sites-available/nagarajan-subdomains`):
   ```nginx
   server_name ~^(?<subdomain>[^.]+)\.newdomain\.com$;
   ```

7. **Get SSL Certificates**:
   ```bash
   # Main domain
   sudo certbot --nginx -d newdomain.com -d www.newdomain.com

   # Wildcard (for subdomains)
   sudo certbot certonly --manual --preferred-challenges dns \
     -d newdomain.com -d "*.newdomain.com"
   ```

8. **Update Nginx SSL paths** in subdomain config:
   ```nginx
   ssl_certificate /etc/letsencrypt/live/newdomain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/newdomain.com/privkey.pem;
   ```

9. **Build and Deploy Frontend**:
   ```bash
   cd D:\PYDJ\Nagarajan\frontend
   npm run build
   scp -i "YOUR_KEY.pem" -r build/* ubuntu@YOUR_IP:/var/www/nagarajan/frontend/build/
   ```

10. **Reload Services**:
    ```bash
    sudo systemctl restart nagarajan
    sudo systemctl reload nginx
    ```

---

## 13. AWS Security Group

Ensure these inbound rules are set:

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | Your IP or 0.0.0.0/0 |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

---

## Common Commands

### Service Management
```bash
# Restart Django app
sudo systemctl restart nagarajan

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nagarajan
sudo systemctl status nginx
```

### View Logs
```bash
# Django/Gunicorn logs
sudo journalctl -u nagarajan -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Database
```bash
# Access PostgreSQL
sudo -u postgres psql nagarajan_db

# Backup database
sudo -u postgres pg_dump nagarajan_db > backup_$(date +%Y%m%d).sql

# Restore database
sudo -u postgres psql nagarajan_db < backup.sql
```

---

## Update Deployment

### Backend Changes Only
```bash
ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213

cd /var/www/nagarajan/backend
source venv/bin/activate
# (upload new files or git pull)
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart nagarajan
```

### Frontend Changes Only
```bash
# On Windows
cd D:\PYDJ\Nagarajan\frontend
npm run build
tar -czf build.tar.gz build
scp -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" build.tar.gz ubuntu@51.21.169.213:/var/www/nagarajan/frontend/

# On Server
ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213
cd /var/www/nagarajan/frontend
rm -rf build && tar -xzf build.tar.gz && rm build.tar.gz
```

---

## Troubleshooting

### 502 Bad Gateway
```bash
# Check if Gunicorn is running
sudo systemctl status nagarajan

# Check socket exists
ls -la /var/www/nagarajan/backend/nagarajan.sock

# Check logs
sudo journalctl -u nagarajan -n 100
```

### Site Not Loading
```bash
# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check DNS
nslookup profile2connect.com
```

### Permission Issues
```bash
sudo chown -R ubuntu:www-data /var/www/nagarajan
sudo chmod -R 755 /var/www/nagarajan
```

### Out of Memory (Build fails)
```bash
# Check memory
free -m

# Add swap if needed
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## Quick Reference

| Task | Command |
|------|---------|
| SSH to server | `ssh -i "D:\PYDJ\KrossIQ-Admin\krossiq.pem" ubuntu@51.21.169.213` |
| Restart Django | `sudo systemctl restart nagarajan` |
| Restart Nginx | `sudo systemctl restart nginx` |
| View Django logs | `sudo journalctl -u nagarajan -f` |
| View Nginx logs | `sudo tail -f /var/log/nginx/error.log` |
| Renew SSL | `sudo certbot renew` |
| DB console | `sudo -u postgres psql nagarajan_db` |

---

## Email Configuration (Zoho Mail)

The site uses Zoho Mail for sending verification and password reset emails.

**Settings in `backend/settings.py`:**
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtppro.zoho.in'  # India region
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_HOST_USER = 'no-reply@profile2connect.com'
EMAIL_HOST_PASSWORD = 'your-zoho-password'
DEFAULT_FROM_EMAIL = 'Profile2Connect <no-reply@profile2connect.com>'
```

**Zoho Mail Setup:**
1. Login to https://mail.zoho.com with `no-reply@profile2connect.com`
2. Settings → Mail Accounts → IMAP tab → Enable IMAP Access
3. If 2FA enabled: https://accounts.zoho.com → Security → App Passwords → Generate

---

## Credentials

| Service | Username | Password |
|---------|----------|----------|
| Django Admin | raamamoorthy | (set in admin) |
| PostgreSQL | nagarajan_user | Nag@r@j@n2026! |
| SSH | ubuntu | (key-based) |
| Zoho Mail | no-reply@profile2connect.com | xiq@2026 |

---

*Last updated: March 21, 2026*
*Domain: profile2connect.com*
