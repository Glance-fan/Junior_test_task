const express = require('express');
const router = express.Router();
const pool = require('../../pg_conn.js');
const {
    send_action_to_history
} = require('../07_history/history_service.js');
router.use(express.json());

// Маршрут для добавления нового продукта
router.post('/add_product', async (request, response) => {
    // Извлечение PLU и название товара из тела запроса
    const {
        PLU,
        product_name
    } = request.body;

    // Проверка передачи правильных параметров, если нет, возвращается ошибка 400 (Bad Request)
    if (!PLU || !product_name) {
        return response.status(400).send('PLU и название товара обязательны');
    }

    try {
        // SQL-запрос на добавление товара в таблицу products
        const result = await pool.query(
            'INSERT INTO products (PLU, product_name) VALUES ($1, $2) RETURNING *',
            [PLU, product_name]
        );

        // Отправка информации о действии в историю - запись добавления товара
        await send_action_to_history({
            action: 'add_product',
            PLU,
            timestamp: new Date()
        });

        // Возврат успешного ответа с добавленным продуктом и статусом 201 (Created)
        response.status(201).json(result.rows[0]);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка выполнения запроса', error.stack);
        response.status(500).send('Ошибка при добавлении товара');
    }
});

module.exports = router;