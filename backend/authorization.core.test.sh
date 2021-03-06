IP_ADDRESS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2)
docker run --name authorization_core_test \
	-p 3568:3567 \
	-e POSTGRESQL_USER=authorization_manager \
	-e POSTGRESQL_PASSWORD=password \
	-e POSTGRESQL_HOST=$IP_ADDRESS \
	-e POSTGRESQL_PORT=5432 \
  -e POSTGRESQL_DATABASE_NAME=treasury_authorization_test \
	-d supertokens/supertokens-postgresql:3.3

