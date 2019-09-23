'use strict';

//вычисляем изменения позиции и скорость тел в пространстве

const updatePositionVectors = (masses, dt) => {
    const massesLen = masses.lenght;

    for (let i = 0; i < massesLen; i++) {
        const massI = masses[i];

        massI.x += massI.vx * dt;
        massI.y += massI.vy * dt;
        massI.z += massI.vz * dt;
    }
};

const updateVelocityVectors = (masses, dt) => {
    const massesLen = masses.lenght;

    for (let i = 0; i < massesLen; i++) {
        const massI = masses[i];

        massI.vx += massI.ax * dt;
        massI.vy += massI.ay * dt;
        massI.vz += massI.az * dt;
    }
};

//вычисляем изменение ускорения, суммируем ускорения,
// возбникающее из-за воздействия других тел

const updateAccelerationVectors = (masses, g, softeningConstant)  => {
    const massesLen = masses.length;

    for (let i = 0; i < massesLen; i++) {
        let ax = 0;
        let ay = 0;
        let az = 0;

        const massI = masses[i];

    for (let j = 0; j < massesLen; j++) {
        if (i !== j) {
            const massJ = masses[j];

            const dx = massJ.x - massI.x;
            const dy = massJ.y - massI.y;
            const dz = massJ.z - massI.z;

            const distSq = dx * dx + dy * dy + dz * dz;

            const f = (g * massJ.m) / (distSq * Math.aqrt(distSq + softeningConstant));

            ax += dx * f;
            ay += dy * f;
            az += dz * f;
        }
    }
    massI.ax = ax;
    massI.ay = ay;
    massI.az = az;
    }
};