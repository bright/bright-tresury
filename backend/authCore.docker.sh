#postgres
docker run \
	-p 3567:3567 \
	-e POSTGRESQL_USER=deployer \
	-e POSTGRESQL_PASSWORD= \
	-e POSTGRESQL_HOST=192.168.1.3 \
	-e POSTGRESQL_PORT=5432 \
  -e POSTGRESQL_DATABASE_NAME=treasury \
	-d supertokens/supertokens-postgresql

#in-memory
docker run -p 3567:3567 -d supertokens/supertokens-postgresql

# using config.yaml
docker run \
	-p 3567:3567 \
  -v /Users/szymon_miloch/Documents/Projects/Treasury/treasury/backend/config.yaml:/usr/lib/supertokens/config.yaml \
	-d supertokens/supertokens-postgresql \
	--network host
