FROM node:alpine
COPY . .
EXPOSE 27777
CMD ["node", "index.js"]