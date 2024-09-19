const express = require('express');
const router = express.Router();
const pool = require('../../pg_conn.js');
const {
    send_action_to_history
} = require('../07_history/history_service.js');
router.use(express.json());

// Маршрут для увеличения остатков товара в магазине
router.post('/increase_remains', async (request, response) => {
    // Извлечение PLU, название магазина, количество на полке и в заказе из тела запроса
    const {
        PLU,
        store_name,
        shelf_quantity,
        order_quantity
    } = request.body;

    // Проверка передачи правильных параметров, если нет, возвращается ошибка 400 (Bad Request)
    if (!PLU || !store_name || shelf_quantity === undefined || order_quantity === undefined) {
        return response.status(400).send('PLU, shop_id, количество на полке и количество в заказе обязательны');
    }

    // Проверка, что количество на полке и в заказе не отрицательное, если нет, возвращается ошибка 400 (Bad Request)
    if (shelf_quantity < 0 || order_quantity < 0) {
        return response.status(400).send('shelf_quantity и order_quantity не могут быть отрицательными');
    }

    try {
        // SQL-запрос для получения текущих значений остатков по PLU и store_name
        const current_result = await pool.query(
            'SELECT shelf_quantity, order_quantity FROM inventory WHERE PLU = $1 AND store_name = $2',
            [PLU, store_name]
        );

        // Извлечение предыдущих значения остатков
        const {
            shelf_quantity: previous_shelf,
            order_quantity: previous_order
        } = current_result.rows[0];

        // SQL-запрос для обновления остатков, увеличивая их на указанные значения
        const result = await pool.query(
            'UPDATE inventory SET shelf_quantity = shelf_quantity + $1, order_quantity = order_quantity + $2 WHERE PLU = $3 AND store_name = $4 RETURNING *',
            [shelf_quantity, order_quantity, PLU, store_name]
        );

        // Если запись не была обновлена (например, если PLU и store_name не найдены), возвращается ошибка 404 (Not Found)
        if (result.rowCount === 0) {
            return response.status(404).send('Остатки для указанного PLU и store_name не найдены');
        }

        // Отправка информации о действии в историю - увеличение остатков
        await send_action_to_history({
            action: 'increase_remains',
            PLU,
            store_name,
            shelf_quantity: result.rows[0].shelf_quantity,
            order_quantity: result.rows[0].order_quantity,
            previous_shelf_quantity: previous_shelf,
            previous_order_quantity: previous_order,
            timestamp: new Date()
        });

        // Возврат ответа с обновленными остатками товара 
        response.json(result.rows[0]);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка выполнения запроса', error.stack);
        response.status(500).send('Ошибка при увеличении остатка');
    }
});

module.exports = router;