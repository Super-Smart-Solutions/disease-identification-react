FROM nginx:1.25-alpine

# Set working directory
WORKDIR /etc/nginx

# Copy Nginx configuration template
COPY conf.d/default.conf.template /etc/nginx/conf.d/default.conf.template

# Copy built React app from the React container
COPY ../dist /usr/share/nginx/html

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose necessary ports
EXPOSE 80 443

# Use entrypoint script for env variable substitution
ENTRYPOINT ["/entrypoint.sh"]
