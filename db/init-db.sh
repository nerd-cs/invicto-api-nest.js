#!/bin/bash
export PGPASSWORD=${DB_PWD}; psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -f invicto.sql
export PGPASSWORD=${DB_PWD}; psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -f test-data.sql
