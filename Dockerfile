# Use official Node.js image
FROM node:16

# Create and set working directory
WORKDIR /app

# Copy the backend package.json and install dependencies
COPY backend/package.json /app/backend/package.json
WORKDIR /app/backend
RUN npm install

# Copy the frontend files into the backend directory (this will be served by Express)
COPY frontend /app/frontend

# Copy the backend code
COPY backend /app/backend

# Set the working directory back to the backend
WORKDIR /app/backend

# Expose port for the application
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
