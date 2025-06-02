<template>
  <div class="faq-container">
    <!-- Canvas background for car and cloud animation -->
    <canvas ref="carCanvas" class="car-canvas-background" width="400" height="200"></canvas>

    <!-- Section title -->
    <h2 class="section-title">Frequently Asked Questions</h2>

    <!-- Loop through each FAQ item -->
    <div
      v-for="(item, index) in faqs"
      :key="index"
      class="faq-item"
    >
      <!-- Question with toggle interaction -->
      <div class="faq-question" @click="toggle(index)">
        {{ item.question }}
        <span class="arrow" :class="{ open: activeIndex === index }">▼</span>
      </div>

      <!-- Conditionally rendered answer with transition -->
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
      activeIndex: null, // Keeps track of which FAQ is expanded
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
    car.src = require('@/assets/car.png');

    // Cloud definitions
    const cloud = {
      x: 250,
      baseY: 50,
      size: 30,
      phase: Math.random() * Math.PI * 2
    };

    const cloud2 = {
      x: canvas.width - 70,
      baseY: 70,
      size: 18,
      phase: Math.random() * Math.PI * 2
    };

    // Animation logic
    car.onload = () => {
      const carWidth = 300;
      const carHeight = (car.height / car.width) * carWidth;

      const animate = (timestamp) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw clouds
        drawCloud(ctx, cloud, timestamp);
        drawCloud(ctx, cloud2, timestamp);

        // Draw car
        ctx.drawImage(car, 10, canvas.height - carHeight - 5, carWidth, carHeight);

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    };

    // Function to draw a cloud
    function drawCloud(ctx, cloudObj, timestamp) {
      ctx.save();
      const x = cloudObj.x;
      const y = cloudObj.baseY + Math.sin(timestamp / 400 + cloudObj.phase) * 2;
      const s = cloudObj.size;

      ctx.fillStyle = "white";
      ctx.strokeStyle = "#385464";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
      ctx.shadowBlur = 4;

      ctx.beginPath();
      ctx.arc(x - s * 0.6, y, s * 0.6, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(x, y - s * 0.6, s * 0.9, Math.PI, 0);
      ctx.arc(x + s * 0.6, y, s * 0.6, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  },

  methods: {
    // Toggle open/close for the selected FAQ item
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
  position: relative;
  z-index: 1;
}

.section-title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  font-size: 36px;
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

.car-canvas-background {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 400px;
  height: 200px;
  z-index: 0;
  pointer-events: none;
}
</style>
