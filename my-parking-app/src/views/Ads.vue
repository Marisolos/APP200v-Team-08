<template>
    <div class="ads-container">
      <div class="ads-wrapper">
        <h2 class="ads-title">Available Parking Spots</h2>
  
        <div class="ad-card" v-for="(ad, index) in ads" :key="index">
          <img :src="ad.image" alt="Parking Spot" class="ad-image" />
          <div class="ad-details">
            <h3 class="ad-title">{{ ad.title }}</h3>
            <p class="ad-address">{{ ad.address }}</p>
            <div class="ad-book">
              <button class="book-btn">Book</button>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  import parkingImg from "@/assets/parking.png";
  export default {
    name: "AdsPage",
    data() {
      return {
        ads: [
          {
            title: "Oslo, Parkering / Oslo City",
            address: "Karlsgate 1, 0160 Oslo",
            image: parkingImg,
          },
          {
            title: "Oslo, Parkering / Oslo City",
            address: "Karlsgate 1, 0160 Oslo",
            image: parkingImg,
          },
          {
            title: "Oslo, Parkering / Oslo City",
            address: "Karlsgate 1, 0160 Oslo",
            image: parkingImg,
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .ads-container {
    background-color: #ABC89D;
    height: 100vh;
    padding: 50px 0;
    display: flex;
    justify-content: center;
  }
  
  .ads-wrapper {
    background-color: white;
    width: 800px;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .ads-title {
    text-align: center;
    font-family: "Nunito Sans", sans-serif;
    margin-bottom: 30px;
    color: #333;
  }
  
  .ad-card {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 20px 0;
    gap: 20px;
  }
  
  .ad-image {
    width: 150px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
  }
  
  .ad-details {
    flex: 1;
  }
  
  .ad-title {
    font-size: 18px;
    font-weight: bold;
    color: #2c7a7b;
  }
  
  .ad-address {
    color: #666;
    margin: 5px 0;
  }
  
  .ad-rating {
    font-size: 14px;
    color: #555;
  }
  
  .ad-book {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .ad-price {
    font-weight: bold;
    font-size: 16px;
  }
  
  .book-btn {
    background-color: #5B8D8A;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  
  .instant {
    color: #16a34a;
    font-size: 12px;
  }
  </style>

  