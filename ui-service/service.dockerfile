# node alpine
FROM node:alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# jest test
RUN npx jest

# Expose port 3000
EXPOSE 3000

# Run app
CMD ["npm", "start"]