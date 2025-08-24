#!/bin/bash

# SSL Certificate Setup Script
# Run this after the main setup if SSL setup failed

set -e

DOMAIN="agent.kyrexi.tech"
EMAIL="tripathipranav14@gmail.com" 
PROJECT_DIR="/opt/obligence-backend"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# # Check if domain resolves correctly
# check_domain() {
#     log "Checking domain resolution..."
    
#     DOMAIN_IP=$(dig +short $DOMAIN)
#     SERVER_IP=$(curl -s https://ipinfo.io/ip)
    
#     echo "Domain $DOMAIN resolves to: $DOMAIN_IP"
#     echo "This server IP: $SERVER_IP"
    
#     if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
#         error "Domain does not resolve to this server. Please update DNS records first."
#     fi
    
#     log "✅ Domain resolution verified"
# }

# Setup SSL certificate
setup_ssl() {
    log "Setting up SSL certificate..."
    
    cd $PROJECT_DIR
    
    # Ensure we're using HTTP-only config
    sudo -u obligence cp nginx/conf.d/initial.conf nginx/conf.d/default.conf
    
    # Restart nginx with HTTP config
    sudo -u obligence docker-compose restart nginx
    
    # Wait for nginx to start
    sleep 5
    
    # Test HTTP access
    if ! curl -s "http://localhost/.well-known/acme-challenge/" > /dev/null 2>&1; then
        warning "HTTP access test failed, but continuing..."
    fi
    
    # Stop existing certbot container if running
    sudo -u obligence docker-compose stop certbot 2>/dev/null || true
    
    # Request certificate
    log "Requesting SSL certificate from Let's Encrypt..."
    sudo -u obligence docker-compose run --rm certbot \
        certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d $DOMAIN
    
    # Check if certificate was created
    if [ ! -f "./certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
        error "Certificate generation failed"
    fi
    
    # Switch to HTTPS configuration
    log "Switching to HTTPS configuration..."
    sudo -u obligence cp nginx/conf.d/agent.kyrexi.tech.conf nginx/conf.d/default.conf
    
    # Restart nginx
    sudo -u obligence docker-compose restart nginx
    
    # Test HTTPS
    sleep 5
    if curl -s "https://$DOMAIN/health" > /dev/null; then
        log "✅ SSL certificate setup successful!"
        log "🌐 Your API is now available at: https://$DOMAIN/docs"
    else
        error "HTTPS test failed"
    fi
}

main() {
    
    check_domain
    setup_ssl
    
    log "🎉 SSL setup completed!"
    log "Visit: https://$DOMAIN/docs"
}

main "$@"
