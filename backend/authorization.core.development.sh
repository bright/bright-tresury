IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2)
docker run --name authorization_core \
	-p 3567:3567 \
	-e POSTGRESQL_USER=authorization_manager \
	-e POSTGRESQL_PASSWORD=password \
	-e POSTGRESQL_HOST=192.168.1.3 \
	-e POSTGRESQL_PORT=5432 \
  -e POSTGRESQL_DATABASE_NAME=treasury_authorization \
	-d supertokens/supertokens-postgresql:3.3

