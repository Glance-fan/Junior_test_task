const axios = require('axios');

// Асинхронная функция для отправки данных об операции в сервис истории
async function send_action_to_history(action_data) {
    try {
        // POST-запрос к локальному сервису истории действий
        // Отправка данных действия (action_data) на маршрут /add_history_entry
        await axios.post('http://localhost:3001/add_history_entry', action_data);
    } catch (error) {
        // Логирование ошибки и возврат статус 500 (Internal Server Error)
        console.error('Ошибка отправки в сервис истории', error.stack);
    }
}

module.exports = { send_action_to_history };