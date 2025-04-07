# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose the dev port
EXPOSE 5173

# Set environment variables for Vite
ENV VITE_API_URL=http://localhost:7000


# Start the dev server (for Vite)
CMD ["npm", "run", "dev", "--", "--host"]
