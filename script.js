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
        loadParagraph(); // This will now use the freshly loaded paragraphs
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
    
    // Reset the typing animation
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
    
    // Position the cursor
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
        loadParagraph(); // This will now load a new paragraph every time
        currentChar = 0; // Reset the current character
    }

    currentChar += isDeleting ? -1 : 1;
    setTimeout(type, isDeleting ? 50 : 25 );
}

fetchParagraphs();

// Check for paragraph change every minute
setInterval(loadParagraph, 60000);



// CLOCK FEATURE
// Digital Clock Function
function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    let milliseconds = now.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
    
    document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// Update clock every 10 milliseconds for smoother millisecond display
setInterval(updateClock, 10);

// Initial call to display time immediately
updateClock();