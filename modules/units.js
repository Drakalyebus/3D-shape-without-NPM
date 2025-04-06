import Vector from './vector.js';
import Perspective from './perspective.js';
import square from './square.js';

class Units {
    constructor(units = []) {
        this.units = units;
    }
    add(faces = [], color = { r: 0, g: 0, b: 0, a: 1 }, outline = { r: 255, g: 255, b: 255, a: 1 }) {
        this.units.push({ faces, color, outline });
        return this;
    }
    static vertex(unit, callback) {
        unit.forEach(face => {
            face.forEach(point => {
                point = callback(point);
            });
        });
        return unit;
    }
    render(canvas, size, dist, light, intensity, shadows = false, perspective = 1) {
        const ctx = canvas.getContext('2d');
        const project = (x, y, z) => Perspective.projecting(x, y, z, size, dist, perspective, canvas.width / 2, canvas.height / 2);
        const units = this.units.sort((a, b) => Math.max(...b.faces.map(face => Math.max(...face.map(point => point.z)))) - Math.max(...a.faces.map(face => Math.max(...face.map(point => point.z)))));
        units.forEach(unit => {         
            // const faces = unit.faces.sort((a, b) => (Math.max(...b.map(point => point.z)) + Math.min(...b.map(point => point.z)) / 2) - (Math.max(...a.map(point => point.z)) / 2));
            // const faces = unit.faces.sort((a, b) => b.filter(point => point.z > Math.max(...b.map(point => point.z))).length - a.filter(point => point.z > Math.max(...b.map(point => point.z))).length);
            const faces = unit.faces.sort((a, b) => b.reduce((sum, point) => sum + point.z, 0) / b.length - a.reduce((sum, point) => sum + point.z, 0) / a.length);
            faces.forEach(face => {
                const prePoints = face;
                const points = face.map(point => project(point.x, point.y, point.z));
                ctx.moveTo(points[0].x, points[0].y)
                ctx.beginPath();
                points.forEach((point) => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
                ctx.lineTo(points[0].x, points[0].y);
                ctx.closePath();
                const normal = Vector.normal(new Vector(prePoints[0].x - prePoints[1].x, prePoints[0].y - prePoints[1].y, prePoints[0].z - prePoints[1].z), new Vector(prePoints[1].x - prePoints[2].x, prePoints[1].y - prePoints[2].y, prePoints[1].z - prePoints[2].z)).normalize();
                const brightness = shadows ? Math.min(1, Math.max(0, Vector.reflect(normal, light).prod * intensity)) : 1;
                ctx.fillStyle = `rgba(${unit.color.r * brightness}, ${unit.color.g * brightness}, ${unit.color.b * brightness}, ${unit.color.a})`;
                ctx.strokeStyle = `rgba(${unit.outline.r}, ${unit.outline.g}, ${unit.outline.b}, ${unit.outline.a})`;
                ctx.stroke();
                ctx.fill();
            });
        });
        return this;
    }
}

export default Units;