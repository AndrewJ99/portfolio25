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
    const now = new Date();
    const lastChange = localStorage.getItem('lastChange');
    const lastChangeDate = lastChange ? new Date(lastChange) : null;

    // Force a new paragraph if paragraphs array is available
    if (paragraphs.length > 0 && 
        (!lastChangeDate || 
        now.getDate() !== lastChangeDate.getDate() || 
        (now.getHours() >= 8 && lastChangeDate.getHours() < 8))) {
        
        currentParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        localStorage.setItem('currentParagraph', currentParagraph);
        localStorage.setItem('lastChange', now.toISOString());
    } else {
        currentParagraph = localStorage.getItem('currentParagraph') || 
                           (paragraphs.length > 0 ? paragraphs[0] : "Default paragraph");
    }
    
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
        loadParagraph();
    }

    currentChar += isDeleting ? -1 : 1;
    setTimeout(type, isDeleting ? 50 : 100);
}

fetchParagraphs();

// Check for paragraph change every minute
setInterval(loadParagraph, 60000);