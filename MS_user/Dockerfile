FROM node:18-alpine

WORKDIR /app

# Copy only package.json and lock file first
COPY package*.json ./
RUN npm install
RUN npm install bcryptjs


COPY . .

EXPOSE 5000

CMD ["npx", "nodemon", "app.js"]
