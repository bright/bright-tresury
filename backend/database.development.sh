docker build -t treasury-db ../deploy/database
docker run --name treasury-db -dp 5432:5432 treasury-db
