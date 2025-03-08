FROM nginx:1.25-alpine

WORKDIR /etc/nginx

COPY conf.d/default.conf.template /etc/nginx/conf.d/default.conf.template

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose necessary ports
EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
