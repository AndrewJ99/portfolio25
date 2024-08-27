// Dynamic text functionality
const dynamicText = document.getElementById('dynamic-text');
const cursor = document.querySelector('.cursor');

let paragraphs = [];
let currentParagraph = '';
let currentChar = 0;
let isDeleting = false;
let isPaused = false;

localStorage.removeItem('currentParagraph');
localStorage.removeItem('lastChange');

async function fetchParagraphs() {
    try {
        const response = await fetch('paragraphs.json');
        paragraphs = await response.json();
        loadParagraph();
        type();
    } catch (error) {
        console.error('Error fetching paragraphs:', error);
    }
}

function loadParagraph() {
    let newParagraph;
    do {
        newParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    } while (newParagraph === currentParagraph && paragraphs.length > 1);
    
    currentParagraph = newParagraph;
    currentChar = 0;
    isDeleting = false;
}

function type() {
    if (isPaused) {
        setTimeout(type, 3000);
        return;
    }

    const current = currentParagraph.substring(0, currentChar);
    dynamicText.textContent = current;
    
    const textWidth = dynamicText.offsetWidth;
    cursor.style.left = `${textWidth}px`;

    if (!isDeleting && currentChar === currentParagraph.length) {
        isPaused = true;
        setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            type();
        }, 3000);
        return;
    }

    if (isDeleting && currentChar === 0) {
        isDeleting = false;
        loadParagraph();
        currentChar = 0;
    }

    currentChar += isDeleting ? -1 : 1;
    setTimeout(type, isDeleting ? 50 : 25);
}

fetchParagraphs();
setInterval(loadParagraph, 60000);

// Clock functionality
function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    let milliseconds = now.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
    
    document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

setInterval(updateClock, 10);
updateClock();

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    updateRaindropColor();
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}

// Raindrop effect
const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

class Raindrop {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * 5 + 2;
        this.color = body.classList.contains('dark-theme') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    }

    fall() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

const raindrops = [];
for (let i = 0; i < 5; i++) {
    raindrops.push(new Raindrop());
}

function updateRaindropColor() {
    const rainColor = body.classList.contains('dark-theme') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    raindrops.forEach(drop => {
        drop.color = rainColor;
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    raindrops.forEach(drop => {
        drop.fall();
        drop.draw();
    });
    requestAnimationFrame(animate);
}

animate();

// Initial raindrop color update
updateRaindropColor();