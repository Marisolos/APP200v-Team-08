<template>
  <div class="ads-container">
    <div class="ads-wrapper">
      <h2 class="ads-title">Available Parking Spots</h2>

      <div class="ad-card" v-for="(ad, index) in visibleAds" :key="index">
        <div class="ad-details">
          <h3 class="ad-title">
          Listing #{{ ad.customId }} — {{ formatDateOnly(ad.createdAt) }}
          </h3>
          <p class="ad-address">{{ ad.address }}</p>
          <p class="ad-address"><strong>Price:</strong> {{ ad.price }} kr ({{ ad.paymentPeriod }})</p>
          <p class="ad-address"><strong>Available:</strong> {{ ad.availableWeekdays }} | {{ ad.startTime }}–{{ ad.endTime }}</p>
          <div class="ad-book">
            <button class="book-btn" @click="bookSpot(ad)">Book</button>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="visibleAds.length < allAds.length" class="load-more-container">
        <button @click="loadMore" class="load-more-btn">Load More</button>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";

export default {
  name: "AdsPage",
  data() {
    return {
      allAds: [],
      visibleAds: [],
      adsPerPage: 5,
      currentPage: 1,
    };
  },
  methods: {
    async fetchAds() {
      const querySnapshot = await getDocs(collection(db, "listings"));
      this.allAds = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          customId: this.generateListingNumber(),
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(), // fallback
        };
      });
      this.updateVisibleAds();
    },
    updateVisibleAds() {
      const end = this.currentPage * this.adsPerPage;
      this.visibleAds = this.allAds.slice(0, end);
    },
    loadMore() {
      this.currentPage++;
      this.updateVisibleAds();
    },
    generateListingNumber() {
      return Math.floor(1000 + Math.random() * 9000); // e.g. 4523
    },
    formatDateOnly(date) {
      if (!date) return "N/A";
      return new Intl.DateTimeFormat("en-GB", { dateStyle: "short" }).format(date);
    },
    async bookSpot(ad) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to book.");
        return;
      }

      try {
        await addDoc(collection(db, "bookings"), {
          renterId: user.uid,
          listingId: ad.id,
          address: ad.address,
          timestamp: new Date(),
        });
        alert("Booking successful!");
      } catch (error) {
        console.error("Booking error:", error);
        alert("Failed to book.");
      }
    }
  },
  mounted() {
    this.fetchAds();
  }
};</script>

<style scoped>
.ads-container {
  background-color: #ABC89D;
  min-height: 100vh;
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
  border-bottom: 1px solid #eee;
  padding: 20px 0;
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

.ad-book {
  margin-top: 10px;
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

.book-btn:hover {
  background-color: #FED28D;
}

.load-more-container {
  text-align: center;
  margin-top: 20px;
}

.load-more-btn {
  background-color: #5B8D8A;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.load-more-btn:hover {
  background-color: #FED28D;
}
</style>


  