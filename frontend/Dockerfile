# Use the official Node.js 22 image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install the dependencies, including expo
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Expose port 19000 for Expo DevTools, 19001 for the app, and 19002 for the Web UI
EXPOSE 19000 19001 19002

# # Start the Expo CLI using npx
# CMD ["npm", "start"]

# Keep the container running by starting a shell
CMD ["sh", "-c", "while :; do sleep 1; done"]