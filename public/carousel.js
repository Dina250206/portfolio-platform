document.querySelectorAll('.carousel').forEach(carousel => {
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let intervalId;

    // Функция для отображения текущего элемента
    const showItem = (index) => {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    };

    // Переход к следующему элементу
    const nextItem = () => {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    };

    // Запуск автоматической смены изображений
    const startCarousel = () => {
        intervalId = setInterval(nextItem, 3000); // Автоматическая смена каждые 3 секунды
    };

    // Остановка карусели
    const stopCarousel = () => {
        clearInterval(intervalId);
    };

    // Инициализация карусели
    showItem(currentIndex);
    startCarousel();

    // Остановка карусели при наведении мыши
    carousel.addEventListener('mouseenter', stopCarousel);

    // Возобновление карусели при уходе мыши
    carousel.addEventListener('mouseleave', startCarousel);
});
