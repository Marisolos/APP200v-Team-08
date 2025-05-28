<!-- Author: Hedvig -->
<template>
<!-- Kartet -->
  <GMapMap
    class="map-container"
    :center="center"
    :zoom="zoom"
    map-type-id="roadmap"
    style="width: 100%; height: 500px"
  >
  <!-- Markør på kartet -->
    <GMapMarker
      v-for="spot in displayedParkingSpots"
      :key="spot.id"
      :position="{ lat: Number(spot.lat), lng: Number(spot.lng) }"
      @click="openInfoWindow(spot)"
    />

    <!-- Infoboks som vises når en markør er valgt -->
    <GMapInfoWindow
      v-if="currentInfoWindow && typeof currentInfoWindow.lat === 'number' && typeof currentInfoWindow.lng === 'number'"
      :position="{ lat: Number(currentInfoWindow.lat), lng: Number(currentInfoWindow.lng) }"
      :opened="infoWindowOpened"
      @closeclick="closeInfoWindow"
      :options="{ pixelOffset: { width: 0, height: -35 } }"
    >

    <!-- Innholdet i infoboksen -->
      <div class="info-window-card"> <h3 class="info-title">{{ currentInfoWindow.postCode }} {{ currentInfoWindow.city }}</h3>
        <p class="info-detail">Price: {{ currentInfoWindow.price }} kr/hour</p>
        <p class="info-detail" v-if="currentInfoWindow.availability">Available: {{ currentInfoWindow.availability }}</p>
      </div>
    </GMapInfoWindow>
  </GMapMap>
</template>

<script>
// Importer Google Maps komponenter
import { GMapMap, GMapMarker, GMapInfoWindow } from '@fawmi/vue-google-maps';
// Importerer Firestore og databasen
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

  // Start-zoom for kartet
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
      allParkingSpotsFromFirebase: [], // Lagrer alle parkeringsplassene ved lasting
      currentInfoWindow: null,         // Holder data for den valgte parkeringsplassen for infoboks
      infoWindowOpened: false          // Kontrollerer synligheten av infoboksen
    };
  },
  //vis alle plasser ved søk
  computed: {
    displayedParkingSpots() {
      return this.listingsToShow.length > 0 ? this.listingsToShow : this.allParkingSpotsFromFirebase;
    }
  },
  
  // Henter alle parkeringsplasser fra Firebase når komponenten lastes
  async created() {
    try {
      const snapshot = await getDocs(collection(db, 'parkingSpots'));
      this.allParkingSpotsFromFirebase = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lat: Number(data.lat), // Konverterer lat til tall 
          lng: Number(data.lng), // Konverterer lng til tall
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
    // Åpne og lukke infoboksen til valgt markør
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
      // Forsinkelse for å sikre at infoboksen visuelt lukkes før data nullstilles
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

/*infoboksen*/
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

/* postnummer og poststed */
.info-title {
  font-size: 16px; 
  font-weight: bold;
  color: #333; 
  margin-top: 0;
  margin-bottom: 8px; 
}

/* pris og tilgjengelighet */
.info-detail {
  margin-bottom: 5px; 
  line-height: 1.3;
  color: #555;
}
</style>
