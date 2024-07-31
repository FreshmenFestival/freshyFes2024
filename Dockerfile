# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the Firebase CLI globally
RUN npm install -g firebase-tools

# Copy the rest of the application code
COPY . .

# Expose the necessary ports
EXPOSE 8080 9000 9099 4000

# Run the Firebase emulators
CMD ["firebase", "emulators:start"]
