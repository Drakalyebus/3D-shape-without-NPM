class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static multiply(v1, v2) {
        return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }
    static scalar(v1, n) {
        return new Vector(v1.x * n, v1.y * n, v1.z * n);
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    length() {
        return Math.hypot(this.x, this.y, this.z);
    }
    normalize() {
        const length = Math.hypot(this.x, this.y, this.z);
        return new Vector(this.x / length, this.y / length, this.z / length);
    }
    static normal(v1, v2) {
        return Vector.multiply(v1, v2).normalize().abs();
    }
    abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }
    reverse() {
        return new Vector(-this.x, -this.y, -this.z);
    }
    static reflect(normal, light) {
        const normalizedNormal = new Vector(normal.x, normal.y, normal.z).normalize();
        const normalizedLight = new Vector(light.x, light.y, light.z).normalize();
        const prod = normalizedNormal.x * normalizedLight.x + normalizedNormal.y * normalizedLight.y + normalizedNormal.z * normalizedLight.z;
        return {vector: new Vector(normalizedLight.x - 2 * prod * normalizedNormal.x, normalizedLight.y - 2 * prod * normalizedNormal.y, normalizedLight.z - 2 * prod * normalizedNormal.z), prod};
    }
}

export default Vector;