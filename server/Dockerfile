FROM node:18

RUN apt-get update && apt-get install -y \
  sox \
  libsox-fmt-all \
  ffmpeg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN rm -rf node_modules && npm cache clean --force

COPY package*.json ./

RUN npm install

RUN mkdir -p /app/data/audios && chown -R node:node /app/data/audios
RUN chmod -R 755 /app/data/audios


COPY . .

# Expose application port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "dev"]
