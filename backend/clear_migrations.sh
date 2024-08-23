#!/bin/bash

# Directory containing your Django apps
APPS_DIR="."

# Find all migrations directories and delete all files except __init__.py
find $APPS_DIR -path "*/migrations/*.py" ! -name "__init__.py" -delete
find $APPS_DIR -path "*/migrations/*.pyc" -delete

echo "All migration files (except __init__.py) have been deleted."
