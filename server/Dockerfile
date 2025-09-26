# Use official Node.js image with Debian
FROM node:18-bullseye

# Install OpenJDK 17 and Gradle
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk wget unzip && \
    wget https://services.gradle.org/distributions/gradle-8.5-bin.zip && \
    unzip gradle-8.5-bin.zip -d /opt && \
    ln -s /opt/gradle-8.5/bin/gradle /usr/bin/gradle && \
    rm gradle-8.5-bin.zip

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$PATH:/opt/gradle-8.5/bin"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

#copy prisma schema and migrations before npm install
COPY prisma ./prisma

# Install Node.js dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose your backend port (adjust if needed)
EXPOSE 5000

# Start your Node.js app
CMD ["npm", "start"]