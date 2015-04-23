module.exports = {
    maps: {
        center: [55.76, 37.64], // Москва
        zoom: 15,
        minZoom: 8,
        controls: ['zoomControl'],
        behaviors: ['drag', 'scrollZoom']
    },

    // Подсказка
    hint: {
        price: -250,// point
        lifeTime: 5000, // ms
        countDown: 4000 // ms
    },

    // Очки за верный ответ
    point: 100,

    // Время игры
    timer: 4 * 60 * 1000
};
