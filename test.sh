#!/bin/sh
echo "Running tests on auth service.."
cd auth 
npx npm-check --update-all
npm i
npx jest
cd ..

echo "Upgrading tickets microservice.."
cd tickets 
npx npm-check --update-all
npm i
npx jest
cd ..

echo "Upgrading orders microservice.."
cd orders 
npx npm-check --update-all
npm i
npx jest
cd ..