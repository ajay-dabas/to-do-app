FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

RUN yarn --cwd ./client install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]