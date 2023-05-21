FROM node:18-alpine AS build
WORKDIR /frontend
COPY package.json .
COPY package-lock.json .
RUN npm install --silent
RUN npm install react-scripts@5.0.1 -g --silent
COPY . .
RUN npm run build

FROM nginx
ENV NODE_ENV production
COPY --from=build /frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]