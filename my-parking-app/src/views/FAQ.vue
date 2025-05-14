<template>
  <div class="faq-container">
    <h2 class="section-title">Frequently Asked Questions</h2>

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
  margin-bottom: 30px;
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

</style>

  