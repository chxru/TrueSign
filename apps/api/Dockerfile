FROM node:18-alpine

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile  --production=true

COPY . .

EXPOSE 3333

CMD [ "node", "main.js" ]
