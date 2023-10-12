FROM node:20-alpine
WORKDIR /app
COPY *.json .
COPY *.config.js .
COPY *.config.ts .
RUN npm install
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "/bin/sh", "startup.sh" ]