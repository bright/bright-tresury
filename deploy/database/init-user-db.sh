#!/usr/bin/env bash

psql --echo-all --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE ROLE deployer WITH LOGIN SUPERUSER;
CREATE ROLE web WITH LOGIN;
CREATE ROLE authorization_manager WITH LOGIN PASSWORD 'password';

CREATE DATABASE "treasury" WITH OWNER deployer;
CREATE DATABASE "treasury_test" WITH OWNER deployer;
CREATE DATABASE "treasury_authorization" WITH OWNER deployer;
CREATE DATABASE "treasury_authorization_test" WITH OWNER deployer;

EOSQL

for db_name in treasury_authorization treasury_authorization_test; do
    echo "Setup access for $db_name"
psql --echo-all --username "deployer" --dbname ${db_name} <<-EOSQL
alter default privileges in schema public grant select, insert, update, delete, truncate on tables to authorization_manager;
alter default privileges in schema public grant all on sequences to authorization_manager;

alter default privileges for user authorization_manager in schema public grant select, insert, update, delete, truncate ON TABLES TO web;
alter default privileges for user authorization_manager in schema public grant all on sequences to web;
EOSQL
done

for db_name in treasury treasury_test; do
    echo "Setup access for $db_name"
psql --echo-all --username "deployer" --dbname ${db_name} <<-EOSQL
grant all privileges on all tables in schema public to web;
grant all privileges on all sequences in schema public to web;
alter default privileges in schema public grant select, insert, update, delete, truncate on tables to web;
alter default privileges in schema public grant all on sequences to web;
EOSQL
done
