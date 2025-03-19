```javascript
// scripts/aquarium.js

// Aquarium module to define the environment and interactions
(function() {
  const aquarium = document.getElementById('aquarium');
  const fishCount = 10;
  const fishSize = 20;
  const fishSpeed = 2;
  const fishElements = [];

  // Initialize the aquarium with fish
  function initAquarium() {
    for (let i = 0; i < fishCount; i++) {
      const fish = createFish();
      fishElements.push(fish);
      aquarium.appendChild(fish);
    }
    requestAnimationFrame(animateFish);
  }

  // Create a fish element
  function createFish() {
    const fish = document.createElement('div');
    fish.className = 'fish';
    fish.style.width = `${fishSize}px`;
    fish.style.height = `${fishSize}px`;
    fish.style.position = 'absolute';
    fish.style.backgroundColor = getRandomColor();
    fish.style.borderRadius = '50%';
    fish.style.left = `${Math.random() * (aquarium.offsetWidth - fishSize)}px`;
    fish.style.top = `${Math.random() * (aquarium.offsetHeight - fishSize)}px`;
    return fish;
  }

  // Get a random color for the fish
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Animate fish movement
  function animateFish() {
    fishElements.forEach((fish, index) => {
      const targetFish = fishElements[(index + 1) % fishElements.length];
      moveFishTowards(fish, targetFish);
    });
    requestAnimationFrame(animateFish);
  }

  // Move fish towards another fish
  function moveFishTowards(fish, targetFish) {
    const fishRect = fish.getBoundingClientRect();
    const targetRect = targetFish.getBoundingClientRect();

    const dx = targetRect.left - fishRect.left;
    const dy = targetRect.top - fishRect.top;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const moveX = (dx / distance) * fishSpeed;
      const moveY = (dy / distance) * fishSpeed;

      const newLeft = Math.min(Math.max(parseFloat(fish.style.left) + moveX, 0), aquarium.offsetWidth - fishSize);
      const newTop = Math.min(Math.max(parseFloat(fish.style.top) + moveY, 0), aquarium.offsetHeight - fishSize);

      fish.style.left = `${newLeft}px`;
      fish.style.top = `${newTop}px`;
    }
  }

  // Start the aquarium
  initAquarium();
})();
```