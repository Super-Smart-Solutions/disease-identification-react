#!/bin/sh

# Render the Nginx configuration with environment variables
envsubst '$$SERVER_NAME $$CERT_BASE_PATH' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
exec nginx -g "daemon off;"
