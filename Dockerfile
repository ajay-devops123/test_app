FROM node

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=qwerty

WORKDIR /testapp

COPY . .

# 👇 This is what's missing
RUN npm install

CMD ["node", "server.js"]
