#!/usr/bin/env bash

psql --echo-all --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE ROLE deployer WITH LOGIN SUPERUSER;
CREATE ROLE web WITH LOGIN;
CREATE DATABASE "treasury" WITH OWNER deployer;
CREATE DATABASE "treasury_test" WITH OWNER deployer;
EOSQL

for db_name in treasury treasury_test; do
    echo "Setup web role access for $db_name"
psql --echo-all --username "deployer" --dbname ${db_name} <<-EOSQL
alter default privileges in schema public grant select, insert, update, delete, truncate on tables to web;
alter default privileges in schema public grant all on sequences to web;
EOSQL
done




docker run \
  -p 3567:3567 \
  --env POSTGRESQL_USER=supertokens_user \
  --env POSTGRESQL_PASSWORD=password \
  --env POSTGRESQL_HOST=127.0.0.1 \
  --env POSTGRESQL_PORT=5432 \
  --env POSTGRESQL_DATABASE_NAME=treasury \
  -d supertokens/supertokens-postgresql \
  --network host
