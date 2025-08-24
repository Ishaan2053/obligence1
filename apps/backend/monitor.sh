#!/bin/bash

# Monitoring Script for Obligence Backend
# This script checks the health of all services and provides a status report

set -e

# Configuration
DOMAIN="agent.kyrexi.tech"
PROJECT_DIR="/opt/obligence-backend"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Symbols
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"

print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}       Obligence Backend Health Check${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

check_system() {
    echo -e "${BLUE}🖥️  System Status${NC}"
    echo "----------------------------------------"
    
    # Uptime
    uptime_info=$(uptime | sed 's/.*up //' | sed 's/, *[0-9]* users.*//')
    echo -e "Uptime: ${GREEN}$uptime_info${NC}"
    
    # Memory
    mem_info=$(free -h | awk 'NR==2{printf "Memory: %s/%s (%.2f%%)", $3,$2,$3*100/$2 }')
    echo -e "$mem_info"
    
    # Disk
    disk_info=$(df -h / | awk 'NR==2{printf "Disk: %s/%s (%s)", $3,$2,$5}')
    echo -e "$disk_info"
    
    echo ""
}

check_docker() {
    echo -e "${BLUE}🐳 Docker Status${NC}"
    echo "----------------------------------------"
    
    if systemctl is-active --quiet docker; then
        echo -e "${CHECK} Docker service is running"
    else
        echo -e "${CROSS} Docker service is not running"
        return 1
    fi
    
    cd $PROJECT_DIR
    
    # Check containers
    if docker-compose ps | grep -q "Up"; then
        echo -e "${CHECK} Docker containers are running"
        
        # Show container status
        echo ""
        echo "Container Status:"
        docker-compose ps --format "table {{.Name}}\t{{.State}}\t{{.Status}}"
    else
        echo -e "${CROSS} Docker containers are not running properly"
        echo ""
        echo "Container Status:"
        docker-compose ps
        return 1
    fi
    
    echo ""
}

check_nginx() {
    echo -e "${BLUE}🌐 Nginx Status${NC}"
    echo "----------------------------------------"
    
    cd $PROJECT_DIR
    
    if docker-compose exec -T nginx nginx -t &>/dev/null; then
        echo -e "${CHECK} Nginx configuration is valid"
    else
        echo -e "${CROSS} Nginx configuration has errors"
        docker-compose exec -T nginx nginx -t
    fi
    
    # Check if nginx is responding
    if curl -s "http://localhost" &>/dev/null; then
        echo -e "${CHECK} Nginx is responding to HTTP requests"
    else
        echo -e "${CROSS} Nginx is not responding to HTTP requests"
    fi
    
    echo ""
}

check_ssl() {
    echo -e "${BLUE}🔒 SSL Certificate Status${NC}"
    echo "----------------------------------------"
    
    if [ -f "$PROJECT_DIR/certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
        echo -e "${CHECK} SSL certificate exists"
        
        # Check expiration
        expiry_date=$(docker-compose -f $PROJECT_DIR/docker-compose.yml run --rm certbot \
            openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" \
            2>/dev/null | cut -d= -f2)
        
        if [ ! -z "$expiry_date" ]; then
            echo -e "Certificate expires: ${YELLOW}$expiry_date${NC}"
            
            # Check if expiring soon (less than 30 days)
            expiry_seconds=$(date -d "$expiry_date" +%s)
            current_seconds=$(date +%s)
            days_until_expiry=$(( ($expiry_seconds - $current_seconds) / 86400 ))
            
            if [ $days_until_expiry -lt 30 ]; then
                echo -e "${WARNING} Certificate expires in $days_until_expiry days - consider renewal"
            else
                echo -e "${CHECK} Certificate is valid for $days_until_expiry days"
            fi
        fi
        
        # Test HTTPS connection
        if curl -s "https://$DOMAIN/health" &>/dev/null; then
            echo -e "${CHECK} HTTPS is working"
        else
            echo -e "${CROSS} HTTPS connection failed"
        fi
    else
        echo -e "${CROSS} SSL certificate not found"
    fi
    
    echo ""
}

check_backend() {
    echo -e "${BLUE}🚀 Backend Application Status${NC}"
    echo "----------------------------------------"
    
    # Health check
    health_response=$(curl -s "https://$DOMAIN/health" 2>/dev/null || curl -s "http://$DOMAIN/health" 2>/dev/null)
    
    if [[ $health_response == *"healthy"* ]]; then
        echo -e "${CHECK} Backend health check passed"
        echo -e "Response: ${GREEN}$health_response${NC}"
    else
        echo -e "${CROSS} Backend health check failed"
        if [ ! -z "$health_response" ]; then
            echo -e "Response: ${RED}$health_response${NC}"
        fi
    fi
    
    # Check API documentation
    if curl -s "https://$DOMAIN/docs" &>/dev/null || curl -s "http://$DOMAIN/docs" &>/dev/null; then
        echo -e "${CHECK} API documentation is accessible"
    else
        echo -e "${CROSS} API documentation is not accessible"
    fi
    
    echo ""
}

check_logs() {
    echo -e "${BLUE}📋 Recent Log Analysis${NC}"
    echo "----------------------------------------"
    
    cd $PROJECT_DIR
    
    # Check for errors in backend logs
    error_count=$(docker-compose logs --tail=100 backend 2>/dev/null | grep -i "error\|exception\|fail" | wc -l)
    if [ $error_count -eq 0 ]; then
        echo -e "${CHECK} No recent errors in backend logs"
    else
        echo -e "${WARNING} Found $error_count recent errors in backend logs"
    fi
    
    # Check nginx error logs
    if [ -f "nginx/logs/error.log" ]; then
        nginx_errors=$(tail -n 100 nginx/logs/error.log 2>/dev/null | grep -v "^\s*$" | wc -l)
        if [ $nginx_errors -eq 0 ]; then
            echo -e "${CHECK} No recent errors in nginx logs"
        else
            echo -e "${WARNING} Found $nginx_errors recent nginx errors"
        fi
    fi
    
    echo ""
}

show_summary() {
    echo -e "${BLUE}📊 Quick Summary${NC}"
    echo "----------------------------------------"
    
    echo -e "${INFO} Service URLs:"
    echo -e "   Health: https://$DOMAIN/health"
    echo -e "   Docs:   https://$DOMAIN/docs"
    echo -e "   ReDoc:  https://$DOMAIN/redoc"
    echo ""
    
    echo -e "${INFO} Management commands:"
    echo -e "   Status:  systemctl status obligence"
    echo -e "   Restart: systemctl restart obligence"
    echo -e "   Logs:    cd $PROJECT_DIR && docker-compose logs -f"
    echo ""
}

main() {
    print_header
    
    # Run all checks
    check_system
    check_docker
    check_nginx
    check_ssl
    check_backend
    check_logs
    show_summary
    
    echo -e "${GREEN}Health check completed!${NC}"
}

# Run main function
main "$@"
