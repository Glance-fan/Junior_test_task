/*
Запуск контейнера PostgreSQL, подключение к контейнеру

docker run --name my-postgres -e POSTGRES_PASSWORD=pgsql -d -p 5432:5432 -v C:\Users\Max\OneDrive\Desktop\Test_Task\Task_1\pg_data:/var/lib/postgresql/data postgres

docker exec -it my-postgres psql -U postgres
*/

-- Создание базы данных с именем 'shop'
CREATE DATABASE shop;
\c shop

-- Создание таблицы 'products'
CREATE TABLE products (
    PLU VARCHAR(20) PRIMARY KEY,                -- Уникальный идентификатор товара
    product_name VARCHAR(255) NOT NULL          -- Название товара
);

-- Создание таблицы 'inventory'
CREATE TABLE inventory (
    PLU VARCHAR(20),                            -- Уникальный идентификатор товара
    store_name VARCHAR(255),                    -- Название магазина
    shelf_quantity INTEGER NOT NULL,            -- Количество товара на полке
    order_quantity INTEGER NOT NULL,            -- Количество товара в заказе
    PRIMARY KEY (PLU, store_name),              -- Составной первичный ключ (PLU и store_name)
    FOREIGN KEY (PLU) REFERENCES products (PLU) -- Внешний ключ, ссылается на таблицу 'products'
);

-- Создание таблицы 'product_history'
CREATE TABLE product_history (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,                -- Тип действия: добавление, увеличение, уменьшение и т.д.
    PLU VARCHAR(20) NOT NULL,                   -- PLU товара
    store_name VARCHAR(255),                    -- Магазин (если действие связано с остатками)
    timestamp TIMESTAMP DEFAULT NOW(),          -- Время действия
    shelf_quantity INTEGER,                     -- Количество на полке после изменения
    order_quantity INTEGER,                     -- Количество в заказе после изменения
    previous_shelf_quantity INTEGER,            -- Предыдущее количество на полке
    previous_order_quantity INTEGER,            -- Предыдущее количество в заказе
    FOREIGN KEY (PLU) REFERENCES products(PLU)  -- Внешний ключ, ссылающийся на таблицу 'products'
);
