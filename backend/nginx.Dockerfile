FROM nginx:1.19-alpine
RUN apk add openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=PL/ST=Gdansk/L=Gdansk/O=Bright Inventions/OU=./CN=brightinventions.pl"
RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
ADD backend/nginx.conf /etc/nginx/nginx.conf
