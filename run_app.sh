# Function to bring down Docker Compose when the script exits
cleanup() {
    echo "Stopping Docker Compose..."
    docker-compose down
}

# Trap the EXIT signal to run the cleanup function
trap cleanup EXIT

# Step 1: Start Docker Compose
echo "Starting Docker Compose..."
docker-compose up -d

# Step 2: Navigate to the React Native project directory
cd frontend/

# Step 3: Install dependencies (optional, but recommended)
echo "Installing dependencies..."
npm install

# Step 4: Start the React Native Expo app
echo "Starting the React Native Expo app..."
npm start
