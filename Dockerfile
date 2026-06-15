FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

# Install dependencies based on package-lock.json
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Make entrypoint.sh executable
RUN chmod +x /app/entrypoint.sh

# Expose Next.js port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Execute startup entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
