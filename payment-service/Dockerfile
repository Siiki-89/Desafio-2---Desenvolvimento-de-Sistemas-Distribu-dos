FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY payment-service ./payment-service
RUN npm install
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/payment-service/dist ./payment-service/dist
COPY payment-service/package.json ./payment-service/package.json
EXPOSE 3001
CMD ["node", "payment-service/dist/index.js"]
