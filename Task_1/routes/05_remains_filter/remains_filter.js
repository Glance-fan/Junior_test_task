const express = require('express');
const router = express.Router();
const pool = require('../../pg_conn.js');
router.use(express.json());

// Маршрут для фильтрации остатков товара
router.post('/remains_filter', async (request, response) => {
    // Извлечение PLU, название магазина, минимальные и максимальные значения остатков на полке и в заказе из тела запроса
    const {
        PLU,
        store_name,
        min_shelf_quantity,
        max_shelf_quantity,
        min_order_quantity,
        max_order_quantity
    } = request.body;

    // Проверяем, что переданные значения не отрицательные, если хотя бы одно значение меньше 0, возвращается ошибка 400 (Bad Request)
    if (min_shelf_quantity < 0 || max_shelf_quantity < 0 || min_order_quantity < 0 || max_order_quantity < 0) {
        return response.status(400).send('Количество не может быть отрицательным');
    }

    // SQL-запрос для фильтрации записей на основе переданных параметров
    try {
        const result = await pool.query(
            /* 
                Фильтр по PLU, если он передан
                Фильтр по названию магазина, если он передан
                Фильтр по минимальному количеству на полке, если он передан
                Фильтр по максимальному количеству на полке, если он передан
                Фильтр по минимальному количеству в заказе, если он передан
                Фильтр по максимальному количеству в заказе, если он передан
            */
            `SELECT * FROM inventory 
           WHERE ($1::TEXT IS NULL OR PLU = $1)
           AND ($2::TEXT IS NULL OR store_name = $2)
           AND ($3::INTEGER IS NULL OR shelf_quantity >= $3)
           AND ($4::INTEGER IS NULL OR shelf_quantity <= $4)
           AND ($5::INTEGER IS NULL OR order_quantity >= $5)
           AND ($6::INTEGER IS NULL OR order_quantity <= $6)`,
            [PLU || null, store_name || null, min_shelf_quantity || null, max_shelf_quantity || null, min_order_quantity || null, max_order_quantity || null]
        );
        
        // Возвращат отфильтрованных записей таблицы inventory
        response.json(result.rows);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка выполнения запроса', error.stack);
        response.status(500).send('Ошибка при получении остатков');
    }
});

module.exports = router;