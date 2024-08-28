// Dynamic text functionality
const dynamicText = document.getElementById('dynamic-text');
const cursor = document.querySelector('.cursor');

if (dynamicText && cursor) {
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
        setTimeout(type, isDeleting ? 5 : 25);
    }

    fetchParagraphs();
    setInterval(loadParagraph, 60000);
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        updateRaindropColor();
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
}

// Raindrop effect
const canvas = document.getElementById('rainCanvas');
if (canvas) {
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
}

// DVD Logo Animation
// ... (previous code remains the same) ...

function initDVDLogos(count) {
    const container = document.getElementById('dvd-container');
    if (!container) return; // Only run on pages with the DVD container element

    // Clear existing logos
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const dvdLogo = document.createElement('div');
        dvdLogo.className = 'dvd-logo';
        dvdLogo.textContent = 'hello';
        container.appendChild(dvdLogo);

        let x = Math.random() * (window.innerWidth - 100);
        let y = Math.random() * (window.innerHeight - 50);
        let xSpeed = (Math.random() - 0.5) * 4; // Random speed between -2 and 2
        let ySpeed = (Math.random() - 0.5) * 4; // Random speed between -2 and 2

        function animateDVDLogo() {
            x += xSpeed;
            y += ySpeed;

            if (x + 100 > window.innerWidth || x < 0) {
                xSpeed = -xSpeed;
                changeColor(dvdLogo);
            }
            if (y + 50 > window.innerHeight || y < 0) {
                ySpeed = -ySpeed;
                changeColor(dvdLogo);
            }

            dvdLogo.style.transform = `translate(${x}px, ${y}px)`;

            requestAnimationFrame(animateDVDLogo);
        }

        animateDVDLogo();
    }
}

function changeColor(element) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    element.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
}

// Call initDVDLogos when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initDVDLogos(5)); // Create 5 DVD logos
} else {
    initDVDLogos(5); // Create 5 DVD logos
}

// Reinitialize DVD logos on window resize
window.addEventListener('resize', () => initDVDLogos(5)); // Recreate 5 DVD logos on resize

// ... (rest of the code remains the same) ...