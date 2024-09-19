const express = require('express');
const router = express.Router();
const pool = require('../../pg_conn.js');
const {
    send_action_to_history
} = require('../07_history/history_service.js');
router.use(express.json());

// Маршрут для добавления данных об остатках товара
router.post('/add_remains', async (request, response) => {
    // Извлечение PLU, название магазина, количество на полке и в заказе из тела запроса
    const {
        PLU,
        store_name,
        shelf_quantity,
        order_quantity
    } = request.body;

    // Проверка передачи правильных параметров, если нет, возвращается ошибка 400 (Bad Request)
    if (!PLU || !store_name || shelf_quantity === undefined || order_quantity === undefined) {
        return response.status(400).send('PLU, store_name, количество на полке и количество в заказе обязательны');
    }

    try {
        // SQL-запрос для добавления данных об остатках товара в таблицу inventory
        const result = await pool.query(
            'INSERT INTO inventory (PLU, store_name, shelf_quantity, order_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [PLU, store_name, shelf_quantity, order_quantity]
        );

        // Отправка информации о действии в историю - добавление остатков
        await send_action_to_history({
            action: 'add_remains',
            PLU,
            store_name,
            shelf_quantity: shelf_quantity,
            order_quantity: order_quantity,
            timestamp: new Date()
        });

        // Возврат успешного ответа с добавленными остатками товара и статусом 201 (Created)
        response.status(201).json(result.rows[0]);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка выполнения запроса', error.stack);
        response.status(500).send('Ошибка при создании остатка');
    }
});

module.exports = router;