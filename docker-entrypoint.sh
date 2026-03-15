#!/bin/sh

# Wait for DB to be ready (though depends_on with healthcheck handles this, 
# sometimes the network bridge takes a second)
echo "Waiting for database to be fully ready..."
sleep 2

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Push the schema to the database (Best for Dev)
echo "Pushing database schema..."
npx prisma db push

# Start the application
echo "Starting Next.js dev server..."
npm run dev
