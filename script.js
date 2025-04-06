import Units from './modules/units.js';

// Настройки холста
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const s = -5;
let size = 200; // Размер куба
let dist = 4; // Фокусное расстояние для перспективы
const intensity = 1; // Интенсивность света
const light = { x: 0, y: 0, z: 1 }; // Источник света

// Создаём экземпляр Units
const units = new Units();

// Вершины куба
const vertices = [
    { x: -1, y: -1, z: -1 }, // Нижний левый ближний угол 0
    { x: 1, y: -1, z: -1 }, // Нижний правый ближний угол 1
    { x: 1, y: 1, z: -1 }, // Верхний правый ближний угол 2
    { x: -1, y: 1, z: -1 }, // Верхний левый ближний угол 3
    { x: -1, y: -1, z: 1 }, // Нижний левый дальний угол 4
    { x: 1, y: -1, z: 1 }, // Нижний правый дальний угол 5
    { x: 1, y: 1, z: 1 }, // Верхний правый дальний угол 6
    { x: -1, y: 1, z: 1 }, // Верхний левый дальний угол 7
    { x: 0, y: 2, z: 0 } // Макушка 8
];

// Переменные для углов вращения
let rotationX = 0;
let rotationY = 0;

// Функция для поворота точки
function rotatePoint(point, angleX, angleY) {
    const cosX = Math.cos(angleX * s), sinX = Math.sin(angleX * s);
    const cosY = Math.cos(angleY * s), sinY = Math.sin(angleY * s);

    // Вращение вокруг оси X
    let rotated = {
        x: point.x,
        y: point.y * cosX - point.z * sinX,
        z: point.y * sinX + point.z * cosX
    };

    // Вращение вокруг оси Y
    rotated = {
        x: rotated.x * cosY + rotated.z * sinY,
        y: rotated.y,
        z: -rotated.x * sinY + rotated.z * cosY
    };

    return rotated;
}

// Анимация
function animate() {
    // Вращаем вершины куба
    const rotatedVertices = vertices.map(vertex => rotatePoint(vertex, rotationX, rotationY));

    // Обновляем грани куба с вращёнными вершинами
    const rotatedFaces = [
        [rotatedVertices[0], rotatedVertices[1], rotatedVertices[2], rotatedVertices[3]],
        [rotatedVertices[4], rotatedVertices[5], rotatedVertices[6], rotatedVertices[7]],
        [rotatedVertices[0], rotatedVertices[1], rotatedVertices[5], rotatedVertices[4]],
        [rotatedVertices[2], rotatedVertices[3], rotatedVertices[7], rotatedVertices[6]],
        [rotatedVertices[0], rotatedVertices[3], rotatedVertices[7], rotatedVertices[4]],
        [rotatedVertices[1], rotatedVertices[2], rotatedVertices[6], rotatedVertices[5]],
        [rotatedVertices[8], rotatedVertices[2], rotatedVertices[3]],
        [rotatedVertices[8], rotatedVertices[2], rotatedVertices[6]],
        [rotatedVertices[8], rotatedVertices[6], rotatedVertices[7]],
        [rotatedVertices[8], rotatedVertices[7], rotatedVertices[3]],
    ];

    // Сбрасываем содержимое Units и добавляем новый куб
    units.units = [];
    units.add(rotatedFaces, { r: 0, g: 255, b: 100, a: 1 }, { r: 0, g: 0, b: 0, a: 1 })

    // Рендеринг
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
    units.render(canvas, size, dist, light, intensity, true, 1);

    requestAnimationFrame(animate);
}

// Обработка движения мыши
canvas.addEventListener('mousemove', (e) => {
    // Рассчитываем угол поворота на основе положения мыши
    rotationX = (e.clientY / canvas.height - 0.5) * Math.PI; // Вращение по X
    rotationY = (e.clientX / canvas.width - 0.5) * Math.PI;  // Вращение по Y
});

// Запуск анимации
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW':
            dist -= 0.1;
            break;
        case 'KeyS':
            dist += 0.1;
            break;
        case 'KeyA':
            size -= 200 / 4 * 0.1;
            break;
        case 'KeyD':
            size += 200 / 4 * 0.1;
            break;
    }
});