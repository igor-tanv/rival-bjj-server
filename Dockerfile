# Base image for Node.js
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port (e.g., 3000; adjust if your app uses a different port)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
