// Falling petals animation
function createFallingPetals() {
  const petalsContainer = document.querySelector('.petals');
  const petalEmojis = ['🌸', '🌷', '🌹', '💐'];
  
  function createPetal() {
    const petal = document.createElement('div');
    const emoji = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    petal.textContent = emoji;
    petal.style.position = 'fixed';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = '-50px';
    petal.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
    petal.style.opacity = Math.random() * 0.5 + 0.2;
    petal.style.pointerEvents = 'none';
    petal.style.zIndex = '1';
    
    petalsContainer.appendChild(petal);
    
    const duration = Math.random() * 5 + 8;
    const animation = petal.animate(
      [
        { 
          transform: 'translateY(0) rotate(0deg)',
          opacity: parseFloat(petal.style.opacity)
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
  
  // Create petals periodically
  setInterval(createPetal, 1500);
  
  // Create initial petals
  for (let i = 0; i < 3; i++) {
    setTimeout(createPetal, i * 500);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  createFallingPetals();
  console.log('Tribute page loaded with falling petals! 🌸');
});

// Add smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});