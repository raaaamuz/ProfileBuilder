"""
Management command to provision SSL certificates for verified custom domains.
Run this via cron every few minutes to automatically provision domains.

Usage:
    python manage.py provision_custom_domains
    python manage.py provision_custom_domains --domain example.com
"""

import subprocess
import os
from django.core.management.base import BaseCommand
from profiles.models import CustomDomain


class Command(BaseCommand):
    help = 'Provision SSL certificates for verified custom domains'

    def add_arguments(self, parser):
        parser.add_argument(
            '--domain',
            type=str,
            help='Provision a specific domain only',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def handle(self, *args, **options):
        specific_domain = options.get('domain')
        dry_run = options.get('dry_run', False)

        # Get domains that need provisioning
        if specific_domain:
            domains = CustomDomain.objects.filter(
                domain=specific_domain,
                dns_verified=True,
                ssl_provisioned=False
            )
        else:
            domains = CustomDomain.objects.filter(
                dns_verified=True,
                ssl_provisioned=False,
                status='verified'
            )

        if not domains.exists():
            self.stdout.write(self.style.SUCCESS('No domains to provision'))
            return

        for custom_domain in domains:
            self.stdout.write(f'Processing: {custom_domain.domain}')

            if dry_run:
                self.stdout.write(self.style.WARNING(f'  [DRY RUN] Would provision {custom_domain.domain}'))
                continue

            try:
                # Step 1: Create nginx config
                self.create_nginx_config(custom_domain)

                # Step 2: Test nginx config
                if not self.test_nginx_config():
                    raise Exception('Nginx configuration test failed')

                # Step 3: Reload nginx
                self.reload_nginx()

                # Step 4: Request SSL certificate
                self.request_ssl_certificate(custom_domain)

                # Step 5: Update nginx config with SSL
                self.update_nginx_with_ssl(custom_domain)

                # Step 6: Reload nginx again
                self.reload_nginx()

                # Step 7: Update database
                custom_domain.ssl_provisioned = True
                custom_domain.status = 'active'
                custom_domain.verification_error = None
                custom_domain.save()

                self.stdout.write(self.style.SUCCESS(f'  Successfully provisioned {custom_domain.domain}'))

            except Exception as e:
                custom_domain.status = 'failed'
                custom_domain.verification_error = str(e)
                custom_domain.save()
                self.stdout.write(self.style.ERROR(f'  Failed to provision {custom_domain.domain}: {e}'))

    def create_nginx_config(self, custom_domain):
        """Create initial nginx config for HTTP (needed for certbot verification)"""
        config = f"""# Custom domain config for {custom_domain.user.username}
server {{
    listen 80;
    server_name {custom_domain.domain};

    # Frontend (React)
    location / {{
        root /var/www/nagarajan/frontend/build;
        try_files $uri $uri/ /index.html;
    }}

    # Backend API
    location /api/ {{
        include proxy_params;
        proxy_pass http://unix:/var/www/nagarajan/backend/nagarajan.sock;
    }}

    # Media files
    location /media/ {{
        alias /var/www/nagarajan/backend/media/;
    }}
}}
"""
        config_path = f'/etc/nginx/sites-available/custom-{custom_domain.domain}'
        symlink_path = f'/etc/nginx/sites-enabled/custom-{custom_domain.domain}'

        # Write config file
        with open(config_path, 'w') as f:
            f.write(config)

        # Create symlink if not exists
        if not os.path.exists(symlink_path):
            os.symlink(config_path, symlink_path)

        self.stdout.write(f'  Created nginx config: {config_path}')

    def test_nginx_config(self):
        """Test nginx configuration"""
        result = subprocess.run(['sudo', 'nginx', '-t'], capture_output=True, text=True)
        return result.returncode == 0

    def reload_nginx(self):
        """Reload nginx to apply changes"""
        subprocess.run(['sudo', 'systemctl', 'reload', 'nginx'], check=True)
        self.stdout.write('  Reloaded nginx')

    def request_ssl_certificate(self, custom_domain):
        """Request SSL certificate from Let's Encrypt"""
        result = subprocess.run([
            'sudo', 'certbot', 'certonly',
            '--nginx',
            '-d', custom_domain.domain,
            '--non-interactive',
            '--agree-tos',
            '--email', 'admin@profile2connect.com',
            '--expand'
        ], capture_output=True, text=True)

        if result.returncode != 0:
            raise Exception(f'Certbot failed: {result.stderr}')

        self.stdout.write(f'  Obtained SSL certificate for {custom_domain.domain}')

    def update_nginx_with_ssl(self, custom_domain):
        """Update nginx config to use SSL"""
        config = f"""# Custom domain config for {custom_domain.user.username}
server {{
    listen 80;
    server_name {custom_domain.domain};
    return 301 https://$host$request_uri;
}}

server {{
    listen 443 ssl;
    server_name {custom_domain.domain};

    ssl_certificate /etc/letsencrypt/live/{custom_domain.domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{custom_domain.domain}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 100M;

    # Frontend (React)
    location / {{
        root /var/www/nagarajan/frontend/build;
        try_files $uri $uri/ /index.html;
    }}

    # Backend API
    location /api/ {{
        include proxy_params;
        proxy_pass http://unix:/var/www/nagarajan/backend/nagarajan.sock;
    }}

    # Media files
    location /media/ {{
        alias /var/www/nagarajan/backend/media/;
    }}
}}
"""
        config_path = f'/etc/nginx/sites-available/custom-{custom_domain.domain}'

        with open(config_path, 'w') as f:
            f.write(config)

        self.stdout.write(f'  Updated nginx config with SSL: {config_path}')
