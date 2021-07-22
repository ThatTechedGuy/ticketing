#!/bin/sh
echo "Running tests on auth service.."
cd auth 
npx jest
cd ..

echo "Upgrading tickets microservice.."
cd tickets 
npx jest
cd ..

echo "Upgrading orders microservice.."
cd orders 
npx jest
cd ..