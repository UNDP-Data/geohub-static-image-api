#!/bin/bash

# This script must be executed after pnpm build to make sure node_modules is under build folder for production nodejs server
# npm ci
npm run build
rm -rf node_modules
npm ci --only=production
cp package.json build/.
mv node_modules build/.