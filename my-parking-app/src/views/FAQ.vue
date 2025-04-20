<template>
    <div class="page-container">
      <h2>FAQ</h2>
      <p>Her finner du svar på vanlige spørsmål.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "FAQ"
  };
  </script>
  
  <style scoped>
  .page-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers horizontally */
  justify-content: flex-start; /* Moves everything closer to the top */
  text-align: center; /* Ensures text inside is centered */
  padding-top: 20px;
  height: 100vh;
  background-color: #ABC89D;
  width: 100%; /* Ensures full width to properly center content */
  font-family: "Nunito Sans", sans-serif;
  font-size: 28px;
  color: #ffffff; /* Medium grey */
  margin-bottom: 20px;
  }
  </style>
  