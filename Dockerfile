# build environment
FROM node:22-alpine3.19 AS builder

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install --force


COPY --chown=node:node . .

RUN npm run build

COPY --chown=node:node ./model /app/dist/model


# production environment

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html