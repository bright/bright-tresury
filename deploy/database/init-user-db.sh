#!/usr/bin/env bash

psql --echo-all --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE ROLE deployer WITH LOGIN SUPERUSER;
CREATE ROLE web WITH LOGIN;
CREATE DATABASE "treasury" WITH OWNER deployer;
CREATE DATABASE "treasury_test" WITH OWNER deployer;
CREATE DATABASE "treasury_authorization" WITH OWNER deployer;

CREATE USER authorization_manager with encrypted password 'password';
GRANT ALL PRIVILEGES ON DATABASE "treasury_authorization" to authorization_manager;
EOSQL

for db_name in treasury treasury_test treasury_authorization; do
    echo "Setup web role access for $db_name"
psql --echo-all --username "deployer" --dbname ${db_name} <<-EOSQL
alter default privileges in schema public grant select, insert, update, delete, truncate on tables to web;
alter default privileges in schema public grant all on sequences to web;
EOSQL
done
