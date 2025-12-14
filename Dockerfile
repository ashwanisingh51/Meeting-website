FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 3000 3001

# Build Next.js
RUN npm run build

# Start both frontend and backend
CMD ["sh", "-c", "npm run server &amp; npm start"]
