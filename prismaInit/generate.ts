require('dotenv').config({ path: './src/config/env/database.env' });
const { execSync } = require('child_process');
execSync('npx prisma generate --schema=./src/prisma/schema.prisma', { stdio: 'inherit' });