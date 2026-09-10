// JokeAPI Base URL
const JOKE_API_URL = 'https://v2.jokeapi.dev/joke/';

// DOM Elements
const jokeDisplay = document.getElementById('jokeDisplay');
const getJokeBtn = document.getElementById('getJokeBtn');
const copyBtn = document.getElementById('copyBtn');
const jokeTypeSelect = document.getElementById('jokeType');
const categorySelect = document.getElementById('category');
const jokeHistory = document.getElementById('jokeHistory');

// State
let currentJoke = null;
let jokesHistory = JSON.parse(localStorage.getItem('jokesHistory')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    getJokeBtn.addEventListener('click', fetchJoke);
    copyBtn.addEventListener('click', copyJokeToClipboard);
    jokeTypeSelect.addEventListener('change', fetchJoke);
    categorySelect.addEventListener('change', fetchJoke);
    displayJokeHistory();
});

// Fetch Joke from API
async function fetchJoke() {
    try {
        getJokeBtn.disabled = true;
        getJokeBtn.textContent = 'Loading...';
        jokeDisplay.innerHTML = '<div class="loading-spinner"></div>';

        // Build API URL with parameters
        let url = JOKE_API_URL;
        
        // Add category
        const category = categorySelect.value;
        if (category !== 'any') {
            url += category;
        } else {
            url += 'Any';
        }

        // Add parameters
        const jokeType = jokeTypeSelect.value;
        const params = new URLSearchParams();
        
        if (jokeType !== 'any') {
            params.append('type', jokeType);
        }

        if (params.toString()) {
            url += '?' + params.toString();
        }

        // Fetch from API
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            jokeDisplay.innerHTML = '<p style="color: #ef4444;">No jokes found for this category. Try another!</p>';
            return;
        }

        // Store current joke
        currentJoke = data;

        // Display joke
        displayJoke(data);

        // Add to history
        addToHistory(data);

    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeDisplay.innerHTML = `<p style="color: #ef4444;">❌ Error: ${error.message}</p>`;
    } finally {
        getJokeBtn.disabled = false;
        getJokeBtn.textContent = 'Get a Joke';
    }
}

// Display Joke
function displayJoke(joke) {
    let jokeHTML = '';

    if (joke.type === 'single') {
        jokeHTML = `<p class="joke-text">${escapeHtml(joke.joke)}</p>`;
    } else if (joke.type === 'twopart') {
        jokeHTML = `
            <p class="joke-setup">${escapeHtml(joke.setup)}</p>
            <p class="joke-delivery">${escapeHtml(joke.delivery)}</p>
        `;
    }

    jokeDisplay.innerHTML = jokeHTML;
}

// Copy to Clipboard
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
        // Change button state
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

// Add to History
function addToHistory(joke) {
    let jokeText = '';
    
    if (joke.type === 'single') {
        jokeText = joke.joke;
    } else if (joke.type === 'twopart') {
        jokeText = `${joke.setup} ... ${joke.delivery}`;
    }

    // Add to beginning of array
    jokesHistory.unshift({
        text: jokeText,
        category: categorySelect.value,
        timestamp: new Date().toLocaleTimeString()
    });

    // Limit history to 20 jokes
    if (jokesHistory.length > 20) {
        jokesHistory.pop();
    }

    // Save to localStorage
    localStorage.setItem('jokesHistory', JSON.stringify(jokesHistory));

    // Display updated history
    displayJokeHistory();
}

// Display Joke History
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

// Utility Functions
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

// Auto-fetch a joke on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('Joke Generator loaded successfully!');
    }, 500);
});