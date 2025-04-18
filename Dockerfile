# Use official Node.js image
FROM node:16

# Create and set the working directory for the application
WORKDIR /app

# Copy backend package.json and package-lock.json
COPY backend/package.json backend/package-lock.json ./backend/

# Set the working directory to /app/backend
WORKDIR /app/backend

# Install backend dependencies
RUN npm install

# Copy frontend files into the container's frontend directory
COPY frontend /app/frontend

# Copy the backend code into the backend directory
COPY backend /app/backend

# Set the working directory back to /app/backend to start the app
WORKDIR /app/backend

# Expose port for the backend application
EXPOSE 3000

# Start the backend application
CMD ["node", "server.js"]
