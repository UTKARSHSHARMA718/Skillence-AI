#!/bin/bash
set -e
npm i
# npx prisma init
# npm run generate
npx prisma@6 generate
npx prisma db push
npm run build
PORT=4000 npm run start:prod