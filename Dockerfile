# build environment
FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn global add pm2
COPY . .
RUN yarn build

# production environment
EXPOSE 3000
CMD ["pm2-runtime", "dist/main.js"]