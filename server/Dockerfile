FROM node:18

# Install necessary system dependencies for sharp
RUN apt-get update && apt-get install -y \
  bash \
  build-essential \
  libvips-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Remove node_modules and cache if they exist
RUN rm -rf node_modules && npm cache clean --force

# Copy package.json and install dependencies
COPY package*.json ./

# Install dependencies with platform-specific flags
RUN npm install --platform=linux --arch=arm64

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "dev"]
