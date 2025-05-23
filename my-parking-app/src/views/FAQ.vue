<template>
  <div class="faq-container">
    <canvas ref="carCanvas" class="car-canvas-background" width="400" height="200"></canvas>

    <h2 class="section-title">Frequently Asked Questions</h2>

    <div class="faq-search">
      <input
        type="text"
        placeholder="Search questions..."
        v-model="searchQuery"
        class="faq-search-input"
      />
    </div>

    <div
      v-for="(item, index) in filteredFaqs"
      :key="index"
      class="faq-item"
    >
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
      searchQuery: "",
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

  car.onload = () => {
    const carWidth = 300;
    const carHeight = (car.height / car.width) * carWidth;

    // ✅ Define cloud ONCE outside animate
    const cloud = {
  x: 250,               // move to the left
  baseY: 50,           // vertical position
  size: 30,            // larger
  phase: Math.random() * Math.PI * 2
};

const cloud2 = {
  x: canvas.width - 70,  // move to the right
  baseY: 70,             // slightly lower
  size: 18,              // smaller
  phase: Math.random() * Math.PI * 2
};

    function animate(timestamp) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.save();

const x = cloud.x;
const y = cloud.baseY + Math.sin(timestamp / 400 + cloud.phase) * 2;
const s = cloud.size;

ctx.fillStyle = "white";
ctx.strokeStyle = "#385464";
ctx.lineWidth = 2;
ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
ctx.shadowBlur = 4;

ctx.beginPath();
// Left hump
ctx.arc(x - s * 0.6, y, s * 0.6, Math.PI * 0.5, Math.PI * 1.5);
// Top hump
ctx.arc(x, y - s * 0.6, s * 0.9, Math.PI, 0);
// Right hump
ctx.arc(x + s * 0.6, y, s * 0.6, Math.PI * 1.5, Math.PI * 0.5);
ctx.closePath();

ctx.fill();
ctx.stroke();

ctx.restore();

// Draw second smaller cloud
ctx.save();

const x2 = cloud2.x;
const y2 = cloud2.baseY + Math.sin(timestamp / 400 + cloud2.phase) * 2;
const s2 = cloud2.size;

ctx.fillStyle = "white";
ctx.strokeStyle = "#385464";
ctx.lineWidth = 2;
ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
ctx.shadowBlur = 4;

ctx.beginPath();
// Left hump
ctx.arc(x2 - s2 * 0.6, y2, s2 * 0.6, Math.PI * 0.5, Math.PI * 1.5);
// Top hump
ctx.arc(x2, y2 - s2 * 0.6, s2 * 0.9, Math.PI, 0);
// Right hump
ctx.arc(x2 + s2 * 0.6, y2, s2 * 0.6, Math.PI * 1.5, Math.PI * 0.5);
ctx.closePath();

ctx.fill();
ctx.stroke();

ctx.restore();

      // 🚗 Draw car
      ctx.drawImage(car, 10, canvas.height - carHeight - 5, carWidth, carHeight);

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  };
},

  methods: {
    toggle(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  },
computed: {
  filteredFaqs() {
    if (!this.searchQuery.trim()) return this.faqs;
    const q = this.searchQuery.toLowerCase();
    return this.faqs.filter(
      item =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
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

.bottom-animation {
  display: flex;
  justify-content: flex-start; /* or center or end */
  margin-top: 30px; /* pushes it down visually */
}

.car-canvas-background {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 400px;
  height: 200px;
  z-index: 0; /* behind content */
  pointer-events: none;
}

.faq-search {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.faq-search-input {
  width: 100%;
  max-width: 600px;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}


</style>
