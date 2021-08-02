#!/bin/sh
echo "Testing auth microservice.."
cd auth 
npx jest
cd ..

echo "Testing tickets microservice.."
cd tickets 
npx jest
cd ..

echo "Testing orders microservice.."
cd orders 
npx jest
cd ..

echo "Testing expiration microservice.."
cd expiration 
npx jest
cd ..
