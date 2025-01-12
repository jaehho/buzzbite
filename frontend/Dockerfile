# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install the dependencies, including expo
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Define build-time arguments
ARG EXPO_USERNAME
ARG EXPO_PASSWORD

# Login to Expo using npx
RUN npx expo login -u "$EXPO_USERNAME" -p "$EXPO_PASSWORD"

# Expose port 19000 for Expo DevTools, 19001 for the app, and 19002 for the Web UI
EXPOSE 19000 19001 19002
