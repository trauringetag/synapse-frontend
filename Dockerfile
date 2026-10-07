# ЭТАП 1: Сборка приложения
FROM node:20-alpine AS build

WORKDIR /app

# Объявляем аргумент сборки (значение по умолчанию)
ARG VITE_API_URL=http://localhost:8080

# Передаём аргумент как переменную окружения для Vite
ENV VITE_API_URL=$VITE_API_URL

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Собираем production-билд (Vite подставит VITE_API_URL прямо в JS-бандл)
RUN npm run build

# ЭТАП 2: Раздача через Nginx
FROM nginx:alpine

# Копируем собранные файлы из первого этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]