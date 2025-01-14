FROM node:20-alpine
RUN apk add --no-cache tzdata


ARG buildpc_api_host
ARG public_url


ENV TZ Asia/Ho_Chi_Minh
ENV NODE_ENV=production
ENV PORT=1345

ENV REACT_APP_BACKEND_URL $buildpc_api_host
ENV PUBLIC_URL $public_url

WORKDIR  /opt/app

COPY . .

RUN npm install -g serve
RUN npm install 
RUN npm install -g react-scripts
RUN npm run build:prod

EXPOSE 1345

CMD ["npm", "run", "start:prod"]



