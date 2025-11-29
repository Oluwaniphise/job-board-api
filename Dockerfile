# Stage 1: Build the application (Builder Stage)
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies (dev and prod) needed for compilation
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the NestJS application (output goes to /dist)
RUN npm run build

# ---
# Stage 2: Create the final lean image (Production Stage)
# ---

# Use a minimal production-ready Node.js image
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json again
COPY package*.json ./

# Install only production dependencies
# The --omit=dev flag is crucial for size reduction
RUN npm install --omit=dev

# Copy the build output (the JavaScript code) from the builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables for NestJS
ENV NODE_ENV production
ENV PORT 4000

# Expose the port the NestJS application runs on
EXPOSE 4000

# Define the command to run the application
CMD [ "node", "dist/main" ]