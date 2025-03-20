<template>
    <l-map 
      :zoom="zoom"
      :center="center"
      style="height: 500px; width: 100%;"
    >
      <!-- Legger til et kartlag fra OpenStreetMap -->
      <l-tile-layer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <!-- Viser markører for parkeringsplasser hentet fra Firebase -->
      <l-marker 
  v-for="parking in parkingSpots"
  :key="parking.id"
  :lat-lng="[parking.lat, parking.lng]"
>
  <l-popup>
    <h3>{{ parking.name }}</h3>
    <p>{{ parking.description }}</p>
  </l-popup>
</l-marker>
    </l-map>
  </template>
  
  <script>
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
  import "leaflet/dist/leaflet.css";
  import { db } from "@/firebase";
  import { collection, getDocs } from "firebase/firestore"; // ✅ Korrekt Firestore-import
  
  export default {
    components: { LMap, LTileLayer, LMarker, LPopup },
    data() {
      return {
        center: [59.9139, 10.7522], // Standard posisjon (Oslo), kan endres
        zoom: 13,
        parkingSpots: []
      };
    },
    async created() {
  try {
    const querySnapshot = await getDocs(collection(db, "parkingSpots"));
    this.parkingSpots = querySnapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() };
      console.log("Dokument hentet fra Firestore:", data); // 🔹 Logger hver parkeringsplass
      console.log("Koordinater for markør:", data.lat, data.lng);
      return data;
    });

    console.log("Alle parkeringsplasser:", JSON.stringify(this.parkingSpots, null, 2)); // 🔹 Gir mer lesbar output
  } catch (error) {
    console.error("Feil ved henting av parkeringsplasser:", error);
  }
}
};
  </script>
  
  <style>
  /* Styling for Leaflet-kartet */
  .leaflet-container {
    width: 100%;
    height: 100%;
  }
  </style>
  