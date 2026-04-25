#!/bin/bash
set -e
sleep 0.1m
npm i 
npm run build
PORT=3000 npm run start
 