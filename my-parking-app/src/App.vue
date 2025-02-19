<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/login">Login</router-link> 
      <router-link to="/home">Home</router-link> 
      <router-link to="/finn-parkering">Finn parkering</router-link> 
      <router-link to="/lei-ut">Lei ut</router-link> 
      <router-link to="/faq">FAQ</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
/* Navbar Styles */
.navbar {
  background-color: white; /* ✅ White background */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* ✅ Subtle shadow */
  padding: 15px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Nunito Sans", sans-serif; /* ✅ Custom font */
}

/* Navbar Links */
.navbar a {
  color: #0D8F3D; /* ✅ Black text */
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px; /* ✅ Space between links (removes vertical lines) */
  transition: color 0.3s ease-in-out;
}

.navbar a:hover {
  color: black; /* ✅ Change color on hover */
}

</style>
