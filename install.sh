#!/bin/sh
echo "Upgrading auth service.."
cd auth 
npx npm-check --update-all
npm i
cd ..

echo "Upgrading tickets microservice.."
cd tickets 
npx npm-check --update-all
npm i
cd ..

echo "Upgrading orders microservice.."
cd orders 
npx npm-check --update-all
npm i
cd ..

echo "Installing client dependencies.."
cd client 
npm i
cd ..

echo "Upgrading orders microservice.."
cd ticketing-common 
npx npm-check --update-all
npm i
cd ..

echo "Upgrading nats-test packages..." 
cd nats-test
npx npm-check --update-all
npm i 
cd ..

echo "Upgrading common library..." 
cd ticketing-common 
npx npm-check --update-all
npm i 
cd ..

echo "Upgrading expiration microservice..." 
cd expiration 
npx npm-check --update-all
npm i 
cd ..