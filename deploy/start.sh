#!/bin/bash
set -a
source /var/www/intelesalud/.env.production
set +a
cd /var/www/intelesalud/.next/standalone
exec /usr/bin/node server.js
