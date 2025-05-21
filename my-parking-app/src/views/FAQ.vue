<template>
  <div class="faq-container">
    <h2 class="section-title">Frequently Asked Questions</h2>
    <div class="animation-wrapper">
      <canvas ref="carCanvas" class="car-canvas" width="700" height="60"></canvas>
  </div>

    <div v-for="(item, index) in faqs" :key="index" class="faq-item">
      <div class="faq-question" @click="toggle(index)">
        {{ item.question }}
        <span class="arrow" :class="{ open: activeIndex === index }">▼</span>
      </div>
      <transition name="fade-slide">
  <div v-if="activeIndex === index" class="faq-answer">
    {{ item.answer }}
  </div>

</transition>
    </div>
  </div>

  
</template>

<script>
export default {
  name: "FAQ",
  data() {
    return {
      activeIndex: null,
      faqs: [
        {
          question: "How do I rent a parking spot?",
          answer: "Go to 'Find Parking', search for a location, and click 'Book' on a listed space."
        },
        {
          question: "How do I list my parking spot?",
          answer: "Use the 'Register Parking' page to add location, price, and availability."
        },
        {
          question: "How do I know my booking was successful?",
          answer: "You’ll get a confirmation and can view it in your profile under history."
        },
        {
          question: "Can I update my personal information?",
          answer: "Yes, go to 'Edit Profile' to change your name, phone number, and more."
        },
        {
          question: "Can I manage my listings?",
          answer: "Yes, under 'My Listings' in your profile, you can edit or remove spots you've listed."
        },
      ]
    };
  },

  mounted() {
  const canvas = this.$refs.carCanvas;
  const ctx = canvas.getContext("2d");

  const car = new Image();
  car.src = require('@/assets/logo.png'); 

  car.onload = () => {
    
  const carWidth = 60;
  const carHeight = (car.height / car.width) * carWidth;

  const smokes = [];
  let isWaiting = false;
  let waitStart = null;
  const waitDuration = 1200; // ms

// Generate multiple clouds
const clouds = Array.from({ length: 3 }, () => ({
  x: Math.random() * canvas.width,
  y: 5 + Math.random() * 15,
  speed: 0.1 + Math.random() * 0.15,
  size: 20 + Math.random() * 15
}));

  function animate(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw drifting clouds
ctx.save();
clouds.forEach(cloud => {
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
  ctx.ellipse(cloud.x + cloud.size * 0.6, cloud.y + 2, cloud.size * 0.6, cloud.size * 0.4, 0, 0, Math.PI * 2);
  ctx.ellipse(cloud.x - cloud.size * 0.6, cloud.y + 2, cloud.size * 0.6, cloud.size * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  cloud.x += cloud.speed;
  if (cloud.x > canvas.width + 50) {
    cloud.x = -60;
    cloud.y = 5 + Math.random() * 15;
  }
});
ctx.restore();

    const fadeDistance = 100;
    let opacity = 1;

    if (x > canvas.width - fadeDistance) {
      opacity = 1 - (x - (canvas.width - fadeDistance)) / fadeDistance;
    } else if (x < fadeDistance - carWidth) {
      opacity = x / fadeDistance;
    }

    // Bubble-style smoke generation
    if (!isWaiting && Math.random() < 0.1) {
      smokes.push({
        x: x + carWidth - 8,
        y: 35 + Math.random() * 4,
        radius: 4 + Math.random() * 6,
        opacity: 0.4 + Math.random() * 0.2
      });
    }

    // Draw car
    if (!isWaiting) {
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

ctx.restore();

// headlight glow
ctx.save();
ctx.fillStyle = "rgba(255, 255, 150, 0.5)";
ctx.beginPath();
ctx.ellipse(x - 4, 36, 8, 4, 0, 0, Math.PI * 2); 
ctx.fill();
ctx.restore();


ctx.drawImage(car, x, 10, carWidth, carHeight);


      ctx.globalAlpha = 1;
    }

    // Draw bubbles
    for (let i = smokes.length - 1; i >= 0; i--) {
      const s = smokes[i];
      ctx.fillStyle = `rgba(240, 240, 240, ${s.opacity})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();

      s.x -= 0.3; // drift left
      s.y += 0.05; // gentle rise
      s.opacity -= 0.01;
      s.radius += 0.1;

      if (s.opacity <= 0) smokes.splice(i, 1);
    }

    // Delay re-entry after car exits
    if (!isWaiting) {
      x -= speed;
      if (x + carWidth < 0) {
        isWaiting = true;
        waitStart = timestamp;
      }
    } else if (timestamp - waitStart > waitDuration) {
      x = canvas.width;
      isWaiting = false;
    }

    requestAnimationFrame(animate);
  }

  let x = canvas.width;
  const speed = 1.2;
  requestAnimationFrame(animate);
};

},
  methods: {
    toggle(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  }
};
</script>

<style scoped>
.faq-container {
  background-color: #ABC89D;
  padding: 40px 20px;
  font-family: "Nunito Sans", sans-serif;
  min-height: 100vh;
}

.section-title {
  text-align: center;
  color: #fff;
  margin-bottom: 10px;
  font-size: 28px;
}

.faq-item {
  background-color: #fff;
  margin: 10px auto;
  padding: 15px 20px;
  border-radius: 10px;
  max-width: 700px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: #2c3e50;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.faq-answer {
  margin-top: 10px;
  color: #555;
  font-size: 15px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-5px);
  overflow: hidden;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0);
}

.animation-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.car-canvas {
  width: 100%;
  max-width: 700px;
  height: 60px;
  background: transparent;
}

</style>

  