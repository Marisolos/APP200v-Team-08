<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/login">Login</router-link> |
      <router-link to="/home">Home</router-link>
    </nav>
    <router-view /> <!-- ✅ This MUST exist for pages to show up -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.navbar {
  background: blue;
  padding: 10px;
  text-align: center;
}
.navbar a {
  color: white;
  text-decoration: none;
  padding: 0 10px;
}
</style>


