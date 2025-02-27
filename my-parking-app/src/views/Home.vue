<template>
    <div class="home-container">
      <h2> Hjem</h2>
      <p>Velkommen! Du er nå logget inn.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "UserHome"
  };
  </script>
  
  <style scoped>
/* 🔹 Page Container */
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers horizontally */
  justify-content: flex-start; /* Moves everything closer to the top */
  text-align: center; /* Ensures text inside is centered */
  padding-top: 20px;
  height: 100vh;
  background-color: #B3C4AF;
  width: 100%; /* Ensures full width to properly center content */
  font-family: "Nunito Sans", sans-serif;
  font-size: 28px;
  color: #ffffff; /* Medium grey */
  margin-bottom: 20px;
}

  </style>
  