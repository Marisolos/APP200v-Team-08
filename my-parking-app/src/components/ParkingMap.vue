<!-- Author: Hedvig -->
<template>
  <!-- Map -->
  <GMapMap
    class="map-container"
    :center="center"
    :zoom="zoom"
    map-type-id="roadmap"
    style="width: 100%; height: 500px"
  >
    <!-- Map markers -->
    <GMapMarker
      v-for="spot in displayedParkingSpots"
      :key="spot.id"
      :position="{ lat: Number(spot.lat), lng: Number(spot.lng) }"
      @click="openInfoWindow(spot)"
    />

    <!-- Info window shown when a marker is clicked -->
    <GMapInfoWindow
      v-if="currentInfoWindow && typeof currentInfoWindow.lat === 'number' && typeof currentInfoWindow.lng === 'number'"
      :position="{ lat: Number(currentInfoWindow.lat), lng: Number(currentInfoWindow.lng) }"
      :opened="infoWindowOpened"
      @closeclick="closeInfoWindow"
      :options="{ pixelOffset: { width: 0, height: -35 } }"
    >
      <!-- Info window displaying details of the selected parking spot -->
      <div class="info-window-card">
        <h3 class="info-title">{{ currentInfoWindow.postCode }} {{ currentInfoWindow.city }}</h3>
        <p class="info-detail">Price: {{ currentInfoWindow.price }} kr/hour</p>
        <p class="info-detail" v-if="currentInfoWindow.availability">Available: {{ currentInfoWindow.availability }}</p>
      </div>
    </GMapInfoWindow>
  </GMapMap>
</template>

<script>
// Import Google Maps components
import { GMapMap, GMapMarker, GMapInfoWindow } from '@fawmi/vue-google-maps';
// Import Firestore and the database instance
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'ParkingMap',
  components: {
    GMapMap,
    GMapMarker,
    GMapInfoWindow
  },
  props: {
    center: {
      type: Object,
      required: true
    },

    // Initial zoom level for the map
    zoom: {
      type: Number,
      default: 13
    },

    listingsToShow: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      allParkingSpotsFromFirebase: [], // Stores all parking spots when loaded
      currentInfoWindow: null,         // Holds data for the selected parking spot's info window
      infoWindowOpened: false          // Controls visibility of the info window
    };
  },

  // Shows all spots when no search filter is applied
  computed: {
    displayedParkingSpots() {
      return this.listingsToShow.length > 0 ? this.listingsToShow : this.allParkingSpotsFromFirebase;
    }
  },

  // Fetches all parking spots from Firebase when the component is created
  async created() {
    try {
      const snapshot = await getDocs(collection(db, 'listings'));
      this.allParkingSpotsFromFirebase = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lat: Number(data.lat), // Converts latitude to number
          lng: Number(data.lng), // Converts longitude to number
          postCode: data.postCode || '',
          city: data.city || '',
          price: data.price || '',
          rules: data.rules || '', 
          publishedDate: data.publishedDate || '',
        };
      });
    } catch (error) {
      console.error('Error fetching parking spots from Firebase:', error);
    }
  },

  methods: {
    // Opens and closes the info window for the selected marker
    openInfoWindow(spot) {
      if (this.currentInfoWindow && this.currentInfoWindow.id === spot.id && this.infoWindowOpened) {
        this.closeInfoWindow();
      } else {
        this.currentInfoWindow = spot;
        this.infoWindowOpened = true;
      }
    },

    closeInfoWindow() {
      this.infoWindowOpened = false;
      // Delay to ensure the info window is visually closed before resetting data
      setTimeout(() => {
        this.currentInfoWindow = null;
      }, 100);
    }
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
}

/* Info window styling */
.info-window-card {
  background-color: white;
  border-radius: 12px; 
  padding: 15px; 
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15); 
  max-width: 200px;
  font-family: "Nunito Sans", sans-serif;
  font-size: 14px;
  color: #333;
  text-align: center;
}

/* Postcode and city name */
.info-title {
  font-size: 16px; 
  font-weight: bold;
  color: #333; 
  margin-top: 0;
  margin-bottom: 8px; 
}

/* Price and availability */
.info-detail {
  margin-bottom: 5px; 
  line-height: 1.3;
  color: #555;
}
</style>
