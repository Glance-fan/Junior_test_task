const express = require('express');
const router = express.Router();
const pool = require('../../pg_conn.js');
router.use(express.json());

// Маршрут для добавления записи в историю действий
router.post('/add_history_entry', async (request, response) => {
    const {
        action, // Тип действия (add_product, add_remains, increase_remains, decrease_remains)
        PLU, // PLU товара
        store_name, // Название магазина 
        shelf_quantity, // Текущее количество на полке после изменения
        order_quantity, // Текущее количество в заказе после изменения
        previous_shelf_quantity, // Предыдущее количество на полке (до изменения)
        previous_order_quantity, // Предыдущее количество в заказе (до изменения)
        timestamp // Время действия 
    } = request.body;

    // Проверка передачи правильных параметров, если нет, возвращается ошибка 400 (Bad Request)
    if (!action || !PLU) {
        return response.status(400).send('Тип действия (action) и PLU обязательны');
    }

    try {
         // SQL-запрос для добавления записи в таблицу product_history
        const result = await pool.query(
            `INSERT INTO product_history (
                action, PLU, store_name, shelf_quantity, order_quantity, 
                previous_shelf_quantity, previous_order_quantity, timestamp
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [action, PLU, store_name || null, shelf_quantity || null, order_quantity || null,
                previous_shelf_quantity || null, previous_order_quantity || null, timestamp || new Date()
            ]
        );

        // Возврат успешного ответа с записью истории и статусом 201 (Created)
        response.status(201).json(result.rows[0]);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка записи в историю', error.stack);
        response.status(500).send('Ошибка при записи истории действия');
    }
});

// Маршрут для получения истории действий с фильтрацией и пагинацией
router.post('/show_history', async (request, response) => {
    const {
        store_name,
        PLU,
        start_date,
        end_date,
        action,
        page = 1,
        limit = 5
    } = request.body;

    // Вычисление смещения для SQL-запроса, чтобы пропустить записи для предыдущих страниц
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            /*
                 Фильтрация по магазину, если store_name передан
                 Фильтрация по PLU товара, если он передан
                 Фильтрация по начальной дате, если она передана
                 Фильтрация по конечной дате, если она передана
                 Фильтрация по типу действия, если он передан
                 Сортировка по времени выполнения действия по возрастанию
                 Лимитирование количества записей и пропуск записей в соответствии с текущей страницей
            */
            `SELECT * FROM product_history 
             WHERE ($1::TEXT IS NULL OR store_name = $1)
             AND ($2::TEXT IS NULL OR PLU = $2)
             AND ($3::TIMESTAMP IS NULL OR timestamp >= $3)
             AND ($4::TIMESTAMP IS NULL OR timestamp <= $4)
             AND ($5::TEXT IS NULL OR action = $5)
             ORDER BY timestamp ASC
             LIMIT $6 OFFSET $7`,
            [store_name || null, PLU || null, start_date || null, end_date || null, action || null, limit, offset]
        );

        // Возвращат отфильтрованных записей таблицы product_history
        response.json(result.rows);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка выполнения запроса', error.stack);
        response.status(500).send('Ошибка при получении истории действий');
    }
});

module.exports = router;