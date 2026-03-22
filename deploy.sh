#!/bin/bash
# Deploy script for Profile2Connect

echo "Building frontend..."
cd "$(dirname "$0")/frontend"
npm run build

echo "Uploading to server..."
scp -i "D:/PYDJ/KrossIQ-Admin/krossiq.pem" -r build/* ubuntu@51.21.169.213:/var/www/nagarajan/frontend/build/

echo "Reloading nginx..."
ssh -i "D:/PYDJ/KrossIQ-Admin/krossiq.pem" ubuntu@51.21.169.213 "sudo systemctl reload nginx"

echo "Deploy complete!"
