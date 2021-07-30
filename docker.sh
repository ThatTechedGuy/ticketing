#!/bin/sh
echo "Dockerizing auth service.."
cd auth 
docker build -t auth .
cd ..

echo "Dockerizing tickets microservice.."
cd tickets 
docker build -t tickets .
cd ..

echo "Dockerizing orders microservice.."
cd orders 
docker build -t orders .
cd ..

echo "Installing client dependencies.."
cd client 
docker build -t client .
cd ..
