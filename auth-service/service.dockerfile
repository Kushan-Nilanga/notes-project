# node alpine
FROM node:alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY index.js /app/

# Expose port 3000
EXPOSE 3000

# Run app
CMD ["node", "index.js"]