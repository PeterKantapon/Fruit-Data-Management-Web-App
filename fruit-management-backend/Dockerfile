FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p src/uploads

EXPOSE 3001

# Use dev command
CMD ["npm", "run", "dev"]