const express = require('express');
const router = express.Router();
const pool = require('../../pg_conn.js');
router.use(express.json());

// Маршрут для фильтрации товаров
router.post('/products_filter', async (request, response) => {
    // Извлечение PLU и название товара из тела запроса
    const {
        PLU,
        product_name
    } = request.body;

    try {
        // SQL-запрос для фильтрации записей на основе переданных параметров
        const result = await pool.query(
            /*
                Фильтр по PLU, если он передан, с поиском по подстроке (ILIKE)
                Фильтр по названию товара, если он передан, с поиском по подстроке (ILIKE)
            */
            `SELECT * FROM products 
            WHERE ($1::TEXT IS NULL OR PLU ILIKE $1)
            AND ($2::TEXT IS NULL OR product_name ILIKE $2)`,
            [PLU ? `%${PLU}%` : null, product_name ? `%${product_name}%` : null]
        );

        // Возвращат отфильтрованных записей таблицы products
        response.json(result.rows);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка выполнения запроса', error.stack);
        response.status(500).send('Ошибка при получении товаров');
    }
});

module.exports = router;