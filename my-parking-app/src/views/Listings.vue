<template>
  <section class="ads-container">
    <div class="ads-content">
    <h2 class="ads-title">Available Parking Spots</h2>

    <div class="ads-wrapper">

      <input
  type="text"
  v-model="searchQuery"
  placeholder="Search by address, city, price, or day"
  class="search-bar"
/>

<div class="sort-container">
  <label for="sort">Sort by:</label>
  <select v-model="sortOption" id="sort" class="sort-select">
    <option value="date-desc">Date added (newest first)</option>
    <option value="date-asc">Date added (oldest first)</option>
    <option value="price-asc">Price (low to high)</option>
    <option value="price-desc">Price (high to low)</option>
  </select>
</div>

      <article
        class="ad-card"
        v-for="(ad, index) in visibleAds"
        :key="index"
        aria-label="Parking listing"
      >
        <div class="ad-details">
          <h3 class="ad-title">{{ ad.address }}</h3>
          <p class="ad-subtitle">Published {{ formatDateOnly(ad.createdAt) }}</p>
          <p class="ad-address"><strong>Price:</strong> {{ ad.price }} kr /hour</p>
          <p class="ad-address"><strong>Available:</strong> {{ ad.availableWeekdays }} | {{ ad.startTime }}–{{ ad.endTime }}</p>
          <div class="ad-book">

            <div v-if="expandedAdId === ad.id" class="ad-details-expanded">
  <p><strong>Access:</strong> {{ ad.accessType }}</p>
  <p><strong>Dimensions:</strong> L: {{ ad.dimensions?.length }}m, W: {{ ad.dimensions?.width }}m, H: {{ ad.dimensions?.height || 'N/A' }}m</p>
  <p><strong>Features:</strong>
    <span v-if="ad.roofChecked">🏠 Roof</span>
    <span v-if="ad.hasCamera">📹 Camera</span>
    <span v-if="ad.hasCharger">🔌 Charger</span>
    <span v-if="ad.hasHeating">🔥 Heated</span>
  </p>
  <p v-if="ad.guidelines"><strong>Rules:</strong> {{ ad.guidelines }}</p>
  <p v-if="ad.additionalInfo"><strong>Info:</strong> {{ ad.additionalInfo }}</p>
  <div v-if="ad.photos?.length">
    <h4>Photos:</h4>
    <img v-for="(url, i) in ad.photos" :key="i" :src="url" class="ad-photo" />
  </div>
</div>

            <button class="book-btn" @click="selectAd(ad)">Book</button>
            <button
  class="details-btn"
  @click="expandedAdId = expandedAdId === ad.id ? null : ad.id"
>
  {{ expandedAdId === ad.id ? 'Hide Details' : 'Show Details' }}
</button>
          </div>
        </div>

        <!-- Booking Form -->
        <div v-if="selectedAd?.id === ad.id" class="booking-form">
          <label>
  <span>Day:</span>
  <select v-model="bookingDay" class="booking-select">
    <option disabled value="">Select a day</option>
    <option
      v-for="day in allDays"
      :key="day"
      :value="day"
      :disabled="!getAvailableDays(ad).includes(day)"
    >
      {{ day }}
    </option>
  </select>
</label>


          <label>
            Start Time:
            <input type="time" v-model="bookingStart" class="booking-input" />
          </label>

          <label>
            End Time:
            <input type="time" v-model="bookingEnd" class="booking-input" />
          </label>

          <div class="booking-actions">
            <button @click="confirmBooking" class="confirm-btn">Confirm</button>
            <button @click="cancelBooking" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </article>
      <div
        v-if="visibleAds.length < allAds.length"
        class="load-more-container"
      >
        <button @click="loadMore" class="load-more-btn">Load More</button>
      </div>
    </div>
    </div>
  </section>
  <FooterComponent /> <!-- Footer Component -->
</template>

