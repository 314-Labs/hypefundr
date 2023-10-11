#!/bin/sh

# Specify the output file (your .env file)
output_file=".env"

# Create or truncate the output file
> "$output_file"

# Loop through all the environment variables and write them to the .env file
for var in $(printenv | cut -d= -f1); do
  value=$(printenv "$var")
  echo "$var=$value" >> "$output_file"
done

# Optional: Print a message to indicate the operation is complete
echo "Environment variables have been written to $output_file"
ls -la
npm run build

# start
node -r dotenv/config build