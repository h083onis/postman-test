FROM node:18-alpine

# 作業ディレクトリを指定
WORKDIR /app

COPY package.json ./
RUN npm install

# ソースコードをコピー
COPY . .
