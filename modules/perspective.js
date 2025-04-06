class Perspective {
    static projecting(x, y, z, size = 1, distance, depth = 1, dx = 0, dy = 0) {
        const perspective = size / (z * depth + distance);
        return {
            x: dx + x * perspective,
            y: dy - y * perspective
        }
    }
}

export default Perspective;