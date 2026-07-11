# Pinned version instead of :latest so deployments are reproducible
FROM nginx:1.28-alpine

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
