#!/bin/sh

# Extract host and port from DATABASE_URL if available
if [ -n "$DATABASE_URL" ]; then
  # Remove the protocol part
  PROTO_REMOVED=$(echo "$DATABASE_URL" | sed -e 's/^.*:\/\///')
  # Remove the auth part (before @)
  AUTH_REMOVED=$(echo "$PROTO_REMOVED" | sed -e 's/^.*@//')
  # Get host and port (before /)
  HOST_PORT=$(echo "$AUTH_REMOVED" | cut -d'/' -f1)
  # Extract host and port
  DB_HOST=$(echo "$HOST_PORT" | cut -d':' -f1)
  DB_PORT=$(echo "$HOST_PORT" | cut -d':' -f2)
  
  # Default port if not specified
  if [ "$DB_PORT" = "$DB_HOST" ]; then
    DB_PORT=5432
  fi
else
  DB_HOST="db"
  DB_PORT=5432
fi

echo "Waiting for database at $DB_HOST:$DB_PORT..."
if command -v nc >/dev/null 2>&1; then
  # Timeout after 30 seconds to prevent infinite hang in hosting panels
  count=0
  while ! nc -z "$DB_HOST" "$DB_PORT"; do
    sleep 1
    count=$((count+1))
    if [ $count -gt 30 ]; then
      echo "Warning: Database connection check timeout ($DB_HOST:$DB_PORT). Attempting to proceed anyway..."
      break
    fi
  done
else
  echo "netcat not found, sleeping 5 seconds..."
  sleep 5
fi

echo "Database is reachable or check bypassed!"

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
