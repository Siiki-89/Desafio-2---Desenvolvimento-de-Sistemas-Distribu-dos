FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY notification-service ./notification-service
RUN npm install
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/notification-service/dist ./notification-service/dist
COPY notification-service/package.json ./notification-service/package.json
EXPOSE 3002
CMD ["node", "notification-service/dist/index.js"]
