/* ==========================================================
   DOM
========================================================== */

const card = document.querySelector(".card");

const heart = document.querySelector(".heart-secret");

const particlesContainer = document.getElementById("particles");

const petalsContainer = document.getElementById("petals");


/* ==========================================================
   CARD TRANSFORM
========================================================== */

let parallaxX = 0;

let parallaxY = 0;

function updateCardTransform() {

    const scale = card.classList.contains("open")
        ? 1.02
        : 1;

    card.style.transform =

        `translate3d(${parallaxX}px, ${parallaxY}px, 0)
         scale(${scale})`;

}


/* ==========================================================
   SECRET LETTER
========================================================== */

heart.addEventListener("click", () => {

    card.classList.toggle("open");

    updateCardTransform();

});


/* ==========================================================
   PARALLAX
========================================================== */

const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice) {

    document.addEventListener("mousemove", (event) => {

        const x =
            (event.clientX / window.innerWidth - 0.5) * 10;

        const y =
            (event.clientY / window.innerHeight - 0.5) * 10;

        parallaxX = x;

        parallaxY = y;

        updateCardTransform();

    });

}


/* ==========================================================
   PARTICLE BASE CLASS
========================================================== */

class Particle {

    constructor(container) {

        this.container = container;

        this.element = document.createElement("div");

        this.active = false;

        container.appendChild(this.element);

    }

    spawn() {}

    update() {}

    hide() {

        this.active = false;

        this.element.style.opacity = "0";

    }

}

/* ==========================================================
   ROSE PETAL
========================================================== */

class RosePetal extends Particle {

    constructor(container) {

        super(container);

        this.element.className = "rose-petal";

        this.reset();

    }

    reset() {

        this.active = true;

        this.x = Math.random() * window.innerWidth;

        this.y = -100 - Math.random() * 250;

        this.velocityX = (Math.random() - 0.5) * 0.4;

        this.velocityY = 0.35 + Math.random() * 0.55;

        this.rotation = Math.random() * 360;

        this.rotationSpeed =
            (Math.random() - 0.5) * 0.8;

        this.scale =
            0.65 + Math.random() * 0.7;

        this.swing =
            Math.random() * Math.PI * 2;

        this.swingSpeed =
            0.01 + Math.random() * 0.02;

        this.opacity =
            0.35 + Math.random() * 0.45;

        this.width =
            16 + Math.random() * 12;

        this.height =
            this.width * 1.35;

        this.element.style.width =
            `${this.width}px`;

        this.element.style.height =
            `${this.height}px`;

        this.element.style.opacity =
            this.opacity;

    }

    update() {

        this.swing += this.swingSpeed;

        this.y += this.velocityY;

        this.x +=

            this.velocityX +

            Math.sin(this.swing) * 0.45;

        this.rotation +=

            this.rotationSpeed;

        this.element.style.transform =

            `translate3d(${this.x}px, ${this.y}px, 0)
             rotate(${this.rotation}deg)
             scale(${this.scale})`;

        if (

            this.y >

            window.innerHeight + 120

        ) {

            this.reset();

        }

    }

}



/* ==========================================================
   FIREFLY
========================================================== */

class Firefly extends Particle {

    constructor(container) {

        super(container);

        this.element.className = "firefly";

        this.reset();

    }

    reset() {

        this.active = true;

        this.x =
            Math.random() * window.innerWidth;

        this.y =
            Math.random() * window.innerHeight;

        this.radius =
            2 + Math.random() * 4;

        this.speed =
            0.12 + Math.random() * 0.25;

        this.angle =
            Math.random() * Math.PI * 2;

        this.turnSpeed =
            0.003 + Math.random() * 0.01;

        this.phase =
            Math.random() * Math.PI * 2;

        this.element.style.width =
            `${this.radius * 2}px`;

        this.element.style.height =
            `${this.radius * 2}px`;

    }

    update() {

        this.phase += 0.02;

        this.angle +=

            Math.sin(this.phase) *

            this.turnSpeed;

        this.x +=

            Math.cos(this.angle) *

            this.speed;

        this.y +=

            Math.sin(this.angle) *

            this.speed;

        const glow =

            0.25 +

            Math.sin(this.phase) * 0.35;

        this.element.style.opacity =

            glow;

        this.element.style.transform =

            `translate3d(${this.x}px, ${this.y}px, 0)`;

        if (

            this.x < -50 ||

            this.x > window.innerWidth + 50 ||

            this.y < -50 ||

            this.y > window.innerHeight + 50

        ) {

            this.reset();

        }

    }

}

/* ==========================================================
   ENGINE
========================================================== */

const engine = {

    objects: [],

    running: true,

    add(object) {

        this.objects.push(object);

    },

    update() {

        if (!this.running) {

            requestAnimationFrame(() => this.update());

            return;

        }

        for (const object of this.objects) {

            if (object.active) {

                object.update();

            }

        }

        requestAnimationFrame(() => this.update());

    }

};

requestAnimationFrame(() => engine.update());


/* ==========================================================
   CREATE PETALS
========================================================== */

const petals = [];

const PETAL_COUNT = 14;

for (let i = 0; i < PETAL_COUNT; i++) {

    const petal = new RosePetal(petalsContainer);

    petals.push(petal);

    engine.add(petal);

}


/* ==========================================================
   CREATE FIREFLIES
========================================================== */

const fireflies = [];

const FIREFLY_COUNT = 22;

for (let i = 0; i < FIREFLY_COUNT; i++) {

    const firefly = new Firefly(particlesContainer);

    fireflies.push(firefly);

    engine.add(firefly);

}


/* ==========================================================
   WINDOW RESIZE
========================================================== */

window.addEventListener("resize", () => {

    petals.forEach((petal) => petal.reset());

    fireflies.forEach((firefly) => firefly.reset());

});


/* ==========================================================
   PAGE VISIBILITY
========================================================== */

document.addEventListener("visibilitychange", () => {

    engine.running = !document.hidden;

});


/* ==========================================================
   INITIAL TRANSFORM
========================================================== */

updateCardTransform();
