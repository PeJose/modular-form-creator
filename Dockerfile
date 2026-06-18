FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci --frozen-lockfile || npm install

COPY . .

EXPOSE 5173

CMD ["npx", "vite", "--host=0.0.0.0", "--port=5173"]
