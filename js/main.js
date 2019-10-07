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
        const massesLen = this.masses.length;

        for (let i = 0; i < massesLen; i++) {
            const massI = this.masses[i];

            massI.x += massI.vx * this.dt;
            massI.y += massI.vy * this.dt;
           
        }

        return this;
    }

    updateVelocityVectors() {
        const massesLen = this.masses.length;

        for (let i = 0; i < massesLen; i++) {
            const massI = this.masses[i];

            massI.vx += massI.ax * this.dt;
            massI.vy += massI.ay * this.dt;
         
        }
    }

    //вычисляем изменение ускорения, суммируем ускорения,
    // возникающее из-за воздействия других тел

    updateAccelerationVectors() {
        const massesLen = this.masses.length;

        for (let i = 0; i < massesLen; i++) {
            let ax = 0;
            let ay = 0;
           

            const massI = this.masses[i];

            for (let j = 0; j < massesLen; j++) {
                if (i !== j) {
                    const massJ = this.masses[j];

                    const dx = massJ.x - massI.x;
                    const dy = massJ.y - massI.y;
                    

                    const distSq = dx * dx + dy * dy ;

                    const f = (this.g * massJ.m) / (distSq * Math.sqrt(distSq + this.softeningConstant));

                    ax += dx * f;
                    ay += dy * f;
                  
                }
            }

            massI.ax = ax;
            massI.ay = ay;
            
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
    name: "Sun",
    m: 1,
    x: -1.50324727873647e-6,
    y: -3.93762725944737e-6,
    vx: 3.1669325898331e-5,
    vy: -6.85489559263319e-6, 
},
{
    name: "Mercury",
    m: 1.65956463e-7,
    x: -0.346390408691506,
    y: -0.272465544507684,
    vx: 4.25144321778261,
    vy: -7.61778341043381,
  },
  {
    name: "Venus",
    m: 2.44699613e-6,
    x: -0.168003526072526,
    y: 0.698844725464528,
    vx: -7.2077847105093,
    vy: -1.76778886124455,
   
  },
  {
    name: "Earth",
    m: 3.0024584e-6,
    x: 0.648778995445634,
    y: 0.747796691108466,
    vx: -4.85085525059392,
    vy: 4.09601538682312,
  },
  {
    name: "Mars",
    m: 3.213e-7,
    x: -0.574871406752105,
    y: -1.395455041953879,
    vx: 4.9225288800471425,
    vy: -1.5065904473191791,
  }
];

const innerSolarSystem = new nBody({
    g,
    dt,
    softeningConstant,
    masses: JSON.parse(JSON.stringify(masses)) //для сброса симуляции (клонирование массива)
});

//создаем визуальное отображение небесных тел

class Visualization {

    constructor(ctx, trailLength, radius) {
        this.ctx = ctx;
        this.trailLength = trailLength;
        this.radius = radius;
        this.positions = [];
    }

    storePosition(x, y) {
      this.positions.push({x, y});
  
      if (this.positions.length > this.trailLength){
          this.positions.shift();
        }
        
    }
    
    magnitude(x, y) {
        this.storePosition(x, y);

        const positionsLen = this.positions.length;

        for (let i = 0; i < positionsLen; i++) {
            let transparency;
            let circleScaleFactor;

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
                this.positions[i].x,
                this.positions[i].y,
                circleScaleFactor * this.radius,
                0,
                2 * Math.PI
            );
            this.ctx.fillStyle = `rgb(0, 12, 153, ${transparency})`;

            this.ctx.fill();
        }
    }
    
}

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const scale = 70,
      radius = 4,
      trailLength = 35;

const populateVisualization = masses => {
    masses.forEach(
        mass => (mass["visualization"] = new Visualization (ctx, trailLength, radius)) 
    );
};

populateVisualization (innerSolarSystem.masses);

document.querySelector('.reset-button').addEventListener('click', () => {
    innerSolarSystem.masses = JSON.parse(JSON.stringify(masses));
    populateVisualization(innerSolarSystem.masses);
}, false);

//Добавление небесных тел в симуляцию пользователем

//переменные, которые будут хранить координаты мышки
let mousePressX = 0;
let mousePressY = 0;

//переменные, которые хранят координаты текущего положения мышки
let currentMouseX = 0;
let currentMouseY = 0;

//переменную, которая хранит состояние: перемещается мышь или нет
let dragging = false;

//событие записывающий координаты того места, где была нажата мышь,
//и устанавливает переменную перемещения в значение true.
canvas.addEventListener("mousedown", e => {
        mousePressX = e.clientX;
        mousePressY = e.clientY;
        dragging = true;
    },
    false
);

//событие записывающие координаты текущего положения курсора мыши
canvas.addEventListener("mousemove", e => {
        currentMouseX = e.clientX;
        currentMouseY = e.clientY;
    }, 
    false
);

const massesList = document.querySelector(".masses-list");

canvas.addEventListener("mouseup", e => {
    const x = (mousePressX - width / 2) / scale;
    const y = (mousePressY - height / 2) / scale;
    const vx = (e.clientX - mousePressX) / 500;
    const vy = (e.clientY - mousePressY) / 500;

    innerSolarSystem.masses.push({
        m: parseFloat(massesList.value),
        x,
        y,
        vx,
        vy,
        visualization: new Visualization(ctx, trailLength, radius)
    });

    dragging = false;
}, false);

const animate = () => {
    
    innerSolarSystem
        .updatePositionVectors()
        .updateAccelerationVectors()
        .updateVelocityVectors();

    ctx.clearRect(0, 0, width, height);

    const massesLen = innerSolarSystem.masses.length;

    for (let i =0; i < massesLen; i++) {
        const massI = innerSolarSystem.masses[i];

        const x = width / 2 + massI.x * scale;
        const y = height / 2 + massI.y * scale;

        massI.visualization.magnitude(x, y);

        if (massI.name) {
            ctx.font = "14px Arial";
            ctx.fillText(massI.name, x + 12, y + 4);
            ctx.fill();
        }

        if (x < radius || x > width - radius) {
            massI.vx = -massI.vx;
        }
        if (y < radius || y > height - radius) {
            massI.vy = -massI.vy;
        }
    }
    
    if (dragging) {
        ctx.beginPath();
        ctx.moveTo(mousePressX, mousePressY);
        ctx.lineTo(currentMouseX, currentMouseY);
        ctx.strokeStyle = "blue";
        ctx.stroke();
    }

    requestAnimationFrame(animate);
};

animate();