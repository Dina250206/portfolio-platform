document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const input = document.getElementById('images');
    const preview = document.getElementById('preview');
    const addImageButton = document.getElementById('addImage');

    const selectedFiles = []; // Хранилище для выбранных файлов

    // Добавление изображения в список
    addImageButton.addEventListener('click', () => {
        if (input.files.length > 0) {
            const file = input.files[0];

            if (selectedFiles.length >= 3) {
                alert('You can only upload up to 3 images.');
                return;
            }

            selectedFiles.push(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100px';
                img.style.margin = '5px';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);

            input.value = ''; // Очищаем поле выбора файла
        } else {
            alert('Please select an image first.');
        }
    });

    // Обработка отправки формы
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (selectedFiles.length === 0) {
            alert('Please add at least one image.');
            return;
        }

        const formData = new FormData(form);

        // Добавляем файлы из selectedFiles в formData
        selectedFiles.forEach((file, index) => {
            formData.append('images', file);
        });

        const token = localStorage.getItem('token'); // Получаем токен из localStorage

        if (!token) {
            alert('You are not logged in!');
            return;
        }

        try {
            const response = await fetch('/portfolio', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
                },
                body: formData,
            });

            if (response.ok) {
                alert('Portfolio item uploaded successfully!');
                location.reload(); // Перезагрузка страницы для отображения новых данных
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload portfolio item.');
        }
    });
});
