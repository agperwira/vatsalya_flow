#!/bin/sh

echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is up and running!"

echo "Running Prisma migrations/db push..."
npx prisma db push --accept-data-loss

if [ "$SEED_DB" = "true" ]; then
  echo "Seeding database..."
  node prisma/seed.js
else
  echo "Skipping seeding (SEED_DB is not true)..."
fi

echo "Starting Next.js application..."
exec npm run start
