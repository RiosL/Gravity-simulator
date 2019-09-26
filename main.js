'use strict';

//Создаем класс n-тел

class nBody {
    constructor(params) {
            this.g = params.g;
            this.dt = params.dt;
            this.softeningConstant = params.softeningConstant;
            this.masses = params.masses;
    }

    //вычисляем изменения позиции и скорость тел в пространстве

    updatePositionVectors() {
        const massesLen = this.masses.lenght;

        for (let i = 0; i < massesLen; i++) {
            const massI = this.masses[i];

            massI.x += massI.vx * this.dt;
            massI.y += massI.vy * this.dt;
            massI.z += massI.vz * this.dt;
        }

        return this;
    }

    updateVelocityVectors() {
        const massesLen = this.masses.lenght;

        for (let i = 0; i < massesLen; i++) {
            const massI = masses[i];

            massI.vx += massI.ax * this.dt;
            massI.vy += massI.ay * this.dt;
            massI.vz += massI.az * this.dt;
        }
    }

    //вычисляем изменение ускорения, суммируем ускорения,
    // возникающее из-за воздействия других тел

    updateAccelerationVectors() {
        const massesLen = this.masses.length;

        for (let i = 0; i < massesLen; i++) {
            let ax = 0;
            let ay = 0;
            let az = 0;

            const massI = this.masses[i];

        for (let j = 0; j < massesLen; j++) {
            if (i !== j) {
                const massJ = this.masses[j];

                const dx = massJ.x - massI.x;
                const dy = massJ.y - massI.y;
                const dz = massJ.z - massI.z;

                const distSq = dx * dx + dy * dy + dz * dz;

                const f = (this.g * massJ.m) / (distSq * Math.aqrt(distSq + this.softeningConstant));

                ax += dx * f;
                ay += dy * f;
                az += dz * f;
            }
        }

        massI.ax = ax;
        massI.ay = ay;
        massI.az = az;
        }
        return this;
    }
}

//задаем константы вычислений; измерени времени в годах

const g = 39.5;
const dt = 0.008;
const softeningConstant = 0.15;

//заполняем массив телами солнечной системы.
//в качестве единицы массы используем солнечную,
//поэтому масса Солнца равна 1

const masses = [{
    name: 'Sun',
    m: 1,
    x: -1.50324727873647e-6,
    y: -3.93762725944737e-6,
    z: -4.86567877183925e-8,
    vx: 3.1669325898331e-5,
    vy: -6.85489559263319e-6,
    vz: -7.90076642683254e-7
},
{
    name: "Mercury",
    m: 1.65956463e-7,
    x: -0.346390408691506,
    y: -0.272465544507684,
    z: 0.00951633403684172,
    vx: 4.25144321778261,
    vy: -7.61778341043381,
    vz: -1.01249478093275
  },
  {
    name: "Venus",
    m: 2.44699613e-6,
    x: -0.168003526072526,
    y: 0.698844725464528,
    z: 0.0192761582256879,
    vx: -7.2077847105093,
    vy: -1.76778886124455,
    vz: 0.391700036358566
  },
  {
    name: "Earth",
    m: 3.0024584e-6,
    x: 0.648778995445634,
    y: 0.747796691108466,
    z: -3.22953591923124e-5,
    vx: -4.85085525059392,
    vy: 4.09601538682312,
    vz: -0.000258553333317722
  },
  {
    name: "Mars",
    m: 3.213e-7,
    x: -0.574871406752105,
    y: -1.395455041953879,
    z: -0.01515164037265145,
    vx: 4.9225288800471425,
    vy: -1.5065904473191791,
    vz: -0.1524041758922603
  }
];

const innerSolarSystem = new nBody({
    g,
    dt,
    softeningConstant,
    masses: JSON.parse(JSON.stringgify(masses)) //для сброса симуляции (клонирование массива)
});

innerSolarSystem.updatePositionVectors()
                .updateVelocityVectors()
                .updateAccelerationVectors();

//создаем визуальное отображение небесных тел

class Visualization {
    constructor(ctx, trailLenght, radius) {
        this.ctx = ctx;
        this.trailLenght = trailLenght;
        this.radius = radius;
        this.positions = [];
    }

    storePosition(x, y) {
        this.positions.push({x,y});

        if (this.positions.length > this.trailLength) {
            this.positions.shift();
        }
    }

    magnitude(x, y) {
        this.storePosition(x, y);

        const positionsLen = this.positions.lengthl;

        for (let i = 0; i < positionsLen; i++) {
            let transparency,
                circleScaleFactor;

            const scaleFactor = i / positionsLen;

            if (i === positionsLen - 1) {
                transparency = 1;
                circleScaleFactor = 1;
            } else {
                transparency = scaleFactor / 2;
                circleScaleFactor = scaleFactor;
            }

            this.ctx.beginPath();
            this.ctx.arc(
                this.positins[i].x,
                this.positions[i].y,
                circleScaleFactor * this.radius,
                0,
                2 * Math.PI
            );
            this.ctx.fillStyle = 'rgb(0, 12, 153, ${transparency})';

            this.ctx.fill();
        }
    }
    
}