<template>
  <div class="find-parking-container">
    <!-- Page Title -->
    <h2 class="page-title">Finn Parkering</h2>

    <!-- Search Bar -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Enter location..."
        class="search-input"
      />
      <button @click="searchParking" class="search-button">Search</button>
    </div>

    <!-- Placeholder for Map (Future Implementation) -->
    <div class="map-placeholder">
      <p>🗺️ Map will be displayed here in the future...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FindParking",
  data() {
    return {
      searchQuery: "", // Stores the search input
    };
  },
  methods: {
    searchParking() {
      console.log("Searching for parking at:", this.searchQuery);
      // 🔹 Future: Integrate search functionality (e.g., Google Maps API)
    },
  },
};
</script>

<style scoped>
/* 🔹 Page Container */
.find-parking-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Moves content closer to the top */
  padding-top: 20px; /* Reduce padding to move even higher */
  height: 100vh; /* Full height */
  background-color: #B3C4AF;
}

/* 🔹 Page Title */
.page-title {
  font-family: "Nunito Sans", sans-serif;
  font-size: 28px;
  color: #ffffff; /* Medium grey */
  margin-bottom: 20px;
}

/* 🔹 Search Bar */
.search-container {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 5px;
  border-radius: 25px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 350px;
}

/* 🔹 Search Input */
.search-input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 25px;
  outline: none;
  font-size: 16px;
  font-family: "Nunito Sans", sans-serif;
  color: #7a7a7a; /* Medium grey text */
}

/* 🔹 Search Button */
.search-button {
  background-color: #5B8D8A;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 25px;
  font-size: 16px;
  font-family: "Nunito Sans", sans-serif;
  cursor: pointer;
  transition: 0.3s;
}

.search-button:hover {
  background-color: #FED28D;
}

/* 🔹 Map Placeholder */
.map-placeholder {
  margin-top: 40px;
  width: 90%;
  max-width: 800px;
  height: 400px;
  background-color: #d9e4d2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-family: "Nunito Sans", sans-serif;
  color: #4a4a4a;
  border-radius: 15px;
}
</style>


  