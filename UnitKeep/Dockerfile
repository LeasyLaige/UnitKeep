FROM php:8.4-cli

ARG NODE_VERSION=22

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        git \
        unzip \
        libpq-dev \
        libicu-dev \
        libzip-dev \
        libonig-dev \
        libxml2-dev \
    && docker-php-ext-install \
        bcmath \
        intl \
        mbstring \
        pcntl \
        pdo_pgsql \
        zip \
    && curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY composer.json composer.lock package.json package-lock.json ./

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts \
    && npm ci

COPY . .

RUN npm run build \
    && php artisan package:discover --ansi \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod +x docker/start.sh

EXPOSE 10000

CMD ["/app/docker/start.sh"]
