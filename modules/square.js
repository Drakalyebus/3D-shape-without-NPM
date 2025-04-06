function square(...points) {
    const maxSquare = (Math.max(...points.map(point => point.x)) - Math.min(...points.map(point => point.x))) * (Math.max(...points.map(point => point.y)) - Math.min(...points.map(point => point.y)));
    return maxSquare - (points.length > 2 ? Math.abs(points.reduce((sum, point, i) => {
        const next = points[i + 1] !== undefined ? points[i + 1] : points[0];
        return sum + (point.x - next.x) * (point.y - next.y);
    }, 0) / 2) : 0);
}

export default square;