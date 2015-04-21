module.exports = {
    maps: {
        center: [55.76, 37.64], // Москва
        zoom: 15,
        controls: [],
        behaviors: ['drag']
    },

    // Подсказка
    hint: {
        price: -250, // point
        lifeTime: 5000, // ms
        countDown: 3000 // ms
    },

    // Очки за верный ответ
    point: 100,

    // Время игры
    timer: 2 * 60 * 1000
};
