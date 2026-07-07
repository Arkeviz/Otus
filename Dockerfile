
FROM node:24.18.0-slim
USER node

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

CMD ["npm", "start"]
