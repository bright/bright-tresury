#postgres
docker run -p 3567:3567
  -e POSTGRESQL_USER=web \
  -e POSTGRESQL_PASSWORD= \
  -e POSTGRESQL_HOST=localhost \
  -e POSTGRESQL_PORT=5432 \
  -e POSTGRESQL_DATABASE_NAME=treasury \
  -d supertokens/supertokens-postgresql \
  --network host

#in-memory
docker run -p 3567:3567 -d supertokens/supertokens-postgresql