<script>
import { collection, getDocs, addDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import FooterComponent from '@/components/Footer.vue'; // Import FooterComponent for use in this component

export default {
  name: "ListingsPage",
    components: {
    FooterComponent  // <-- Registrer komponenten her
  },
  data() {
    return {
      allAds: [],
      visibleAds: [],
      adsPerPage: 5,
      currentPage: 1,
      selectedAd: null,
      bookingDay: "",
      bookingStart: "",
      bookingEnd: "",
      searchQuery: "",
      allDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      sortOption: "date-desc",
      expandedAdId: null
    };
  },
  computed: {
    filteredAds() {
  const q = this.searchQuery.toLowerCase();

  return this.allAds.filter(ad => {
    const inAddress = ad.address?.toLowerCase().includes(q);
    const inCity = ad.address?.split(" ").slice(-1)[0]?.toLowerCase().includes(q);
    const inCustomId = ad.customId?.toString().includes(q.replace("#", ""));
    const inPrice = ad.price?.toString().includes(q);

    const searchedDay = this.allDays.find(day =>
      day.toLowerCase().startsWith(q)
    );

    let inDay = false;
    if (searchedDay) {
      inDay = this.getAvailableDays(ad).includes(searchedDay);
    } else if (["every", "any", "daily", "day"].some(keyword => q.includes(keyword))) {
      inDay = this.getAvailableDays(ad).length === this.allDays.length;
    }

    return inAddress || inCity || inCustomId || inPrice || inDay;
  });
}
},

watch: {
  searchQuery() {
    this.currentPage = 1;
    this.updateVisibleAds();
  },
  sortOption() {
    this.updateVisibleAds();
  }
},
  methods: {
    async fetchAds() {
  const querySnapshot = await getDocs(collection(db, "listings"));
  this.allAds = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date()
    };
  });
  this.updateVisibleAds();
},
getAvailableDays(ad) {
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const value = ad.availableWeekdays;

  if (!value || value.length === 0) {
    return allDays;
  }

  // If already an array, return it directly
  if (Array.isArray(value)) {
    return value;
  }

  // If it's not a string, return an empty array to avoid crashing
  if (typeof value !== 'string') {
    return [];
  }

  const lower = value.toLowerCase();

  if (lower.includes("every day")) {
    if (lower.includes("except")) {
      const exceptPart = lower
        .split("except")[1]
        .replace(/[()]/g, "")
        .split(",")
        .map(day => day.trim().toLowerCase());

      return allDays.filter(day => !exceptPart.includes(day.toLowerCase()));
    }
    return allDays;
  }

  return value.split(",").map(day => day.trim());
},
updateVisibleAds() {
  let sortedAds = [...this.filteredAds];

  if (this.sortOption === "date-desc") {
    sortedAds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (this.sortOption === "date-asc") {
    sortedAds.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (this.sortOption === "price-asc") {
    sortedAds.sort((a, b) => a.price - b.price);
  } else if (this.sortOption === "price-desc") {
    sortedAds.sort((a, b) => b.price - a.price);
  }

  const end = this.currentPage * this.adsPerPage;
  this.visibleAds = sortedAds.slice(0, end);
},
    loadMore() {
      this.currentPage++;
      this.updateVisibleAds();
    },
    formatDateOnly(date) {
      if (!date) return "N/A";
      return new Intl.DateTimeFormat("en-GB", { dateStyle: "short" }).format(date);
    },
    selectAd(ad) {
      this.selectedAd = ad;
      this.bookingDay = ad.availableWeekdays[0] || "";
      this.bookingStart = "";
      this.bookingEnd = "";
    },
    cancelBooking() {
      this.selectedAd = null;
      this.bookingDay = "";
      this.bookingStart = "";
      this.bookingEnd = "";
    },
    async confirmBooking() {
      if (!this.bookingDay || !this.bookingStart || !this.bookingEnd) {
        alert("Please fill in all fields.");
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to book.");
        return;
      }

      const bookingsRef = collection(db, "bookings");

      await addDoc(collection(db, "rentalHistory"), {
        ownerId: this.selectedAd.ownerId,
        renterId: user.uid,
        listingId: this.selectedAd.id,
        address: this.selectedAd.address,
        price: this.selectedAd.price,
        day: this.bookingDay,
        startTime: this.bookingStart,
        endTime: this.bookingEnd,
        timestamp: serverTimestamp()
    });


      // Fetch existing bookings for that listing and weekday
      const q = query(
        bookingsRef,
        where("listingId", "==", this.selectedAd.id),
        where("day", "==", this.bookingDay)
      );

      const snapshot = await getDocs(q);
      const hasConflict = snapshot.docs.some(doc => {
        const existing = doc.data();
        return (
          this.bookingStart < existing.endTime &&
          this.bookingEnd > existing.startTime
        );
      });

      if (hasConflict) {
        alert("This time slot is already booked.");
        return;
      }

      await addDoc(bookingsRef, {
        renterId: user.uid,
        listingId: this.selectedAd.id,
        address: this.selectedAd.address,
        price: this.selectedAd.price,
        day: this.bookingDay,
        startTime: this.bookingStart,
        endTime: this.bookingEnd,
        createdAt: new Date()
      });

      alert("Booking successful!");
      this.cancelBooking();
    }
  },


  mounted() {
    this.fetchAds();
  }

};

</script>


<style scoped>
.ads-container {
  background-color: #ABC89D;
  min-height: 100vh;
  padding: 50px 0;
  display: flex;
  justify-content: center;
}

.ads-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -10px;
}

.ads-wrapper {
  background-color: white;
  width: 800px;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.ads-title {
  color: white;
  text-align: center;
  font-size: 36px;
  margin-bottom: 20px;
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

.booking-form {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.booking-input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-family: "Nunito Sans", sans-serif;
}

.booking-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.booking-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-family: inherit;
  font-size: 14px;
  margin-left: 10px;
}

.confirm-btn,
.cancel-btn {
  background-color: #5B8D8A;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  background-color: #ccc;
  color: #333;
}

.confirm-btn:hover {
  background-color: #FED28D;
}

.cancel-btn:hover {
  background-color: #bbb;
}

.search-bar {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  margin-bottom: 25px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.booking-select option:disabled {
  color: #aaa;
  background-color: #f9f9f9;
}

.sort-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 8px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.ad-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 8px;
}

.details-btn {
  background-color: #ececec;
  color: black;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 10px;
  transition: background 0.3s ease;
}

.ad-details-expanded {
  margin-top: 15px;
  padding: 15px;
  background-color: #f5f9f7;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  font-size: 14px;
  color: #444;
  line-height: 1.6;
}

.ad-details-expanded p {
  margin: 5px 0;
}

.ad-details-expanded h4 {
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c7a7b;
}

.ad-photo {
  max-width: 100px;
  max-height: 80px;
  margin-right: 10px;
  margin-top: 5px;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

</style>



  