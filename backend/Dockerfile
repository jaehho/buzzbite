# backend/Dockerfile

# Use the official Python image as a base image
FROM python:latest

# Set the working directory inside the image
WORKDIR /app

# Copy the requirements file into the image
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
