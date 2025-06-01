<template>
  <footer class="footer">
    <div class="footer-left">
      <p>{{ $t('footer.footer') }}</p>
    </div>
    <div class="footer-right">
      <p><router-link to="/faq">FAQ</router-link></p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent"
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #5B8D8A;
  color: #ffffff;
  padding: 25px 40px;
  font-family: "Nunito Sans", sans-serif;
  font-size: 18px;
  min-height: 80px;
}

.footer a {
  color: #ffffff;
  text-decoration: underline;
}

.footer a:hover {
  text-decoration: none;
}

.footer-left p,
.footer-right p {
  margin: 0;
}
</style>