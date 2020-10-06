#!/usr/bin/env bash

psql --echo-all --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE ROLE deployer WITH LOGIN SUPERUSER;
CREATE ROLE web WITH LOGIN;
CREATE DATABASE "PROJECT_NAME" WITH OWNER deployer;
CREATE DATABASE "PROJECT_NAME_test" WITH OWNER deployer;
EOSQL

for db_name in PROJECT_NAME PROJECT_NAME_test; do
    echo "Setup web role access for $db_name"
psql --echo-all --username "deployer" --dbname ${db_name} <<-EOSQL
alter default privileges in schema public grant select, insert, update, delete, truncate on tables to web;
alter default privileges in schema public grant all on sequences to web;
EOSQL
done
