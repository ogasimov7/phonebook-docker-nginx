FROM node:16

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci --only-production
ENV NODE_ENV=production
CMD npm start