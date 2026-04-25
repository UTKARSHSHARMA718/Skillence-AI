FROM node:20-alpine

WORKDIR /var/www/html
# Install Python, make, and g++
#RUN apk add --no-cache python3 make g++

COPY start_prod.sh .

COPY start_dev.sh .

USER root
# Set the default command based on the NODE_ENV environment variable
ENTRYPOINT ["sh", "-c", "if [ \"$STAG\" = 'production' ]; then sh start_prod.sh; else sh start_dev.sh; fi"]
