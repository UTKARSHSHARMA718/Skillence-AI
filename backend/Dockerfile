FROM node:20-alpine

WORKDIR /var/www/html

# Install dependencies
RUN apk update && apk add --no-cache \
    python3  

# Copy start script
COPY start.sh .

RUN chmod +x start.sh

USER root

CMD ["/bin/sh", "start.sh"]