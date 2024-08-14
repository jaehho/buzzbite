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

# Step 2: Start Expo
echo "Starting the React Native Expo app..."
docker-compose exec -it frontend npm start