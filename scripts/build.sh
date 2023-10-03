#!/bin/bash

# This script must be executed after pnpm build to make sure node_modules is under build folder for production nodejs server
npm run build
rm -rf node_modules
npm install --omit=dev
cp package.json build/.
mv node_modules build/.