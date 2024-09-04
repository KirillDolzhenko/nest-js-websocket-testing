require('dotenv').config({ path: './src/config/env/database.env' });
const { execSync: execSyncPush } = require('child_process');
execSyncPush('npx prisma generate --schema=./src/prisma/schema.prisma', { stdio: 'inherit' });