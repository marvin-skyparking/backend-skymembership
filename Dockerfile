# Use a smaller base image for Node.js
FROM node:20.11

# Create and set the working directory for the application
WORKDIR /app

# Copy only package.json and yarn.lock to leverage Docker cache
COPY package*.json ./

# Install application dependencies without dev dependencies
RUN yarn install --production

# Copy only the necessary files for production
COPY . .

# Build the TypeScript code
RUN yarn build

# Expose the port the app runs on
EXPOSE 9000

# Specify the command to run the application
CMD ["yarn", "start"]
