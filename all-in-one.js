// ==================== JOKE API FUNCTIONALITY ====================

const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/';

// DOM Elements
const jokeDisplay = document.getElementById('jokeDisplay');
const getJokeBtn = document.getElementById('getJokeBtn');
const copyBtn = document.getElementById('copyBtn');
const jokeTypeSelect = document.getElementById('jokeType');
const categorySelect = document.getElementById('category');
const jokeHistory = document.getElementById('jokeHistory');
const contactForm = document.getElementById('contactForm');

// State
let currentJoke = null;
let jokesHistory = JSON.parse(localStorage.getItem('jokesHistory')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    getJokeBtn.addEventListener('click', fetchJoke);
    copyBtn.addEventListener('click', copyJokeToClipboard);
    jokeTypeSelect.addEventListener('change', fetchJoke);
    categorySelect.addEventListener('change', fetchJoke);
    contactForm.addEventListener('submit', handleContactForm);
    displayJokeHistory();
    createFallingPetals();
    setupSmoothScroll();
});

// ==================== JOKE FUNCTIONS ====================

async function fetchJoke() {
    try {
        getJokeBtn.disabled = true;
        getJokeBtn.textContent = 'Loading...';
        jokeDisplay.innerHTML = '<div style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite;"></div>';

        let url = JOKE_API_URL;
        const category = categorySelect.value;
        
        if (category !== 'any') {
            url += category;
        } else {
            url += 'Any';
        }

        const jokeType = jokeTypeSelect.value;
        const params = new URLSearchParams();
        
        if (jokeType !== 'any') {
            params.append('type', jokeType);
        }

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            jokeDisplay.innerHTML = '<p style="color: #ef4444;">No jokes found for this category. Try another!</p>';
            return;
        }

        currentJoke = data;
        displayJoke(data);
        addToHistory(data);

    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeDisplay.innerHTML = `<p style="color: #ef4444;">❌ Error: ${error.message}</p>`;
    } finally {
        getJokeBtn.disabled = false;
        getJokeBtn.textContent = 'Get a Joke';
    }
}

function displayJoke(joke) {
    let jokeHTML = '';

    if (joke.type === 'single') {
        jokeHTML = `<p class="joke-text">${escapeHtml(joke.joke)}</p>`;
    } else if (joke.type === 'twopart') {
        jokeHTML = `
            <p class="joke-setup" style="margin-bottom: 15px; font-weight: 600;">${escapeHtml(joke.setup)}</p>
            <p class="joke-delivery" style="margin-top: 15px; font-size: 1.3rem; font-weight: 700;">${escapeHtml(joke.delivery)}</p>
        `;
    }

    jokeDisplay.innerHTML = jokeHTML;
}

function copyJokeToClipboard() {
    if (!currentJoke) {
        alert('No joke to copy yet. Get a joke first!');
        return;
    }

    let jokeText = '';
    
    if (currentJoke.type === 'single') {
        jokeText = currentJoke.joke;
    } else if (currentJoke.type === 'twopart') {
        jokeText = `${currentJoke.setup}\n${currentJoke.delivery}`;
    }

    navigator.clipboard.writeText(jokeText).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy joke');
    });
}

function addToHistory(joke) {
    let jokeText = '';
    
    if (joke.type === 'single') {
        jokeText = joke.joke;
    } else if (joke.type === 'twopart') {
        jokeText = `${joke.setup} ... ${joke.delivery}`;
    }

    jokesHistory.unshift({
        text: jokeText,
        category: categorySelect.value,
        timestamp: new Date().toLocaleTimeString()
    });

    if (jokesHistory.length > 20) {
        jokesHistory.pop();
    }

    localStorage.setItem('jokesHistory', JSON.stringify(jokesHistory));
    displayJokeHistory();
}

function displayJokeHistory() {
    if (jokesHistory.length === 0) {
        jokeHistory.innerHTML = '<li style="color: #999;">No jokes yet. Get started!</li>';
        return;
    }

    jokeHistory.innerHTML = jokesHistory.map((joke, index) => `
        <li>
            <strong>#${index + 1}</strong> (${joke.timestamp})<br>
            ${truncateText(joke.text, 100)}
        </li>
    `).join('');
}

// ==================== FALLING PETALS ====================

function createFallingPetals() {
    const petalsContainer = document.querySelector('.petals');
    if (!petalsContainer) return;
    
    const petalEmojis = ['🌸', '🌷', '🌹', '💐'];
    
    function createPetal() {
        const petal = document.createElement('div');
        const emoji = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        petal.textContent = emoji;
        petal.style.position = 'absolute';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = '-50px';
        petal.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
        petal.style.opacity = Math.random() * 0.5 + 0.2;
        petal.style.pointerEvents = 'none';
        
        petalsContainer.appendChild(petal);
        
        const duration = Math.random() * 5 + 8;
        const startOpacity = parseFloat(petal.style.opacity);
        
        const animation = petal.animate(
            [
                { 
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: startOpacity
                },
                { 
                    transform: 'translateY(100vh) rotate(360deg)',
                    opacity: 0
                }
            ],
            { duration: duration * 1000, easing: 'linear' }
        );
        
        animation.onfinish = () => petal.remove();
    }
    
    setInterval(createPetal, 1500);
    
    for (let i = 0; i < 3; i++) {
        setTimeout(createPetal, i * 500);
    }
}

// ==================== SMOOTH SCROLL ====================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==================== CONTACT FORM ====================

function handleContactForm(e) {
    e.preventDefault();
    const inputs = contactForm.querySelectorAll('input, textarea');
    const name = inputs[0].value;
    
    // Show success message
    alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`);
    
    // Reset form
    contactForm.reset();
}

// ==================== UTILITY FUNCTIONS ====================

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Initialize
console.log('🌸 Debra All-in-One website loaded successfully! 🎉');
