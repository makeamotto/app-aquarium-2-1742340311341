```javascript
// scripts/flocking.js

class Fish {
    constructor(x, y, angle) {
        this.position = { x, y };
        this.velocity = { x: Math.cos(angle), y: Math.sin(angle) };
        this.angle = angle;
        this.maxSpeed = 2;
        this.maxForce = 0.05;
        this.size = 10; // Size of the fish
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
    }

    applyForce(force) {
        this.velocity.x += force.x;
        this.velocity.y += force.y;
        const speed = Math.hypot(this.velocity.x, this.velocity.y);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }
    }

    seek(target) {
        const desired = {
            x: target.x - this.position.x,
            y: target.y - this.position.y
        };
        const distance = Math.hypot(desired.x, desired.y);
        if (distance > 0) {
            desired.x = (desired.x / distance) * this.maxSpeed;
            desired.y = (desired.y / distance) * this.maxSpeed;

            const steer = {
                x: desired.x - this.velocity.x,
                y: desired.y - this.velocity.y
            };
            const steerMag = Math.hypot(steer.x, steer.y);
            if (steerMag > this.maxForce) {
                steer.x = (steer.x / steerMag) * this.maxForce;
                steer.y = (steer.y / steerMag) * this.maxForce;
            }
            this.applyForce(steer);
        }
    }

    align(fishArray) {
        const perceptionRadius = 50;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (const other of fishArray) {
            const d = Math.hypot(other.position.x - this.position.x, other.position.y - this.position.y);
            if (other !== this && d < perceptionRadius) {
                steering.x += other.velocity.x;
                steering.y += other.velocity.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            const mag = Math.hypot(steering.x, steering.y);
            if (mag > 0) {
                steering.x = (steering.x / mag) * this.maxSpeed;
                steering.y = (steering.y / mag) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            const steerMag = Math.hypot(steering.x, steering.y);
            if (steerMag > this.maxForce) {
                steering.x = (steering.x / steerMag) * this.maxForce;
                steering.y = (steering.y / steerMag) * this.maxForce;
            }
        }
        return steering;
    }

    cohesion(fishArray) {
        const perceptionRadius = 50;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (const other of fishArray) {
            const d = Math.hypot(other.position.x - this.position.x, other.position.y - this.position.y);
            if (other !== this && d < perceptionRadius) {
                steering.x += other.position.x;
                steering.y += other.position.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            steering.x -= this.position.x;
            steering.y -= this.position.y;
            const mag = Math.hypot(steering.x, steering.y);
            if (mag > 0) {
                steering.x = (steering.x / mag) * this.maxSpeed;
                steering.y = (steering.y / mag) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            const steerMag = Math.hypot(steering.x, steering.y);
            if (steerMag > this.maxForce) {
                steering.x = (steering.x / steerMag) * this.maxForce;
                steering.y = (steering.y / steerMag) * this.maxForce;
            }
        }
        return steering;
    }

    separation(fishArray) {
        const perceptionRadius = 25;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (const other of fishArray) {
            const d = Math.hypot(other.position.x - this.position.x, other.position.y - this.position.y);
            if (other !== this && d < perceptionRadius) {
                const diff = {
                    x: this.position.x - other.position.x,
                    y: this.position.y - other.position.y
                };
                const mag = Math.hypot(diff.x, diff.y);
                if (mag > 0) {
                    diff.x /= mag;
                    diff.y /= mag;
                }
                steering.x += diff.x;
                steering.y += diff.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            const mag = Math.hypot(steering.x, steering.y);
            if (mag > 0) {
                steering.x = (steering.x / mag) * this.maxSpeed;
                steering.y = (steering.y / mag) * this.maxSpeed;
            }
            steering.x -= this.velocity.x;
            steering.y -= this.velocity.y;
            const steerMag = Math.hypot(steering.x, steering.y);
            if (steerMag > this.maxForce) {
                steering.x = (steering.x / steerMag) * this.maxForce;
                steering.y = (steering.y / steerMag) * this.maxForce;
            }
        }
        return steering;
    }

    flock(fishArray) {
        const alignment = this.align(fishArray);
        const cohesion = this.cohesion(fishArray);
        const separation = this.separation(fishArray);

        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(separation);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size, this.size / 2);
        ctx.lineTo(-this.size, -this.size / 2);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.restore();
    }
}

export default Fish;
```