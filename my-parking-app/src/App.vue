<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/login">Login</router-link> |
      <router-link to="/home">Home</router-link> |
      <router-link to="/finn-parkering">Finn parkering</router-link> |
      <router-link to="/lei-ut">Lei ut</router-link> |
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
.navbar {
  background-color: #0D8F3D;
  padding: 10px;
  text-align: center;
  font-family: Tahoma, sans-serif;
}

.navbar a {
  color: white;
  text-decoration: none;
  padding: 0 15px;
  font-weight: bold;
}
</style>
